/* global utils, NNW */
window.CONVOS['ai-prompter'] = (self) => {
  return [{
    id: 'start',
    before: () => NNW.menu.switchFace('default'),
    content: 'AI is now part of modern programming, but not all uses support learning. For beginners, many of these tools can undermine our learning goals, robbing us of the opportunity to master the fundamentals. Which is why we need to choose the right AI tool and craft deliberate prompts.',
    options: {
      'how do I choose?': (e) => e.goTo('choose'),
      'deliberate prompts?': (e) => e.goTo('prompts')
    }
  }, {
    id: 'choose',
    content: 'AI assistants plug into coding workflows in different ways: in-editor auto-completion (ex: GitHub Copilot) writes directly into your files; terminal/IDE "agent" tools (ex: Claude Code, Codex) can run commands and even refactor entire projects; and chatbots (ex: <a href="https://chatgpt.com/" target="_blank">ChatGPT</a>, <a href="https://claude.ai/" target="_blank">Claude</a>, <a href="https://gemini.google.com/" target="_blank">Gemini</a>) live in a separate tab where you discuss code and get explanations, which is what we want.',
    options: {
      'Why chatbots and not agents?': (e) => e.goTo('why-chat'),
      'How should I prompt it?': (e) => e.goTo('prompts')
    }
  }, {
    id: 'why-chat',
    content: 'Our aim is AI literacy that supports learning, not automation that replaces it. A coding agent works great for experienced coders, but for those of us still learning conversational models, like chat bots, which operate outside your coding environment usually provide a lot more context. You also don\'t need to install anything on your computer, you can use them just by opening a new tab.',
    options: {
      'Then I copy the code?': (e) => e.goTo('transcribe1'),
      'How should I prompt it?': (e) => e.goTo('prompts')
    }
  }, {
    id: 'transcribe1',
    content: 'You could always copy+paste, but I would recommend that you actually retype the code yourself, doing so ensures that you\'ve read every line closely which will deepen your understanding and also gives you the chance to rewrite code in your own voice/style. If we prompt the model correctly we should only ever get small snippets that are easy to retype.',
    options: {
      'I see': (e) => e.goTo('transcribe2')
    }
  }, {
    id: 'transcribe2',
    content: 'We want AI to help us learn, not develop our entire project. Using this widget should help steer it in that direction. That said, if the AI suggests unfamiliar code or patterns, pause and ask follow-up questions. Don\'t copy or retype any code until every line is clear.',
    options: {
      'Ok, how should I prompt?': (e) => e.goTo('prompts')
    }
  }, {
    id: 'prompts',
    content: 'If we ask a short question like <i>"why doesn\'t my code work?"</i> AI models tend to solve your problem for you by default, but with the right prompt we can instead get them to help us grow as creative coders. The goal of this widget is to teach you how best to prompt models for this purpose and to do so quickly. We want it to help us, not do the work for us.',
    options: {
      'I see': (e) => e.goTo('struggle1')
    }
  }, {
    id: 'struggle1',
    content: 'Before you ask AI for help, try to solve it yourself. Struggling through a hard problem is key to learning, <a href="https://www.media.mit.edu/publications/your-brain-on-chatgpt/" target="_blank">recent research</a> suggests that early AI reliance can weaken understanding and memory, while late, targeted use can actually help reinforce what you’ve learned.',
    options: {
      'Too early? How can I tell?': (e) => e.goTo('struggle2'),
      'Ok, will do!': (e) => e.hide()
    }
  }, {
    id: 'struggle2',
    content: 'It\'s ok to turn to AI for help, but if you run into a new issue try to solve it yourself first. Start by isolating the problem, create a separate <a href="/sketch" target="_blank">sketch</a> with the least amount of code possible that still produces the same bug. Attempting to create an isolated example of the issue often helps you identify why it\'s happening, and if it doesn\'t, now you\'ve got a much simpler sketch to share with AI for help.',
    options: {
      'Ok, will do!': (e) => e.hide()
    }
  }, {
    id: 'copied-prompt',
    content: `Great, I've copied the prompt to your clipboard, you can paste it with <code>${utils.hotKey()} + V</code> into the prompt box of a web based LLM like <a href="https://chatgpt.com/" target="_blank">ChatGPT</a>, <a href="https://claude.ai/" target="_blank">Claude</a>, <a href="https://gemini.google.com/" target="_blank">Gemini</a> or the privacy concious <a href="https://lumo.proton.me/guest" target="_blank">Lumo</a>. Dont't forget to also download your code so you can attach it with your prompt.`,
    options: {
      'Ok, thanks!': (e) => e.hide()
    }
  }, {
    id: 'context',
    before: () => NNW.menu.switchFace('default'),
    content: 'It\'s important to give AI the right context up front. Without that, the model has to assume things about the level your at and the coding language your working in from the way you worded your question. If it guesses incorrectly the answer might be unhelpful or worse, it might <i>seem</i> helpful at first, but you could end up going down a conversational route that leads to a frustrating dead end.',
    options: {
      'dead end? It\'ll stop?': (e) => e.goTo('context2'),
      'I see': (e) => e.hide()
    }
  }, {
    id: 'context2',
    content: 'No, it\'ll always keep going, making assertions with naive confidence that has nothing to do with the issue you first asked it about. You\'ll get stuck in a <i>"It\'s still not working"</i> spiral of endless frustration. So it\'s very important we start the chat with the right context.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'question',
    before: () => NNW.menu.switchFace('default'),
    content: 'Here\'s where you\'ll ask your question or explain your issue. Use it as an excuse to practice the lingo you\'ve been learning by writing your question with proper coding terminology. Remember, LLMs respond to patterns in your text prompt, the more text with the right terminology the more likely it hones in on the right patterns and produces helpful results.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'ground-truth',
    before: () => NNW.menu.switchFace('default'),
    content: 'AI can "hallucinate," meaning it generates answers that sound correct but aren\'t. It doesn\'t actually verify facts or perform explicit tasks like counting or arithmetic, instead it predicts text based on patterns in its training data. Because of this, it can make mistakes when asked factual questions, simple math or other seemingly easy tasks.',
    options: {
      'math?': (e) => e.goTo('ground-truth1'),
      'facts?': (e) => e.goTo('ground-truth2'),
      'what about code?': (e) => e.goTo('ground-truth3')
    }
  }, {
    id: 'ground-truth1',
    before: () => NNW.menu.switchFace('default'),
    content: 'A classic example is asking <i>“How many r\'s are in strawberry?”</i>, the pattern in this particular sequence of tokens (pieces of words) suggests to the model that the answer should include an amount, so it will likely always give you a number, but not necessarily the right one. Because it\'s not actually counting letters, it\'s generating a likely-looking answer based on how similar questions are usually answered.',
    options: {
      'what about facts?': (e) => e.goTo('ground-truth2'),
      'what about code?': (e) => e.goTo('ground-truth3')
    }
  }, {
    id: 'ground-truth2',
    content: 'The same issue applies to factual questions. For example, there have been cases where AI generated legal citations to court cases that look convincing because they follow the pattern of a real citation (publication, author, date, etc.), but in reality don\'t exist.',
    options: {
      'what about math?': (e) => e.goTo('ground-truth1'),
      'what about code?': (e) => e.goTo('ground-truth3')
    }
  }, {
    id: 'ground-truth3',
    content: 'In code, this often shows up as made-up function names. For example, if you ask about creating a fuzzy guitar sound in Tone.js it might suggest something like <code>new Tone.Fuzz()</code> because it matches the pattern of the library\'s naming conventions, but in reality there is no "Fuzz" effect in Tone.js, the correct answer would be <code>new Tone.Distortion()</code>.',
    options: {
      'I see': (e) => e.goTo('ground-truth4')
    }
  }, {
    id: 'ground-truth4',
    content: 'To avoid this, it\'s best to explicitly mention the libraries you\'re using, not only so that it\'s response includes the use of this library, but also so that it uses it\'s Web search tool (built into most modern LLM chat bots) to look up the library\'s documentation and include that data in the prompt as a "source of truth". This minimizes (but doesn\'t guarantee) the likelyhood of hallucinations.',
    options: {
      'go it': (e) => e.hide()
    }
  }, {
    id: 'constraints',
    before: () => NNW.menu.switchFace('default'),
    content: 'AI chatbots are typically designed to give complete answers right away. While this can be efficient, it can also skip over the thinking process that leads to real understanding. By adding constraints to your prompts, our goal is to try and shift AI from a solution generator into more of a learning tool.',
    options: {
      'I see': (e) => e.hide()
    }
  }]
}
