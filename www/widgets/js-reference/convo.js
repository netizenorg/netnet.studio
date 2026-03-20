/* global nn NNW NNE utils WIDGETS */
/* eslint no-template-curly-in-string: "off" */
window.CONVOS['js-reference'] = (self) => {
  return [
    {
      id: 'start-guide',
      layout: 'welcome',
      before: () => {
        NNW.menu.switchFace('default')
      },
      after: async () => {
        nn.sleep(500)
        NNW.update({ bottom: 32, left: 32 }, 500)
        self.update({ top: 20, right: 20 }, 500)
      },
      code: utils.starterCode(),
      content: 'Unlike HTML and CSS, which describe what a page looks like, JavaScript is a programming language, it lets you express logic: making decisions, repeating actions, and responding to user input. There are many programming languages (Python, Java, C++, Rust, etc.) and they all share the same core building blocks: variables, functions, loops, and conditionals. What differs is the "syntax", how you write them.',
      options: {
        'go on': (e) => e.goTo('js-web')
      }
    },
    {
      id: 'js-web',
      content: 'While JavaScript can be used well beyond the browser (to create <a href="https://www.electronjs.org/" target="_blank">native apps</a>, program <a href="http://johnny-five.io/" target="_blank">robots</a>, or script other apps like <a href="https://helpx.adobe.com/photoshop/using/scripting.html" target="_blank">Adobe Creative Suite</a> and <a href="https://learn.microsoft.com/en-us/office/dev/scripts/develop/javascript-objects" target="_blank">Microsoft Office</a>), it was invented specifically for the Web in 1995, transforming the Web from a collection of static pages into a platform for interactive software.',
      options: {
        'go on': (e) => e.goTo('explain-widget')
      }
    },
    {
      id: 'explain-widget',
      content: 'In the widget you\'ll find a drop-down menu containing each of the core concepts. Once selected, it will update the drop-down beside it with a list of code examples. Click on the code and type over it to practice. If you click "explain" I\'ll explain the example, and when you click "run code" you\'ll see the result in the output section below it.',
      options: { ok: e => e.hide() }
    },
    {
      id: 'var',
      content: 'Like a recipe, software is just a set of instructions. Before the steps, a recipe lists its ingredients. In programming, our "ingredients" are data, and we store that data in variables. Variables always have a name, we called this one <code>year</code>',
      options: {
        'go on': e => e.goTo('var-2')
      }
    },
    {
      id: 'var-2',
      content: 'To create, or "declare", a new variable we first specify a declaration keyword, here we\'re using the <code>var</code> keyword. However, we should try not to use this old keyword anymore. You might come across old example code online that uses <code>var</code>, it still works, but it can lead to buggy code so it\'s best to avoid it.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'const',
      content: 'In place of <code>var</code>, these days it\'s typically better to use either <code>const</code> or <code>let</code>. The <code>const</code> keyword is used when the variable\'s value isn\'t going to change. We\'ve named this one "year", if we reference it later, it will always return the value 1995',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'let',
      content: 'Instead of <code>const</code>, we can use the <code>let</code> keyword when we plan on changing this variable\'s value elsewhere in our code. Here we change, or "reassign", our year variable\'s value from 1995 to 2000 using the <code>=</code> "operator"',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'output',
      content: 'In these examples we\'ll use a special <code>output()</code> function to display the value of a particular variable in the "output" section below the code. If you click on "run code" whatever value is stored in the variable between the parenthesis will get displayed below it.',
      options: {
        ok: e => e.hide()
      }
    },
    // ------------------
    {
      id: 'addition',
      content: 'The <code>+</code> and <code>-</code> are "arithmetic operators", they tell JavaScript to add or subtract two numbers. When a line of code produces a new value like <code>400 + 4</code> we call it an "expression". JavaScript evaluates the expression first, arriving at <code>404</code>, then stores that result in <code>x</code>.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'multiply',
      content: 'The <code>*</code> and <code>/</code> are arithmetic operators for multiplication and division. Just like before, JavaScript evaluates the expression first, then stores the result in the variable. Can you guess what the two outputs are going to be?',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'modulo',
      content: 'The <code>%</code> operator (aka modulus or modulo) is similar to the division operator except that it only returns the remainder of the operation. It\'s most often used for "clock arithmetic", also known as <a href="https://en.wikipedia.org/wiki/Modular_arithmetic" target="_blank">modular arithmetic</a>',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'incrementing',
      content: 'Here we\'ve declared a variable with <code>let</code> because we\'re going to reassign its value. We\'ve used the variable itself in the expression, adding <code>50</code> to itself. Can you guess what its new value is?',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'incrementing-2',
      content: 'Lines 2, 3 and 4 are essentially performing the same operation: incrementing the current value by 1. When we want to increment a value, instead of adding a number to itself, we can use the special <code>+=</code> operator to both add and reassign, and when we want to increment a value by 1 specifically we can use the shorthand <code>++</code>.  Can you guess what its new value is?',
      options: {
        ok: e => e.hide()
      }
    },
    // ------------------
    {
      id: 'number',
      content: 'We can store different "data types" in our variables. All programming languages have more or less the same data types, though the details will vary. For example, some programming languages specify two (or more) different data types for numbers like "integer" for whole numbers and "float" for decimal numbers, but in JavaScript all numbers have the same data type: "number".',
      options: {
        'go on': e => e.goTo('number-2')
      }
    },
    {
      id: 'number-2',
      content: 'In this example we\'re outputting two lines, first the value stored in the variable <code>pi</code> and then the <i>type</i> of data stored in it, by placing the <code>typeof</code> operator before the variable name.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'string',
      content: 'Another very common data type is a "string", which is how we store text in our variables. This can be a single letter or an entire essay, so long as we surround this text with quote marks. You can use the single quote mark <code>\'</code> or the double quote mark <code>"</code>, so long as you use the same quote mark on either side of your string.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'string-template',
      content: 'The <code>&#96;</code> marks can also be used to create special types of strings in JavaScript known as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals" target="_blank">Template literals or Template strings</a>, which are used for "string interpolation". You can pass variables into these special strings using the <code>&#36;&#123; &#125;</code> styntax.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'boolean',
      content: 'Another data type is a "boolean", named after <a href="https://en.wikipedia.org/wiki/George_Boole" target="_blank">George Boole</a>. Boolean\'s can only ever be one of two values, either <code>true</code> or <code>false</code>.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'undefined',
      content: 'Here we\'ve explicitly declared the variable <code>x</code> but never gave it any value. Because all variables need to have some data type, when we haven\'t explicitly given it any data, it gets assigned the special placeholder value of <code>undefined</code>, which in JavaScript is both a value and it\'s own data type.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'function',
      content: 'We\'ll discuss functions in a bit more depth with their own set of examples, but for now it\'s worth mentioning that functions are themselves a data type in JavaScript. Here\'s where things get a little <i>meta</i>. Our <code>output()</code> function has a name, "output", so we can check its type as we would any other variable.',
      options: {
        'go on': e => e.goTo('function-2')
      }
    },
    {
      id: 'function-2',
      content: 'Instead of storing a number or a string, the variable <code>output</code> stores instructions, so we call it a "function". In JavaScript, functions are technically just another data type, so calling it a variable isn\'t wrong, but because of what it holds, we usually just refer to it as a function.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'object',
      content: 'The last data type, is an "object", a container that groups related data (called "properties") and functions (called "methods") together under one name. Think of it like a toolbox, instead of having <code>PI</code> and <code>round()</code> defined on their own, they\'re bundled inside <code>Math</code>.',
      options: {
        'go on': e => e.goTo('object-2')
      }
    },
    {
      id: 'object-2',
      content: 'You access a property (internal variable) of an object using a dot <code>.</code> like <code>Math.PI</code> which grabs the number pi (3.14159...), and <code>Math.round()</code> calls a method (internal function) that rounds a value to the nearest whole number. Objects are also referred to as "data structures", because they contain more than one value, you can read more about that in the JavaScript docs.',
      options: {
        ok: e => e.hide()
      }
    },
    // -----------
    {
      id: 'conditionals',
      content: 'Conditional statements let you run different code depending on whether a condition is true or false. Between the parenthesis we write "boolean statements", which are questions that return "true" or "false" and can be written in a lot of different ways.',
      options: {
        'go on': (e) => e.goTo('conditionals-2')
      }
    },
    {
      id: 'conditionals-2',
      content: 'Here we\'re asking the question: "<i>is the age greater than or equal to 21?</i>", because the answer is <code>true</code> then any code we write between the <code>{</code> and <code>}</code> will run, if the answer were <code>false</code> then our program would skip all the code between the brackets.',
      options: {
        'go on': (e) => e.goTo('conditionals-3')
      }
    },
    {
      id: 'conditionals-3',
      content: 'We can also use other "boolean operators" to ask questions like <code>&gt;</code> (greater than), <code>&lt;</code> (less than), <code>===</code> (equal to), <code>!==</code> (not equal to), and <code>&lt;=</code> (less than or equal to)',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'logical',
      content: 'We can also combine more than one boolean statement using "logical operators" like <code>&amp;&amp;</code> which means "and", as well as <code>||</code> which means "or". Here we\'re asking the question: <i>is country equal to \'US\' and is age greater than or equal to 21?</i> This will return <code>false</code> because although the country is equal to \'US\', age is not greater than or equal to 21.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'else-if',
      content: 'We can use the <code>else</code> and <code>else if</code> keywords to add follow up questions when the answer to a previous <code>if</code> or <code>else if</code> question is false. Only one of these outputs will run, can you tell which one?',
      options: {
        ok: e => e.hide()
      }
    },
    // -----------
    {
      id: 'while',
      content: 'A "loop", as the name implies, runs a block of code over and over again, until some condition is met. The most basic type of loop is a <code>while</code> loop. We first create a variable. Then similar to our "if" statements, we\'ll ask a question by writing the <code>while</code> keyword followed by <code>()</code> parenthesis with a boolean expression within it.',
      options: {
        'go on': (e) => e.goTo('while-2')
      }
    },
    {
      id: 'while-2',
      content: 'In this case we\'re asking the question: "<i>is i less than 3?</i>", so long as the answer is <code>true</code> we\'ll run its block of code, everything we\'ve got between the opening <code>{</code> and closing <code>}</code> brackets, over and over again.',
      options: {
        'go on': (e) => e.goTo('while-3')
      }
    },
    {
      id: 'while-3',
      content: 'The first time our while loop runs the value of <code>i</code> is 0 (what we initially set it to) which is less than 3, and so we\'ll <code>output()</code> that value. We have to reassign the value of <code>i</code> inside of our loop, because if we don\'t, then <code>i</code> will always be less than 3 and our loop will never end... it\'ll keep calling that <code>output()</code> over and over as fast as it can eventually crashing our browser.',
      options: {
        'go on': (e) => e.goTo('while-4')
      }
    },
    {
      id: 'while-4',
      content: 'You might recall from the increment example that <code>i++</code> is a shorthand for <code>i = i + 1</code> which means on the second iteration of our loop <code>i</code> will be equal to 1, the next time it will be 2, then 3 at which point it will exit the loop.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'for',
      content: 'A <code>for</code> loop does the same thing that a "while" loop does but it\'s written differently. The variable declaration, the boolean expression and the incrementing of that variable are all written within the loop\'s parenthesis. This allows us to express the same logic in less lines of code. And because programmers love "efficiency" we tend to see lots more for loops than while loops.',
      options: {
        'go on': e => e.goTo('for-2')
      }
    },
    {
      id: 'for-2',
      content: 'Notice that between each of the statements there\'s a semicolon <code>;</code>, lots of other programming languages require that you end each line of code, or "statement", with a semicolon. In JavaScript, semicolons are optional, except in situations where more than one statement are written on the same line, as they are here within the parenthesis. In these instances we need the <code>;</code> to identify where one statement ends and the next begins.',
      options: {
        ok: e => e.hide()
      }
    },
    // -----------
    {
      id: 'functions',
      content: 'As we\'ve seen in the previous examples, there exists some predefined variables. Some of these are built-into JavaScript, like the <code>Math</code> object, others are part of the context we\'re coding in, like the <code>output</code> function built into this example widget. Just as we can define our own variables to store numbers or strings, we can also define our own functions to store instructions.',
      options: {
        'go on': (e) => e.goTo('functions-2')
      }
    },
    {
      id: 'functions-2',
      content: 'Functions are like mini-programs inside our program. We use the <code>function</code> keyword to create a new function, we give it a name (just like we do with variables) followed by <code>()</code> parenthesis and then opening <code>{</code> and closing <code>}</code> brackets, this creates the code block containing instructions we want to execute when we "call" (or "run") this function.',
      options: {
        'go on': (e) => e.goTo('functions-3')
      }
    },
    {
      id: 'functions-3',
      content: 'We can declare variables known as "arguments" within the function\'s parenthesis <code>()</code> when we definine it. This argument variable will only exist within the <a href="https://developer.mozilla.org/en-US/docs/Glossary/Scope" target="_blank">scope</a> of the function (ie. inside the function), its value will be whatever we "pass" it when we later run the function. It\'s worth noting here that any variable you create inside of a function only exists within that block (or scope) of that function.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'pure-functions',
      content: 'When a function has some effect on another part of your program, like the way our last example\'s function would output the greeting to the widget, this is considered a "side effect". Some functions have no side effects, they simply take in some data as arguments (within the parenthesis) do something with that data and then <code>return</code> some new data back out. These are known as "pure functions".',
      options: {
        'go on': (e) => e.goTo('pure-functions-2')
      }
    },
    {
      id: 'pure-functions-2',
      content: 'In This example, the "square" function takes a number as an argument, then internally it creates a new variable to store the squared value of the argument before "returning" the value of that variable back out.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'variable-declaration',
      content: 'Because a function is also a variable, which stores instructions instead of other data types, we could also declare a function similar to how we would any other variable. This isn\'t <i>functionally</i> different than before, it\'s just a different way of defining it, you can use which ever approach you prefer.',
      options: {
        ok: e => e.hide()
      }
    },
    {
      id: 'arrow-functions',
      content: 'Instead of using the "function" keyword we can also use the alternative <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions" target="_blank">arrow function</a> syntax. Technically, the way arrow functions handle scope is a bit different from functions declared the other ways, but more often than not, programmers use this syntax because it\'s shorter (and programmers like short concise code) so it\'s not uncommon to see it in modern day examles or tutorials.',
      options: {
        ok: e => e.hide()
      }
    },
    // -----------
    {
      id: 'code-error',
      content: 'Oops, you didn\'t type the code exactly right. Try again and click "run code", if you typed it correctly the output will either display your code\'s result or it will say <code>correct</code> if there is nothing to display.',
      options: { ok: e => e.hide() }
    },
    {
      id: 'no-code',
      content: 'It does\'t look like you typed any code, click on the code example next to the line number <code>1</code> to place your cursor there and type over the code exactly as it\'s written, then press "run code" again.',
      options: { ok: e => e.hide() }
    },
    {
      id: 'confirm-start',
      graph: { id: 23, x: 50, y: 25 },
      content: 'Seems like you might be working on some code, I\'ll be replacing the code in my editor once we start this guide, are you sure you want to do that?',
      options: {
        'yes, go ahead': (e) => {
          self._toggleIntroPresentation()
        },
        'oh, never mind': (e) => e.hide()
      }
    }
  ]
}
