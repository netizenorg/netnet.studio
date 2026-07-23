window.CONVOS['color-widget'] = (self) => {
  return [{
    id: 'intro',
    content: 'Every pixel on your screen mixes three colors of light: <b>red</b>, <b>green</b>, and <b>blue</b> (the primary colors of light, not pigment which would be red, yellow and blue). A <b>hex value</b> like <code>#ff6600</code> is just those three channels packed into one string. CSS also gives us <code>rgb()</code> and <code>hsl()</code> as more human-readable alternatives.',
    options: {
      'hex?': (e) => e.goTo('hex'),
      'rgb?': (e) => e.goTo('rgb'),
      'hsl?': (e) => e.goTo('hsl'),
      'i see': (e) => e.hide()
    }
  }, {
    id: 'hex',
    content: 'A hex color is three <b>bytes</b>, one per channel, which is literally how the computer stores color. Each byte is written as two base-16 digits: <code>00</code> is none and <code>ff</code> (or 255 in decimal) is full. So <code>#ff0000</code> is pure red, <code>#00ff00</code> is pure green, and <code>#ffffff</code> is white.',
    options: {
      'which should i use?': (e) => e.goTo('which'),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'rgb',
    content: 'The <code>rgb()</code> function lets you set each channel directly as a decimal value from <code>0</code> to <code>255</code>. So pure red would be <code>rgb(255, 0, 0)</code>, and if we add a little green like <code>rgb(255, 165, 0)</code> we\'d get orange. You can also add a fourth value for transparency with <code>rgba()</code>, so a transparent red would be <code>rgba(255, 0, 0, 0.5)</code>',
    options: {
      'which should i use?': (e) => e.goTo('which'),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'hsl',
    content: '<code>hsl()</code> describes a color by its <b>hue</b> (position on the color wheel, 0–360°), <b>saturation</b> (how vivid or washed out, 0–100%), and <b>lightness</b> (how bright or dark, 0–100%). It\'s often more intuitive than RGB because you can think more in terms of "color theory". Like RGB it also has an <code>hsla()</code> variant for transparency.',
    options: {
      'which should i use?': (e) => e.goTo('which'),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'which',
    content: 'Honestly, it\'s completely up to you, and a lot of it comes down to personal style. Some folks prefer <b>hex</b> because it\'s compact and you see it everywhere in design tools and documentation. Others prefer <b>HSL</b> because it maps more closely to how we actually think about color. RGB sits somewhere in between. All three work the same in the browser, so go with whatever feels most natural.',
    options: {
      'got it': (e) => e.hide()
    }
  }]
}
