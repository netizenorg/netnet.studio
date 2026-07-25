/* global THREE */
// <lappy-vid src="my-video.mp4"></lappy-vid>
//
// Standalone custom element that renders a 3D laptop (extracted from
// netnet's old scroll-animated homepage scene) with a video playing on
// its screen. No scroll animation, no camera rig - just the laptop.
//
// Requires (loaded as plain globals, in this order, before this file):
//   <script src="js/libs/three.min.js"></script>
//   <script src="js/libs/GLTFLoader.js"></script>
//   <script src="js/LappyVid.js"></script>
//
// Assumes the model file (laptop.glb) lives in a `models/` folder
// next to this script's own `js/` folder, unless a `model` attribute
// overrides that.
//
// Attributes (all optional, all live-updatable):
//   src           video url
//   poster        image url shown before the video has data
//   autoplay      "" | "true" | "false" (default: true)
//   loop          "" | "true" | "false" (default: true)
//   muted         "" | "true" | "false" (default: true - needed for autoplay)
//   pos-x/y/z     offset from the default (centered) position (default: 0)
//   rot-x/y/z     offset from the default (screen facing camera) rotation,
//                 radians (default: 0)
//   fov           camera field of view (default: 20)
//   grad-alpha    opacity of the laptop body material, 0-1 (default: 1)
//   model         url to the laptop .glb file
//   osc           vertical float distance, e.g. osc="1" bobs the laptop
//                 up/down over a 1-unit range (default: 0, off)
//   mouse         "" | "true" | "false" - subtly rotate the laptop to
//                 track the mouse position (default: false, off)

(() => {
  const SCRIPT_URL = document.currentScript && document.currentScript.src
  const DEFAULT_MODEL_URL = SCRIPT_URL
    ? new URL('laptop.glb', SCRIPT_URL).href
    : 'laptop.glb'

  // fake-lit gradient material for the laptop body (same shader as the
  // original site's GradShaderMaterial, inlined so this component has no
  // extra script dependency beyond three.js + GLTFLoader)
  function createBodyMaterial (alpha) {
    return new THREE.ShaderMaterial({
      uniforms: {
        xMult: { value: 1 },
        xAdd: { value: 0.69 },
        yMult: { value: 0.19 },
        yAdd: { value: 0.36 },
        zMult: { value: 0.166 },
        zAdd: { value: 0.71 },
        alpha: { value: alpha }
      },
      vertexShader: `
        varying vec3 vp;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;
          vp = -mvPos.xyz;
        }`,
      fragmentShader: `#include <common>
        uniform float xMult;
        uniform float xAdd;
        uniform float yMult;
        uniform float yAdd;
        uniform float zMult;
        uniform float zAdd;
        uniform float alpha;
        varying vec3 vp;
        void main() {
          vec3 fdx = vec3(dFdx(vp.x), dFdx(vp.y), dFdx(vp.z));
          vec3 fdy = vec3(dFdy(vp.x), dFdy(vp.y), dFdy(vp.z));
          vec3 norm = normalize(refract(fdy, fdx, 1.0));
          float x = norm.x * xMult + xAdd;
          float y = norm.y * yMult + yAdd;
          float z = norm.z * zMult + zAdd;
          gl_FragColor = vec4(x, y, z, alpha);
        }`,
      side: THREE.DoubleSide,
      transparent: alpha < 1
    })
  }

  // internal, non-configurable tuning for the osc/mouse effects
  const OSC_SPEED = 1.2 // radians/sec fed into the sine wave
  const MOUSE_STRENGTH = 0.12 // max radians of rotation offset

  // defaults center the laptop along the fixed camera's view ray with its
  // screen normal pointed straight back at the camera - computed from the
  // camera transform below and the screen mesh's fixed -0.18 tilt, not
  // eyeballed (see git history for the derivation)
  const FLOAT_ATTRS = {
    'pos-x': -0.025,
    'pos-y': -0.393,
    'pos-z': -0.229,
    'rot-x': 0.238,
    'rot-y': 1.018,
    'rot-z': -0.204,
    fov: 20,
    'grad-alpha': 1,
    osc: 0
  }

  class LappyVid extends HTMLElement {
    static get observedAttributes () {
      return [
        'src', 'poster', 'autoplay', 'loop', 'muted', 'model',
        'pos-x', 'pos-y', 'pos-z', 'rot-x', 'rot-y', 'rot-z',
        'fov', 'grad-alpha', 'osc', 'mouse'
      ]
    }

    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; position: relative; overflow: hidden; }
          canvas { display: block; width: 100%; height: 100%; }
        </style>
      `
      this._canvas = document.createElement('canvas')
      this.shadowRoot.appendChild(this._canvas)
      this._ready = false
      this._raf = null
      this._resizeObserver = new ResizeObserver(() => this._resize())
      this._mouseTarget = { x: 0, y: 0 }
      this._mouseCurrent = { x: 0, y: 0 }
      this._pointerListenerActive = false
      this._onPointerMove = (e) => this._handlePointerMove(e)
    }

    // ..........................................[ lifecycle ]........

    connectedCallback () {
      if (!this._ready) this._init()
      this._resizeObserver.observe(this)
      this._resize()
      this._setMouseReactive(this.mouse)
      if (!this._raf) this._draw()
      if (this.video && this.video.paused && this.autoplay) this._play()
    }

    disconnectedCallback () {
      this._resizeObserver.unobserve(this)
      this._setMouseReactive(false)
      if (this._raf) cancelAnimationFrame(this._raf)
      this._raf = null
      if (this.video) this.video.pause()
    }

    attributeChangedCallback (name, oldVal, newVal) {
      if (!this._ready || oldVal === newVal) return
      if (name === 'src') this._updateVideo(newVal)
      else if (name === 'poster') this._updatePoster(newVal)
      else if (name === 'model') this._loadLaptop(this._modelUrl())
      else if (name === 'muted') this.video.muted = this.muted
      else if (name === 'loop') this.video.loop = this.loop
      else if (name === 'autoplay') { if (this.autoplay) this._play() }
      else if (name === 'grad-alpha') this._updateGradAlpha()
      else if (name === 'fov') this._updateCamera()
      else if (name === 'osc') { /* read live each frame in _animate */ }
      else if (name === 'mouse') this._setMouseReactive(this.mouse)
      else this._updateOrientation() // pos-*/rot-*
    }

    // ..........................................[ attribute/property accessors ]........

    get src () { return this.getAttribute('src') || '' }
    set src (v) { this.setAttribute('src', v) }

    get poster () { return this.getAttribute('poster') || '' }
    set poster (v) { this.setAttribute('poster', v) }

    get model () { return this.getAttribute('model') || '' }
    set model (v) { this.setAttribute('model', v) }

    get autoplay () { return this._boolAttr('autoplay', true) }
    set autoplay (v) { this.toggleAttribute('autoplay', !!v) }

    get loop () { return this._boolAttr('loop', true) }
    set loop (v) { this.toggleAttribute('loop', !!v) }

    get muted () { return this._boolAttr('muted', true) }
    set muted (v) { this.toggleAttribute('muted', !!v) }

    _boolAttr (name, defaultVal) {
      if (!this.hasAttribute(name)) return defaultVal
      return this.getAttribute(name) !== 'false'
    }

    _floatAttr (name) {
      const v = parseFloat(this.getAttribute(name))
      return isNaN(v) ? FLOAT_ATTRS[name] : v
    }

    // pos-*/rot-* are offsets added on top of the centered, screen-facing
    // default, rather than absolute values - e.g. rot-y="0.6" means
    // "0.6 radians off the default rot-y", not "rot-y = 0.6"
    _offsetAttr (name) {
      const v = parseFloat(this.getAttribute(name))
      return FLOAT_ATTRS[name] + (isNaN(v) ? 0 : v)
    }

    get posX () { return this._offsetAttr('pos-x') }
    set posX (v) { this.setAttribute('pos-x', v) }
    get posY () { return this._offsetAttr('pos-y') }
    set posY (v) { this.setAttribute('pos-y', v) }
    get posZ () { return this._offsetAttr('pos-z') }
    set posZ (v) { this.setAttribute('pos-z', v) }
    get rotX () { return this._offsetAttr('rot-x') }
    set rotX (v) { this.setAttribute('rot-x', v) }
    get rotY () { return this._offsetAttr('rot-y') }
    set rotY (v) { this.setAttribute('rot-y', v) }
    get rotZ () { return this._offsetAttr('rot-z') }
    set rotZ (v) { this.setAttribute('rot-z', v) }
    get fov () { return this._floatAttr('fov') }
    set fov (v) { this.setAttribute('fov', v) }
    get gradAlpha () { return this._floatAttr('grad-alpha') }
    set gradAlpha (v) { this.setAttribute('grad-alpha', v) }
    get osc () { return this._floatAttr('osc') }
    set osc (v) { this.setAttribute('osc', v) }
    get mouse () { return this._boolAttr('mouse', false) }
    set mouse (v) { this.toggleAttribute('mouse', !!v) }

    setOrientation (pos, rot) {
      if (pos) {
        if (pos.x !== undefined) this.setAttribute('pos-x', pos.x)
        if (pos.y !== undefined) this.setAttribute('pos-y', pos.y)
        if (pos.z !== undefined) this.setAttribute('pos-z', pos.z)
      }
      if (rot) {
        if (rot.x !== undefined) this.setAttribute('rot-x', rot.x)
        if (rot.y !== undefined) this.setAttribute('rot-y', rot.y)
        if (rot.z !== undefined) this.setAttribute('rot-z', rot.z)
      }
    }

    _modelUrl () { return this.model || DEFAULT_MODEL_URL }

    // ..........................................[ setup ]........

    _init () {
      this._ready = true

      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.1, 1000)
      this.camera.position.set(2.673, 0.033, 1.389)
      this.camera.rotation.set(-0.108, 1.028, 0.092)

      this.renderer = new THREE.WebGLRenderer({
        canvas: this._canvas,
        antialias: true,
        alpha: true
      })
      this.renderer.setClearColor(0x000000, 0)

      this._clock = new THREE.Clock()
      this._elapsed = 0

      this.group = new THREE.Group()
      this._updateOrientation()
      this.scene.add(this.group)

      this._createScreen()
      this._loadLaptop(this._modelUrl())
    }

    _updateOrientation () {
      this._baseX = this.posX
      this._baseY = this.posY
      this._baseZ = this.posZ
      this._baseRotX = this.rotX
      this._baseRotY = this.rotY
      this._baseRotZ = this.rotZ
    }

    _updateCamera () {
      this.camera.fov = this.fov
      this.camera.updateProjectionMatrix()
    }

    _updateGradAlpha () {
      if (!this.bodyMaterial) return
      this.bodyMaterial.uniforms.alpha.value = this.gradAlpha
      this.bodyMaterial.transparent = this.gradAlpha < 1
      this.bodyMaterial.needsUpdate = true
    }

    _loadLaptop (url) {
      const dir = url.substring(0, url.lastIndexOf('/') + 1)
      const file = url.substring(url.lastIndexOf('/') + 1)
      this.bodyMaterial = createBodyMaterial(this.gradAlpha)
      new THREE.GLTFLoader().setPath(dir).load(file, (gltf) => {
        if (this.laptop) this.group.remove(this.laptop)
        this.laptop = gltf.scene
        this.laptop.scale.set(0.05 * 1.25, 0.05, 0.05)
        this.laptop.traverse((child) => {
          if (child.isMesh) child.material = this.bodyMaterial
        })
        this.group.add(this.laptop)
        this.dispatchEvent(new CustomEvent('lappyvid-ready'))
      })
    }

    _createScreen () {
      this.video = document.createElement('video')
      this.video.loop = this.loop
      this.video.muted = this.muted
      this.video.playsInline = true
      this.video.setAttribute('playsinline', '')
      this.video.crossOrigin = 'anonymous'

      const geo = new THREE.PlaneBufferGeometry(1, 1)
      this.screenMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      this.screen = new THREE.Mesh(geo, this.screenMaterial)
      this.screen.position.set(0, 0.251, -0.294)
      this.screen.scale.set(0.58 * 1.38, 0.409, 0.5)
      this.screen.rotation.x = -0.18
      this.group.add(this.screen)

      if (this.poster) this._updatePoster(this.poster)
      if (this.src) this._updateVideo(this.src)
    }

    _updatePoster (url) {
      if (!url) return
      new THREE.TextureLoader().load(url, (tex) => {
        if (this.usingVideoTexture) return
        this.screenMaterial.map = tex
        this.screenMaterial.opacity = 1
        this.screenMaterial.needsUpdate = true
      })
    }

    _updateVideo (url) {
      if (!url) return
      this.usingVideoTexture = false
      this.video.removeEventListener('loadeddata', this._onLoadedData)
      this._onLoadedData = () => {
        this.videoTexture = new THREE.VideoTexture(this.video)
        this.screenMaterial.map = this.videoTexture
        this.screenMaterial.opacity = 1
        this.screenMaterial.needsUpdate = true
        this.usingVideoTexture = true
      }
      this.video.addEventListener('loadeddata', this._onLoadedData, { once: true })
      this.video.src = url
      this.video.load()
      if (this.autoplay) this._play()
    }

    _play () {
      const p = this.video.play()
      if (p && p.catch) p.catch(() => {})
    }

    // ..........................................[ mouse reactivity ]........

    _setMouseReactive (enabled) {
      if (enabled && !this._pointerListenerActive) {
        window.addEventListener('pointermove', this._onPointerMove)
        this._pointerListenerActive = true
      } else if (!enabled && this._pointerListenerActive) {
        window.removeEventListener('pointermove', this._onPointerMove)
        this._pointerListenerActive = false
      }
    }

    _handlePointerMove (e) {
      const rect = this.getBoundingClientRect()
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 || 1)
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2 || 1)
      this._mouseTarget.x = Math.max(-1, Math.min(1, nx))
      this._mouseTarget.y = Math.max(-1, Math.min(1, ny))
    }

    // ..........................................[ render loop ]........

    _resize () {
      const w = this.clientWidth
      const h = this.clientHeight
      if (!this.renderer || w === 0 || h === 0) return
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.renderer.setSize(w, h, false)
    }

    _animate () {
      const dt = Math.min(this._clock.getDelta(), 0.1)
      this._elapsed += dt

      let y = this._baseY
      if (this.osc) y += Math.sin(this._elapsed * OSC_SPEED) * (this.osc / 2)

      let rotX = this._baseRotX
      let rotY = this._baseRotY
      if (this.mouse) {
        const damp = 1 - Math.pow(0.001, dt)
        this._mouseCurrent.x += (this._mouseTarget.x - this._mouseCurrent.x) * damp
        this._mouseCurrent.y += (this._mouseTarget.y - this._mouseCurrent.y) * damp
        rotY += this._mouseCurrent.x * MOUSE_STRENGTH
        rotX -= this._mouseCurrent.y * MOUSE_STRENGTH
      }

      this.group.position.set(this._baseX, y, this._baseZ)
      this.group.rotation.set(rotX, rotY, this._baseRotZ)
    }

    _draw () {
      this._raf = requestAnimationFrame(() => this._draw())
      this._animate()
      if (this.renderer) this.renderer.render(this.scene, this.camera)
    }
  }

  customElements.define('lappy-vid', LappyVid)
})()
