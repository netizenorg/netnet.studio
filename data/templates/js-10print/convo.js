/* global WIDGETS */
window.CONVOS['template-js-10print'] = (self) => {
  let tenPrintGif = WIDGETS['js-template-10print-gif']
  if (!tenPrintGif) {
    tenPrintGif = WIDGETS.create({
      key: 'js-template-10print-gif',
      title: '10PRINT',
      innerHTML: `
        <div style="">
          <img src="/templates/js-10print/files/images/10print.gif" alt="animated gif of the 10print algorithm running on a Commodore 64"><br>
          <p>The <a href="https://youtu.be/m9joBLOZVEo?si=2X2otCX1UHgK707Q" target="_blank">10PRINT</a> algorithm running on a Commodore 64</p>
        </div>`
    })
  }

  return [
    {
      id: 'intro-10print',
      after: () => {
        tenPrintGif.open()
      },
      content: 'Here\'s a short gif of the classic 10PRINT algorithm running on a Commodore 64 from the 1980s. It\'s a landmark of generative art (there\'s a whole <a href="https://10print.org/" target="_blank">book</a> about it) and a perfect way to learn programming fundamentals and common techniques in generative art.',
      options: {
        'go on': (e) => e.goTo('two-symbols')
      }
    },
    {
      id: 'two-symbols',
      after: () => {
        tenPrintGif.close()
      },
      content: 'The maze-like pattern comes from randomly alternating just two diagonal symbols. We\'ll start by using the <code>body</code> element and typing a bunch of diagonals to demonstrate the idea.',
      options: {
        'go on': (e) => e.goTo('not-keyboard-slashes'),
        'go back': (e) => e.goTo('intro-10print')
      }
    },
    {
      id: 'not-keyboard-slashes',
      content: 'These aren\'t the regular forward and back slashes on your keyboard. Standard slashes look narrow in a proportional font, but 10PRINT uses characters that fill the full character cell width. If we had used the slashes on your keyboard it would look a little different, like this.',
      options: {
        'go on': (e) => e.goTo('unicode'),
        'go back': (e) => e.goTo('two-symbols')
      }
    },
    {
      id: 'unicode',
      content: 'These full-width diagonals are special characters you won\'t find on a typical keyboard. They come from the <a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">Unicode Standard</a>, which defines thousands of symbols beyond basic letters and numbers.',
      options: {
        'go on': (e) => e.goTo('add-styles'),
        'go back': (e) => e.goTo('not-keyboard-slashes')
      }
    },
    {
      id: 'add-styles',
      content: 'To get closer to the Commodore 64 look, we\'ll include a <code>link</code> element to import a CSS stylesheet. The CSS will set colors and pick a font so our pattern feels more like the original.',
      options: {
        'go on': (e) => e.goTo('need-js'),
        'go back': (e) => e.goTo('unicode')
      }
    },
    {
      id: 'need-js',
      content: 'It already looks 10PRINT-<i>ish</i>, but it\'s still static. Typing out our diagonals directly in the HTML means they will render the same way every time. We want a randomized pattern each time we load and also regenerates when we click, which is why we need JavaScript.',
      options: {
        'go on': (e) => e.goTo('inline-js'),
        'go back': (e) => e.goTo('add-styles')
      }
    },
    {
      id: 'inline-js',
      before: () => tenPrintGif.close(),
      content: 'One way to add JavaScript is inline with HTML, similar to how the <code>style</code> attribute adds CSS. For example, the <code>onclick</code> attribute can run JavaScript when an element is clicked (try clicking the rendered maze).',
      options: {
        'go on': (e) => e.goTo('external-js'),
        'go back': (e) => e.goTo('need-js')
      }
    },
    {
      id: 'external-js',
      content: 'Like CSS, JavaScript can also live in a separate file. We include it with a <code>script</code> element by setting its <code>src</code> attribute to the path of the file we want to load.',
      options: {
        'go on': (e) => e.goTo('inline-script'),
        'go back': (e) => e.goTo('inline-js')
      }
    },
    {
      id: 'inline-script',
      content: 'In this template we\'ll write JavaScript directly in the HTML file, between opening and closing <code>script</code> tags. This is similar to how we can embed CSS between <code>style</code> tags.',
      options: {
        'go on': (e) => e.goTo('recipe-vars'),
        'go back': (e) => e.goTo('external-js')
      }
    },
    {
      id: 'recipe-vars',
      content: 'Writing a program is a lot like writing a recipe: define ingredients, then describe steps. Our ingredients are data stored in variables, most commonly numbers, booleans, and strings.',
      options: {
        'go on': (e) => e.goTo('numbers'),
        'go back': (e) => e.goTo('inline-script')
      }
    },
    {
      id: 'numbers',
      before: () => tenPrintGif.close(),
      content: '<b>Numbers</b> can be integers (whole numbers) or floats (decimals). For example, we might store <code>9000</code> in a variable named <code>a</code> and <code>3.14</code> in a variable named <code>b</code>.',
      options: {
        'go on': (e) => e.goTo('arithmetic'),
        'go back': (e) => e.goTo('recipe-vars')
      }
    },
    {
      id: 'arithmetic',
      content: 'We can build <b>expressions</b> with arithmetic operators: <code>+</code> (add), <code>-</code> (subtract), <code>*</code> (multiply), <code>/</code> (divide). If we compute <code>10 + a / 3</code>, what number do you expect will bes stored in <code>c</code>?',
      options: {
        'go on': (e) => e.goTo('c-value'),
        'go back': (e) => e.goTo('numbers')
      }
    },
    {
      id: 'c-value',
      content: '<code>c</code> equals <code>3010</code>. Multiplication and division happen before addition and subtraction, so <code>a / 3</code> becomes <code>3000</code>, then <code>+ 10</code> brings it to <code>3010</code>.',
      options: {
        'go on': (e) => e.goTo('const-vs-let'),
        'go back': (e) => e.goTo('arithmetic')
      }
    },
    {
      id: 'const-vs-let',
      content: 'Variables created with <code>const</code> can not be reassigned, while <code>let</code> variables can change later. Use <code>const</code> by default, and switch to <code>let</code> when you know the value should vary.',
      options: {
        'go on': (e) => e.goTo('reassignment'),
        'go back': (e) => e.goTo('c-value'),
        'what about "var"?': (e) => e.goTo('old-var')
      }
    },
    {
      id: 'old-var',
      content: 'Before <code>let</code> and <code>const</code> were added to JavaScript, the only way to create variables was with the <code>var</code> keyword. You might still see it used in older code or tutorials, but it behaves differently in ways that can cause confusing bugs. For this reason, modern JavaScript best practice is to avoid using <code>var</code> entirely and stick with <code>let</code> and <code>const</code> for predictable, safer code.',
      options: {
        ok: (e) => e.goTo('reassignment'),
        'what type of bugs?': (e) => e.goTo('var-bugs')
      }
    },
    {
      id: 'var-bugs',
      content: 'Soon we\'ll be writing code in "blocks", which means between <code>{</code> curly braces <code>}</code>. Typically variables created in a code block only exist in that code block, however variables declared with <code>var</code> ignores this block <i>scope</i> and can be accessed outside of the curly braces it was defined in. That might not seem like a big deal now, but rest assured it was the source of lots of coder\'s frustration for years.',
      options: {
        'I see': (e) => e.goTo('reassignment')
      }
    },
    {
      id: 'reassignment',
      content: 'If <code>x</code> is declared with <code>let</code>, you can set it to <code>100</code> and then assign a new value on the next line. You only write the keyword once when first <i>delcaring</i> the variable, later lines can just reassign it since it already exists.',
      options: {
        'go on': (e) => e.goTo('booleans'),
        'go back': (e) => e.goTo('const-vs-let')
      }
    },
    {
      id: 'booleans',
      before: () => tenPrintGif.close(),
      content: 'Now lets talk about <b>booleans</b>, these represent truth values: <code>true</code> or <code>false</code>. Notice how I named this one <i>loggedIn</i>. Variable names are often short but they don\'t have to be a single letter. Sometimes it\'s helpful to give them more descriptive names.',
      options: {
        'go on': (e) => e.goTo('naming'),
        'go back': (e) => e.goTo('reassignment')
      }
    },
    {
      id: 'naming',
      content: 'Variable names can\'t include spaces though, nor can they include dashes (that\'s reserved for subtraction), so if you have a name with more than one word in it, there\'s a convention programmers use, where every word (besides the first one) has it\'s first letter capitalized, this is called "Camel Casing" because the capital letter looks like the hump on  camel\'s back.',
      options: {
        'go on': (e) => e.goTo('boolean-expr'),
        'go back': (e) => e.goTo('booleans')
      }
    },
    {
      id: 'boolean-expr',
      content: 'We create boolean expressions with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#comparison_operators" target="_blank">comparison operators</a> such as <code>&gt;</code> (greater than), <code>&lt;=</code> (greater than or equal to), and <code>===</code> (exactly equal to). These expressions evaluate to <code>true</code> or <code>false</code>.',
      options: {
        'go on': (e) => e.goTo('strings'),
        'go back': (e) => e.goTo('naming')
      }
    },
    {
      id: 'strings',
      before: () => tenPrintGif.close(),
      content: 'The third basic data type are <b>strings</b>, this is how we store text characters. That can be as short as a single letter or as long as an entire novel. To create a string we need to surround the text in matching quotes.',
      options: {
        'go on': (e) => e.goTo('string-quotes'),
        'go back': (e) => e.goTo('boolean-expr')
      }
    },
    {
      id: 'string-quotes',
      content: 'You can use single quotes <code>\'</code>, double quotes <code>"</code>, or backticks <code>`</code> for strings. Backticks create <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals" target="_blank">template literals</a>, which are special strings, we\'ll revisit those a little later.',
      options: {
        'go on': (e) => e.goTo('string-plus'),
        'go back': (e) => e.goTo('strings')
      }
    },
    {
      id: 'string-plus',
      content: 'We can write expressions with strings, when we use the <code>+</code> operator it doesn\'t do addition, instead it\'s used to combine or "concatenate" the strings. For example, <code>\'hello there \' + user</code> becomes <i>"hello there Nick"</i>.',
      options: {
        'go on': (e) => e.goTo('number-plus-string'),
        'go back': (e) => e.goTo('string-quotes')
      }
    },
    {
      id: 'number-plus-string',
      content: 'If you add a number to a string, JavaScript still concatenates. The value of the variable <code>message</code> here would be the string <i>"My favorite number is 100"</i>.',
      options: {
        'go on': (e) => e.goTo('basics-recap'),
        'go back': (e) => e.goTo('string-plus')
      }
    },
    {
      id: 'basics-recap',
      content: 'Now that we\'ve covered creating variables and writing expressions that evaluate to the three basic data types: numbers, booleans and strings, lets do something with these <i>ingredients</i>',
      options: {
        'go on': (e) => e.goTo('functions-intro'),
        'go back': (e) => e.goTo('number-plus-string')
      }
    },
    {
      id: 'functions-intro',
      content: 'One of the most common things we do with variables is pass them into functions like the <code>alert</code> function which we use to create pop-up messages in the browser. Functions are also variables, but rather than storing data, like a number or a string, they store <i>instructions</i>. When we type the name of a function followed by parenthesis <code>()</code> the instructions stored inside them are <i>invoked</i> meaning they run.',
      options: {
        'go on': (e) => e.goTo('calling-functions'),
        'go back': (e) => e.goTo('basics-recap')
      }
    },
    {
      id: 'calling-functions',
      before: () => tenPrintGif.close(),
      content: 'Running a function is also called a <i>function call</i>. When we <i>call</i> a function we can somtimes pass data into them by writing it between the parenthesis, these are called <b>arguments</b>. Here I\'ve passed our variable <code>message</code> into the <b>alert</b> function as an argument.',
      options: {
        'go on': (e) => e.goTo('pass-args'),
        'go back': (e) => e.goTo('functions-intro')
      }
    },
    {
      id: 'pass-args',
      before: () => tenPrintGif.close(),
      content: 'We often pass variables as arguments, but we could also pass data directly, for example: <code>alert(\'Hi!\')</code>. Whether you store a value in a variable first or pass it directly depends on clarity and whether you need to reuse that variable or not.',
      options: {
        'go on': (e) => e.goTo('objects-intro'),
        'go back': (e) => e.goTo('calling-functions')
      }
    },
    {
      id: 'objects-intro',
      before: () => tenPrintGif.close(),
      content: 'Some variables group many values and functions together, these are called <b>objects</b>. Think of an object like a multi-tool we can pull all sorts of data and other functions out of.',
      options: {
        'go on': (e) => e.goTo('math-object'),
        'go back': (e) => e.goTo('pass-args')
      }
    },
    {
      id: 'math-object',
      content: 'For example there\'s a built-in object in JavaScript called <code>Math</code>, which contains other variables in it like <code>Math.PI</code>, to access these internal variables we use the <code>.</code> syntax.',
      options: {
        'go on': (e) => e.goTo('math-pi'),
        'go back': (e) => e.goTo('objects-intro')
      }
    },
    {
      id: 'math-pi',
      content: 'When there\'s a variable inside an object like this we refer to it as a "property", the Math object\'s PI property contains the value <i>3.141592653589793</i> so that\'s the data we\'ve now stored in our new <code>x</code> variable.',
      options: {
        'go on': (e) => e.goTo('math-round'),
        'go back': (e) => e.goTo('math-object')
      }
    },
    {
      id: 'math-round',
      content: 'Objects can also have internal functions, which we refer to as "methods." The Math object has all sorts of calculator type methods built-in like <code>Math.round()</code> which takes a decimal value as it\'s argument and returns the rounded value. So the value of <code>x</code> is now simply <code>3</code>, because it\'s been rounded down.',
      options: {
        'go on': (e) => e.goTo('web-apis'),
        'go back': (e) => e.goTo('math-pi')
      }
    },
    {
      id: 'web-apis',
      content: 'The context we\'re coding in now, an HTML page inside a web browser, isn\'t the only place you find JavaScript, though it\'s arguably the most common. When we write JavaScript in the browser we get access to different Web APIs or "application programming interfaces", which means exactly that: an <i>interface</i> for us <i>programmers</i> to use when creating our <i>applications</i>.',
      options: {
        'go on': (e) => e.goTo('dom-api'),
        'go back': (e) => e.goTo('math-round')
      }
    },
    {
      id: 'dom-api',
      content: 'These <i>interfaces</i> are usually objects stored in pre-defined variables, like this one <code>document</code>. This is part of the Web\'s <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" target="_blank">DOM API</a>, which stands for "document object model", this means our document (the web page) and all the HTML elements and CSS code in it has been transformed into a JavaScript object for us to use to modify our page programatically.',
      options: {
        'go on': (e) => e.goTo('document-body'),
        'go back': (e) => e.goTo('web-apis')
      }
    },
    {
      id: 'document-body',
      content: '<code>document.body</code> gives you the page\'s <code>body</code> element as an object. It has properties you can read and set, like <code>innerText</code> for the text inside the element.',
      options: {
        'go on': (e) => e.goTo('inner-text'),
        'go back': (e) => e.goTo('dom-api')
      }
    },
    {
      id: 'inner-text',
      content: 'If the body is empty, setting its <code>.innerText</code> changes what appears on the page. Assigning it repeatedly overwrites the previous value, so only the last assignment remains.',
      options: {
        'go on': (e) => e.goTo('reassign-vs-append'),
        'go back': (e) => e.goTo('document-body')
      }
    },
    {
      id: 'reassign-vs-append',
      content: 'To add more text without replacing what\'s there, use <code>+=</code> to append. This is how we can build a pattern line by line with JavaScript instead of hard-coding it in HTML. Of course constructing the pattern this way is no more "dynamic" than if we had simply written these values directly onto our page between the body\'s opening and closing tags.',
      options: {
        'go on': (e) => e.goTo('randomness'),
        'go back': (e) => e.goTo('inner-text')
      }
    },
    {
      id: 'randomness',
      before: () => tenPrintGif.close(),
      content: 'One of the most important tools for turning a static site into something more dynamic is "randomness", remember that book I mentioned earlier about the 10PRINT algorithm? There\'s an entire chapter devoted to <a href="https://generativeart.online/files/randomness-10print.pdf" target="_blank">randomness</a>, not just how it\'s used in this particular algorithm but how it\'s used by artists and engineers alike in creative ways.',
      options: {
        'go on': (e) => e.goTo('math-random'),
        'go back': (e) => e.goTo('reassign-vs-append')
      }
    },
    {
      id: 'math-random',
      content: 'The Math object holds the secret to unlocking the power of randomness in JavaScript. Its <code>Math.random()</code> method doesn\'t take any arguments like the others we\'ve discussed, it\'s parenthesis is left empty. Instead every time we call this method we get a new random value between 0 and 1.',
      options: {
        'go on': (e) => e.goTo('scale-random'),
        'go back': (e) => e.goTo('randomness')
      }
    },
    {
      id: 'scale-random',
      content: 'Multiply the random value to scale it up: <code>Math.random() * 100</code> gives a range from 0 up to (but not including) 100. This is a common way to generate ranges you need.',
      options: {
        'go on': (e) => e.goTo('random-boolean'),
        'go back': (e) => e.goTo('math-random')
      }
    },
    {
      id: 'random-boolean',
      content: 'Compare the random value to get a boolean. <code>Math.random() < 0.5</code> is a 50% coin flip, <code>Math.random() < 1 / 6</code> mimics a 1-in-6 die roll.',
      options: {
        'go on': (e) => e.goTo('conditionals'),
        'go back': (e) => e.goTo('scale-random')
      }
    },
    {
      id: 'conditionals',
      before: () => tenPrintGif.close(),
      content: 'We can wrap our "coin flip" code in parenthesis with a special keyword before it <code>if</code>, followed by <code>{</code> curly braces <code>}</code> or a "code block". The code inside the block will only run <i>if</i> the boolean expression between the parenthesis is true, which is why we call this pattern a <b>conditional statements</b>.',
      options: {
        'go on': (e) => e.goTo('conditional-else'),
        'go back': (e) => e.goTo('random-boolean')
      }
    },
    {
      id: 'conditional-else',
      content: 'We can add an <code>else</code> statement after it with an additional <code>{</code> block <code>}</code> with code to run if the statement is <b>false</b>. Now we have branching logic, one of these two slashes is going to get rendered, which one is up to chance.',
      options: {
        'go on': (e) => e.goTo('conditional-repeat'),
        'go back': (e) => e.goTo('conditionals')
      }
    },
    {
      id: 'conditional-repeat',
      content: 'We can now write this block multiple times to start creating the random maze pattern, each time we run this code each conditional block will generate a new random number, a 50/50 chance between which of the two statements to run which will add one of the diagonal slashes to body\'s text.',
      options: {
        'go on': (e) => e.goTo('loops-intro'),
        'go back': (e) => e.goTo('conditional-else')
      }
    },
    {
      id: 'loops-intro',
      content: 'However there\'s one last tool in the programmers tool kit that will help us to express these instructions with far less code. Anytime you have a piece of code which is repeated over-and-over again, exactly the same or even slightly differently each time, that\'s probably a good candidate for a <b>loop</b>. Loops express repetition clearly and cut down on copy-paste.',
      options: {
        'go on': (e) => e.goTo('while-loop'),
        'go back': (e) => e.goTo('conditional-repeat')
      }
    },
    {
      id: 'while-loop',
      before: () => tenPrintGif.close(),
      content: ' We can create loops a few different ways, the first version we\'ll explore is called a <b>while</b> loop. The syntax looks like an <code>if</code> block, but the code inside keeps running as long as its condition is <i>true</i>. That means the code in the <code>{</code> block <code>}</code> can execute many times until the condition flips to <i>false</i>.',
      options: {
        'go on': (e) => e.goTo('loop-counter'),
        'go back': (e) => e.goTo('loops-intro')
      }
    },
    {
      id: 'loop-counter',
      content: 'We usually control loop length with a counter variable, commonly named <code>i</code> (for "index" or "iteration"). Start it at <code>0</code>, then change it inside the loop to make progress.',
      options: {
        'go on': (e) => e.goTo('increment'),
        'go back': (e) => e.goTo('while-loop')
      }
    },
    {
      id: 'increment',
      content: 'Then inside the loop we\'ll increment the value of <code>i</code> by some amount, usually we increase it by one, which we can do by adding 1 to it\'s current value like this <code>i = i + 1</code>.',
      options: {
        'go on': (e) => e.goTo('increment2'),
        'go back': (e) => e.goTo('loop-counter')
      }
    },
    {
      id: 'increment2',
      content: 'We can also write it this way, using that same <code>+=</code> operator, this is another way of saying "add this amount to the current value".',
      options: {
        'go on': (e) => e.goTo('increment3'),
        'go back': (e) => e.goTo('increment')
      }
    },
    {
      id: 'increment3',
      content: 'When the amount we want to increment a variable by is 1, there\'s actually an even shorter way which is simply to write <code>i++</code>. Because programmers often prefer writing less code, it\'s much more common to find code written like this than written with the much longer <code>i = i + 1</code>.',
      options: {
        'go on': (e) => e.goTo('loop-bound'),
        'go back': (e) => e.goTo('increment2')
      }
    },
    {
      id: 'loop-bound',
      content: 'We can use the counter in the condition, like <code>i < 600</code>, to run <i>"as long as <b>i</b> is less than 600"</i>, which means it will run for 600 iterations (from 0 through 599). That gives us a precise number of characters (our diagonal slashes) to append to our body.',
      options: {
        'go on': (e) => e.goTo('loop-with-if'),
        'go back': (e) => e.goTo('increment')
      }
    },
    {
      id: 'loop-with-if',
      content: 'So now, if we bring back those conditional statements, this time placing it within our loop, we can control how many random slashes we want to create by changing that one value, 600. With only 9 lines of code we can add a large number of slashes, and because we\'re using randomness the pattern created by these slashes will look different every time we run the code!',
      options: {
        'go on': (e) => e.goTo('for-loop'),
        'go back': (e) => e.goTo('loop-bound')
      }
    },
    {
      id: 'for-loop',
      before: () => tenPrintGif.close(),
      content: 'We can actually express these same instructions in even fewer lines of code. This pattern of defining a variable, checking to see if it\'s less than some threshold value, and then incrementing it by some amount (usually 1) is so common that we can actually write those three statements on a single line using a <b>for</b> loop.',
      options: {
        'go on': (e) => e.goTo('for-loop2'),
        'go back': (e) => e.goTo('loop-with-if')
      }
    },
    {
      id: 'for-loop2',
      content: 'The syntax for a <b>for</b> loop is nearly identical to the <i>while</i> loop, the only difference is that all three <code>i</code> statements get written inside the parenthesis. Because these three statements are now written on the same line we need to use semi-colons <code>;</code> to separate them.',
      options: {
        'go on': (e) => e.goTo('recap'),
        'go back': (e) => e.goTo('for-loop')
      }
    },
    {
      id: 'recap',
      content: 'We\'ve now built a JavaScript version of <a href="https://www.youtube.com/watch?v=m9joBLOZVEo" target="_blank">10PRINT</a>. Along the way we\'ve covered all the core programming concepts: variables, the ingredients of our algorithmic recipes, and the different data types we can store in them, as well as how to write instructions using conditional logic (<b>if</b> and <b>else</b>), as well as loops (<b>while</b> and <b>for</b>).',
      options: {
        'go on': (e) => e.goTo('define-func'),
        'go back': (e) => e.goTo('for-loop')
      }
    },
    {
      id: 'define-func',
      content: 'We\'ve also covered how to use functions, but we haven\'t yet created any ourselves. To take our generative page to an interactive level, the first thing we need to do is create a function we can call at will. Let\'s create one for changing the background color of our page.',
      options: {
        'go on': (e) => e.goTo('define-function-var'),
        'go back': (e) => e.goTo('recap')
      }
    },
    {
      id: 'define-function-var',
      before: () => tenPrintGif.close(),
      content: 'There\'s more than one way to define a function. One way is to create a variable the same way we would any other variable, except rather than assigning a simple number or string, we place an entire function declaration on the other side of the equal sign. This includes the special keyword <code>function</code> followed by parentheses <code>()</code>, which we can use to optionally send arguments into our function, and then the <code>{</code> curly braces <code>}</code>.',
      options: {
        'go on': (e) => e.goTo('name-function'),
        'go back': (e) => e.goTo('define-func')
      }
    },
    {
      id: 'name-function',
      content: 'However, an even more common approach is to start with the <code>function</code> keyword and then name it just before the parentheses <code>()</code>. There\'s no functional difference between these two approaches; you can use whichever format you prefer.',
      options: {
        'go on': (e) => e.goTo('function-body-bg'),
        'go back': (e) => e.goTo('define-function-var')
      }
    },
    {
      id: 'function-body-bg',
      content: 'I mentioned earlier that functions are variables that store instructions inside of them. When creating our own functions we define these instructions between the <code>{</code> curly braces <code>}</code> of the code block. The goal of our function is going to be to change the background color of our page, this means modifying the body\'s style.',
      options: {
        'go on': (e) => e.goTo('document-style-background'),
        'go back': (e) => e.goTo('name-function')
      }
    },
    {
      id: 'document-style-background',
      content: 'To do this we\'ll use the <code>document.body</code> object again. All of the element\'s CSS code can be accessed through its <code>.style</code> property, inside of which are all the CSS properties including <code>.background</code>. So if we set that to a new value, we\'ll change our page\'s background color.',
      options: {
        'go on': (e) => e.goTo('call-function'),
        'go back': (e) => e.goTo('function-body-bg')
      }
    },
    {
      id: 'call-function',
      content: 'Nothing has changed at first, that\'s because the code we write inside a function won\'t run until we call that function. So after defining the function we\'ll also need to <i>call it</i> in order to see the change take effect.',
      options: {
        'go on': (e) => e.goTo('event-listeners'),
        'go back': (e) => e.goTo('document-style-background')
      }
    },
    {
      id: 'event-listeners',
      content: 'But if all we wanted was a different background color we could have just edited our CSS stylesheet. Our goal is to make this page interactive, we want the color to change when we click the page. To accomplish this we need to use something called an <b>event listener</b>. Events are things that happen while your program is running, like mouse movements, screen taps, and data loading.',
      options: {
        'go on': (e) => e.goTo('window-addEventListener'),
        'go back': (e) => e.goTo('call-function')
      }
    },
    {
      id: 'window-addEventListener',
      before: () => tenPrintGif.close(),
      content: 'There\'s another object built into the browser called <code>window</code>, and we can use its <code>.addEventListener()</code> method to attach functions to specific events. We do this by passing two arguments into this method\'s parentheses: first, the name of the event we want to <i>listen</i> for (there\'s a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window#events" target="_blank">specific list</a> and they\'re always written as strings). The second argument is the name of the function we want to run when that event occurs.',
      options: {
        'go on': (e) => e.goTo('try-click'),
        'go back': (e) => e.goTo('event-listeners')
      }
    },
    {
      id: 'try-click',
      content: 'Now our background color won\'t change until you click on the page, try it out! Click anywhere on the maze pattern!',
      options: {
        'go on': (e) => e.goTo('css-colors-rgb'),
        'go back': (e) => e.goTo('window-addEventListener')
      }
    },
    {
      id: 'css-colors-rgb',
      before: () => tenPrintGif.close(),
      content: 'We can make this even more interesting by introducing a little randomness again. In CSS we not only have color names, you may recall from other lessons that we can define colors using CSS functions like <code>rgb()</code>. We can assign these to style properties as strings, which means we can construct custom strings using a little more JavaScript.',
      options: {
        'go on': (e) => e.goTo('random-0-255'),
        'go back': (e) => e.goTo('try-click')
      }
    },
    {
      id: 'random-0-255',
      content: 'You might recall that the <code>Math.random()</code> method returns a value between <b>0</b> and <b>1</b>, so if we multiply that by <b>255</b> then we\'ll get a range from <b>0</b> to <b>255</b>, which are the values we need to pass into the <code>rgb</code> string. Now we\'ll get a different shade of red every time we click. Try clicking now.',
      options: {
        'go on': (e) => e.goTo('full-rgb-color'),
        'go back': (e) => e.goTo('css-colors-rgb')
      }
    },
    {
      id: 'full-rgb-color',
      content: 'If we do this for the green and blue channels as well, then we\'ll get a completely random color every time we click, try it out!',
      options: {
        'go on': (e) => e.goTo('template-literals'),
        'go back': (e) => e.goTo('random-0-255')
      }
    },
    {
      id: 'template-literals',
      before: () => tenPrintGif.close(),
      content: 'That string is getting hard to parse, there are so many pieces and <code>+</code> operators it\'s easy to miss one and cause a bug. When we need complex string concatenations like this it\'s often less buggy to use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals" target="_blank">template literals</a>. I mentioned these earlier, it\'s the type of strings that use the <code>`</code> mark (next to the 1-key on most keyboards) instead of the <code>\'</code> or <code>"</code> quote marks.',
      options: {
        'go on': (e) => e.goTo('template-vars'),
        'go back': (e) => e.goTo('full-rgb-color')
      }
    },
    {
      id: 'template-vars',
      content: 'These are special because the <code>`</code> strings let you easily pass variables into them using the <code>$</code> symbol followed by <code>{</code> curly brances <code>}</code> with the variable between them. This isn\'t functionally different from the <code>+</code> style concatenation we wrote before, our output is still the same, so use whichever approach makes most sense to you.',
      options: {
        'go on': (e) => e.goTo('function-10print'),
        'go back': (e) => e.goTo('template-literals')
      }
    },
    {
      id: 'function-10print',
      content: 'Let\'s create one last function: let\'s take our 10PRINT algorithm and store it in its own function. As soon as we do that you\'ll notice the pattern disappears. Again, that\'s because we need to call the function for its code to run. So we\'ll attach that function to the window\'s <b>\'load\'</b> event to have it run as soon as our page reloads.',
      options: {
        'go on': (e) => e.goTo('click-regenerate'),
        'go back': (e) => e.goTo('template-vars')
      }
    },
    {
      id: 'click-regenerate',
      content: 'Now that we\'ve got it in a function, we could also attach it to the window\'s <b>\'click\'</b> event, which means not only will our background color change each time we click it, the entire maze pattern will change as well.',
      options: {
        'go on': (e) => e.goTo('append-issue'),
        'go back': (e) => e.goTo('function-10print')
      }
    },
    {
      id: 'append-issue',
      content: 'Except that, the way the code is written now uses the <code>+=</code> operator to <i>append</i> slashes each time, so clicking the page won\'t create a new pattern, it\'ll just make the one we already have longer. (click, then scroll to see)',
      options: {
        'go on': (e) => e.goTo('clear-innertext'),
        'go back': (e) => e.goTo('click-regenerate')
      }
    },
    {
      id: 'clear-innertext',
      content: 'To correct this we\'ll add one more line of code to the start of the function. By using the <code>=</code> operator we\'re reassigning our body\'s <code>innerText</code> to an empty string, replacing all the slashes that were there before. This creates a blank slate for the <b>for</b> loop that follows to create a whole new set of slashes. Try clicking the page now to see!',
      options: {
        'go on': (e) => e.goTo('pause-experiment'),
        'go back': (e) => e.goTo('append-issue')
      }
    },
    {
      id: 'pause-experiment',
      content: 'This is probably a good time to pause and experiment with the code we\'ve written so far. Try changing the slashes in our strings to other symbols, change how many times our loop is going to run, and tweak the random probability in our conditional and color function. After some experimentation, click the "<b>Guide</b>" button to resume the lesson.',
      options: {
        'go on': (e) => e.goTo('libraries'),
        'go back': (e) => e.goTo('clear-innertext')
      }
    },
    {
      id: 'libraries',
      content: 'As you might imagine, there\'s loads more we could do, which will make our code increasingly complex. One way programmers cut down on the amount of code they have to write is by using "libraries" (sometimes also called "packages" or "modules").',
      options: {
        'go on': (e) => e.goTo('what-lib'),
        'go back': (e) => e.goTo('pause-experiment')
      }
    },
    {
      id: 'what-lib',
      content: 'A library is a collection of code (often functions) other folks wrote and packaged up (usually as an object) to abstract away common tasks. That way we can focus on the creative aspects of our code and not worry as much about smaller logical details.',
      options: {
        'go on': (e) => e.goTo('nn-intro'),
        'go back': (e) => e.goTo('libraries')
      }
    },
    {
      id: 'nn-intro',
      content: 'There\'s a JavaScript library my creators wrote while creating me called the <a href="https://github.com/netizenorg/netnet-standard-library/blob/main/README.md" target="_blank">netnet standard library</a>. It packages up helpful functions for creative coding into a single <code>nn</code> object.',
      options: {
        'go on': (e) => e.goTo('import-lib'),
        'go back': (e) => e.goTo('what-lib')
      }
    },
    {
      id: 'import-lib',
      before: () => tenPrintGif.close(),
      content: 'There are a few ways to import a JavaScript library, but the traditional approach is the one we referenced earlier: add a pair of <code>script</code> tags above the ones we have and set the opening tag\'s <code>src</code> attribute to a JavaScript file containing the library\'s code. The template we\'re working on already has a <b>js</b> folder with the library inside it.',
      options: {
        'go on': (e) => e.goTo('nn-global'),
        'go back': (e) => e.goTo('nn-intro')
      }
    },
    {
      id: 'nn-global',
      before: () => tenPrintGif.close(),
      content: 'Now that the library is loaded, we can use the <code>nn</code> object in our code. First, we\'ll add a special comment at the top of our JavaScript to remind us (especially me) that there\'s a new global variable available.',
      options: {
        'go on': (e) => e.goTo('nn-on'),
        'go back': (e) => e.goTo('import-lib'),
        'especially you?': (e) => e.goTo('linting')
      }
    },
    {
      id: 'linting',
      content: 'As you probably already know, when I spot an issue with your code I\'ll leave a mark next to the line number to let you know. If you try to use a variable that isn\'t part of a browser API nor is it one you created yourself I\'ll warn you about it. This comment lets me know that even though you didn\'t create the <code>nn</code> variable yourself in this file, it is in fact a global variable you know you can use, in this case because you imported it with a library',
      options: {
        'I see': (e) => e.goTo('nn-on')
      }
    },
    {
      id: 'nn-on',
      content: 'First thing we\'ll rewrite is our event listeners. When registering events, many libraries use a shorter function named <code>on</code> instead of <code>addEventListener</code>. Notice we only changed the method name and replaced <code>window</code> with <code>nn</code>. Nothing has functionally changed, behind the scenes the <code>nn</code> library calls <code>addEventListener</code> for us, it just makes things quicker to read and write.',
      options: {
        'go on': (e) => e.goTo('nn-random'),
        'go back': (e) => e.goTo('nn-global')
      }
    },
    {
      id: 'nn-random',
      content: 'Next, let\'s replace <code>Math.random()</code> with <code>nn.random()</code>. This one\'s special: it\'s not just shorter, it can take arguments. Pass a single number to get a random value between 0 and that number, or pass two numbers to get a value between a minimum and maximum.',
      options: {
        'go on': (e) => e.goTo('nn-randomColor'),
        'go back': (e) => e.goTo('nn-on')
      }
    },
    {
      id: 'nn-randomColor',
      content: 'The library also has <code>nn.randomColor()</code> built in, so our color code can get much shorter with the same effect, click on the rendered maze pattern to try it.',
      options: {
        'go on': (e) => e.goTo('nn-hsl'),
        'go back': (e) => e.goTo('nn-random')
      }
    },
    {
      id: 'nn-hsl',
      content: 'There are other methods for creating and modifying colors, too. For example, <code>nn.hsl()</code> can create a dark shade of red: hue <b>0</b> (degrees around the color wheel), saturation <b>100</b>% and lightness <b>20</b>%. Keeping it dark ensures our white slashes remain easy to read (which isn\'t guaranteed with completely random colors).',
      options: {
        'go on': (e) => e.goTo('nn-dark-random'),
        'go back': (e) => e.goTo('nn-randomColor')
      }
    },
    {
      id: 'nn-dark-random',
      content: 'We can randomize the color while keeping it dark by generating a random hue between 0 and 360 degrees and fixing the lightness at <b>20</b>%. Try clicking the maze pattern now.',
      options: {
        'go on': (e) => e.goTo('nn-get'),
        'go back': (e) => e.goTo('nn-hsl')
      }
    },
    {
      id: 'nn-get',
      content: 'It\'s convenient that the <code>document</code> object has a property for <code>body</code>, but accessing other elements can be trickier. That\'s why the library has <code>nn.get()</code>, which can select any element by tag name (as a string) or any CSS selector you\'d use in your styles.',
      options: {
        'go on': (e) => e.goTo('nn-css'),
        'go back': (e) => e.goTo('nn-dark-random')
      }
    },
    {
      id: 'nn-css',
      content: 'We can access the body this way, and then chain other methods to modify it. For example, <code>.css()</code> updates styles on the selected element.',
      options: {
        'go on': (e) => e.goTo('pattern-var'),
        'go back': (e) => e.goTo('nn-get')
      }
    },
    {
      id: 'pattern-var',
      content: 'Let\'s try this approach in our <code>tenPrint</code> function as well. First, I\'m going to create a new variable to keep track of our pattern. It\'ll start as an empty string and then have the diagonal slashes appended using the same logic as before.',
      options: {
        'go on': (e) => e.goTo('nn-content'),
        'go back': (e) => e.goTo('nn-css')
      }
    },
    {
      id: 'nn-content',
      content: 'To add the pattern to the page, we\'ll use <code>nn.get()</code> again and then chain <code>.content()</code>, passing in our new pattern string.',
      options: {
        'go on': (e) => e.goTo('chain-methods'),
        'go back': (e) => e.goTo('pattern-var')
      }
    },
    {
      id: 'chain-methods',
      before: () => tenPrintGif.close(),
      content: 'These methods can <i>chain</i>, meaning we can attach one after another. To demonstrate this, let\'s remove our <i>randomBackground</i> function and move those two color variables into the <i>tenPrint</i> function.',
      options: {
        'go on': (e) => e.goTo('chain-multiline'),
        'go back': (e) => e.goTo('nn-content')
      }
    },
    {
      id: 'chain-multiline',
      content: 'Now that the variables live here, we can use them by chaining a <code>.css()</code> call directly after <code>.content()</code>. When chaining more than a couple of methods, splitting them across lines often makes the code easier to read.',
      options: {
        'go on': (e) => e.goTo('chars-var'),
        'go back': (e) => e.goTo('chain-methods')
      }
    },
    {
      id: 'chars-var',
      content: 'Let\'s create another variable named <code>chars</code> (short for "characters"). It will be a string containing the symbols we want to use to generate the pattern, initially our two diagonal slash symbols.',
      options: {
        'go on': (e) => e.goTo('random-char'),
        'go back': (e) => e.goTo('chain-multiline')
      }
    },
    {
      id: 'random-char',
      content: 'With the symbols stored in a single string, we can simplify our conditional. If we pass a string to <code>nn.random()</code>, it will return a random character from that string.',
      options: {
        'go on': (e) => e.goTo('more-symbols'),
        'go back': (e) => e.goTo('chars-var')
      }
    },
    {
      id: 'more-symbols',
      content: 'This means we can define a longer set of symbols in <code>chars</code> and get new patterns. This new set includes 11 different symbols; we could write a series of <code>else if</code> statements to achieve the same result, but this approach uses far fewer lines of code.',
      options: {
        'go on': (e) => e.goTo('nn-times'),
        'go back': (e) => e.goTo('random-char')
      }
    },
    {
      id: 'nn-times',
      before: () => tenPrintGif.close(),
      content: 'We could also abstract our <b>for</b> loop using <code>nn.times()</code>, which takes two arguments: the number of iterations, and a function that looks like <code>i =&gt; { }</code>. This is called an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions" target="_blank">arrow function</a>, because the <code>=&gt;</code> looks like an arrow pointing to the function\'s code block. The <code>i</code> argument is our loop index.',
      options: {
        'go on': (e) => e.goTo('arrow-one-line'),
        'go back': (e) => e.goTo('more-symbols')
      }
    },
    {
      id: 'arrow-one-line',
      content: 'This didn\'t reduce much code at first, it still used three lines for the repeating block. But arrow functions have a nice shortcut: when the block has only one statement, we can drop the <code>{</code> and <code>}</code> and write it on a single line.',
      options: {
        'go on': (e) => e.goTo('arrow-one-line2'),
        'go back': (e) => e.goTo('nn-times')
      }
    },
    {
      id: 'arrow-one-line2',
      content: 'If the function expected more than one argument, we could use parenthesis.',
      options: {
        'go on': (e) => e.goTo('arrow-one-line3'),
        'go back': (e) => e.goTo('arrow-one-line')
      }
    },
    {
      id: 'arrow-one-line3',
      content: 'And if we don\'t expect or need any of the arguments, we could leave them empty.',
      options: {
        'go on': (e) => e.goTo('style-preference'),
        'go back': (e) => e.goTo('arrow-one-line2')
      }
    },
    {
      id: 'style-preference',
      content: 'Less code doesn\'t always mean clearer code. Some folks prefer this concise style; others prefer classic <b>for</b> loops and <b>if</b> statements even if there\'s more syntax. The choice is yours, importing a library doesn\'t force you to use all of its tools.',
      options: {
        'go on': (e) => e.goTo('local-vs-cdn'),
        'go back': (e) => e.goTo('arrow-one-line3')
      }
    },
    {
      id: 'local-vs-cdn',
      before: () => tenPrintGif.close(),
      content: 'Before we finish, a note about how we imported this library. It\'s stored locally in our project, but it\'s also common to use libraries hosted on other servers, often CDNs, or "content delivery networks."',
      options: {
        'go on': (e) => e.goTo('cdn-url'),
        'go back': (e) => e.goTo('style-preference')
      }
    },
    {
      id: 'cdn-url',
      content: 'We could rewrite our <code>src</code> URL to point to a CDN-hosted version. Behavior won\'t change at first, but there are implications: if the hosting server goes down, moves the file, or renames it, our code is affected. Importing code from elsewhere means we don\'t control that server.',
      options: {
        'go on': (e) => e.goTo('cdn-tradeoffs'),
        'go back': (e) => e.goTo('local-vs-cdn')
      }
    },
    {
      id: 'cdn-tradeoffs',
      content: 'You might think it\'s best to keep a local copy to avoid third-party dependencies. CDNs, however, are designed to be resilient and fast, and they keep libraries up to date. If a bug is fixed "upstream" (in the CDN), you often get the fix automatically (sometimes all you need to change is the URL).',
      options: {
        'go on': (e) => e.goTo('cdn-common'),
        'go back': (e) => e.goTo('cdn-url')
      }
    },
    {
      id: 'cdn-common',
      content: 'It\'s very common for creative coders to link to CDN-hosted libraries. Still, if you want to lock a specific version inside your project (as we\'ve done here), that\'s also a valid option.',
      options: {
        'go on': (e) => e.goTo('minified'),
        'go back': (e) => e.goTo('cdn-tradeoffs')
      }
    },
    {
      id: 'minified',
      content: 'Notice the library file is named <b>nn.min.js</b>. The ".min" indicates the code is "minified": spaces and line breaks removed, variable names shortened, and other tricks applied to make the file compact. Smaller files load faster. The code isn\'t human-friendly, but this library is open source, so you can read the original on <a href="https://github.com/netizenorg/netnet-standard-library/tree/main" target="_blank">GitHub</a>.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('cdn-common')
      }
    },
    {
      id: 'end-guide',
      before: () => tenPrintGif.close(),
      content: 'We\'ve covered all of JavaScript\'s core concepts in this lesson, but in terms of what we can do with it, we\'ve really only scratched the surface! There are many more Web APIs and creative coding libraries full of potential. We\'ll explore these in other lessons, templates, and demos. To make the most of them, keep building your understanding of the fundamentals we covered here, and explore the <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.scrollTo(\'js-docs\'))">JavaScript Docs</span> in my Learning Guide.',
      options: {
        'great!': (e) => {
          WIDGETS['template-projects']._experimentWithCode()
          e.hide()
        }
      }
    }
  ]
}
