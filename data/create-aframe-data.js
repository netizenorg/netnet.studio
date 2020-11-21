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
  { name: 'a-box', url: 'https://aframe.io/docs/1.0.0/primitives/a-box.html#sidebar', description: 'The box primitive creates shapes such as boxes, cubes, or walls.' },
  { name: 'a-camera', url: 'https://aframe.io/docs/1.0.0/primitives/a-camera.html', description: 'It determines what the user sees. We can change the viewport by modifying the camera entity\'s position and rotation.' },
  { name: 'a-circle', url: 'https://aframe.io/docs/1.0.0/primitives/a-circle.html#sidebar', description: 'The circle primitive creates circles surfaces using the geometry component with the type set to circle.' },
  { name: 'a-cone', url: 'https://aframe.io/docs/1.0.0/primitives/a-cone.html#sidebar', description: 'The cone primitive creates a cone shape.' },
  { name: 'a-cubemap', url: 'https://aframe.io/docs/1.0.0/components/material.html#environment-maps', description: 'This creates an environment map from six images put together to form a cube. The cubemap wraps around the mesh and applied as a texture.' },
  { name: 'a-cursor', url: 'https://aframe.io/docs/1.0.0/primitives/a-cursor.html#sidebar', description: 'The cursor primitive is a reticle that allows for clicking and basic interactivity with a scene on devices that do not have a hand controller. The default appearance is a ring geometry. The cursor is usually placed as a child of the camera.' },
  { name: 'a-curvedimage', url: 'https://aframe.io/docs/1.0.0/primitives/a-curvedimage.html#sidebar', description: 'The curved image primitive creates images that bend around the user. Curved images arranged around the camera can be pleasing for legibility since each pixel sits at the same distance from the user. They can be a better choice than angled flat planes for complex layouts because they ensure a smooth surface rather than a series of awkward seams between planes.' },
  { name: 'a-cylinder', url: 'https://aframe.io/docs/1.0.0/primitives/a-cylinder.html#sidebar', description: 'The cylinder primitive is used to create tubes and curved surfaces.' },
  { name: 'a-dodecahedron', url: 'https://aframe.io/docs/1.0.0/primitives/a-dodecahedron.html#sidebar', description: 'This primitive creates a polyhedron with 12 faces' },
  { name: 'a-entity', url: 'https://aframe.io/docs/1.0.0/core/entity.html', description: 'Entities are placeholder objects to which we plug in components (aka HTML attributes) to provide them appearance, behavior, and functionality.' },
  { name: 'a-icosahedron', url: 'https://aframe.io/docs/1.0.0/primitives/a-gltf-model.html#sidebar', description: 'This primitive creates a polyhedron with 20 faces' },
  { name: 'a-gltf-model', url: 'https://aframe.io/docs/1.0.0/primitives/a-gltf-model.html#sidebar', description: 'The glTF model primitive displays a 3D glTF model created from a 3D modeling program or downloaded from the web.' },
  { name: 'a-image', url: 'https://aframe.io/docs/1.0.0/primitives/a-image.html#sidebar', description: 'The image primitive shows an image on a flat plane.' },
  { name: 'a-light', url: 'https://aframe.io/docs/1.0.0/primitives/a-light.html#sidebar', description: 'A light changes the lighting and shading of the scene.' },
  { name: 'a-link', url: 'https://aframe.io/docs/1.0.0/primitives/a-link.html#sidebar', description: 'The link primitive provides a compact API to define links that resembles the traditional <code>&lt;a&gt;</code> tag.' },
  { name: 'a-mixin', url: 'https://aframe.io/docs/1.0.0/core/mixins.html', description: 'It provides a way to compose and reuse commonly-used sets of component properties.' },
  { name: 'a-node', url: null, description: null },
  { name: 'a-obj-model', url: 'https://aframe.io/docs/1.0.0/primitives/a-obj-model.html#sidebar', description: 'The .OBJ model primitive displays a 3D Wavefront model.' },
  { name: 'a-octahedron', url: 'https://aframe.io/docs/1.0.0/primitives/a-octahedron.html#sidebar', description: 'This primitive creates a polyhedron with 8 faces' },
  { name: 'a-plane', url: 'https://aframe.io/docs/1.0.0/primitives/a-plane.html#sidebar', description: 'The plane primitive creates flat surfaces using the geometry component with the type set to plane.' },
  { name: 'a-register-element', url: null, description: null },
  { name: 'a-ring', url: 'https://aframe.io/docs/1.0.0/primitives/a-ring.html#sidebar', description: 'The ring primitive creates a ring or disc shape.' },
  { name: 'a-scene', url: 'https://aframe.io/docs/1.0.0/core/scene.html', description: 'The scene is the global root object, and all entities are contained within the scene.' },
  { name: 'a-sky', url: 'https://aframe.io/docs/1.0.0/primitives/a-sky.html', description: 'It adds a background color or 360° image to a scene. A sky is a large sphere with a color or texture mapped to the inside.' },
  { name: 'a-sound', url: 'https://aframe.io/docs/1.0.0/primitives/a-sound.html#sidebar', description: 'The sound primitive wraps the sound component.' },
  { name: 'a-sphere', url: 'https://aframe.io/docs/1.0.0/primitives/a-sphere.html#sidebar', description: 'The sphere primitive creates a spherical or polyhedron shapes. It wraps an entity that prescribes the geometry component with its geometric primitive set to sphere.' },
  { name: 'a-tetrahedron', url: 'https://aframe.io/docs/1.0.0/primitives/a-tetrahedron.html#sidebar', description: 'This primitive creates a polyhedron composed of four triangular faces' },
  { name: 'a-text', url: 'https://aframe.io/docs/1.0.0/primitives/a-text.html#sidebar', description: 'Wraps the text component, which renders signed distance field (SDF) font text.' },
  { name: 'a-torus', url: 'https://aframe.io/docs/1.0.0/primitives/a-torus.html#sidebar', description: 'The torus primitive creates donut or tube shapes using the geometry component with the type set to torus.' },
  { name: 'a-torus-knot', url: 'https://aframe.io/docs/1.0.0/primitives/a-torus-knot.html#sidebar', description: 'The torus knot primitive creates pretzel shapes using the geometry component with the type set to torusKnot.' },
  { name: 'a-triangle', url: 'https://aframe.io/docs/1.0.0/primitives/a-triangle.html#sidebar', description: 'The triangle primitive creates triangle surfaces using the geometry component with the type set to triangle.' },
  { name: 'a-video', url: 'https://aframe.io/docs/1.0.0/primitives/a-video.html#sidebar', description: 'The video primitive plays a video as a texture on a flat plane.' },
  { name: 'a-videosphere', url: 'https://aframe.io/docs/1.0.0/primitives/a-videosphere.html#sidebar', description: 'https://aframe.io/docs/1.0.0/primitives/a-videosphere.html#sidebar' }
]
const attrs = [
  { name: 'animation', url: 'https://aframe.io/docs/1.0.0/components/animation.html#sidebar', description: 'It lets us animate and tween values including <code>position</code>, <code>rotation</code> and more.' },
  { name: 'camera', url: 'https://aframe.io/docs/1.0.0/components/camera.html', description: 'It defines from which perspective the user views the scene. The camera is commonly paired with <a href="https://aframe.io/docs/1.0.0/introduction/interactions-and-controllers.html" target="_blank">controls</a> components that allow input devices to move and rotate the camera.' },
  // { name: 'color', url: null, description: null },
  { name: 'cursor', url: 'https://aframe.io/docs/1.0.0/components/cursor.html#sidebar', description: 'The cursor component provides hover and click states for interaction on top of the raycaster component. The cursor component can be used for both gaze-based and controller-based interactions, but the appearance needs to be configured depending on the use case. ' },
  { name: 'daydream-controls', url: 'https://aframe.io/docs/1.0.0/components/daydream-controls.html#sidebar', description: 'The daydream-controls component interfaces with the Google Daydream controllers. It wraps the tracked-controls component while adding button mappings, events, and a Daydream controller model that highlights the touched and/or pressed buttons (trackpad).' },
  { name: 'gearvr-controls', url: 'https://aframe.io/docs/1.0.0/components/gearvr-controls.html#sidebar', description: 'The gearvr-controls component interfaces with the Samsung/Oculus Gear VR controllers. It wraps the tracked-controls component while adding button mappings, events, and a Gear VR controller model that highlights the touched and/or pressed buttons (trackpad, trigger).' },
  { name: 'geometry', url: 'https://aframe.io/docs/1.0.0/components/geometry.html', description: 'The <code>geometry</code> component provides a basic shape for an entity. It\'s <code>primitive</code> property defines the general shape. Geometric "primitives", in computer graphics, are irreducible basic shapes. A <a href="https://aframe.io/docs/1.0.0/components/material.html" target="_blank">material</a> component is commonly defined to provide a appearance alongside the shape to create a complete mesh.' },
  { name: 'generic-tracked-controller-controls', url: 'https://aframe.io/docs/1.0.0/introduction/interactions-and-controllers.html#tracked-controls-component', description: 'The tracked-controls component is A-Frame’s base controller component that provides the foundation for all of A-Frame’s controller components.' },
  { name: 'gltf-model', url: 'https://aframe.io/docs/1.0.0/components/gltf-model.html#sidebar', description: 'It loads a 3D model and material using a <a href="https://www.khronos.org/gltf/" target="_blank">glTF</a> (.lgtf or .glb) file.' },
  { name: 'hand-controls', url: 'https://aframe.io/docs/1.0.0/components/hand-controls.html#sidebar', description: 'The hand-controls component provides tracked hands (using a prescribed model) with animated gestures. hand-controls wraps the vive-controls and oculus-touch-controls which in turn wrap the tracked-controls component. By specifying just hand-controls, we have something that works well with both Vive and Rift. The component gives extra events and handles hand animations and poses.' },
  // { name: 'height', url: null, description: null },
  { name: 'id', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id', description: 'The HTML <code>id</code> attribute is used to specify a unique id for an HTML element. In the context of an A-Frame they are often used to associate an entity with an asset. In regular HTML it\'s often used to apply CSS to an element.' },
  { name: 'laser-controls', url: 'https://aframe.io/docs/1.0.0/components/laser-controls.html#sidebar', description: 'The laser-controls component provides tracked controls with a laser or ray cursor shooting out to be used for input and interactions. DoF stands for degrees of freedom. Because they only require rotation and some form of input, laser-based interactions scale well across 0 DoF (gaze-based, Cardboard), 3 DoF (Daydream, GearVR with controllers), and 6 DoF (Vive, Oculus Touch). If desired, we can get a consistent form of interaction that works across all VR platforms with a single line of HTML.' },
  { name: 'light', url: 'https://aframe.io/docs/1.0.0/components/light.html#sidebar', description: 'The light component defines the entity as a source of light. Light affects all materials that have not specified a flat shading model with shader: flat. Note that lights are computationally expensive we should limit number of lights in a scene.' },
  { name: 'line', url: 'https://aframe.io/docs/1.0.0/components/line.html#sidebar', description: 'The line component draws a line given a start coordinate and end coordinate using THREE.Line.' },
  { name: 'link', url: 'https://aframe.io/docs/1.0.0/components/link.html#sidebar', description: 'The link component connects between experiences and allows for traversing between VR web pages. When activated via an event, the link component sends the user to a different page, just like a normal web page redirect. ' },
  { name: 'look-controls', url: 'https://aframe.io/docs/1.0.0/components/look-controls.html#sidebar', description: 'The look-controls component: Rotates the entity when we rotate a VR head-mounted display (HMD). Rotates the entity when we move the mouse. Rotates the entity when we touch-drag the touchscreen.' },
  { name: 'magicleap-controls', url: 'https://aframe.io/docs/1.0.0/components/windows-motion-controls.html#sidebar', description: 'The windows-motion-controls component interfaces with any spatial controllers exposed through Windows Mixed Reality as Spatial Input Sources (such as Motion Controllers). It wraps the tracked-controls component while adding button mappings, events, and a controller model that highlights applies position/rotation transforms to the pressed buttons (trigger, grip, menu, thumbstick, trackpad) and moved axes (thumbstick and trackpad.)' },
  { name: 'material', url: 'https://aframe.io/docs/1.0.0/components/material.html', description: 'The <code>material</code> component gives appearance to an entity. We can define properties such as color, opacity, or texture. This is often paired with the <a href="https://aframe.io/docs/1.0.0/components/geometry.html" target="blank">geometry component</a> which provides shape.' },
  { name: 'mixin', url: 'https://aframe.io/docs/1.0.0/core/mixins.html', description: 'It provides a way to compose and reuse commonly-used sets of component properties.' },
  { name: 'obj-model', url: 'https://aframe.io/docs/1.0.0/components/obj-model.html#sidebar', description: 'It loads a 3D model and material using a <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file" target="_blank">Wavefront</a> (.OBJ) file and a .MTL file.' },
  { name: 'oculus-go-controls', url: 'https://aframe.io/docs/1.0.0/components/oculus-go-controls.html#sidebar', description: 'The oculus-go-controls component interfaces with the Oculus Go controllers. It wraps the tracked-controls component while adding button mappings, events, and an Oculus Go controller model that highlights the touched and/or pressed buttons (trackpad, trigger).' },
  { name: 'oculus-touch-controls', url: 'https://aframe.io/docs/1.0.0/components/oculus-touch-controls.html#sidebar', description: 'The oculus-touch-controls component interfaces with the Oculus Touch controllers. It wraps the tracked-controls component while adding button mappings, events, and a Touch controller model.' },
  { name: 'position', url: 'https://aframe.io/docs/1.0.0/components/position.html', description: 'It places entities at certain spots in 3D space. Position takes coordinate "x y z" values as three numbers separated by spaces.' },
  { name: 'raycaster', url: 'https://aframe.io/docs/1.0.0/components/raycaster.html#sidebar', description: 'The raycaster component provides line-based intersection testing with a raycaster. Raycasting is the method of extending a line from an origin towards a direction, and checking whether that line intersects with other entites.' },
  { name: 'renderer', url: 'https://aframe.io/docs/1.0.0/components/renderer.html', description: 'It is used to configure the renderer settings (like <code>anialias</code> which when set to <code>true</code> smooths jagged edges on curved lines)' },
  { name: 'rotation', url: 'https://aframe.io/docs/1.0.0/components/rotation.html', description: 'It defines the orientation of an entity in degrees. It takes the pitch (x), yaw (y), and roll (z) as three numbers separated by spaces.' },
  { name: 'scale', url: 'https://aframe.io/docs/1.0.0/components/scale.html', description: 'It defines a shrinking, stretching, or skewing transformation of an entity. It takes three scaling factors for the "x y z" axes.' },
  { name: 'shadow', url: 'https://aframe.io/docs/1.0.0/components/shadow.html#sidebar', description: 'The shadow component enables shadows for an entity and its children. Receiving shadows from surrounding objects and casting shadows onto other objects may (and often should) be enabled independently.' },
  { name: 'sound', url: 'https://aframe.io/docs/1.0.0/components/sound.html#sidebar', description: 'The sound component defines the entity as a source of sound or audio. The sound component is positional and is thus affected by the components-position.' },
  { name: 'text', url: 'https://aframe.io/docs/1.0.0/components/text.html#sidebar', description: 'The text component renders signed distance field (SDF) font text.' },
  { name: 'tracked-controls', url: 'https://aframe.io/docs/1.0.0/introduction/interactions-and-controllers.html#tracked-controls-component', description: 'The tracked-controls component is A-Frame’s base controller component that provides the foundation for all of A-Frame’s controller components.' },
  { name: 'tracked-controls-webvr', url: 'https://aframe.io/docs/1.0.0/components/tracked-controls.html#sidebar', description: 'The tracked-controls component interfaces with tracked controllers. tracked-controls uses the Gamepad API to handle tracked controllers, and is abstracted by the hand-controls component as well as the vive-controls, oculus-touch-controls, windows-motion-controls, and daydream-controls components. This component elects the appropriate controller, applies pose to the entity, observes buttons state and emits appropriate events. For non-6DOF controllers such as daydream-controls, a primitive arm model is used to emulate positional data.' },
  { name: 'tracked-controls-webxr', url: 'https://aframe.io/docs/1.0.0/components/tracked-controls.html#sidebar', description: 'The tracked-controls component interfaces with tracked controllers. tracked-controls uses the Gamepad API to handle tracked controllers, and is abstracted by the hand-controls component as well as the vive-controls, oculus-touch-controls, windows-motion-controls, and daydream-controls components. This component elects the appropriate controller, applies pose to the entity, observes buttons state and emits appropriate events. For non-6DOF controllers such as daydream-controls, a primitive arm model is used to emulate positional data.' },
  { name: 'visible', url: 'https://aframe.io/docs/1.0.0/components/visible.html#sidebar', description: 'The visible component determines whether to render an entity. If set to false, then the entity will not be visible nor drawn.' },
  { name: 'vive-controls', url: 'https://aframe.io/docs/1.0.0/components/vive-controls.html#sidebar', description: 'The vive-controls component interfaces with the HTC Vive controllers/wands. It wraps the tracked-controls component while adding button mappings, events, and a Vive controller model that highlights the pressed buttons (trigger, grip, menu, system) and trackpad.' },
  { name: 'vive-focus-controls', url: 'https://aframe.io/docs/1.0.0/components/vive-focus-controls.html#sidebar', description: 'The vive-focus-controls component interfaces with the Vive Focus controller. It wraps the tracked-controls component while adding button mappings, events, and an Vive Focus controller model that highlights the touched and/or pressed buttons (trackpad, trigger).' },
  { name: 'wasd-controls', url: 'https://aframe.io/docs/1.0.0/components/wasd-controls.html#sidebar', description: 'The wasd-controls component controls an entity with the WASD or arrow keyboard keys. The wasd-controls component is commonly attached to an entity with the camera component.' },
  // { name: 'width', url: null, description: null },
  { name: 'windows-motion-controls', url: 'https://aframe.io/docs/1.0.0/components/windows-motion-controls.html#sidebar', description: 'The windows-motion-controls component interfaces with any spatial controllers exposed through Windows Mixed Reality as Spatial Input Sources (such as Motion Controllers). It wraps the tracked-controls component while adding button mappings, events, and a controller model that highlights applies position/rotation transforms to the pressed buttons (trigger, grip, menu, thumbstick, trackpad) and moved axes (thumbstick and trackpad.)' },
  { name: 'background', url: 'https://aframe.io/docs/1.0.0/components/background.html#sidebar', description: 'The background component sets a basic color background of a scene that is more performant than a-sky since geometry is not created. There are no undesired frustum culling issues when a-sky is further than the far plane of the camera. There are no unexpected occlusions either with far objects that might be behind of the sphere geometry of a-sky.' },
  { name: 'debug', url: 'https://aframe.io/docs/1.0.0/components/debug.html#sidebar', description: 'The debug component enables component-to-DOM serialization.' },
  { name: 'device-orientation-permission-ui', url: 'https://aframe.io/docs/1.0.0/components/device-orientation-permission-ui.html#sidebar', description: 'Starting with Safari on iOS 13 browsers require sites to be served over https and request user permission to access DeviceOrientation events. This component presents a permission dialog for the user to grant or deny access. ' },
  { name: 'embedded', url: 'https://aframe.io/docs/1.0.0/components/embedded.html#sidebar', description: 'The embedded component removes fullscreen CSS styles from A-Frame’s <canvas> element, making it easier to embed within the layout of an existing webpage. Embedding removes the default fixed positioning from the canvas and makes the Enter VR button smaller.' },
  { name: 'inspector', url: 'https://aframe.io/docs/1.0.0/introduction/visual-inspector-and-dev-tools.html#sidebar', description: 'The A-Frame Inspector is a visual tool for inspecting and tweaking scenes. With the Inspector,' },
  { name: 'fog', url: 'https://aframe.io/docs/1.0.0/components/fog.html#sidebar', description: 'The fog component obscures entities in fog given distance from the camera.' },
  { name: 'keyboard-shortcuts', url: 'https://aframe.io/docs/1.0.0/components/keyboard-shortcuts.html#sidebar', description: 'The keyboard-shortcuts component toggles global keyboard shortcuts.' },
  { name: 'pool', url: 'https://aframe.io/docs/1.0.0/components/pool.html#sidebar', description: 'The pool component allows for object pooling. This gives us a reusable pool of entities to avoid creating and destroying the same kind of entities in dynamic scenes. Object pooling helps reduce garbage collection pauses.' },
  { name: 'screenshot', url: 'https://aframe.io/docs/1.0.0/components/screenshot.html#sidebar', description: 'The screenshot component lets us take different types of screenshots with keyboard shortcuts.' },
  { name: 'stats', url: 'https://aframe.io/docs/1.0.0/components/stats.html#sidebar', description: 'The stats component displays a UI with performance-related metrics.' },
  { name: 'vr-mode-ui', url: 'https://aframe.io/docs/1.0.0/components/vr-mode-ui.html#sidebar', description: 'The vr-mode-ui component allows disabling of UI such as an Enter VR button, compatibility modal, and orientation modal for mobile. ' },
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
