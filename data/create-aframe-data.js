/*
  -----------
     info
  -----------

  This is a node program for generating the a-frame-edu-data.json data used
  in the A-Frame tutorial.

  -----------
     usage
  -----------

  $ node create-aframe-data
*/
const fs = require('fs')
const data = { elements: {}, attributes: {}, properties: {} }
const eles = [
  { name: 'a-assets', url: 'https://aframe.io/docs/1.0.0/core/asset-management-system.html', description: 'A-Frame has an asset management system that allows us to place our assets (images, audio, video, 3d models) in one place and to preload and cache assets for better performance.' },
  { name: 'a-asset-item', url: 'https://aframe.io/docs/1.0.0/core/asset-management-system.html#lt-a-asset-item-gt', description: 'It\'s used to load assets (external files used in the scene) like 3D objects' },
  { name: 'a-box', url: null, description: null },
  { name: 'a-camera', url: 'https://aframe.io/docs/1.0.0/primitives/a-camera.html', description: 'It determines what the user sees. We can change the viewport by modifying the camera entity\'s position and rotation.' },
  { name: 'a-circle', url: null, description: null },
  { name: 'a-cone', url: null, description: null },
  { name: 'a-cubemap', url: null, description: null },
  { name: 'a-cursor', url: null, description: null },
  { name: 'a-curvedimage', url: null, description: null },
  { name: 'a-cylinder', url: null, description: null },
  { name: 'a-dodecahedron', url: null, description: null },
  { name: 'a-entity', url: 'https://aframe.io/docs/1.0.0/core/entity.html', description: 'Entities are placeholder objects to which we plug in components (aka HTML attributes) to provide them appearance, behavior, and functionality.' },
  { name: 'a-gltf-model', url: null, description: null },
  { name: 'a-icosahedron', url: null, description: null },
  { name: 'a-image', url: null, description: null },
  { name: 'a-light', url: null, description: null },
  { name: 'a-link', url: null, description: null },
  { name: 'a-mixin', url: 'https://aframe.io/docs/1.0.0/core/mixins.html', description: 'It provides a way to compose and reuse commonly-used sets of component properties.' },
  { name: 'a-node', url: null, description: null },
  { name: 'a-obj-model', url: null, description: null },
  { name: 'a-octahedron', url: null, description: null },
  { name: 'a-plane', url: null, description: null },
  { name: 'a-register-element', url: null, description: null },
  { name: 'a-ring', url: null, description: null },
  { name: 'a-scene', url: 'https://aframe.io/docs/1.0.0/core/scene.html', description: 'The scene is the global root object, and all entities are contained within the scene.' },
  { name: 'a-sky', url: 'https://aframe.io/docs/1.0.0/primitives/a-sky.html', description: 'It adds a background color or 360° image to a scene. A sky is a large sphere with a color or texture mapped to the inside.' },
  { name: 'a-sound', url: null, description: null },
  { name: 'a-sphere', url: null, description: null },
  { name: 'a-tetrahedron', url: null, description: null },
  { name: 'a-text', url: null, description: null },
  { name: 'a-torus', url: null, description: null },
  { name: 'a-torus-knot', url: null, description: null },
  { name: 'a-triangle', url: null, description: null },
  { name: 'a-video', url: null, description: null },
  { name: 'a-videosphere', url: null, description: null }
]
const attrs = [
  { name: 'animation', url: 'https://aframe.io/docs/1.0.0/components/animation.html#sidebar', description: 'It lets us animate and tween values including <code>position</code>, <code>rotation</code> and more.' },
  { name: 'camera', url: 'https://aframe.io/docs/1.0.0/components/camera.html', description: 'It defines from which perspective the user views the scene. The camera is commonly paired with <a href="https://aframe.io/docs/1.0.0/introduction/interactions-and-controllers.html" target="_blank">controls</a> components that allow input devices to move and rotate the camera.' },
  { name: 'color', url: null, description: null },
  { name: 'cursor', url: null, description: null },
  { name: 'daydream-controls', url: null, description: null },
  { name: 'gearvr-controls', url: null, description: null },
  { name: 'geometry', url: 'https://aframe.io/docs/1.0.0/components/geometry.html', description: 'The <code>geometry</code> component provides a basic shape for an entity. It\'s <code>primitive</code> property defines the general shape. Geometric "primitives", in computer graphics, are irreducible basic shapes. A <a href="https://aframe.io/docs/1.0.0/components/material.html" target="_blank">material</a> component is commonly defined to provide a appearance alongside the shape to create a complete mesh.' },
  { name: 'generic-tracked-controller-controls', url: null, description: null },
  { name: 'gltf-model', url: 'https://aframe.io/docs/1.0.0/components/gltf-model.html#sidebar', description: 'It loads a 3D model and material using a <a href="https://www.khronos.org/gltf/" target="_blank">glTF</a> (.lgtf or .glb) file.' },
  { name: 'hand-controls', url: null, description: null },
  { name: 'height', url: null, description: null },
  { name: 'id', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id', description: 'The HTML <code>id</code> attribute is used to specify a unique id for an HTML element. In the context of an A-Frame they are often used to associate an entity with an asset. In regular HTML it\'s often used to apply CSS to an element.' },
  { name: 'laser-controls', url: null, description: null },
  { name: 'light', url: null, description: null },
  { name: 'line', url: null, description: null },
  { name: 'link', url: null, description: null },
  { name: 'look-controls', url: null, description: null },
  { name: 'magicleap-controls', url: null, description: null },
  { name: 'material', url: 'https://aframe.io/docs/1.0.0/components/material.html', description: 'The <code>material</code> component gives appearance to an entity. We can define properties such as color, opacity, or texture. This is often paired with the <a href="https://aframe.io/docs/1.0.0/components/geometry.html" target="blank">geometry component</a> which provides shape.' },
  { name: 'mixin', url: 'https://aframe.io/docs/1.0.0/core/mixins.html', description: 'It provides a way to compose and reuse commonly-used sets of component properties.' },
  { name: 'obj-model', url: 'https://aframe.io/docs/1.0.0/components/obj-model.html#sidebar', description: 'It loads a 3D model and material using a <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank">Wavefront</a> (.OBJ) file and a .MTL file.' },
  { name: 'oculus-go-controls', url: null, description: null },
  { name: 'oculus-touch-controls', url: null, description: null },
  { name: 'position', url: 'https://aframe.io/docs/1.0.0/components/position.html', description: 'It places entities at certain spots in 3D space. Position takes coordinate "x y z" values as three numbers separated by spaces.' },
  { name: 'raycaster', url: null, description: null },
  { name: 'renderer', url: 'https://aframe.io/docs/1.0.0/components/renderer.html', description: 'It is used to configure the renderer settings (like <code>anialias</code> which when set to <code>true</code> smooths jagged edges on curved lines)' },
  { name: 'rotation', url: 'https://aframe.io/docs/1.0.0/components/rotation.html', description: 'It defines the orientation of an entity in degrees. It takes the pitch (x), yaw (y), and roll (z) as three numbers separated by spaces.' },
  { name: 'scale', url: 'https://aframe.io/docs/1.0.0/components/scale.html', description: 'It defines a shrinking, stretching, or skewing transformation of an entity. It takes three scaling factors for the "x y z" axes.' },
  { name: 'shadow', url: null, description: null },
  { name: 'sound', url: null, description: null },
  { name: 'text', url: null, description: null },
  { name: 'tracked-controls', url: null, description: null },
  { name: 'tracked-controls-webvr', url: null, description: null },
  { name: 'tracked-controls-webxr', url: null, description: null },
  { name: 'visible', url: null, description: null },
  { name: 'vive-controls', url: null, description: null },
  { name: 'vive-focus-controls', url: null, description: null },
  { name: 'wasd-controls', url: null, description: null },
  { name: 'width', url: null, description: null },
  { name: 'windows-motion-controls', url: null, description: null },
  { name: 'background', url: null, description: null },
  { name: 'debug', url: null, description: null },
  { name: 'device-orientation-permission-ui', url: null, description: null },
  { name: 'embedded', url: null, description: null },
  { name: 'inspector', url: null, description: null },
  { name: 'fog', url: null, description: null },
  { name: 'keyboard-shortcuts', url: null, description: null },
  { name: 'pool', url: null, description: null },
  { name: 'screenshot', url: null, description: null },
  { name: 'stats', url: null, description: null },
  { name: 'vr-mode-ui', url: null, description: null },
  { name: 'pivot', url: null, description: null }
]

const props = [
  { name: 'position', type: 'vec3', default: '0 0 0' },
  { name: 'rotation', type: 'vec3', default: '0 0 0' },
  { name: 'scale', type: 'vec3', default: '1 1 1' }
  // {
  //   name: 'camera',
  //   type: 'component',
  //   schema: {
  //     active: { type: 'boolean', default: true },
  //     far: { type: 'number', default: 10000, min: 100, max: 10000 },
  //     fov: { type: 'number', default: 80, min: 0, max: 200 },
  //     near: { type: 'number', default: 0.005, min: 0, step: 0.001, max: 2 },
  //     spectator: { type: 'boolean', default: false },
  //     zoom: { type: 'number', default: 1, min: 0, max: 10 }
  //   }
  // }
]

// function schema2data (s) {
//   const data = {}
//   for (const p in s) {
//     data[p] = {
//       type: s[p].type,
//       default: s[p].default,
//       info: '...'
//     }
//     if (s[p].type === 'number') {
//       data[p].min = s[p].min || 0
//       data[p].max = s[p].max || 1
//     }
//   }
//   return JSON.stringify(data, null, 2)
// }

const attrArr = attrs.map(a => a.name)
const eleTextStr = eles.map(e => `<${e.name}>`).join(', ')
const eleHtmlStr = eles.map(e => {
  const url = e.url || ''
  return `<a href="${url}" target="_blank">&lt;${e.name}&gt;</a>`
}).join(', ')

eles.forEach(ele => {
  const name = ele.name
  const url = ele.url || 'https://aframe.io/docs/1.0.0/introduction/'
  const cel = 'This HTML <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" target="_blank">custom element</a> is part of the <a href="https://aframe.io/" target="_blank">A-Frame</a> library. '
  data.elements[name] = {
    keyword: {
      html: `<a href="${url}" target="_blank">${name}</a>`,
      text: `<${name}>`,
      name: name
    },
    url: url,
    status: 'core',
    attributes: attrArr,
    description: {
      html: cel + ele.description || cel + 'Make sure you\'ve imported the library by <a href="https://aframe.io/docs/1.0.0/introduction/installation.html#include-the-js-build" target="_blank">including</a> a <code>&lt;script&gt;</code> element for it.',
      text: ele.description || 'This HTML custom element is part of the A-Frame library. Make sure you\'ve imported the library by including a <script> element for it.'
    }
  }
})

attrs.forEach(attr => {
  const name = attr.name
  const url = attr.url || 'https://aframe.io/docs/1.0.0/introduction/'
  const cat = 'This special attribute (also known as a "component" in this case) is part of the <a href="https://aframe.io/" target="_blank">A-Frame</a> library. '
  data.attributes[name] = {
    keyword: {
      html: `<a href="${url}" target="_blank">${name}</a>`,
      text: name
    },
    url: url,
    status: 'core',
    elements: {
      html: eleHtmlStr,
      text: eleTextStr
    },
    description: {
      html: cat + attr.description || cat + 'Make sure you\'ve imported the library by <a href="https://aframe.io/docs/1.0.0/introduction/installation.html#include-the-js-build" target="_blank">including</a> a <code>&lt;script&gt;</code> element for it.',
      text: attr.description || 'This special attribute (also known as a "component" in this case) is part of the A-Frame library. Make sure you\'ve imported the library by including a <script> element for it.'
    }
  }
})

props.forEach(prop => {
  data.properties[prop.name] = prop
})

const json = JSON.stringify(data, null, 2)
fs.writeFile(`${__dirname}/a-frame-edu-data.json`, json, (err) => {
  if (err) console.log(err)
})
