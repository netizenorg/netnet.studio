/* global utils */
window.CONVOS['keyboard-shortcuts'] = (self) => {
  const hk = utils.hotKey()
  return [
    // .................. coding .................
    {
      id: 'hotkey-s',
      content: 'This shortcut pulls up your save and share options. If you\'re working on a "sketch" (a single HTML file) you can quickly save it as an HTML file to your computer or share it with a special URL. If you\'re working on a "project" (multiple files) this will save your changes.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-o',
      content: 'This shortcut lets you open a project or upload a sketch from your computer. You can load up any HTML file you\'ve saved before or open an existing project to keep working on it.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-enter',
      content: 'When you\'re working on a "sketch" (a single HTML file) I will render your code as soon as it changes, unless you disable the <b>auto-update</b> in the <img src="images/menu/code.png" class="keyboard-shortcuts__icon"> <b>Coding Menu > editor settings</b>. When auto-update is disabled you decide when you want to run and render your code using this shortcut key.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-c',
      content: `This is a shortcut key for "copying" the code you currently have selected to your clipboard. You can paste it elsewhere using the <code>${hk} + V</code> shortcut key. This shortcut key is found in most code editors.`,
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-v',
      content: `This is a shortcut key for "pasting" the code you currently have copied to your clipboard. You can copy code to your clipboard using the <code>${hk} + C</code> shortcut key. This shortcut key is found in most code editors.`,
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-fwd-slash',
      content: 'This shortcut toggles comments on whatever lines you have selected. If the lines are uncommented it will comment them out, and if they\'re already commented it will uncomment them. Super handy when you want to temporarily disable a chunk of code without deleting it!',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-d',
      content: `This is a really powerful one! First select a word or piece of text, then each time you press <code>${hk} + D</code> it will find and select the next matching instance, creating a new cursor each time. This lets you rename or edit multiple instances of something all at once.`,
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-f',
      content: 'This shortcut opens a search bar at the bottom of the code editor so you can find any text in your code. Type something to highlight all matches, then press <code>Enter</code> or use the <code>↑</code> and <code>↓</code> buttons to jump between them. Press <code>Esc</code> or <code>✕</code> to close it.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-left',
      content: 'This shortcut jumps your cursor to the very start of the current line. It\'s a quick way to navigate without reaching for the Home key or clicking with your mouse.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-right',
      content: 'This shortcut jumps your cursor to the very end of the current line. It\'s a quick way to navigate without reaching for the End key or clicking with your mouse.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-shift-left',
      content: `This works just like <code>${hk} + Left Arrow</code> (jump to start of line) but it also selects all the text between where your cursor was and the start of the line. Great for quickly selecting a chunk of code to copy, cut, or replace.`,
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-shift-right',
      content: `This works just like <code>${hk} + Right Arrow</code> (jump to end of line) but it also selects all the text between where your cursor was and the end of the line. Great for quickly selecting a chunk of code to copy, cut, or replace.`,
      options: { thanks: (e) => e.hide() }
    },
    // .................. tutorial .................
    {
      id: 'spacebar',
      content: 'When you have a tutorial open you can press the spacebar to play or pause it. This only works when the code editor isn\'t focused, so click on the video first if you want to use these shortcut keys.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'right',
      content: 'When you have a tutorial open, pressing the right arrow key will skip ahead 5 seconds.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'left',
      content: 'When you have a tutorial open, pressing the left arrow key will jump back 5 seconds.',
      options: { thanks: (e) => e.hide() }
    },
    // .................. netnet .................
    {
      id: 'hotkey-period',
      content: 'This shortcut switches netnet to the next layout. Layouts change how the code editor and output preview are arranged on screen. You can also change the layout in the <img src="images/menu/code.png" class="keyboard-shortcuts__icon"> <b>Coding Menu > editor settings</b>',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-comma',
      content: `This shortcut switches netnet to the previous layout. It's the reverse of <code>${hk} + ></code>, so you can cycle back through the layout options if you went past the one you wanted.`,
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-l',
      content: 'This shortcut opens the <img src="images/menu/tutorials.png" class="keyboard-shortcuts__icon"> <b>Learning Guide</b>, where you\'ll find all the educational resources like guides, tutorials, demos, templates and docs. You can also open it by clicking on my face!',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-semi',
      content: 'This shortcut opens the <img src="images/menu/code.png" class="keyboard-shortcuts__icon"> <b>Coding Menu</b>, where you\'ll find all your project tools like saving, opening files, editor settings, and more.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-quote',
      content: 'This shortcut opens the <img src="images/menu/search.png" class="keyboard-shortcuts__icon"> universal search bar. From there you can search for widgets, tutorials, demos, and pretty much anything else in the studio.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'esc',
      content: 'The escape key closes whatever is on top. If you have the search bar open it\'ll close that first, otherwise it\'ll close the top-most widget. Think of it as a quick "nevermind" button.',
      options: { thanks: (e) => e.hide() }
    },
    {
      id: 'hotkey-shift-k',
      content: 'This shortcut puts netnet into kiosk mode (fullscreen). It\'s great for live-coding or when you want to focus without any browser distractions. Press <code>Esc</code> to exit fullscreen.',
      options: { thanks: (e) => e.hide() }
    }
  ]
}
