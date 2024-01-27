/* global HTMLElement WIDGETS */
class ReorderableList extends HTMLElement {
  constructor (widget) {
    super()
    this.widget = widget || null
    this.isActivated = false
  }

  connectedCallback () {
    const div = document.createElement('div')
    div.className = 'reorderable-list'
    div.innerHTML = `
            <div class="rl-highlight">
                <div class="rl-h-text">
                    <p class="rl-s-i">0.</p>
                    <p class="rl-s-t">getting started</p>
                </div>
                <p><i class="arrow down"></i></p>
            </div>
            <ul class="rl-list">
            </ul
        `
    const arrowDown = div.querySelector('.rl-highlight')
    arrowDown.addEventListener('click', () => {
      this.dropdownActivated()
    })

    div.querySelector('.rl-list').addEventListener('dragover', this.initList)
    div.querySelector('.rl-list').addEventListener('dragenter', e => e.preventDefault())

    this.appendChild(div)
  }

  initList = (e) => {
    e.preventDefault()
    const selectedStep = document.querySelector('.dragging')
    const list = this.querySelector('.rl-list')

    const placeholder = document.createElement('li')
    placeholder.className = 'placeholder'
    list.insertBefore(placeholder, selectedStep)

    const otherSteps = [...this.querySelectorAll('.rl-step:not(.dragging)')]

    const nextStep = otherSteps.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = e.clientY - (box.top + window.scrollY) - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element

    if (nextStep) {
      list.insertBefore(selectedStep, nextStep)
    } else {
      list.appendChild(selectedStep)
    }

    setTimeout(() => {
      list.removeChild(placeholder)
      selectedStep.classList.remove('transition')
    }, 100)
  }

  updateList () {
    const steps = [...this.querySelectorAll('.rl-step')]
    steps.forEach((step, index) => {
      step.dataset.id = index
      step.querySelector('.rl-s-i').textContent = index.toString()
    })
  }

  dropdownActivated () {
    const list = this.querySelector('.rl-list')
    list.style.maxHeight = this.isActivated ? '133px' : '0'
    this.isActivated = !this.isActivated
  }

  addStep (data) {
    const step = document.createElement('li')
    step.dataset.id = data.id
    step.dataset.title = data.title || null
    step.className = 'rl-step'
    step.draggable = true

    if (data.title) {
      data.title = data.title.length > 40
        ? data.title.substring(0, 40).replace(/\s+\S*$/, '') + ' ...'
        : data.title
    }
    step.innerHTML = `
            <div class="rl-details">
                <img class="rl-dots" src="/assets/images/widgets/draggable-dots.svg" />
                <p class="rl-s-i">${data.id}</p>
                <p class="rl-s-t">${data.title || ''}</p>
            </div>
            <div class="rl-info">
                <img class="rl-info-icon" src="/assets/images/widgets/info-button.svg" activated="false" />
                <div class="rl-info-menu">
                    <p><i class="arrow up"></i></p>
                    <p><i class="arrow down"></i></p>
                    <img class="rl-trash-can" src="/assets/images/widgets/trash.svg"/>
                </div>
            </div>
        `
    const info = step.querySelector('.rl-info')
    info.addEventListener('mouseenter', () => {
      info.querySelector('.rl-info-icon').style.width = '0'
      info.querySelector('.rl-info-menu').style.width = '110px'
      info.querySelector('.rl-info-menu').style.paddingLeft = '20px' // fixes trigger issues
    })
    info.addEventListener('mouseleave', () => {
      info.querySelector('.rl-info-icon').style.width = 'auto'
      info.querySelector('.rl-info-menu').style.width = '0'
      info.querySelector('.rl-info-menu').style.paddingLeft = '0'
    })

    step.querySelector('.arrow.down').addEventListener('click', () => {
      this.moveSteps(step)
    })

    step.querySelector('.arrow.up').addEventListener('click', () => {
      this.moveSteps(step, 'up')
    })

    step.querySelector('.rl-trash-can').addEventListener('click', (e) => {
        e.stopPropagation()  
        WIDGETS[this.widget]._updateStep(Number(step.dataset.id), 'remove')
    })

    step.addEventListener('click', () => {
        this.selectStep(step, this.querySelector('.rl-h-text'))
        WIDGETS[this.widget]._selectStep(Number(step.dataset.id))
    })

    step.addEventListener('dragstart', () => step.classList.add('dragging'))

    step.addEventListener('dragend', () => {
      step.classList.remove('dragging')
      const nodes = Array
        .from(step.parentNode.childNodes)
        .filter(node => node.nodeType === 1 && node.classList
          .contains('rl-step'))
      const index = nodes.indexOf(step)
      WIDGETS[this.widget]._updateStep({
        oldIdx: Number(step.dataset.id),
        newIdx: index
      })
      this.updateList()
      this.selectStep(step, this.querySelector('.rl-h-text'))
    })

    const highlightedStep = this.querySelector('.rl-h-text')
    highlightedStep.querySelector('.rl-s-i').textContent = data.id
    highlightedStep.querySelector('.rl-s-t').textContent = data.title

    this.querySelector('.rl-list').appendChild(step)
  }

  updateStep (data, remove) {
    const ss = this.querySelector('.rl-h-text') // selected step
    if (remove === 'uploading') {
      const step = this.querySelector(`.rl-step:nth-of-type(${data})`)
      step.remove()
    } else if (remove) {
      const step = this.querySelector(`.rl-step:nth-of-type(${data + 1})`)
      step.remove()
      const newStep = (data <= 0)
        ? this.querySelector(`.rl-step:nth-of-type(${data + 1})`)
        : this.querySelector(`.rl-step:nth-of-type(${data})`)
      this.updateList()
      this.selectStep(newStep, ss)
    } else {
      data.title = data.title.length > 40
        ? data.title.substring(0, 40) + ' ...'
        : data.title
      const step = this.querySelector(`li[data-id="${data.id}"]`)
      step.querySelector('.rl-s-i').textContent = data.id
      step.querySelector('.rl-s-t').textContent = data.title
      ss.querySelector('.rl-s-i').textContent = data.id
      ss.querySelector('.rl-s-t').textContent = data.title
    }
  }

  selectStep (step, container) {
    if (step === 0) {
      step = document.querySelector(`.rl-step:nth-of-type(1)`)
      this.querySelector('.rl-h-text').querySelector('.rl-s-i').textContent = step.dataset.id
      this.querySelector('.rl-h-text').querySelector('.rl-s-t').textContent = step.dataset.title || ''
    } else {
      container.querySelector('.rl-s-i').textContent = step.dataset.id
      container.querySelector('.rl-s-t').textContent = step.dataset.title || ''
    }
  }

  moveSteps (step, up) {
    const steps = step.parentNode.querySelectorAll('.rl-step')
    const currentIndex = Number(step.dataset.id)
    const isFirst = currentIndex === 0
    const isSecondToFirst = currentIndex === 1
    const isSecondToLast = currentIndex === steps.length - 2
    const isLast = currentIndex === steps.length - 1

    const updateStepAndMove = (newIndex) => {
      WIDGETS[this.widget]._updateStep({
        oldIdx: currentIndex,
        newIdx: newIndex
      })
      if(isSecondToLast) { //last element
        step.parentNode.appendChild(step)
      } else {
        const refStep = steps[newIndex]
        step.parentNode.insertBefore(step, refStep)
      }
      this.updateList()
      this.selectStep(step, this.querySelector('.rl-h-text'))
    }

    if (up) {
      if (isSecondToFirst) {
        updateStepAndMove(0)
      } else if (!isFirst) {
        updateStepAndMove(currentIndex - 1)
      }
    } else {
      if (isSecondToLast) {
        updateStepAndMove(currentIndex + 1)
      } else if (!isLast) {
        updateStepAndMove(currentIndex + 2)
      }
    }
  }
}

window.customElements.define('reorderable-list', ReorderableList)
