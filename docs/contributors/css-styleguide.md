# CSS styleguide

As mentioned previously, styles are written using [BEM](https://getbem.com/introduction/) as a class-naming methodology. Declarations are loosely based on [Idiomatic CSS](https://github.com/necolas/idiomatic-css).

Don't worry if these concepts are unfamiliar! These aren't strict rules -- but having these systems as guidelines may make it easier to write or find CSS in the repository if you're a new or returning contributor.

## BEM

BEM stands for **Block**, **Element**, **Modifier**. It is a methodology of writing class names.

A **block** is something unique on the page that is independent and meaningful on its own. It can be used in one or more locations across the site. A block is an opportunity to straightforwardly name something with a descriptive class, and should be written in kebob case.

An example would be `.pill-btn` taken from `core/styles/buttons.css`. Pills, a rounded design for buttons, are used in multiple places across netnet.
```css
.pill-btn {
  position: relative;

  padding: 5px 15px;
  border: none;
  border-radius: 25px;
  margin-right: 0 5px 0 0;

  color: var(--bg-color);
  background: var(--fg-color);

  ...
}
```

An **element**, on the other hand, is entirely dependent on an established block. In other words, it denotes a part of a block that is inside of -- and only meaningful within -- its parent. In the context of cascading styles, **elements** don't inherit their parent block's styles; rather, they are are semantically tied to their parent blocks due to their specificity. They are written using two underscores to denote its element status: `[parent-block]__[child-element]`.

Good examples of **elements** can be found in `widgets/styles.css`.
```css
.widget {
  position: absolute;

  min-width: 200px;
  min-height: 150px;

  ...
}

.widget__top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  ...
}
```

While `.widget` is a block declaring general styles for widgets, `.widget__top` is an **element** that declares styles only for the top bar of a widget. It's not used anywhere on netnet besides on the inside of a widget.

Now, onto **modifiers**! Once a block or element is established, there may be variations of it for altered use across the site. This is where **modifiers** come in, distinguished by adding a `--[modifier]` flag to the class name. **Modifiers** can be used on a block or element class to change an aspect of its base behavior. They are additive, meaning one block or element can take many modifiers, if necessary. Modifier classes should declare only what it intends to change about its parent class.

An example would be `.pill-btn`'s `--secondary` state, which features alternative colors and slightly different sizing, used in various cases across netnet (to denote a different meaning or to maintain visibility).

```css
.pill-btn--secondary {
  display: inline-block;

  padding: 5px 10px;
  border: 1px solid var(--netizen-meta);

  color: var(--netizen-meta);
  background-color: var(--bg-color);

  ...
}
```

When writing HTML, modified classes should be used succeeding their base classes, offering various ways to mix and match core design elements with modified states. `[class] [class]--[modifier]`. Using the above example to create a secondary pill button would look like this in HTML:

```html
<button class="pill-btn pill-btn--secondary"></button>
```

## Idiomatic CSS

Right now, the only aspect of [Idiomatic CSS](https://github.com/necolas/idiomatic-css) we're adopting is a consistent declaration order format. We'll likely adopt more in the future.

We're writing declarations in [order of related properties](https://github.com/necolas/idiomatic-css?tab=readme-ov-file#declaration-order). Positioning -> Display -> Box Model ([from outside in](https://every-layout.dev/rudiments/boxes/#the-box-model)) -> Color -> Type -> Animation. These are loose rules to adopt going forward with the intention of fleshing out stricter rules as we go!

```css
.selector {
    /* Positioning */
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    /* Display */
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    visibility: visible;
    opacity: 1;

    /* Box Model */
    margin: 10px;
    outline: 1px solid #000;
    border: 10px solid #333;
    padding: 10px;

    /* Color */
    color: #fff;
    background: #000;

    /* Type */
    font-family: sans-serif;
    font-size: 16px;
    text-align: right;
    white-space: nowrap;

    /* Animation */
    transition: color .1s ease;
}
```
