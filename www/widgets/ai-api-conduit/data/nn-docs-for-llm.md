# nn.js (netnet standard library) — COMPLETE API Reference

IMPORTANT: This document lists every available method. If a method is not listed here, it does not exist in nn.js. Do not invent or assume additional methods.

The `nn` object is a global utility library available via `<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>`.

Chaining: Element methods listed in this document can be chained because they return the element itself. The chain ONLY supports the methods listed in this document — no others. You cannot add timing, delays, or async behavior to a chain. There is no `.then()`, `.delay()`, `.wait()`, or similar — none of these exist.

To do something with an element after a delay, you MUST break out of the chain by storing the element in a variable, then use separate statements:

```js
// CORRECT — break the chain into a variable, then use nn.sleep()
const el = nn.create('div').css({color:'red'}).addTo('body')
await nn.sleep(1000)
el.remove()
```

Never append anything to the end of a chain that is not listed in this document. If you need to do something later (remove it, change it, animate it), store the chain result in a variable first.

## Global Properties

- `nn.width` / `nn.height` - Window dimensions
- `nn.mouseX` / `nn.mouseY` - Mouse position
- `nn.mouseDown` - Boolean, is mouse pressed

## Global Events

- `nn.on(event, callback)` - window.addEventListener alias
- `nn.off(event, callback)` - window.removeEventListener alias

## DOM

### nn.create(tagName) / nn.get(selector) / nn.getAll(selector)

`nn.create()` creates and returns an augmented element. `nn.get()` queries and augments a single element. `nn.getAll()` returns an array of augmented elements. These are standard DOM elements with all the usual DOM properties and methods (e.g. `.remove()`, `.classList`, `.style`, etc.) plus the additional nn.js methods listed below.

### Augmented Element Methods

**Content & Attributes:**
- `.content(html)` - Set innerHTML
- `.set(key, value)` or `.set({key: value})` - Set attributes
- `.get(selector)` - Scoped querySelector within element
- `.getAll(selector)` - Scoped querySelectorAll

**Events:**
- `.on(event, callback)` - Add event listener
- `.off(event, callback)` - Remove event listener

**Styling:**
- `.css(prop, value)` or `.css({prop: value})` - Set inline styles (numbers auto-convert to px)

**Positioning:**
- `.position(x, y, type, origin)` - Position element (type: absolute/relative/fixed/sticky, default: absolute)
- `.positionOrigin(origin)` - Set the transform origin for positioning (e.g. 'center')
- `.addTo(parent)` - Append to parent (selector string or element)

**Box (read-only getters):** `.x`, `.y`, `.width`, `.height`, `.top`, `.left`, `.bottom`, `.right`

**CSS Filters (chainable):**
`.blur(px)`, `.brightness(v)`, `.contrast(v)`, `.dropShadow(x,y,blur,color)`, `.grayscale(v)`, `.hueRotate(deg)`, `.invert(v)`, `.opacity(v)`, `.sepia(v)`, `.saturate(v)`

**CSS Transforms (chainable):**
`.scale(x, y)`, `.rotate(deg)`, `.skew(xDeg, yDeg)`

**Data Attributes:**
- `.data` - Proxy for `data-*` attributes with automatic type parsing (strings, numbers, booleans, objects)
- `.data.toJSON()` - Snapshot of all data attributes

## Canvas

Elements created with `nn.create('canvas')` get extra methods:

**Properties:** `.ctx` (2D context), `.mouseX`, `.mouseY`, `.mouseDown` (canvas-relative)

**Sizing:** `.resize(w, h)`, `.fitToParent(dpr)`

**Drawing (auto fill+stroke):**
`.circle(x, y, r)`, `.ellipse(x, y, rx, ry)`, `.rect(x, y, w, h)`, `.line(x1, y1, x2, y2)`, `.triangle(x1, y1, x2, y2, x3, y3)`

**Style properties:** `.fillColor`, `.strokeColor`, `.lineWidth`, `.lineCap`, `.lineJoin`, `.font`, `.textAlign`, `.textBaseline`, `.blendMode`, `.globalAlpha`

**Context passthroughs (chainable):**
`.beginPath()`, `.closePath()`, `.fill()`, `.stroke()`, `.clip()`, `.moveTo()`, `.lineTo()`, `.arc()`, `.arcTo()`, `.bezierCurveTo()`, `.quadraticCurveTo()`, `.fillRect()`, `.strokeRect()`, `.clearRect()`, `.drawImage()`, `.text(str, x, y, type)`, `.fillText()`, `.strokeText()`, `.save()`, `.restore()`, `.scale()`, `.rotate()`, `.translate()`, `.transform()`, `.setTransform()`

**Pixels:** `.getPixels()` returns `[{r,g,b,a}]`, `.setPixels(pixels)`, `.getPixelData()`, `.clear()`

## Math & Geometry

- `nn.random()` - Polymorphic random function:
  - No args: random float 0–1
  - One number arg: random float 0–max
  - Two number args: random float min–max
  - **Array arg: returns a random item from the array** — e.g. `nn.random(['cat.png','dog.png','bird.png'])` returns one random item. Use this instead of `Math.floor(Math.random() * arr.length)`.
  - String arg: returns a random character from the string
- `nn.randomInt(min, max)` / `nn.randomFloat(min, max)`
- `nn.shuffle(array)` - Returns shuffled copy
- `nn.norm(val, min, max)` - Normalize to 0-1
- `nn.clamp(val, min, max)` - Constrain value
- `nn.lerp(a, b, t)` - Linear interpolation
- `nn.map(val, inMin, inMax, outMin, outMax)` - Re-map range
- `nn.dist(x1, y1, x2, y2)` - Distance between points
- `nn.angleBtw(x1, y1, x2, y2)` - Angle in radians
- `nn.radToDeg(r)` / `nn.degToRad(d)`
- `nn.cartesianToPolar(x, y)` → `{distance, radians, degrees}`
- `nn.polarToCartesian(dist, angle)` → `{x, y}`
- `nn.perlin()` - Returns PerlinNoise object (`.seed(n)`, `.get(x)` or `.get(x,y)`)
- `nn.ease(type, t)` - Easing functions. Types: InQuad, OutQuad, InOutQuad, InCubic, OutCubic, InOutCubic, InQuart, OutQuart, InOutQuart, InQuint, OutQuint, InOutQuint, InSine, OutSine, InOutSine, InCirc, OutCirc, InOutCirc, InElastic, OutElastic, InOutElastic, InExpo, OutExpo, InOutExpo, InBack, OutBack, InOutBack, InBounce, OutBounce

## Array & Loop Helpers

- `nn.times(n, fn)` - Call fn n times, return results array. Example: `nn.times(5, i => i * 2)`
- `nn.range(end)` / `nn.range(start, end, step, mapFn)` - Generate number array
- `nn.sleep(ms)` - Promise-based delay. Use with `await nn.sleep(1000)` instead of `setTimeout`. Requires the containing function to be `async`.

## Colors

- `nn.randomColor(type, alpha)` - Random color. Types: 'hex', 'rgb', 'rgba', 'hsl', 'hsla'
- `nn.rgb(r, g, b, a)` / `nn.hsl(h, s, l, a)` - Build color strings
- `nn.isLight(color)` - Boolean
- `nn.colorContrast(a, b)` - WCAG contrast ratio
- `nn.colorScheme({harmony, base, ...})` - Generate color schemes. Harmonies: complementary, analogous, triadic, split-complementary, tetradic, monochromatic
- `nn.toRGB(val)` → `{r,g,b}`, `nn.toHSL(val)` → `{h,s,l}`

**Conversions:** `nn.hex2rgb()`, `nn.rgb2hex()`, `nn.hex2hsl()`, `nn.hsl2hex()`, `nn.hex2hsv()`, `nn.hsv2hex()`, `nn.rgb2hsl()`, `nn.hsl2rgb()`, `nn.rgb2hsv()`, `nn.hsv2rgb()`, `nn.hsl2hsv()`, `nn.hsv2hsl()`

## Music

- `nn.notes` - `['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']`
- `nn.modes` - Object of mode interval patterns (major, minor, dorian, mixolydian, etc.)
- `nn.chords` - Object of chord scale degrees (triad, seventh, ninth, etc.)
- `nn.noteToMidi(note)` / `nn.midiToNote(midi)`
- `nn.noteToFrequency(note)` / `nn.frequencyToNote(hz)`
- `nn.midiToFrequency(midi)` / `nn.frequencyToMidi(hz)`
- `nn.createScale(root, mode)` - e.g. `nn.createScale('C4', 'major')` → `['C4','D4','E4',...]`
- `nn.createChord(scale, type)` - e.g. `nn.createChord(scale, 'triad')`
- `nn.rotateScale(scale, index)` / `nn.transposeScale(scale, semitones)`
- `nn.voiceChord(notes, octave)` / `nn.stripOctave(notes)`

## Data

- `nn.loadData(path)` - Promise, loads .json/.csv/.txt
- `nn.fetch(url, opts)` - CORS-proxy wrapped fetch
- `nn.parseCSV(str)` / `nn.parseJSON(str)` / `nn.parseData(str)`
- `nn.stringifyCSV(arr)` / `nn.stringifyJSON(obj)` / `nn.stringifyData(data)`

## Media & Device

- `nn.loadImage(url)` - Promise resolving to image element
- `nn.modifyPixels(dataUrl, fn)` - Pixel manipulation
- `nn.askFor(constraints)` / `nn.askForStream(constraints)` - getUserMedia
- `nn.askForGPS(cb)` → `{lat, lng, timestamp}`
- `nn.MIDI(cb)` - MIDI input. Callback: `{dev, chl, val}`
- `nn.isMobile()`, `nn.hasWebGL()`, `nn.hasTouch()`, `nn.browserInfo()`, `nn.platformInfo()`, `nn.screen()`, `nn.gpuInfo()`, `nn.orientation()`, `nn.audioSupport()`, `nn.videoSupport()`

## CSS Data Binding

- `nn.bindCSS()` - Activate data-bind attributes
  - `data-bind-var="--name"` - Input binds to CSS variable
  - `data-bind-click="--name: add(10px)"` - Click modifies CSS variable (ops: add, sub, toggle, cycle)

## FileUploader

```js
new nn.FileUploader({
  click: '#btn',        // click target selector
  drop: '#zone',        // drag-drop zone selector
  types: ['image/png'], // MIME filter
  maxSize: 1000,        // KB limit
  ready: (file) => {},  // {name, type, data}
  error: (err) => {}
})
```

## Common Patterns

```js
// Chaining
nn.create('div').content('hello').css({color:'red'}).addTo('body')

// Canvas animation
const c = nn.create('canvas').addTo('body').fitToParent()
c.fillColor = 'hotpink'
function draw () {
  requestAnimationFrame(draw)
  if (c.mouseDown) c.circle(c.mouseX, c.mouseY, 30)
}
nn.on('load', draw)

// Data attributes with type preservation
const el = nn.create('div').addTo('body')
el.data.count = 3           // sets data-count="3"
console.log(el.data.count)  // reads as number 3
```
