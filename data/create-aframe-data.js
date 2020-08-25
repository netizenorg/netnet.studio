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
const data = { elements: {}, attributes: {} }
const eles = [
  { name: 'a-assets', url: 'https://aframe.io/docs/1.0.0/core/asset-management-system.html', description: 'A-Frame has an asset management system that allows us to place our assets (images, audio, video, 3d models) in one place and to preload and cache assets for better performance.' },
  { name: 'a-asset-item', url: null, description: null },
  { name: 'a-box', url: null, description: null },
  { name: 'a-camera', url: null, description: null },
  { name: 'a-circle', url: null, description: null },
  { name: 'a-cone', url: null, description: null },
  { name: 'a-cubemap', url: null, description: null },
  { name: 'a-cursor', url: null, description: null },
  { name: 'a-curvedimage', url: null, description: null },
  { name: 'a-cylinder', url: null, description: null },
  { name: 'a-dodecahedron', url: null, description: null },
  { name: 'a-entity', url: null, description: null },
  { name: 'a-gltf-model', url: null, description: null },
  { name: 'a-icosahedron', url: null, description: null },
  { name: 'a-image', url: null, description: null },
  { name: 'a-light', url: null, description: null },
  { name: 'a-link', url: null, description: null },
  { name: 'a-mixin', url: null, description: null },
  { name: 'a-node', url: null, description: null },
  { name: 'a-obj-model', url: null, description: null },
  { name: 'a-octahedron', url: null, description: null },
  { name: 'a-plane', url: null, description: null },
  { name: 'a-register-element', url: null, description: null },
  { name: 'a-ring', url: null, description: null },
  { name: 'a-scene', url: null, description: null },
  { name: 'a-sky', url: null, description: null },
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
  { name: 'animation', url: null, description: null },
  { name: 'camera', url: null, description: null },
  { name: 'color', url: null, description: null },
  { name: 'cursor', url: null, description: null },
  { name: 'daydream-controls', url: null, description: null },
  { name: 'gearvr-controls', url: null, description: null },
  { name: 'geometry', url: null, description: null },
  { name: 'generic-tracked-controller-controls', url: null, description: null },
  { name: 'gltf-model', url: null, description: null },
  { name: 'hand-controls', url: null, description: null },
  { name: 'height', url: null, description: null },
  { name: 'laser-controls', url: null, description: null },
  { name: 'light', url: null, description: null },
  { name: 'line', url: null, description: null },
  { name: 'link', url: null, description: null },
  { name: 'look-controls', url: null, description: null },
  { name: 'magicleap-controls', url: null, description: null },
  { name: 'material', url: null, description: null },
  { name: 'obj-model', url: null, description: null },
  { name: 'oculus-go-controls', url: null, description: null },
  { name: 'oculus-touch-controls', url: null, description: null },
  { name: 'position', url: null, description: null },
  { name: 'raycaster', url: null, description: null },
  { name: 'rotation', url: null, description: null },
  { name: 'scale', url: null, description: null },
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

const attrArr = attrs.map(a => a.name)
const eleTextStr = eles.map(e => `<${e.name}>`).join(', ')
const eleHtmlStr = eles.map(e => {
  const url = e.url || ''
  return `<a href="${url}" target="_blank">&lt;${e.name}&gt;</a>`
}).join(', ')

eles.forEach(ele => {
  const name = ele.name
  data.elements[name] = {
    keyword: {
      html: `<a href="https://aframe.io/docs/1.0.0/introduction/" target="_blank">${name}</a>`,
      text: `<${name}>`,
      name: name
    },
    url: ele.url || 'https://aframe.io/docs/1.0.0/introduction/',
    status: 'core',
    attributes: attrArr,
    description: {
      html: ele.description || 'This HTML <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" target="_blank">custom element</a> is part of the <a href="https://aframe.io/" target="_blank">A-Frame</a> library. Make sure you\'ve imported the library by <a href="https://aframe.io/docs/1.0.0/introduction/installation.html#include-the-js-build" target="_blank">including</a> a <code>&lt;script&gt;</code> element for it.',
      text: ele.description || 'This HTML custom element is part of the A-Frame library. Make sure you\'ve imported the library by including a <script> element for it.'
    }
  }
})

attrs.forEach(attr => {
  const name = attr.name
  data.attributes[name] = {
    keyword: {
      html: `<a href="https://aframe.io/docs/1.0.0/introduction/" target="_blank">${name}</a>`,
      text: name
    },
    url: attr.url || 'https://aframe.io/docs/1.0.0/introduction/',
    status: 'core',
    elements: {
      html: eleHtmlStr,
      text: eleTextStr
    },
    description: {
      html: attr.description || 'This special attribute (also known as a "component" in this case) is part of the <a href="https://aframe.io/" target="_blank">A-Frame</a> library. Make sure you\'ve imported the library by <a href="https://aframe.io/docs/1.0.0/introduction/installation.html#include-the-js-build" target="_blank">including</a> a <code>&lt;script&gt;</code> element for it.',
      text: attr.description || 'This special attribute (also known as a "component" in this case) is part of the A-Frame library. Make sure you\'ve imported the library by including a <script> element for it.'
    }
  }
})

const json = JSON.stringify(data, null, 2)
fs.writeFile(`${__dirname}/a-frame-edu-data.json`, json, (err) => {
  if (err) console.log(err)
})
