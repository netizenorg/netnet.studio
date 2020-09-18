/* global Widget, TUTORIAL, HyperVidPlayer, STORE, WIDGETS, NNW, NNE, NNT */
window.TUTORIAL = {
  steps: [{
    code: '<!DOCTYPE html>\n',
    before: () => {
      if (STORE.state.layout !== 'dock-left') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: 'As mentioned in the Intro to Cyberspace lesson, we\'ll be creating a Virtual Reality sketch using a library called <a href="https://aframe.io/" target="_blank">A-Frame</a>, which gives us access to a set of Custom Elements for creating 3D environments.',
    options: {
      'I\'m stoked, let\'s roll!': (e) => e.goTo('start-coding'),
      'intro to cyberspace?': (e) => e.goTo('intro-tut'),
      'what\'s a "library"?': (e) => e.goTo('library'),
      'custom elements?': (e) => e.goTo('custom-elements')
    }
  }, {
    id: 'library',
    content: 'A library is some code other folks wrote for fellow developers to use in their code. It usually contains some components which are general enough to be used in lots of different projects, but specific enough that it solves a particular problem. Say we were building a car, in this metaphor a library would contain various parts used to build a car. Why rewrite the wheel component, am I right? (<a href="https://en.wikipedia.org/wiki/Library_(computing)" target="_blank">Wikipedia</a> has a more esoteric way of describing it if you\'d like to dive deeper)',
    options: { 'thanks!': (e) => e.goTo('intro-aside') }
  }, {
    id: 'custom-elements',
    content: 'As explained in the intro to HTML lesson, there are only so many predefined elements in the HTML language. That said, it is possible to create your own "<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" target="_blank">custom</a>" elements using JavaScript, which is exactly what the developers who\'ve made the <a href="https://aframe.io/" target="_blank">A-Frame</a> library have done.',
    options: {
      'oh, ok.': (e) => e.goTo('intro-aside'),
      'intro to HTML?': (e) => { window.alert(TUTORIAL.betaMessage) },
      'who are these developers?': (e) => {
        const url = 'https://github.com/aframevr/aframe/graphs/contributors'
        const win = window.open(url, '_blank')
        win.focus()
      }
    }
  }, {
    id: 'intro-tut',
    content: 'That\'s the lesson that\'s meant to precede this one. It introduces the notion of "Cyberspace" as well as some VR theory and history. If you haven\'t yet, you should probably do that one first.',
    options: {
      'sounds important, let\'s do that first!': (e) => {
        STORE.dispatch('CHANGE_LAYOUT', 'welcome')
        NNW.updatePosition()
        NNT.load('virtual-reality')
      },
      'that\'s ok, let\'s continue': (e) => e.goTo('intro-aside')
    }
  }, {
    id: 'intro-aside',
    content: 'No problem! Wanna start coding? Or should I clarify anything else?',
    options: {
      'let\'s code!': (e) => e.goTo('start-coding'),
      'what\'s this about cyberspace?': (e) => e.goTo('intro-tut'),
      'what\'s a "library"?': (e) => e.goTo('library'),
      'what are custom elements?': (e) => e.goTo('custom-elements')
    }
  }, {
    id: 'start-coding',
    code: '<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n',
    content: 'We can\'t actually use any of <a href="https://aframe.io/" target="_blank">A-Frame</a>\'s Custom Elements until we include the library in our HTML page. So I\'ve added it on <b>line 2</b> the way we would any other JavaScript library, with a <code>&lt;script&gt;</code> tag whose <code>src</code> points to the library.',
    options: {
      'make\'s sense': (e) => e.goTo('start-coding2'),
      'JavaScript library?': (e) => e.goTo('what-is-js-lib')
    }
  }, {
    id: 'what-is-js-lib',
    content: 'The web provides APIs in browsers for all sorts of things, including one called WebVR, but like most browser APIs it\'s only accessible via JavaScript, which is the web\'s programming language. The <a href="https://aframe.io/" target="_blank">A-Frame</a> library was written in JavaScript, which is how it makes the API accessible to us via HTML instead (using it\'s custom elements)',
    options: {
      'fantastic!': (e) => e.goTo('start-coding2'),
      'API?': (e) => e.goTo('api')
    }
  }, {
    id: 'api',
    content: 'API stands for "Application Programming Interface", it\'s a very general term which covers a lot of stuff. Similar to the term GUI (or Graphical User Interface) which is used to describe all graphical interfaces (buttons, windows, icons, etc) folks use to interact with apps, APIs are code-based interfaces developers use to interact with apps and data at a lower level. In this case, that\'s code provided to us by the browsers to leverage some of it\'s underlying capabilities like creating 3D VR experiences.',
    options: { 'got it! what\'s next?': (e) => e.goTo('start-coding2') }
  }, {
    id: 'start-coding2',
    code: '<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n\n</a-scene>\n',
    content: 'Once we\'ve included the library, the next thing we always need to include when creating a WebVR project is a "scene" which I\'ve gone ahead and added below the library. This is the "root" or "parent" element within which all other custom a-frame elements will be placed.',
    options: { ok: (e) => e.goTo('start-coding3') }
  }, {
    id: 'start-coding3',
    highlight: {
      startLine: 4,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    code: '<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky></a-sky>\n</a-scene>\n',
    content: 'Now I\'ve added an <a href="https://aframe.io/docs/1.0.0/primitives/a-sky.html#sidebar" target="_blank">a-sky</a> element to our scene. This element creates a background for our scene. The default color is white, so it doesn\'t look like much has changed.',
    options: { 'can we change the color!': (e) => e.goTo('start-coding5') }
  }, {
    id: 'start-coding5',
    before: () => { NNE.code = TUTORIAL.getCode('a-sky') },
    highlight: {
      startLine: 4,
      startCol: 9,
      endCol: 24,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Yes! We can change the color by giving the <code>a-sky</code> element a <code>color</code> attribute (or the color "component" in A-Frame lingo) with any color value we\'d like.',
    options: {
      'cool, what\'s next?': (e) => e.goTo('start-coding6'),
      'what color value is that?': (e) => e.goTo('ex-color')
    }
  }, {
    id: 'start-coding6',
    before: () => { NNE.code = TUTORIAL.getCode('a-box') },
    highlight: { startLine: 5, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'We can use the <a href="https://aframe.io/docs/1.0.0/core/entity.html#sidebar" target="_blank">a-entity</a> element, which I\'ve added on <b>line 5</b>, to add all kinds of stuff to our scene.',
    options: { ok: (e) => e.goTo('start-coding7') }
  }, {
    id: 'ex-color',
    content: 'This is called a "<a href="https://www.w3schools.com/colors/colors_hexadecimal.asp" target="_blank">hex color value</a>", in code there are lots of different ways to define colors. We\'ll come back to colors a little later, let\'s get some stuff in our scene first.',
    options: { ok: (e) => e.goTo('start-coding6') }
  }, {
    id: 'start-coding7',
    content: 'If we want this entity to become a 3D object we need to add two components. A <code>geometry</code> compoenent to define it\'s shape and a <code>material</code> component to define it\'s appearance.',
    options: {
      'let\'s set it\'s geometry!': (e) => e.goTo('set-geo'),
      'let\'s set it\'s material!': (e) => e.goTo('set-mat')
    }
  }, {
    id: 'set-geo',
    before: () => { NNE.code = TUTORIAL.getCode('set-geo') },
    highlight: {
      startLine: 5,
      startCol: 12,
      endCol: 38,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Done! The <a href="https://aframe.io/docs/1.0.0/components/geometry.html#sidebar" target="_blank">material</a>  component takes as it\'s value a list of properties written much like CSS. The property name (<i>primitive</i>) followed by a colon <code>:</code> and then the property\'s value (<i>box</i>) ending with a semicolon <code>;</code> (after which we can add another property/value pair). But we won\'t actually see it until we give it a material.',
    options: {
      'let\'s give it a material!': (e) => e.goTo('set-mat-from-geo'),
      'can we add other properites?': (e) => e.goTo('other-props-geo')
    }
  }, {
    id: 'other-props-geo',
    content: 'We can! But let\'s not get ahead of ourselves, we still don\'t see anything, I\'ll come back to other properites at the end of this lesson.',
    options: { 'fair enough': (e) => e.goTo('set-mat-from-geo') }
  }, {
    id: 'set-mat-from-geo',
    before: () => { NNE.code = TUTORIAL.getCode('set-geo-mat') },
    highlight: {
      startLine: 5,
      startCol: 39,
      endCol: 65,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'I\'ve now added the <a href="https://aframe.io/docs/1.0.0/components/material.html#sidebar" target="_blank">material</a> to our entity with a <code>color</code> property, and... Voilà we have a box!',
    options: {
      'I don\'t see anything?': (e) => e.goTo('no-see')
    }
  }, {
    id: 'set-mat',
    before: () => { NNE.code = TUTORIAL.getCode('set-mat') },
    highlight: {
      startLine: 5,
      startCol: 12,
      endCol: 39,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Done! The <a href="https://aframe.io/docs/1.0.0/components/material.html#sidebar" target="_blank">material</a> component takes as it\'s value a list of properties written much like CSS. The property name (<i>color</i>) followed by a colon <code>:</code> and then the property\'s value (<i>the hex color code</i>) ending with a semicolon <code>;</code> (after which we can add another property/value pair). But we won\'t actually see it until we give it a geometry.',
    options: {
      'let\'s give it a geometry!': (e) => e.goTo('set-geo-from-mat'),
      'can we add other properites?': (e) => e.goTo('other-props-mat')
    }
  }, {
    id: 'other-props-mat',
    content: 'We can! But let\'s not get ahead of ourselves, we still don\'t see anything, I\'ll come back to other properites at the end of this lesson.',
    options: { 'fair enough': (e) => e.goTo('set-geo-from-mat') }
  }, {
    id: 'set-geo-from-mat',
    before: () => { NNE.code = TUTORIAL.getCode('set-geo-mat') },
    highlight: {
      startLine: 5,
      startCol: 12,
      endCol: 36,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'I\'ve now added the <a href="https://aframe.io/docs/1.0.0/components/geometry.html#sidebar" target="_blank">geometry</a> to our entity with a <code>primitive</code> property (defining a general shape) set to <code>box</code>, and... Voilà we have a box!',
    options: {
      'I don\'t see anything?': (e) => e.goTo('no-see')
    }
  }, {
    id: 'no-see',
    content: 'That\'s because it\'s under the "camera", by default A-Frame sets the camera in the center of the scene at the "eye-level" of a standing human. While any entities you create get added to the center of the scene at the floor level. Click and drag your mouse downwards in the white space to pan the camera down. Alternatively, you could use your down arrow key to move the camera backwards.',
    options: {
      'make\'s sense': (e) => e.goTo('position-it'),
      'I\'m disoriented': (e) => e.goTo('disoriented')
    }
  }, {
    id: 'disoriented',
    before: () => {
      WIDGETS['xyz-space'].open()
      setTimeout(() => {
        WIDGETS['xyz-space'].recenter()
      }, STORE.getTransitionTime())
    },
    content: 'Working in 3D space on a 2D screen can be tricky, but don\'t worry, with practice you\'ll totally get the hang of it! I\'ve opened up an XYZ diagram to help explain the coordinate system. I\'ll store it in my Widgets Menu too in case you want to open it up later.',
    options: {
      'ok, thanks!': (e) => e.goTo('position-it'),
      'where\'s this Widgets Menu?': (e) => e.goTo('wig-menu')
    }
  }, {
    id: 'wig-menu',
    content: 'Just click on my face and choose the Widgets option to open the Widgets Menu at any time.',
    options: { ok: (e) => e.goTo('position-it') }
  }, {
    id: 'position-it',
    before: () => {
      NNE.code = TUTORIAL.getCode('set-geo-mat')
      if (STORE.state.layout !== 'dock-left') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: 'Now, every time we update our code and our sketch refreshes the camera will get reset to it\'s default position. So if we don\'t want to start with a blank screen, we\'ll either have to change our box\'s position or our camera\'s position in our code.',
    options: {
      'let\'s move the box': (e) => e.goTo('pos-box'),
      'let\'s move the camera': (e) => e.goTo('pos-cam')
    }
  }, {
    id: 'pos-box',
    before: () => { NNE.code = TUTORIAL.getCode('pos-box') },
    highlight: {
      startLine: 5,
      startCol: 12,
      endCol: 31,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'We can add a <code>position</code> component to our box entity which takes "x y z" coordinate values as three numbers separated by spaces. Let\'s move it up (positive) on the <i>Y axis</i> by 1.6 so it matches "eye-level" like the camera, and then inwards (negative) on the <i>Z axis</i> by 3, so that it\'s a bit distanced from the camera.',
    options: { 'what about the camera?': (e) => e.goTo('pos-cam-from-box') }
  }, {
    id: 'pos-cam-from-box',
    content: 'Like I mentioned before, A-Frame adds a default camera at eye-level for us but we can change that by adding the camera to the scene ourselves using another <code>a-entity</code> with the <code>camera</code> component set.',
    options: { ok: (e) => e.goTo('pos-cam-from-box2') }
  }, {
    id: 'pos-cam-from-box2',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam-from-box') },
    content: 'Ok, I\'ve added the entity with the camera component, which means we can now place it wherever we want by adding an additional position component.',
    options: {
      'let\'s do it': (e) => e.goTo('pos-cam-from-box3'),
      'wait, why did the box move?': (e) => e.goTo('ex-cam-shift'),
      'on line 4? does order matter?': (e) => e.goTo('order-matter-box')
    }
  }, {
    id: 'ex-cam-shift',
    content: 'It didn\'t, but when we created our own entity for the camera component, it set the camera to the default <i>x y z</i> of "0 0 0", which is the center of the scene at ground level, so we\'re now on the ground looking up at the box.',
    options: {
      'I see': (e) => e.goTo('pos-cam-from-box3'),
      'does entity order matter?': (e) => e.goTo('order-matter-box')
    }
  }, {
    id: 'order-matter-box',
    content: 'The order you write these entities in your code doesn\'t matter (though in a later tutorial we\'ll discuss an exception) so long as they are all within the opening tag of the scene <code>&lt;a-scene&gt;</code> and the closing tag of the scene <code>&lt;/a-scene&gt;</code>.',
    options: {
      'got it': (e) => e.goTo('pos-cam-from-box3'),
      'so why did the box move?': (e) => e.goTo('ex-cam-shift')
    }
  }, {
    id: 'pos-cam-from-box3',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam-from-box2') },
    highlight: {
      startLine: 4,
      startCol: 19,
      endCol: 37,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Now, let\'s set the camera\'s position back to where it was initially, the center of the scene in the <i>x</i> and <i>z</i> axis, but up at eye level in the <i>y</i> axis, and things should now look like they did before.',
    options: { perfect: (e) => e.goTo('pos-cam-from-box3b') }
  }, {
    id: 'pos-cam-from-box3b',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam-from-box2b') },
    highlight: {
      startLine: 4,
      startCol: 19,
      endCol: 32,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Lastly, I\'ve gone ahead and placed the default <a href="https://aframe.io/docs/1.0.0/components/look-controls.html#sidebar" target="_blank">look-controls</a> in our camera entity so that we can move the scene with our mouse (like we did earlier). There are other types of controls but we\'ll come back to this in the last lesson.',
    options: { ok: (e) => e.goTo('pos-cam-from-box4') }
  }, {
    id: 'pos-cam-from-box4',
    content: 'Ok enough of this minimalist still life, let\'s start animating our box! Before we do that, it\'ll be easier to conceptualize if we center it back at the default position of "0 0 0". Which means it\'ll be under our camera again, so we should probably also reposition the camera to "0 0 3". This way it\'s at ground level but a bit farther back on the <i>z</i> axis so that it\'s looking at our box (and not inside of it).',
    options: { 'ok, go for it!': (e) => e.goTo('box-cam-set') }
  }, {
    id: 'box-cam-set',
    before: () => { NNE.code = TUTORIAL.getCode('box-cam-set') },
    content: 'Done! Before we jump into animation, let\'s add a few more components to our box that\'ll make this more interesting.',
    options: {
      ok: (e) => e.goTo('more-components'),
      'wait, nothing changed?': (e) => e.goTo('ex-reset')
    }
  }, {
    id: 'ex-reset',
    content: 'Look at the position values in the code, I definitely changed them. That said, the relationship between the cube and the camera stayed the same, they\'re both still 3 (meters) away from each other, so there\'s no <i>perceptible</i> change to us.',
    options: {
      'ok, i see': (e) => e.goTo('more-components')
    }
  }, {
    id: 'pos-cam',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam') },
    highlight: {
      startLine: 4,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Ok, so like I said, A-Frame adds a default camera at eye-level for us but we can change that by adding the camera to the scene ourselves using another <code>a-entity</code> with the <code>camera</code> component set. Notice how I\'ve added this to <b>line 4</b>',
    options: {
      'I see it': (e) => e.goTo('pos-cam2'),
      'why line 4? does order matter?': (e) => e.goTo('order-matter-cam')
    }
  }, {
    id: 'order-matter-cam',
    content: 'The order you write these entities in your code doesn\'t matter (though in a later tutorial we\'ll discuss an exception) so long as they are all within the opening tag of the scene <code>&lt;a-scene&gt;</code> and the closing tag of the scene <code>&lt;/a-scene&gt;</code>.',
    options: { ok: (e) => e.goTo('pos-cam2') }
  }, {
    id: 'pos-cam2',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam2') },
    highlight: {
      startLine: 4,
      startCol: 19,
      endCol: 35,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Next we add a <code>position</code> component to our camera entity which takes "x y z" coordinate values as three numbers separated by spaces. I\'ve left the <i>x</i> and <i>y</i> position at the scene\'s center, but I\'ve set it\'s <i>z</i> position to 3. So we\'ve now stepped backwards in the z dimension by 3 meters and are looking at the cube at the center of the scene.',
    options: { ok: (e) => e.goTo('pos-cam3') }
  }, {
    id: 'pos-cam3',
    content: 'You might notice that if you try to move the scene around with your mouse like we did before it no longer works. That\'s because when we create our own camera we also need to specify the kinds of controls we want.',
    options: { ok: (e) => e.goTo('pos-cam4') }
  }, {
    id: 'pos-cam4',
    before: () => { NNE.code = TUTORIAL.getCode('pos-cam4') },
    highlight: {
      startLine: 4,
      startCol: 20,
      endCol: 32,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'I\'ve gone ahead and placed the default <a href="https://aframe.io/docs/1.0.0/components/look-controls.html#sidebar" target="_blank">look-controls</a> in our camera entity. There are other types of controls but we\'ll come back to this in the last lesson.',
    options: { ok: (e) => e.goTo('pos-cam5') }
  }, {
    id: 'pos-cam5',
    before: () => { NNE.code = TUTORIAL.getCode('box-cam-set') },
    highlight: {
      startLine: 6,
      startCol: 12,
      endCol: 28,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Ok now the fun begins! Let\'s start animating things! For this to make more conceptual sense it\'ll help if we add a position component to our box. I\'ve done that now, but I\'ve left the default values of "0 0 0" so we won\'t notice any change yet.',
    options: { ok: (e) => e.goTo('pos-cam') }
  }, {
    id: 'more-components',
    before: () => {
      NNE.code = TUTORIAL.getCode('box-cam-set')
      if (STORE.state.layout !== 'dock-left') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: 'Similar to the position component, we can also give any entity a <a href="https://aframe.io/docs/1.0.0/components/rotation.html#sidebar">rotation</a> component which takes "x y z" values in degrees (0-360), as well as a <a href="https://aframe.io/docs/1.0.0/components/scale.html#sidebar">scale</a> which also takes "x y z" values to change the objects "scale" (1 being the same size, 2 being twice the size, 0.5 half the size, etc)',
    options: { 'let\'s see them': (e) => e.goTo('more-components2') }
  }, {
    id: 'more-components2',
    before: () => { NNE.code = TUTORIAL.getCode('more-components') },
    highlight: {
      startLine: 6,
      startCol: 12,
      endCol: 42,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'Again, I\'ve left their default values. For rotation that\'s "0 0 0" like position, but for scale that\'s "1 1 1" (because a scale of 0 0 0 would resize our box down to nothing). Try editing the values yourself and see!',
    options: { 'cool, what\'s next?': (e) => e.goTo('clean-up') }
  }, {
    id: 'clean-up',
    content: 'Our box entity on <b>line 6</b> is getting really long... which doesn\'t make it very easy to work with (no one likes scrolling back/fourth in an editor). So I\'m going to space things out a little differently so that this is easier to read and write.',
    options: { ok: (e) => e.goTo('clean-up2') }
  }, {
    id: 'clean-up2',
    before: () => { NNE.code = TUTORIAL.getCode('clean-up') },
    content: 'There we go, isn\'t that a little easier on the eyes?',
    options: {
      'very nice, thank you': (e) => e.goTo('animate'),
      'that doesn\'t effect the code?': (e) => e.goTo('ex-space')
    }
  }, {
    id: 'ex-space',
    content: 'The spacing within the opening tag\'s of the entities matters, after all <code>camera look-controls position</code> is not the same code as <code>cameralook-controlsposition</code> (A-Frame would think that was one long component name), but other than that, we could write this all on one line if we wanted to and it wouldn\'t make a difference to the computer.',
    options: {
      'good to know': (e) => e.goTo('animate'),
      'show me!': (e) => e.goTo('ex-space2')
    }
  }, {
    id: 'ex-space2',
    before: () => { NNE.code = TUTORIAL.getCode('no-space') },
    content: 'Boom! ...one line',
    options: {
      'ha! ...ok, let\'s clean it back up': (e) => e.goTo('animate')
    }
  }, {
    id: 'animate',
    before: () => {
      NNE.code = TUTORIAL.getCode('clean-up')
      if (STORE.state.layout !== 'dock-left') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: 'We can animate practically any aspect of our entity, like it\'s scale, rotation and position, and also various sub-properties of it\'s geometry and material. I\'ll demonstrate how the animation system works with our box\'s rotation.',
    options: { ok: (e) => e.goTo('animate2') }
  }, {
    id: 'animate2',
    before: () => { NNE.code = TUTORIAL.getCode('anim-1') },
    highlight: { startLine: 13, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'Like the geometry and material components, the <a href="https://aframe.io/docs/1.0.0/components/animation.html#sidebar" target="_blank">animation</a> component takes a list (separated by semicolons <code>;</code>) of property and value pairs (with colons <code>:</code> between the property and value names). The most important being the <code>property</code> you want to animate and the value you want to change it\'s initial values <code>to</code>, take a look at the code I\'ve added on <b>line 13</b>',
    options: { 'I see': (e) => e.goTo('animate3') }
  }, {
    id: 'animate3',
    before: () => { NNE.code = TUTORIAL.getCode('anim-2') },
    highlight: { startLine: 15, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'Let\'s space out these properties on separate lines so it\'s easier to write. Now, on <b>line 15</b> I\'ve specified the duration (time) for the animation (in milliseconds) using the <code>dur</code> property (2000 milliseconds is 2 seconds).',
    options: { ok: (e) => e.goTo('animate4') }
  }, {
    id: 'animate4',
    before: () => { NNE.code = TUTORIAL.getCode('anim-3') },
    highlight: { startLine: 16, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'If we want the animation to repeat we can set the <code>loop</code> preoprty to <i>true</i>',
    options: { ok: (e) => e.goTo('animate5') }
  }, {
    id: 'animate5',
    before: () => { NNE.code = TUTORIAL.getCode('anim-4') },
    highlight: { startLine: 17, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'We can also change the default direction of the animation using the <code>dir</code> property, so that it animates in <i>reverse</i> or so that it <i>alternates</i> back and fourth.',
    options: { ok: (e) => e.goTo('animate6') }
  }, {
    id: 'animate6',
    before: () => { NNE.code = TUTORIAL.getCode('anim-5') },
    highlight: { startLine: 18, color: 'rgba(255, 255, 255, 0.15)' },
    content: 'We can also change the animations "easing". For example, rather than have our box turn 180 degrees over the course of 2 seconds at a consistent linear speed. We can using the <code>easing</code> property to declare that we want it to "ease in" (or ramp up to full speed) and "ease out" (or slow down towards the end)',
    options: { nice: (e) => e.goTo('animate7') }
  }, {
    id: 'animate7',
    before: () => {
      TUTORIAL.remixTemplate = 'cube-only'
      NNE.code = TUTORIAL.getCode('cube-only')
    },
    highlight: {
      startLine: 19,
      startCol: 4,
      endCol: 21,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'We can create as many animations as we want, each animating a different property of our element. But when defining more than one animation you\'ll need to add two underscores <code>__</code> and some other letter or word to differentiate it from the other animation, notice how I named this new animation on <b>line 19</b> ',
    options: { 'cool!': (e) => e.goTo('animate8') }
  }, {
    id: 'animate8',
    content: 'There are loads <a href="https://aframe.io/docs/1.0.0/components/animation.html#properties" target="_blank">more animation properties</a> which you check out on the A-Frame documentation page if you\'re curious. But I think you\'ve got enough information to start experimenting a bit on your own. Unless you think we should add another object to our scene first?',
    options: {
      'I\'ll take it from here': (e) => e.goTo('pre-remix'),
      'Let\'s add a sphere!': (e) => e.goTo('add-sphere'),
      'Let\'s add a torus!': (e) => e.goTo('add-torus')
    }
  }, {
    id: 'add-torus',
    before: () => {
      TUTORIAL.remixTemplate = 'cube-torus'
      NNE.code = TUTORIAL.getCode('cube-torus')
    },
    highlight: {
      startLine: 9,
      endLine: 18,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'You got it! I also went ahead and added an animation to that entity as well. Now, before you start experimenting I want you to consider the bigger picture here. Spinning a box around might seem trivial, but it\'s the first step in your journey to creating the digital environment the rest of the world lives in. And with great power comes great responsibility.',
    options: { ok: (e) => e.goTo('vr-ethics') }
  }, {
    id: 'add-sphere',
    before: () => {
      TUTORIAL.remixTemplate = 'cube-sphere'
      NNE.code = TUTORIAL.getCode('cube-sphere')
    },
    highlight: {
      startLine: 9,
      endLine: 18,
      color: 'rgba(255, 255, 255, 0.15)'
    },
    content: 'You got it! I also went ahead and added an animation to that entity as well. Now, before you start experimenting I want you to consider the bigger picture here. Spinning a box around might seem trivial, but it\'s the first step in your journey to creating the digital environment the rest of the world lives in. And with great power comes great responsibility.',
    options: { ok: (e) => e.goTo('vr-ethics') }
  }, {
    id: 'pre-remix',
    content: 'Great! Before you start experimenting I want you to consider the bigger picture here. Spinning a box around might seem trivial, but it\'s the first step in your journey to creating the digital environment the rest of the world lives in. And with great power comes great responsibility.',
    options: { ok: (e) => e.goTo('vr-ethics') }
  }, {
    id: 'vr-ethics',
    content: 'VR headsets already have the capability to 3D scan your physical environment in order to propertly track your movements in space. This data, while serving a functional purpose, can be easily <a href="https://uploadvr.com/report-vr-data-collection-stanford/" target="_blank">abused in a surveillance capitalist context</a>. And technology like <a href="https://www.wired.com/story/eye-tracking-vr/" target="_blank">eye tracking</a> is just around the corner. That\'s not to mention the larger more existential considerations we\'ll inevitably be confronted with as the technology proliferates.',
    options: {
      'very true': (e) => e.goTo('lets-play'),
      'existential?': (e) => {
        WIDGETS['vr-ethics'].open()
        WIDGETS['vr-ethics'].play()
        WIDGETS['vr-ethics'].at('165.6', () => WIDGETS['vr-ethics'].close())
        setInterval(() => WIDGETS['vr-ethics'].recenter(), 500)
      }
    }
  }, {
    id: 'lets-play',
    content: 'Keeping all that in the back of your mind... let\'s play! As you start remixing don\'t forget that you can double click on various pieces of code if you\'d like me to explain more about it. In some cases I\'ve even got some widgets to help you write/edit the code. For example, double click the a-sky\'s hex color value or an entity\'s component to see some of those widget options.',
    options: { 'ok thanks!': (e) => e.goTo('remix') }
  }, {
    id: 'remix',
    content: 'When you\'re done experimenting let me know and I\'ll show you how to save your sketch on the Internet so you can share your work with others.',
    options: {
      'ok I\'m done!': (e) => {
        const template = TUTORIAL.getCode(TUTORIAL.remixTemplate)
        const compare = NNE._compareTwoStrings(template, NNE.code)
        console.log('CHANGED BY', compare);
        // e.goTo('...')
      }
    }
  }],

  onload: () => {
    window.utils.setupAframeEnv()
    NNE.addCustomRoot('tutorials/webvr-basics/')
  },

  widgets: {
    'xyz-space': new Widget({
      width: window.innerWidth * 0.25,
      title: '3D Coordinates (X Y Z)',
      innerHTML: '<img style="width:100%" src="tutorials/webvr-basics/images/xyz.png"><br><p>3D means three dimensions, the horizontal dimension (or the <i>X axis</i>), the vertical dimension (or the <i>Y axis</i>) and the depth dimension (or the <i>Z axis</i>). Negative <i>X axis</i> values extend to the left, positive <i>X axis</i> values extend to the right. Negative <i>Y axis</i> values extend down, positive <i>Y axis</i> extend up. Negative <i>Z axis</i> values extend in (forward), positive <i>Z axis</i> values extend out (backwards).</p>'
    }),
    'vr-ethics': new HyperVidPlayer({
      video: 'api/videos/vr-ethics.mp4',
      width: window.innerWidth * 0.4,
      title: 'Ethical Considerations of VR'
    })
  },

  betaMessage: '◕ ◞ ◕ oops! that tutorial isn\'t ready yet! netnet.stuio is still in <beta>, get in touch if you want to help $upport us: hi@netizen.org',

  getCode: (id) => {
    const de = document.documentElement
    const bg = window.getComputedStyle(de).getPropertyValue('--netizen-string')
    const c1 = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
    const c2 = window.getComputedStyle(de).getPropertyValue('--netizen-match-border')
    const c = {
      'a-sky': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n</a-scene>\n`,
      'a-box': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n  <a-entity></a-entity>\n</a-scene>\n`,
      'set-geo': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n  <a-entity geometry="primitive: box;"></a-entity>\n</a-scene>\n`,
      'set-mat': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n  <a-entity material="color: ${c1};"></a-entity>\n</a-scene>\n`,
      'set-geo-mat': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n  <a-entity geometry="primitive: box;" material="color: ${c1};"></a-entity>\n</a-scene>\n`,
      'pos-box': `<!DOCTYPE html>\n<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>\n<a-scene>\n  <a-sky color="${bg}"></a-sky>\n  <a-entity position="0 1.6 -3" geometry="primitive: box;" material="color: ${c1};"></a-entity>\n</a-scene>\n`,
      'pos-cam-from-box': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity position="0 1.6 -3" geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'pos-cam-from-box2': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera position="0 1.6 0"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity position="0 1.6 -3" geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'pos-cam-from-box2b': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera look-controls position="0 1.6 0"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity position="0 1.6 -3" geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'pos-cam': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'pos-cam2': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera position="0 0 3"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'pos-cam4': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera look-controls position="0 0 3"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'box-cam-set': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera look-controls position="0 0 3"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity position="0 0 0" geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'more-components': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-entity camera look-controls position="0 0 3"></a-entity>
  <a-sky color="#82ccd7"></a-sky>
  <a-entity scale="1 1 1" rotation="0 0 0" position="0 0 0" geometry="primitive: box;" material="color: ${c1};"></a-entity>
</a-scene>`,
      'clean-up': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'no-space': `<!DOCTYPE html><script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script><a-scene><a-entity camera look-controls position="0 0 3"></a-entity><a-sky color="${bg}"></a-sky><a-entity scale="1 1 1" rotation="0 0 0" position="0 0 0" geometry="primitive: box;" material="color: ${c1};"></a-entity></a-scene>`,
      'anim-1': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation; to: 0 180 0;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'anim-2': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
     to: 0 180 0;
     dur: 2000;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'anim-3': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
     to: 0 180 0;
     dur: 2000;
     loop: true;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'anim-4': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 0 180 0;
      dur: 2000;
      loop: true;
      dir: alternate;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'anim-5': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 0 180 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'cube-only': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

<a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 0 180 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    animation__move="property: position;
      from: 0 -1 0;
      to: 0 1 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'cube-sphere': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

<a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    animation="property: scale;
     to: 0.5 1 0.5;
     dur: 1000;
     loop: true;
     dir: alternate;
     easing: easeInOutQuad;"
    geometry="primitive: sphere; radius: 0.5;"
    material="color: ${c2};"></a-entity>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 0 180 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    animation__move="property: position;
      from: 0 -1 0;
      to: 0 1 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`,
      'cube-torus': `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>

  <a-entity camera look-controls position="0 0 3"></a-entity>

  <a-sky color="${bg}"></a-sky>

  <a-entity
    scale="1 1 1"
    animation="property: rotation;
     to: 180 0 0;
     dur: 2000;
     loop: true;
     dir: alternate;
     easing: easeInOutQuad;"
    geometry="primitive: torus; radius: 1.5"
    material="color: ${c2};"></a-entity>

  <a-entity
    scale="1 1 1"
    rotation="0 0 0"
    position="0 0 0"
    animation="property: rotation;
      to: 0 180 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    animation__move="property: position;
      from: 0 -1 0;
      to: 0 1 0;
      dur: 2000;
      loop: true;
      dir: alternate;
      easing: easeInOutQuad;"
    geometry="primitive: box;"
    material="color: ${c1};"></a-entity>

</a-scene>`
    }
    return c[id]
  }
}
