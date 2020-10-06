/* global WIDGETS, STORE, NNE, NNW, NNT, utils, TUTORIAL, Averigua */
window.TUTORIAL = {
  onload: () => {
    window.utils.setupAframeEnv()
    TUTORIAL.setup('starter')
  },

  steps: [{
    id: 'intro',
    before: () => TUTORIAL.setup('starter'),
    content: 'In the last tutorial we learned how to make basic 3D shapes (aka "primitives") as well as how to animate them. In this tutorial we\'re going to learn how to apply custom textures to those shapes using our own images as well as how to import our own 3D files into our scene.',
    options: {
      ok: (e) => {
        if (utils.getUserData('owner')) e.goTo('create-new-project')
        else e.goTo('no-gh-acct')
      },
      'basics shapes and animation?': (e) => e.goTo('old-tut')
    }
  }, {
    id: 'old-tut',
    content: 'Do you want me to teach you the basics of WebVR and A-Frame before we get into custom textures and 3D files? This will mean leaving this tutorial and starting that one instead.',
    options: {
      'yes please': (e) => {
        NNT.load('webvr-basics')
      },
      'never mind, I already did that': (e) => {
        if (utils.getUserData('owner')) e.goTo('create-new-project')
        else e.goTo('no-gh-acct')
      }
    }
  }, {
    id: 'no-gh-acct',
    content: 'This tutorial is going to involve uploading your own "assets", which is what we call any additional files that you want to include as part of your sketch, like images and 3D models.',
    options: { ok: (e) => e.goTo('no-gh-acct2') }
  }, {
    id: 'no-gh-acct2',
    content: 'In order to do that, we need some place to upload them to. Seeing as how you\'re on your way to becoming an Internet artist, we should probably get you setup with a GitHub account so you can start building up your portfolio.',
    options: {
      'but I don\'t have an account?': (e) => e.goTo('what-if-no-github'),
      'I already have a GitHub account': (e) => e.goTo('already-gh-acct'),
      'what\'s GitHub?': (e) => e.goTo('github')
    }
  }, {
    id: 'already-gh-acct',
    content: 'Oh! Perfect! Then I\'ll just need you to let GitHub know that you authorize me to create repos and upload files to your account, this way I can save our collaborations as new projects on your GitHub.',
    options: {
      'ok, how\'s that work?': (e) => e.goTo('how-github'),
      'I rather not': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'rather-not',
    content: 'Ok, no pressure. Unfortunately I\'ve got no other way to host your assets myself, so we\'re gonna have to end this tutorial here. That said, the folks at <a href="http://netizen.org" target="_blank">netizen.org</a> are working on lots more tutorials that don\'t require uploading assets, sign up to our <a href="https://netizen.us12.list-manage.com/subscribe?u=6eee3b6fabea3bad38a2463ab&id=3da80c2910" target="_blank">mailing list</a> for updates!',
    options: {
      ok: (e) => e.fin(),
      '...actually, explain GitHub again': (e) => e.goTo('github')
    }
  }, {
    id: 'github',
    content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". I can save your projects to GitHub for you, but I need to know your GitHub account.',
    options: {
      'ok, how\'s that work?': (e) => e.goTo('how-github'),
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'oh, never mind then': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'how-github',
    content: 'I\'ll send you over to GitHub, from there you can let them know you want to authorize me to save and upload projects to your account. After that they\'ll send you back here and we\'ll take it from there.',
    options: {
      'ok, let\'s do it!': (e) => {
        const str = JSON.stringify({
          tutorial: 'webvr-assets', id: 'create-new-project-redirect'
        })
        WIDGETS['functions-menu']._githubAuth(str)
      },
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'actually, never mind': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'what-if-no-github',
    content: 'Not a problem, when I send you over to GitHub they\'ll walk you through the process of creating a new account. Once you\'ve got that setup, you can authorize me to so save and upload projects and then GitHub should send you back over here so we can keep working together.',
    options: {
      'ok, let\'s do it!': (e) => {
        const str = JSON.stringify({
          tutorial: 'webvr-assets', id: 'create-new-project-redirect'
        })
        WIDGETS['functions-menu']._githubAuth(str)
      },
      'actually, never mind': (e) => e.goTo('rather-not')
    }
  },
  // ------------------------------------------------ POST GITHUB --------------
  {
    id: 'create-new-project',
    content: 'This tutorial is going to involve uploading your own "assets", which is what we call any additional files that you want to include as part of your sketch, like images and 3D models. Is it ok if I create a new project on your GitHub to save our collaboration and upload assets?',
    options: {
      'sure!': (e) => {
        WIDGETS['functions-menu'].saveProject()
        e.goTo('upload-assets')
      },
      'I rather not': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'create-new-project-redirect',
    before: () => TUTORIAL.setup('starter'),
    content: 'Welcome back! So like I mentioned before, this tutorial is going to involve uploading your own files. Is it ok if I create a new project on your GitHub to save our collaboration and upload assets?',
    options: {
      'sure!': (e) => {
        WIDGETS['functions-menu'].saveProject()
        e.goTo('upload-assets')
      },
      'I rather not': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'upload-assets',
    before: () => {
      TUTORIAL.setup('starter', 'dock-left')
      STORE.subscribe('widgets', TUTORIAL.waitForUploadAssets)
    },
    content: 'Great, now that the project is saved we can start uploading assets. We\'ll use the <b>Upload Assets</b> widget to upload files to our GitHub project. You\'ll find it in the <b>Widgets Menu</b>, which can be opened by clicking my face and then clicking <img src="images/menu/functions.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;">.',
    options: {}
  }, {
    id: 'upload-assets2',
    before: () => {
      utils.updateRoot()
      STORE.unsubscribe('widgets', TUTORIAL.waitForUploadAssets)
      WIDGETS['assets-widget'].onchange = TUTORIAL.waitForImageUplaod
    },
    content: 'Now, let\'s upload an image file, a jpg or png, to use as a texture for our box. It\'s best to use images with a relatively small file size, you don\'t want to be using images larger than 3 or 4 MB.',
    options: {
      ok: (e) => e.goTo('upload-assets3'),
      'why?': (e) => e.goTo('why-size')
    }
  }, {
    id: 'upload-assets2b',
    before: () => {
      STORE.unsubscribe('widgets', TUTORIAL.waitForUploadAssets)
    },
    highlight: {
      startLine: 19,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Looks like you\'ve already got an image uploaded to your project from before, great! So, at the moment our box\'s <code>material</code> component has a <code>color</code> property set, which is giving our box a solid color material, but we can replace this with an image texture now that we\'ve uploaded an image file to our project.',
    options: { ok: (e) => e.goTo('replace-color') }
  }, {
    id: 'why-size',
    content: 'Internet art lives online, which means when someone views your work in their browser it\'s being downloaded from a server somewhere else in the world (in our case GitHub). The larger the file, the longer it takes to download.',
    options: { 'I see': (e) => e.goTo('upload-assets3') }
  }, {
    id: 'upload-assets3',
    content: 'You need to upload an image file before we can move on, I\'ll wait...',
    options: { }
  }, {
    id: 'image-was-not-uploaded',
    content: 'Hmmm, that doesn\'t seem to be a <b>jpg</b> or <b>png</b> file, try again...',
    options: {}
  }, {
    id: 'image-was-uploaded',
    before: () => {
      WIDGETS['assets-widget'].onchange = null
      NNE.code = TUTORIAL.getCode('starter')
    },
    highlight: {
      startLine: 19,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Great! At the moment our box\'s <code>material</code> component has a <code>color</code> property set, which is giving our box a solid color material, but we can replace this with an image texture now that we\'ve uploaded an image file to our project.',
    options: { ok: (e) => e.goTo('replace-color') }
  }, {
    id: 'replace-color',
    before: () => { NNE.code = TUTORIAL.getCode('image-texture') },
    highlight: {
      startLine: 19,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Let\'s replace that <code>color</code> property with a <code>src</code> property, pronounced "source". As its value we\'ll write the name of your image file and voilà we\'ve got a texture material!',
    options: { 'fantastic!': (e) => e.goTo('post-replace-color') }
  }, {
    id: 'post-replace-color',
    before: () => { NNE.code = TUTORIAL.getCode('image-texture') },
    highlight: {
      startLine: 19,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'You may want to upload other images and try out other textures, but I want to work with 3D models first and then I\'ll stop making edits to our sketch.',
    options: { 'sounds good': (e) => e.goTo('rm-box') }
  },
  // ------------------------------------------------ 3D ASSETS ----------------
  {
    id: 'rm-box',
    before: () => { TUTORIAL.setup('rm-box', 'dock-left') },
    content: 'Before we go any further, I\'m going to remove our box to get it out of our way for now.',
    options: { sure: (e) => e.goTo('3d-assets') }
  }, {
    id: '3d-assets',
    before: () => { TUTORIAL.setup('rm-box', 'dock-left') },
    content: 'There are lots of different 3D model file types out there, and while it\'s technically possible to load up pretty much anything into a browser, we\'ll stick to <b>OBJ</b> and <b>GLTF</b> files because those are the types for which <a href="https://aframe.io/docs/1.0.0/introduction/models.html" target="_blank">A-Frame has built-in support</a>.',
    options: {
      ok: (e) => e.goTo('download-3d'),
      'what if I wanted a different type?': (e) => e.goTo('diff-type')
    }
  }, {
    id: 'diff-type',
    content: 'The A-Frame library is built on top of yet another library called <a href="https://threejs.org/" target="_blank">three.js</a>, which has support for even <a href="https://threejs.org/examples/?q=loader" target="_blank">more file types</a> but that library is beyond the scope of this tutorial.',
    options: { ok: (e) => e.goTo('download-3d') }
  }, {
    id: 'download-3d',
    content: 'Before we move onto the next step, you\'ll need to have either an <b>OBJ</b> or <b>GLTF</b> file to upload. If you\'ve got your own, great! If not you can download a <a href="https://creativecommons.org/" target="_blank">creative commons</a> licensed model for free on <a href="https://poly.google.com/" target="_blank">Google Poly</a>.',
    options: {
      ok: (e) => e.goTo('asset-manager'),
      'Is Poly the only option?': (e) => e.goTo('only-poly')
    }
  }, {
    id: 'only-poly',
    content: 'Nope, there are loads of other sites you can download and purchase 3D models from, including <a href="https://3dwarehouse.sketchup.com/" target="_blank">3D Wherehouse</a>, <a href="https://www.thingiverse.com/" target="_blank">Thingiverse</a>, <a href="https://www.turbosquid.com/Search/3D-Models/free" target="_blank">Turbosquid</a>, <a href="https://archive3d.net/" target="_blank">Archive3D</a> and <a href="https://clara.io/" target="_blank">Clara</a>. But Poly has exactly the file types (and file sizes) we\'re looking for.',
    options: { cool: (e) => e.goTo('asset-manager') }
  }, {
    id: 'asset-manager',
    before: () => {
      TUTORIAL.setup('asset-manager', 'dock-left')
      setTimeout(() => {
        NNE.highlight({
          startLine: 4,
          endLine: 6,
          color: 'rgba(255, 255, 255, 0.15)'
        })
      }, STORE.getTransitionTime() + 100)
    },
    content: 'The first thing we need to do is create a pair of <code>&lt;a-assets&gt;</code> tags at the top of our scene, this is how we invoke <a href="https://aframe.io/docs/1.0.0/core/asset-management-system.html#sidebar" target="_blank">A-Frame\'s Asset Management System</a>. This can be used to preload all sorts of assets including images and videos, but we\'re going to focus on 3D models.',
    options: { ok: (e) => e.goTo('choose-type') }
  }, {
    id: 'choose-type',
    content: 'Working with <b>OBJ</b> and <b>GLTF</b> files is similar, but the way we load them is a little different, which of the two do you want me to show you how to work with?',
    options: {
      'Let\'s do OBJ': (e) => e.goTo('obj-assets'),
      'Let\'s do GLTF': (e) => e.goTo('gltf-assets'),
      'what\'s the difference?': (e) => e.goTo('3d-diff')
    }
  }, {
    id: '3d-diff',
    content: 'For our purposes, the major difference is that when working with <b>GLTF</b> we only need to reference a single file (even when the data may be stored in multiple files), where as with an <b>OBJ</b> we typically need to reference two files, the <b>OBJ</b> itself which contains the geometry data, and it\'s <b>MTL</b> file which contains it\'s materials data.',
    options: {
      'Let\'s do OBJ': (e) => e.goTo('obj-assets'),
      'Let\'s do GLTF': (e) => e.goTo('gltf-assets')
    }
  }, {
    id: 'obj-assets',
    before: () => {
      TUTORIAL.setup('asset-manager', 'dock-left')
      const hasObj = TUTORIAL.filterObj().length > 0
      const hasMtl = TUTORIAL.filterMtl().length > 0
      if (hasObj && hasMtl) {
        NNT.goTo('obj-uploaded')
        WIDGETS['assets-widget'].open()
      } else WIDGETS['assets-widget'].onchange = TUTORIAL.waitForOBJUplaod
    },
    content: 'Ok let\'s start by uploading your 3D model\'s <code>.obj</code> and <code>.mtl</code> files, as well as any necessary image texture files (if applicable) using the <b>Upload Assets</b> widget, I\'ll wait...',
    options: {}
  }, {
    id: 'obj-uploaded',
    before: () => {
      TUTORIAL.setup('obj-setup', 'dock-left')
      WIDGETS['assets-widget'].onchange = null
    },
    content: 'Great! Now that you uploaded those files I\'ve included them both as <code>&lt;a-asset-item&gt;</code> elements within the Assets Manager tags. I gave them both generic <code>id</code> values for now, but feel free to change this after I\'m finished demonstrating how it works.',
    options: { ok: (e) => e.goTo('add-obj-entity') }
  }, {
    id: 'add-obj-entity',
    before: () => { NNE.code = TUTORIAL.getCode('add-obj-entity') },
    highlight: {
      startLine: 13,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Next all we have to do is create a new <code>&lt;a-entity&gt;</code> element, just like the one we had made for our box, but instead of defining our own <b>geometry</b> and <b>material</b> we\'ll use the <a href="https://aframe.io/docs/1.0.0/components/obj-model.html#sidebar" target="_blank">obj-model</a> component to refence the <code>id</code> values of our <b>OBJ</b> and <b>MTL</b> assets.',
    options: {
      ok: (e) => e.goTo('dont-see-obj'),
      'what does # mean?': (e) => e.goTo('id-symbol-obj')
    }
  }, {
    id: 'id-symbol-obj',
    content: 'As you already know the <code>#</code> symbol is often used to create hex color values, but in HTML it is also often used to refence other elements by their <i>id</i>, you can think of it as a stand-in for the word "id".',
    options: { 'got it': (e) => e.goTo('dont-see-obj') }
  }, {
    id: 'dont-see-obj',
    content: 'If you can see your model, fantastic! If not, that\'s not uncommon. Unless the 3D file itself had been centered at the XYZ origin of "0 0 0", there is a chance that the model might be loaded out of your camera\'s view. Another common issue is that the model is too tiny or even too large to appear on camera. Let\'s add our familiar <b>scale</b>, <b>position</b> and <b>rotation</b> components as well as an <b>id</b>.',
    options: {
      ok: (e) => e.goTo('add-comps-obj')
    }
  }, {
    id: 'add-comps-obj',
    before: () => { NNE.code = TUTORIAL.getCode('add-obj-comps') },
    content: 'Now you should be able to double click on either the <b>scale</b>, <b>position</b> or <b>rotation</b> components to open the <b>Component Widget</b> which will allow you to edit and preview changes to these in realtime.',
    options: {
      'great!': (e) => e.goTo('i-see-model'),
      'I still can\'t see my model': (e) => e.goTo('no-see-model')
    }
  }, {
    id: 'gltf-assets',
    before: () => {
      TUTORIAL.setup('asset-manager', 'dock-left')
      if (TUTORIAL.filterGLTF().length > 0) {
        NNT.goTo('gltf-uploaded')
        WIDGETS['assets-widget'].open()
      } else WIDGETS['assets-widget'].onchange = TUTORIAL.waitForGLTFUplaod
    },
    content: 'Ok let\'s start by uploading your 3D model\'s <code>.gltf</code> or <code>.glb</code> (binary gltf file), as well as any accompanying binary files <code>.bin</code> and image texture files (if applicable) using the <b>Upload Assets</b> widget, I\'ll wait...',
    options: {}
  }, {
    id: 'gltf-uploaded',
    before: () => {
      TUTORIAL.setup('gltf-setup', 'dock-left')
      WIDGETS['assets-widget'].onchange = null
    },
    content: 'Great! Now that you\'ve got that uploaded I\'ve included it as an <code>&lt;a-asset-item&gt;</code> element within the Assets Manager tags. I gave it a generic <code>id</code> value for now, but feel free to change this after I\'m finished demonstrating how it works. Again, if there are any related <code>.bin</code> or image texture files don\'t forget to upload those too!',
    options: { ok: (e) => e.goTo('add-gltf-entity') }
  }, {
    id: 'add-gltf-entity',
    before: () => { NNE.code = TUTORIAL.getCode('add-gltf-entity') },
    highlight: {
      startLine: 12,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Next all we have to do is create a new <code>&lt;a-entity&gt;</code> element, just like the one we had made for our box, but instead of defining our own <b>geometry</b> and <b>material</b> we\'ll use the <a href="https://aframe.io/docs/1.0.0/components/gltf-model.html#sidebar" target="_blank">gltf-model</a> component to refence the <code>id</code> value of our <b>GLTF</b> asset.',
    options: {
      ok: (e) => e.goTo('dont-see-gltf'),
      'what does # mean?': (e) => e.goTo('id-symbol-gltf')
    }
  }, {
    id: 'id-symbol-gltf',
    content: 'As you already know the <code>#</code> symbol is often used to create hex color values, but in HTML it is also often used to refence other elements by their <i>id</i>, you can think of it as a stand-in for the word "id".',
    options: { 'got it': (e) => e.goTo('dont-see-gltf') }
  }, {
    id: 'dont-see-gltf',
    content: 'If you can see your model, fantastic! If not, that\'s not uncommon. Unless the 3D file itself had been centered at the XYZ origin of "0 0 0", there is a chance that the model might be loaded out of your camera\'s view. Another common issue is that the model is too tiny or even too large to appear on camera. Let\'s add our familiar <b>scale</b>, <b>position</b> and <b>rotation</b> components as well as an <b>id</b>.',
    options: {
      ok: (e) => e.goTo('add-comps-gltf')
    }
  }, {
    id: 'add-comps-gltf',
    before: () => { NNE.code = TUTORIAL.getCode('add-gltf-comps') },
    content: 'Now you should be able to double click on either the <b>scale</b>, <b>position</b> or <b>rotation</b> components to open the <b>Component Widget</b> which will allow you to edit and preview changes to these in realtime.',
    options: {
      'great!': (e) => e.goTo('i-see-model'),
      'I still can\'t see my model': (e) => e.goTo('no-see-model')
    }
  }, {
    id: 'no-see-model',
    content: 'Ok, we might need to look at our scene from an entirely different perspective then. A-Frame comes with a <a href="https://aframe.io/docs/1.0.0/introduction/visual-inspector-and-dev-tools.html#sidebar" target="_blank">Visual Inspector</a> tool that let\'s you debug your scene with an interface very similar to popular 3D modeling software. I can toggle this on/off for you a second First, I want to remind you that you can save your changes to your GitHub by running the <code>saveProject()</code> function in the <b>my project</b> section of the <b>Functions Menu</b>',
    options: {
      'yep, I know': (e) => e.goTo('inspector'),
      'where\'s that menu?': (e) => e.goTo('func-menu')
    }
  }, {
    id: 'i-see-model',
    content: 'Great! I want to show you one last feature before you continue experimenting. A-Frame comes with a <a href="https://aframe.io/docs/1.0.0/introduction/visual-inspector-and-dev-tools.html#sidebar" target="_blank">Visual Inspector</a> tool that let\'s you debug your scene with an interface very similar to popular 3D modeling software. I can toggle this on/off for you as you sketch, but I want to remind you that you can save your changes to your GitHub by running the <code>saveProject()</code> function in the <b>my project</b> section of the <b>Functions Menu</b>',
    options: {
      'yep, I know': (e) => e.goTo('inspector'),
      'where\'s that menu?': (e) => e.goTo('func-menu')
    }
  }, {
    id: 'func-menu',
    content: `The <code>saveProject()</code> function can be found using the fuzzy search (${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+" shortcut key) or look inside the <b>my project</b> section of the <b>Functions Menu</b> just click on my face and then on the <img src="images/menu/functions.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;">.`,
    options: { 'got it': (e) => e.goTo('inspector') }
  }, {
    id: 'inspector',
    before: () => {
      const inspector = NNW.rndr.querySelector('iframe')
        .contentDocument.querySelector('.toggle-edit')
      if (inspector) {
        inspector.removeEventListener('click', TUTORIAL.onInpsectorClose)
      }
    },
    content: 'Ok, I\'ll stop editing code and let you play!',
    options: {
      'open the Visual Inspector': (e) => {
        NNW.rndr.querySelector('iframe')
          .contentDocument.querySelector('a-scene')
          .components.inspector.openInspector()
        TUTORIAL.addInspectorListener()
        TUTORIAL.placeInCorner()
        e.goTo('inspector-b')
      }
    }
  }, {
    id: 'inspector-b',
    content: 'Click the <b>Back To Scene</b> button on the top left of the Inpsector to close it. Check out the A-Frame docs for more info on the <a href="https://aframe.io/docs/1.0.0/introduction/visual-inspector-and-dev-tools.html#sidebar" target="_blank">Visual Inspector</div>',
    options: {}
  }],

  setup: (code, layout) => {
    layout = layout || 'welcome'
    if (STORE.state.layout !== layout) {
      STORE.dispatch('CHANGE_LAYOUT', layout)
    }
    NNE.code = TUTORIAL.getCode(code)
    utils.updateRoot()
    if (layout === 'welcome') {
      const x = window.innerWidth - window.NNW.win.offsetWidth - 20
      const y = window.innerHeight - window.NNW.win.offsetHeight - 20
      NNW.updatePosition(x, y)
    } else {
      utils.netitorUpdate()
    }
  },

  placeInCorner: () => {
    STORE.dispatch('CHANGE_LAYOUT', 'welcome')
    NNW._whenCSSTransitionFinished(() => {
      const x = window.innerWidth - window.NNW.win.offsetWidth - 20
      const y = window.innerHeight - window.NNW.win.offsetHeight - 20
      NNW.updatePosition(x, y)
    })
  },

  waitForUploadAssets: () => {
    if (WIDGETS['assets-widget'].opened) {
      if (TUTORIAL.filterImg().length > 0) NNT.goTo('upload-assets2b')
      else NNT.goTo('upload-assets2')
    }
  },

  waitForImageUplaod: (assets) => {
    if (TUTORIAL.filterImg().length > 0) NNT.goTo('image-was-uploaded')
    else NNT.goTo('image-was-not-uploaded')
  },

  filterImg: () => {
    const arr = WIDGETS['assets-widget'].assets.filter(f => {
      const e = f.split('.')[1]
      return e === 'jpg' || e === 'png' || e === 'JPG' || e === 'PNG' || e === 'jpeg' || e === 'JPEG'
    })
    return arr
  },

  waitForOBJUplaod: () => {
    const hasObj = TUTORIAL.filterObj().length > 0
    const hasMtl = TUTORIAL.filterMtl().length > 0
    if (hasObj && hasMtl) NNT.goTo('obj-uploaded')
  },

  filterObj: () => {
    const arr = WIDGETS['assets-widget'].assets.filter(f => {
      const e = f.split('.')[1]
      return e === 'obj' || e === 'OBJ'
    })
    return arr
  },

  filterMtl: () => {
    const arr = WIDGETS['assets-widget'].assets.filter(f => {
      const e = f.split('.')[1]
      return e === 'mtl' || e === 'MTL'
    })
    return arr
  },

  waitForGLTFUplaod: () => {
    if (TUTORIAL.filterGLTF().length > 0) NNT.goTo('gltf-uploaded')
  },

  filterGLTF: () => {
    const arr = WIDGETS['assets-widget'].assets.filter(f => {
      const e = f.split('.')[1]
      return e === 'gltf' || e === 'glb'
    })
    return arr
  },

  onInpsectorClose: () => {
    NNT.goTo('inspector')
    STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
    utils.updateRoot()
  },

  addInspectorListener: () => {
    const inspector = NNW.rndr.querySelector('iframe')
      .contentDocument.querySelector('.toggle-edit')
    if (inspector) {
      inspector.addEventListener('click', TUTORIAL.onInpsectorClose)
    } else {
      setTimeout(TUTORIAL.addInspectorListener, 500)
    }
  },

  getCode: (id) => {
    const de = document.documentElement
    const bg = window.getComputedStyle(de).getPropertyValue('--netizen-string')
    const c1 = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
    const img = TUTORIAL.filterImg()[0] || 'filename.jpg'
    const obj = TUTORIAL.filterObj()[0] || 'filename.obj'
    const mtl = TUTORIAL.filterMtl()[0] || 'filename.mtl'
    const glt = TUTORIAL.filterGLTF()[0] || 'filename.gltf'
    const c = {
      starter: `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity id="box"
    scale="1.5 1.5 1.5"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 360 720 0;
      dur: 8000;
      loop: true;
      easing: linear;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'image-texture': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity id="box"
    scale="1.5 1.5 1.5"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 360 720 0;
      dur: 8000;
      loop: true;
      easing: linear;"
    geometry="primitive: box;"
    material="src: ${img};"></a-entity>

</a-scene>`,
      'rm-box': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

</a-scene>`,
      'asset-manager': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <!-- ASSETS GO IN HERE -->
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

</a-scene>`,
      'obj-setup': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-obj" src="${obj}"></a-asset-item>
    <a-asset-item id="my-mtl" src="${mtl}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

</a-scene>`,
      'add-obj-entity': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-obj" src="${obj}"></a-asset-item>
    <a-asset-item id="my-mtl" src="${mtl}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity obj-model="obj: #my-obj; mtl: #my-mtl"></a-entity>

</a-scene>`,
      'add-obj-comps': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-obj" src="${obj}"></a-asset-item>
    <a-asset-item id="my-mtl" src="${mtl}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity id="my-model"
    scale="1 1 1"
    position="0 0 0"
    rotation="0 0 0"
    obj-model="obj: #my-obj; mtl: #my-mtl"></a-entity>

</a-scene>`,
      'gltf-setup': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-gltf" src="${glt}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

</a-scene>`,
      'add-gltf-entity': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-gltf" src="${glt}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity gltf-model="#my-gltf"></a-entity>

</a-scene>`,
      'add-gltf-comps': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-assets>
    <a-asset-item id="my-gltf" src="${glt}"></a-asset-item>
  </a-assets>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity id="my-model"
    scale="1 1 1"
    position="0 0 0"
    rotation="0 0 0"
    gltf-model="#my-gltf"></a-entity>

</a-scene>`
    }
    return c[id]
  }
}
