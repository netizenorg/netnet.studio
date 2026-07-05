# netnet's face

netnet's face `( ◕ ◞ ◕ )` is the central interactive element of the UI: clicking it opens the radial menu, its eyes track the cursor, and its expression changes to reflect what netnet is doing (thinking, happy, upset, etc.). The face is composed of three Unicode characters rendered as SVGs: a left eye, a mouth, and a right eye.

## Updating the face

The primary API is `NNW.menu.updateFace(obj)`. All keys are optional, omitting one leaves that part of the face unchanged.

```js
NNW.menu.updateFace({
  leftEye: '◕',
  mouth: '◞',
  rightEye: '◕',
  lookAtCursor: true,
  animation: 'blink'
})
```

| Key | Type | Description |
|-----|------|-------------|
| `leftEye` | string | Unicode character for the left eye |
| `mouth` | string | Unicode character for the mouth |
| `rightEye` | string | Unicode character for the right eye |
| `lookAtCursor` | boolean | Whether the eyes rotate to follow the mouse (default `true`) |
| `animation` | string | Name of an animation to run (see below) |

You can set just the animation without changing the face characters:

```js
NNW.menu.updateFace({ animation: 'bounce' })
```

This will animate whatever expression is currently showing.

## Available face characters

Each character maps to an SVG file in `www/images/faces/`. Only these characters are valid, anything else will render as blank. While these are grouped here by "Eyes" and "Mouths" for clarity, any character can actually be used for either. For example the `◠` character is used both as a sad mouth frown, but also as a happy closed eye.

**Eyes**

| Char | Description |
|------|-------------|
| `◕` | Default eye, filled circle, right half dark |
| `◉` | Concentric circles, "processing" eye |
| `☉` | Tiny pupil eye |
| `◑` | Half-filled circle |
| `ŏ` | Wide-open surprised eye |
| `ᴖ` | Closed/happy eye |
| `-` | Blink eye (closed line) |
| `⇀` | Arrow right, upset left-eye |
| `↼` | Arrow left, upset right-eye |

**Mouths**

| Char | Description |
|------|-------------|
| `◞` | Default, slight downward curve |
| `◡` | Happy smile |
| `◠` | Sad frown |
| `‿` | Gentle smile |
| `‸` | Caret / inverted V |
| `⌄` | Downward chevron |
| `_` | Flat line |
| `^` | Caret up |
| `ᗜ` | Wide smile |
| `ᴗ` | Tight smile |
| `.` | Dot (mouth-dot.svg) |
| `o` | Ooo mouth |
| `ー` | Long flat mouth |
| `︵` | Wide frown |
| `﹏` | Wavy |
| `✖` | X, menu-open face |

## Common faces

Rather than composing faces from scratch every time, `NNW.menu.switchFace(type)` covers the most-used expressions:

```js
NNW.menu.switchFace('happy')
```

| Name | Expression | Animation |
|------|-----------|-----------|
| `default` | `◕ ◞ ◕` | `blink` |
| `processing` | `◉ ⌄ ☉` | `processing` |
| `conduit` | `◉ ﹏ ☉` | `processing` |
| `happy` | `ᴖ ◡ ᴖ` | `big-nod` |
| `surprise` | `ŏ . ŏ` | `spring-up` |
| `upset` | `⇀ ^ ↼` | `shake` |
| `menu` | `◕ ✖ ◕` | none |
| `error` | `ŏ ︵ ŏ` | none |

## Animations

Every call to `updateFace` with an `animation` key cancels any currently-running animation before starting the new one, so you never need to clean up manually.

There are two kinds of animation:

### JS animations (looping)

These run as `setTimeout` loops inside `_runFaceAnimation()`. They update the face characters directly over time.

**`blink`**: The default idle animation. Closes both eyes to `-` for 150ms, then reopens them. Repeats randomly every 8–14 seconds. Automatically turns off `lookAtCursor` while the eyes are closed.

**`processing`**: Alternates the eyes between `◉` and `☉` every 500ms. Used when netnet is waiting on something (loading a GitHub repo, running an AI request, etc.).

### CSS animations (one-shot)

These set a CSS `animation` string on the `#face` element directly. They play once (or loop if defined that way) and are defined as `@keyframes` in [www/core/styles/utils.css](https://github.com/netizenorg/netnet.studio/blob/main/www/core/styles/utils.css).

| Name | Motion | Duration | Notes |
|------|--------|----------|-------|
| `bounce` | Up 8px and back | 1s | Quick hop |
| `big-nod` | Up 8px, hold, return | 0.7s | Emphatic nod |
| `spring-up` | Up 8px and stays | 0.7s | `forwards` fill, face stays raised |
| `duck-down` | Down 8px and stays | 0.82s | `forwards` fill, face stays lowered |
| `shake` | Horizontal rattle | 0.82s | Agitated, upset |
| `possessed` | Scale pulse 1→0.85→1 | 4s | used when netnet is returning LLM generated text |

## Accessibility

All JS animations check `WIDGETS['student-session']?.getData('nomotion')` before running. If the user has enabled the reduce-motion preference in their session settings, `blink` and `processing` stop themselves rather than looping. CSS animations are not started at all when `nomotion` is `true`.

## Adding a new animation

**CSS animation**: Add a `@keyframes` rule to `www/core/styles/utils.css`, then add a new `else if` branch in `_runFaceAnimation()` in [www/core/NetNetFaceMenu.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/NetNetFaceMenu.js):

```js
} else if (this.face.animation === 'my-animation') {
  NNW.menu.ele.querySelector('#face').style.animation = 'my-animation 0.5s ease-out 0s 1'
}
```

**JS animation**: Add a new `else if` branch that uses `setTimeout` and calls `this.updateFace()` recursively. Respect the `nomotion` flag:

```js
} else if (this.face.animation === 'nervous') {
  this._faceAnimTO = setTimeout(() => {
    const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
    if (nomotion) return
    const isShifted = this.face.leftEye === '⇀'
    this.updateFace({
      leftEye: isShifted ? '◕' : '⇀',
      rightEye: isShifted ? '◕' : '↼'
    })
    this._runFaceAnimation()
  }, 200)
}
```

To use your new animation from anywhere in the codebase:

```js
NNW.menu.updateFace({ animation: 'nervous' })
// or pair it with a face change:
NNW.menu.updateFace({ leftEye: '⇀', mouth: '^', rightEye: '↼', animation: 'nervous' })
```
