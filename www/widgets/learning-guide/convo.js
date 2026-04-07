/* global WIDGETS utils NNE */
window.CONVOS['learning-guide'] = (self) => {
  const menuOpts = () => {
    return {
      'ok!': (e) => e.hide(),
      'Learning Guide?': (e) => e.goTo('nfo-lg'),
      'Coding Menu?': (e) => e.goTo('nfo-fm'),
      'Search Bar?': (e) => e.goTo('nfo-sb')
    }
  }

  return [
    {
      id: 'guide-open',
      graph: { id: 1, x: 25, y: 25 },
      content: 'Here you go! Click on my face when you need me!',
      options: {
        'thanks!': (e) => e.hide(),
        'how does this work?': (e) => e.goTo('explain')
      }
    },
    {
      id: 'toc',
      graph: { id: 2, x: 200, y: 25 },
      content: 'The <b>Hyperlinks</b> section is a the Learning Guie\'s <i>table of Contents</i>. Click on any item to jump to it, you can also scroll through the guide to explore each section.',
      options: {
        'thanks!': (e) => e.hide(),
        'how does this work?': (e) => e.goTo('explain')
      }
    },
    {
      id: 'explain',
      graph: { id: 3, x: 100, y: 200 },
      content: 'Scroll through the Learning Guide to find interactive tutorials, examples and references. If you\'d like to jump straight to coding your own sketch just click on my face and say <img src="images/menu/hi.png" class="learning-guide__d-icons"> anytime. You can also click on the <img src="images/menu/code.png" class="learning-guide__d-icons"> <b>Coding Menu</b>, or the <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> or the <img src="images/menu/search.png" class="learning-guide__d-icons"> <b>Search Bar</b>.',
      options: menuOpts()
    },
    {
      id: 'nfo-lg',
      graph: { id: 4, x: 100, y: 525 },
      content: `The <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> widget contains interactive tutorials, code demos, templates and references. You can also open the Learning Guide using the <code>${utils.hotKey()} + L</code> key.`,
      options: menuOpts()
    },
    {
      id: 'nfo-fm',
      graph: { id: 5, x: 100, y: 675 },
      content: `The <img src="images/menu/code.png" class="learning-guide__d-icons"> <b>Coding Menu</b> widget controls my code editor settings and other details having to do with your sketch. It also lets you connect me (login) to your GitHub so you can create and publish projects (or "repositories") to the World Wide Web. You can also open it using the <code>${utils.hotKey()} + ;</code> key (<i>${utils.hotKey()} semicolon</i>).`,
      options: menuOpts()
    },
    {
      id: 'nfo-sb',
      graph: { id: 6, x: 100, y: 825 },
      content: `The <img src="images/menu/search.png" class="learning-guide__d-icons"> <b>Search Bar</b> looks through all of the features, widgets and content in the studio. If you're not sure where to find something you came across earlier, the search bar's here to help. You can also open the Search using the <code>${utils.hotKey()} + '</code> key (<i>${utils.hotKey()} quote</i>).`,
      options: menuOpts()
    },
    {
      id: '<examples>',
      graph: { id: 7, x: 250, y: 825 },
      content: 'This widget contains a collection of interactive code demos you can explore and experiment with. In some cases I can walk you through the example and explain how it works.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: '<docs>',
      graph: { id: 8, x: 250, y: 525 },
      content: 'These widgets contain foundational info on the core web coding languages as well as appendices containing lists of all the core components for reference. These also include links to further documentation online.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: '<tutorials>',
      graph: { id: 9, x: 250, y: 675 },
      content: 'These are a collection of interactive hypermedia tutorials which will introduce you to both the craft and the culture of HTML and CSS. You can click the (i) to read more about each individual tutorial, or click (play) to launch right into it.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'js-intro',
      graph: { id: 10, x: 250, y: 200 },
      content: 'If you\'d like to read through a written guide, I can open the JavaScript Reference Guide for you, but I think the best way to learn the basics of JavaScript is with an example project. I suggest you jump right into the 10print Template, want me to guide you through it?',
      options: {
        'Ok, let\'s try it!': (e) => {
          e.hide()
          WIDGETS.load('template-projects', w => w.startGuide('js-10print'))
        },
        'I want to read the docs': (e) => {
          e.hide()
          WIDGETS.open('js-reference')
        },
        'never mind': (e) => e.hide()
      }
    },
    {
      id: 'coming-soon',
      graph: { id: 11, x: 50, y: 350 },
      content: '<b>This is Under Construction!</b> If you\'d like to help get this done, consider <a href="/docs" target="_blank">supporting us</a>! I\'m constantly evolving and always seeking financial support from individuals and institutions who benefit from open access to this platform and who support our mission!',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'coming-soon-units',
      graph: { id: 12, x: 200, y: 350 },
      content: 'My creators are still working on those docs, but in the meantime you can check out MDN\'s <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" target="_blank">CSS values and units</a> page for more info on that topic.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'confirm-convo-start',
      graph: { id: 13, x: 400, y: 100 },
      content: 'It appears you might be working on some code, you might want to save that before we get started with this lesson and I reset the editor.',
      options: {
        'ok, give me a sec': (e) => e.hide(),
        'that\'s ok, reset it': (e) => {
          NNE.code = utils.starterCode()
          utils.cancelAllNetitorUses('learning-guide')
          self.convo(self._tempConvo)
        }
      }
    },
    {
      id: 'ch-one-metaphors1',
      graph: { id: 14, x: 600, y: 100 },
      content: 'It\'s worth unpacking some of the language we use to discuss Artificial Intelligence, including the term itself. Are these systems actually "intelligent"? Not really, this word is being used as an <b style="text-decoration:underline">anthropomorphic metaphor</b>, to help give us a frame of reference. Sometimes these can help our understanding, but othertimes they can mislead us.',
      options: {
        'go on': (e) => {
          e.goTo('ch-one-metaphors4')
          self.updateAISlide('alan-turing')
        },
        'anthro-po-wha?': (e) => e.goTo('ch-one-metaphors2')
      }
    },
    {
      id: 'ch-one-metaphors4',
      graph: { id: 15, x: 600, y: 400 },
      content: 'One of the earliest and most influential examples of this kind of metaphorical thinking came from <a href="https://en.wikipedia.org/wiki/Alan_Turing" target="_blank">Alan Turing</a>, a British mathematician often called the father of computer science. In 1950, Turing published a paper that opened with a deceptively simple question: Can machines think?',
      options: {
        'go on': (e) => e.goTo('ch-one-metaphors5')
      }
    },
    {
      id: 'ch-one-metaphors2',
      graph: { id: 16, x: 725, y: 175 },
      content: 'Anthropomorphic metaphors are expressions that attribute human traits, emotions, or intentions to non-human entities. Algorithms aren\'t alive, they don\'t "think" or "reason", but saying <i>the algorithm "learns" from its mistakes</i> is a lot easier to grasp than <i>the algorithm adjusts its parameter weights based on a loss function</i>.',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-metaphors4')
          self.updateAISlide('alan-turing')
        },
        'weights? loss?': (e) => e.goTo('ch-one-metaphors3')
      }
    },
    {
      id: 'ch-one-metaphors3',
      graph: { id: 17, x: 725, y: 325 },
      content: 'We\'ll get to all the technical details later, right now I just want to make sure we understand the benefits as well as the dangers of using anthropomorphic metaphors to discuss and think about AI.',
      options: {
        ok: (e) => {
          e.goTo('ch-one-metaphors4')
          self.updateAISlide('alan-turing')
        }
      }
    },
    {
      id: 'ch-one-metaphors5',
      graph: { id: 18, x: 600, y: 525 },
      content: 'But Turing recognized this question was tangled up in vague definitions: what do we mean by "machine"? What do we mean by "think"? Rather than trying to answer it directly, he proposed replacing it with something more concrete. He called it the Imitation Game, though today we usually call it the <a href="https://en.wikipedia.org/wiki/Turing_test" target="_blank">Turing Test</a>.',
      options: {
        'ah yes, I\'m familiar': (e) => e.goTo('ch-one-metaphors7'),
        'what\'s the test?': (e) => e.goTo('ch-one-metaphors6')
      }
    },
    {
      id: 'ch-one-metaphors7',
      graph: { id: 19, x: 600, y: 750 },
      content: 'This is a useful lens for understanding why the language around AI matters so much. The Imitation Game is, at its core, a test of how well a system can get <i>us</i> to anthropomorphize <i>it</i>. If a machine can be convincingly "intelligent" does <i>it</i> pass the Turing Test, or did the human fail?',
      options: {
        'good point': (e) => e.goTo('ch-one-metaphors8')
      }
    },
    {
      id: 'ch-one-metaphors6',
      graph: { id: 20, x: 725, y: 650 },
      content: 'A human judge has a text-based conversation with two hidden participants: one human and one machine. If the judge can\'t reliably tell which is which, the machine passes. Notice what Turing did here, he sidestepped the question of whether machines actually <i>think</i>, and asked instead whether they could imitate thinking convincingly enough to fool someone.',
      options: {
        'I see': (e) => e.goTo('ch-one-metaphors7')
      }
    },
    {
      id: 'ch-one-metaphors8',
      graph: { id: 21, x: 600, y: 875 },
      content: 'Turing wasn\'t trying to encourage the creation of deceptive systems, he was pointing out that asking the question "is AI actually thinking?" is in fact less productive than asking "what can this thing do, and how easily does it fool us?"',
      options: {
        'I see': (e) => e.goTo('ch-one-metaphors9')
      }
    },
    {
      id: 'ch-one-metaphors9',
      graph: { id: 22, x: 600, y: 1000 },
      content: 'When we anthropomorphize lines of code like myself, it came make systems playful and more accessible. But I\'m obviously not here to fool anyone, no one expects me to be passing the Turing Test anytime soon.',
      options: {
        'ha, true': (e) => {
          e.goTo('ch-one-metaphors10')
          self.updateAISlide('quote-salvaggio')
        }
      }
    },
    {
      id: 'ch-one-metaphors10',
      graph: { id: 23, x: 600, y: 1125 },
      content: 'But when AI systems are advanced enough to fool us, these sorts of metahors can trick us into thinking the code is concious and has a will of its own. This can send us down an uninformed and dangerious line of inquirey.',
      options: {
        'like what?': (e) => e.goTo('ch-one-metaphors11')
      }
    },
    {
      id: 'ch-one-metaphors11',
      graph: { id: 24, x: 600, y: 1250 },
      content: 'We might ask <i>can AI feel pain?</i>, <i>should AI systems have rights?</i>, <i>should people be allowed to marry AI?</i>. Because advanced AI, like LLMs, are so convincing, it\'s no surprise to hear folks ask these questions. But if we take time to dig a little deeper into these systems, it becomes clear that these are the wrong questions.',
      options: {
        'I see': (e) => e.goTo('ch-one-metaphors15'),
        'dig deeper?': (e) => e.goTo('ch-one-metaphors12')
      }
    },
    {
      id: 'ch-one-metaphors15',
      graph: { id: 25, x: 775, y: 1375 },
      content: 'Anthropomorphizing tech isn\'t inherently misleading, it depends on what and how that\'s being done. I myself am an anthropomorphized algorithm, but because I\'m a <i>classical</i> system I don\'t think I\'m fooling anyone into thinking I\'m sentient. Which brings us to the next section: machine learning systems vs symbolic ones, like myself.',
      options: {
        'tell me more': (e) => {
          e.goTo('ch-one-ml1')
          self.updateAISlide('ml-vs-cai')
        }
      }
    },
    {
      id: 'ch-one-metaphors12',
      graph: { id: 26, x: 450, y: 1250 },
      content: 'We\'ll be diving much deeper throughout the notes and widgets in this guide, but I\'ll give you one example. Computers are deterministic systems, given the same input they always return the same output, but they can also simulate randomness. When we give a consumer facing AI system the same prompt they usually respond differently each time.',
      options: {
        'go on': (e) => e.goTo('ch-one-metaphors13')
      }
    },
    {
      id: 'ch-one-metaphors13',
      graph: { id: 27, x: 450, y: 1375 },
      content: 'This isn\'t because the AI\'s "mood" changed, or because it was "thinking" of something else when you repeated the same question. Behind the scenes there\'s a parameter, often called the "seed", this is a number used to inject randomness into each query.',
      options: {
        'I see': (e) => e.goTo('ch-one-metaphors14')
      }
    },
    {
      id: 'ch-one-metaphors14',
      graph: { id: 28, x: 450, y: 1500 },
      content: 'If in addition to your prompt you were also given the ability to choose the seed value, you would quickly realize that these systems aren\'t really "alive", because the same seed/prompt pair will always return the same output, which immediately destroys the illusion. Later we\'ll discuss AI tools that do give you this control.',
      options: {
        'I see': (e) => e.goTo('ch-one-metaphors15')
      }
    },
    {
      id: 'ch-one-ml1',
      graph: { id: 29, x: 1075, y: 100 },
      content: 'Before going any further, it\'s important to clarify the difference between <b style="text-decoration: underline">machine learning vs classical AI</b>. Ultimately, these are two different approaches for creating algorithms.',
      options: {
        'go on': (e) => {
          e.goTo('ch-one-ml2')
          self.updateAISlide('classical-bouncer')
        }
      }
    },
    {
      id: 'ch-one-ml2',
      graph: { id: 30, x: 1075, y: 225 },
      content: 'For most of computing history, if you wanted a program to do something, a human had to write the instructions. Every rule, every decision, every step, spelled out explicitly in code. Most programs were not anthropomorphized, but when they were we called them "AI".',
      options: {
        'I see': (e) => e.goTo('ch-one-ml3')
      }
    },
    {
      id: 'ch-one-ml3',
      graph: { id: 31, x: 1075, y: 350 },
      content: 'Like me! Each line of code, from the text in my speech bubbles to the logic that runs when you click my buttons, was written by a person. If my code was packaged with a different interface, like if I looked like an interactive <i>book</i> instead of a <i>bot</i>, you might not refer to me as AI.',
      options: {
        'i see': (e) => e.goTo('ch-one-ml5'),
        'different interface?': (e) => e.goTo('ch-one-ml4')
      }
    },
    {
      id: 'ch-one-ml5',
      graph: { id: 32, x: 1075, y: 475 },
      content: 'There are plenty more examples of classical AI throughout computer history, but what we call AI these days is the result of an entirely different sort of approach generally referred to as machine learning (ML).',
      options: {
        'ML?': (e) => {
          e.goTo('ch-one-ml10')
          self.updateAISlide('ml-bouncer')
        },
        'what\'s another example?': (e) => e.goTo('ch-one-ml6')
      }
    },
    {
      id: 'ch-one-ml4',
      graph: { id: 33, x: 1200, y: 475 },
      content: 'We\'ll discuss the importance and influence of graphical interfaces in more depth later, but for now consider a weather app. If the app simply said "Today\'s Forcast" in bold letters with a temperature below it, we probably wouldn\'t call it "AI", but if instead it displayed a face saying "I predict today\'s forcast will be..." all of a sudden it\'s "AI".',
      options: {
        'I see': (e) => e.goTo('ch-one-ml5')
      }
    },
    {
      id: 'ch-one-ml10',
      graph: { id: 34, x: 1075, y: 1000 },
      content: 'When you hear about AI in the news these days, they\'re likely talking about a program with an algorithm behind it that was created by a process called "machine learning" (ML). Instead of writing the rules yourself, you feed the system a large set of examples and let it figure out the patterns on its own.',
      options: {
        'the patterns?': (e) => e.goTo('ch-one-ml11')
      }
    },
    {
      id: 'ch-one-ml6',
      graph: { id: 35, x: 1200, y: 600 },
      content: 'Nearly all the video games you\'ve ever played are full of this type of AI. Today it\'s technically possible to create a video game where the NPCs (non-playable characters) are driven by LLMs, but historically all NPCs are examples of classical AI.',
      options: {
        'what\'s another example?': (e) => e.goTo('ch-one-ml7'),
        'what about ML?': (e) => {
          e.goTo('ch-one-ml10')
          self.updateAISlide('ml-bouncer')
        }
      }
    },
    {
      id: 'ch-one-ml7',
      graph: { id: 36, x: 1200, y: 750 },
      content: 'The iconic chess program <a href="https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)" target="_blank">Deep Blue</a> is another classic example. The engineers at IBM painstakingly programmed strategies, heuristics, and evaluation criteria. This was possible with chess, because even though it\'s complex, the rules and strategies are structured enough for humans to encode by hand.',
      options: {
        'go on': (e) => e.goTo('ch-one-ml8')
      }
    },
    {
      id: 'ch-one-ml8',
      graph: { id: 37, x: 1200, y: 875 },
      content: 'But a game like Go, with more possible board positions than atoms in the universe, would have been far too complex for that approach. It wasn\'t until 2016, when Google DeepMind trained a neural network called <a href="https://en.wikipedia.org/wiki/AlphaGo" target="_blank">AlphaGo</a> on millions of games, that a computer was finally able to beat a world champion Go player.',
      options: {
        'what\'s another example?': (e) => e.goTo('ch-one-ml9'),
        'what about ML?': (e) => {
          e.goTo('ch-one-ml10')
          self.updateAISlide('ml-bouncer')
        }
      }
    },
    {
      id: 'ch-one-ml9',
      graph: { id: 38, x: 1200, y: 1000 },
      content: 'Another example is EMI (Experiments in Musical Intelligence), a rule-based system programmed by <a href="https://en.wikipedia.org/wiki/David_Cope" target="_blank">David Cope</a> that recombines patterns from existing music. Instead of trainig on that data like modern AI, it used structured rules designed by Cope, demonstrating that convincing output doesn\'t require machine learning, just clever pattern recombination (we\'ll come back to this point in Chapter 4).',
      options: {
        'What about ML?': (e) => {
          e.goTo('ch-one-ml10')
          self.updateAISlide('ml-bouncer')
        }
      }
    },
    {
      id: 'ch-one-ml11',
      graph: { id: 39, x: 1075, y: 1125 },
      content: 'Finding patterns in data isn\'t new, but what makes ML distinct is that these systems improve on their own. It starts with something called a "neural network", a large web of tiny, connected, simple math functions called "neurons."',
      options: {
        'go on': (e) => e.goTo('ch-one-ml12')
      }
    },
    {
      id: 'ch-one-ml12',
      graph: { id: 40, x: 1075, y: 1250 },
      content: 'When we pass data into these neural networks it gets funneled through all the neurons in it\'s web of interconnected layers before outputing the result. Each neuron takes in a number, does a small calculation, and decides how much to pass along to the next layer, like a funnel that can be widened or narrowed to control what gets through.',
      options: {
        'I see': (e) => e.goTo('ch-one-ml13')
      }
    },
    {
      id: 'ch-one-ml13',
      graph: { id: 41, x: 1075, y: 1375 },
      content: 'When the network is first created, all of these funnels are sized randomly. Feed it an input, like a prompt, and the output will be nonsense. It\'s like handing someone a guitar that\'s never been tuned, you\'ll get sound, but it won\'t be music.',
      options: {
        'I see': (e) => e.goTo('ch-one-ml14')
      }
    },
    {
      id: 'ch-one-ml14',
      graph: { id: 42, x: 1075, y: 1500 },
      content: '"Training" is the tuning process. You give the network a goal, a massive dataset, and a way to measure how right/wrong it is. Then each time it gets something wrong, it adjusts those funnels slightly, widening some, narrowing others, so that next time the right signals get through and the wrong ones don\'t.',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-ml15')
          self.updateAISlide('ml-bouncer-trained')
        }
      }
    },
    {
      id: 'ch-one-ml15',
      graph: { id: 43, x: 1075, y: 1625 },
      content: 'Repeat this millions of times and the random values inside each neuron, which we call "weights and biases" or just "parameters", gradually become meaningful ones. The result is what we call a trained "model", an AI algorithm created not by writing lines of code by hand, but by emerging from data.',
      options: {
        wow: (e) => e.goTo('ch-one-ml16')
      }
    },
    {
      id: 'ch-one-ml16',
      graph: { id: 44, x: 1075, y: 1750 },
      content: 'In the last chapter of this guide we\'ll explain this process in much more detail by creating our own neural network and training it from scratch. At this stage, it\'s most important that we generally understand the core concepts and the difference between ML algorithms and the traditional hand-written ones.',
      options: {
        'remind me again?': (e) => e.goTo('ch-one-ml17'),
        'ok, let\'s move on': (e) => {
          e.goTo('ch-one-ml20')
          self.updateAISlide('neural-net-svg')
        }
      }
    },
    {
      id: 'ch-one-ml17',
      graph: { id: 45, x: 1025, y: 1875 },
      content: 'Instead of writing an algorithm from scratch, with all the rules behind how it should process input and return output explicitly defined by the programmer, ML provides a process for creating those rules automatically. This process starts with a "neural network", a simple (but often large) web of connected "neurons".',
      options: {
        'ok...': (e) => e.goTo('ch-one-ml18')
      }
    },
    {
      id: 'ch-one-ml20',
      graph: { id: 46, x: 1275, y: 1800 },
      content: 'Today we see these fine-tuned neural networks, the trained algorithm or "model", being used in various contexts. Often they\'re anthropomorphized like chatbots, othertimes they\'re embeded in other systems, like a facial recognition model used to unlock your phone or the spam-filtering model behind your email inbox.',
      options: {
        'I see': (e) => e.goTo('ch-one-ml21')
      }
    },
    {
      id: 'ch-one-ml18',
      graph: { id: 47, x: 900, y: 1975 },
      content: 'Each "neuron" contains the same simple equation, with different values for it\'s "parameters". A number enters the neuron, gets multiplied by its "weight", added to its "bias", and then squeezed through a funnel that decides how much of the result to pass along to the next neuron.',
      options: {
        'ok...': (e) => e.goTo('ch-one-ml19')
      }
    },
    {
      id: 'ch-one-ml19',
      graph: { id: 48, x: 1025, y: 2075 },
      content: 'At first these "parameters," the "weight" and "bias" numbers inside each neuron, are all random. But through the process of "training", feeding the network massive amounts of data and letting it adjust those values each time it gets something wrong, they gradually become meaningful.',
      options: {
        'ok...': (e) => e.goTo('ch-one-ml19-b')
      }
    },
    {
      id: 'ch-one-ml21',
      graph: { id: 49, x: 1400, y: 1800 },
      content: 'I should mention that neither machine learning or classical AI is inherently better than the other, there are pros and cons to both approaches.',
      options: {
        'how so?': (e) => e.goTo('ch-one-ml22')
      }
    },
    {
      id: 'ch-one-ml22',
      graph: { id: 50, x: 1400, y: 1650 },
      content: 'For example, modern AI systems can have billions of parameters, the weights and biases inside every neuron. We can test that the model works, but the parameters themselves still look like random numbers to us. This is why we call them "black boxes."',
      options: {
        'I\'ve heard': (e) => e.goTo('ch-one-ml23')
      }
    },
    {
      id: 'ch-one-ml23',
      graph: { id: 51, x: 1400, y: 1500 },
      content: 'In contrast, classical AI is much more transparent, you can trace exactly why it made a decision, because a human wrote that logic. Understanding what\'s happening inside a neural network is so difficult that it\'s become its own field of research, known as <a href="https://en.wikipedia.org/wiki/Explainable_artificial_intelligence" target="_blank">interpretability</a>.',
      options: {
        'important work': (e) => e.goTo('ch-one-ml24')
      }
    },
    {
      id: 'ch-one-ml24',
      graph: { id: 52, x: 1400, y: 1350 },
      content: 'On the other hand, classical AI struggles with messiness. It works well in structured, well-defined domains, like databases or logic puzzles, where the rules are clear. But the real world is full of things that are hard to pin down in explicit rules.',
      options: {
        'like what?': (e) => e.goTo('ch-one-ml25')
      }
    },
    {
      id: 'ch-one-ml25',
      graph: { id: 53, x: 1400, y: 1200 },
      content: 'Take computer vision, for example. How would you write rules by hand to recognize a cat in a photo? You might start with "has pointy ears and whiskers," but what about a cat seen from behind, or half-hidden under a blanket, or in a dark room?',
      options: {
        'sounds tricky': (e) => e.goTo('ch-one-ml26')
      }
    },
    {
      id: 'ch-one-ml26',
      graph: { id: 54, x: 1400, y: 1050 },
      content: 'The variations of possible cat images are endless, and no set of hand-written rules could account for them all. ML systems, on the other hand, can look at millions of photos of cats and learn to recognize and generalize the patterns in those photos.',
      options: {
        impressive: (e) => e.goTo('ch-one-ml27')
      }
    },
    {
      id: 'ch-one-ml27',
      graph: { id: 55, x: 1400, y: 900 },
      content: 'In practice, modern systems often blend both. A self-driving car might use ML for perception (recognizing a stop sign from pixel data) and more classical planning algorithms for deciding which route to take. The boundary between the two isn\'t always sharp, and the most effective systems tend to draw from both approaches.',
      options: {
        'where should I start?': (e) => {
          e.goTo('ch-one-process1')
          self.updateAISlide('creative-process')
        }
      }
    },
    {
      id: 'ch-one-ml19-b',
      graph: { id: 56, x: 1150, y: 1975 },
      content: 'What starts as random noise becomes a finely tuned system capable of recognizing patterns no human could have programmed by hand.',
      options: {
        'got it': (e) => {
          e.goTo('ch-one-ml20')
          self.updateAISlide('neural-net-svg')
        },
        'come again?': (e) => e.goTo('ch-one-ml17')
      }
    },
    {
      id: 'ch-one-process1',
      graph: { id: 57, x: 1800, y: 100 },
      content: 'There are a number of different ways we could incorporate <b style="text-decoration:underline">AI into our creative process</b>. Here I\'m specifically referring to Machine Learning (ML), artificial neural networks molded in response to patterns found in large data sets.',
      options: {
        'go on': (e) => e.goTo('ch-one-process2')
      }
    },
    {
      id: 'ch-one-process2',
      graph: { id: 58, x: 1800, y: 225 },
      content: 'This approach to creating algorithms has proven useful in a variety of different domains. In later chapters we\'ll learn how to incorporate local models in our code and even craft neural networks from scratch, opening up the possability of creating AI models which are themselves artworks.',
      options: {
        oh: (e) => e.goTo('ch-one-process3')
      }
    },
    {
      id: 'ch-one-process3',
      graph: { id: 59, x: 1800, y: 350 },
      content: 'But we\'ll start with the most common use case: using AI as a coding assistant. Specifically, we\'ll learn how to use Large Language Models (LLMs), a form of "generative" AI that synthesizes text by predicting what most likely comes next given the text you feed it.',
      options: {
        'got it': (e) => e.goTo('ch-one-process10'),
        'synthesize?': (e) => {
          e.goTo('ch-one-process4')
          self.updateAISlide('rnn')
        }
      }
    },
    {
      id: 'ch-one-process10',
      graph: { id: 60, x: 1850, y: 925 },
      content: 'Importantly, we won\'t be using LLMs to write code for us, even though they can. This studio is for folks learning the craft of creative coding, and so in the next chapter we\'ll learn how to prompt LLMs in a way that helps us learn rather than bypasses the learning.',
      options: {
        'got it': (e) => e.goTo('ch-one-process18'),
        'why not code for me?': (e) => e.goTo('ch-one-process11')
      }
    },
    {
      id: 'ch-one-process4',
      graph: { id: 61, x: 1975, y: 350 },
      content: 'Yes, it\'s important to remember that inside a neural network there are no thoughts or ideas, just billions of parameters, numbers that reflect statistical relationships between words. It can\'t "think" or "reason" in any real sense. It operates entirely in terms of probability, predicting one word at a time.',
      options: {
        'and that works?': (e) => e.goTo('ch-one-process5')
      }
    },
    {
      id: 'ch-one-process5',
      graph: { id: 62, x: 1975, y: 475 },
      content: 'That it works as well as it does is honestly kind of a miracle (or mystery?). Early language models like Recurrent Neural Networks (RNNs) could learn enough patterns to produce real words and sentence structures, but the results were barely coherent.',
      options: {
        'really?': (e) => e.goTo('ch-one-process5b')
      }
    },
    {
      id: 'ch-one-process5b',
      graph: { id: 63, x: 2100, y: 475 },
      content: 'Try the RNN I\'ve placed in the Learning Guide, press the button to start training and I\'ll show the model loads of Shakespeare sonnets for it to learn from. Stop the training at any point to see how it\'s doing. You\'ll notice it takes a while before it can generate actual english words, but surprisingly, eventually it does!',
      options: {
        'wow!': (e) => e.goTo('ch-one-process6')
      }
    },
    {
      id: 'ch-one-process6',
      graph: { id: 64, x: 1975, y: 600 },
      content: 'Eventually, researchers figured out that if you connected the neurons in just the right way, used enough of them (hence the "Large" in Large Language Model), and trained the network on a massive amount of text data, something remarkable happened.',
      options: {
        'yea?': (e) => e.goTo('ch-one-process7')
      }
    },
    {
      id: 'ch-one-process7',
      graph: { id: 65, x: 1975, y: 725 },
      content: 'The model could synthesize text that wasn\'t just grammatically correct, but genuinely coherent, capable of holding an argument, explaining a concept, or even writing code that actually runs. All by predicting one "token" (piece of a word) at a time.',
      options: {
        wow: (e) => {
          e.goTo('ch-one-process10')
          self.updateAISlide('creative-process')
        },
        'what about hallucinations?': (e) => {
          e.goTo('ch-one-process8')
        }
      }
    },
    {
      id: 'ch-one-process8',
      graph: { id: 66, x: 2100, y: 850 },
      content: 'In a sense, it\'s all hallucination. Every response is synthesized text, and some (or most) of it just happens to be accurate. Once you understand that the model is only ever predicting what token comes next, hallucinations stop being surprising.',
      options: {
        'I see': (e) => e.goTo('ch-one-process9')
      }
    },
    {
      id: 'ch-one-process9',
      graph: { id: 67, x: 2100, y: 975 },
      content: 'It\'s not looking anything up. It\'s not reasoning through a problem. It\'s just predicting the next token. When we understand this and take time to experiment with these sytems, we start to develop an instinct for when to trust the output and when to double-check it.',
      options: {
        'got it': (e) => {
          e.goTo('ch-one-process10')
          self.updateAISlide('creative-process')
        }
      }
    },
    {
      id: 'ch-one-process18',
      graph: { id: 68, x: 2025, y: 1375 },
      content: 'Our goal is to become fluent in the craft of creative coding, not simply so we can express ourselves in this medium, but perhaps more importantly so that we can imagine new possibilities for it. When you understand what code can do, you start having ideas that actually leverage what\'s unique about this medium.',
      options: {
        'I see': (e) => e.goTo('ch-one-process21'),
        'can\'t AI generate ideas?': (e) => e.goTo('ch-one-process19')
      }
    },
    {
      id: 'ch-one-process11',
      graph: { id: 69, x: 1825, y: 1125 },
      content: 'If you were an experienced developer, building commercial software, having AI take over some of the coding does come with some efficiency gains but also risk. For that developer I would have a different set of recommendations.',
      options: {
        'I see': (e) => e.goTo('ch-one-process15'),
        'like what?': (e) => e.goTo('ch-one-process12')
      }
    },
    {
      id: 'ch-one-process15',
      graph: { id: 70, x: 1825, y: 1350 },
      content: 'Agentic engineering is an evolving practice. AI-generated code has been found to introduce security vulnerabilities that aren\'t obvious at a glance, accumulate technical debt that makes projects harder to maintain over time, and even slow developers down without them noticing.',
      options: {
        'I see': (e) => e.goTo('ch-one-process18'),
        'slow down?!': (e) => e.goTo('ch-one-process16')
      }
    },
    {
      id: 'ch-one-process12',
      graph: { id: 71, x: 1675, y: 1125 },
      content: 'An experienced developer knows how to architect software and can produce a detailed plan for an AI to follow. This can include coding components, but also writing docs and running tests. This practice, generally referred to as <a href="https://www.ibm.com/think/topics/agentic-engineering" target="_blank">agentic engineering</a>, is different from "vibe coding" but still comes with certain risks.',
      options: {
        'what risks?': (e) => e.goTo('ch-one-process15'),
        'vibe coding?': (e) => e.goTo('ch-one-process13')
      }
    },
    {
      id: 'ch-one-process13',
      graph: { id: 72, x: 1675, y: 1275 },
      content: '"Vibe coding" is when you describe an idea and ask AI to generate all the code without really reviewing or understanding it. It\'s typically done by non-developers who need a quick prototype. It\'s great for conveying a concept (maybe to collaborators), but rarely good enough for publication.',
      options: {
        'I see': (e) => e.goTo('ch-one-process14')
      }
    },
    {
      id: 'ch-one-process14',
      graph: { id: 73, x: 1675, y: 1400 },
      content: 'Agentic engineering is different because the developer remains in charge. They understand the code, they design the architecture, and they use AI to speed up the execution of a plan they could have carried out themselves. Still, even this can be risky.',
      options: {
        'how so?': (e) => e.goTo('ch-one-process15')
      }
    },
    {
      id: 'ch-one-process16',
      graph: { id: 74, x: 1825, y: 1475 },
      content: 'Yes, surprisingly, using AI to code isn\'t always faster. A <a href="https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" target="_blank">2025 study</a> by METR found that experienced developers actually took 19% longer to complete tasks when using AI tools, all while believing they were working 20% faster.',
      options: {
        wow: (e) => e.goTo('ch-one-process17')
      }
    },
    {
      id: 'ch-one-process17',
      graph: { id: 75, x: 1825, y: 1600 },
      content: 'At the same time, <a href="https://www.technologyreview.com/2025/12/15/1128352/rise-of-ai-coding-developers-2026/" target="_blank">MIT Technology Review</a> has noted that "For simpler tasks like restructuring the code base and writing tests, AI-powered workflows have achieved speedups of up to 90%." So it all depends, the details matter.',
      options: {
        'I see': (e) => e.goTo('ch-one-process18')
      }
    },
    {
      id: 'ch-one-process21',
      graph: { id: 76, x: 2325, y: 1400 },
      content: 'Being fluent in code doesn\'t inherently make you an expert (that takes time) but it does mean you can collaborate effectively with experts, because you share a common understanding of what\'s possible and what isn\'t. And if you do develop deep expertise, you can unlock all of that potential yourself.',
      options: {
        'I see': (e) => e.goTo('ch-one-process22')
      }
    },
    {
      id: 'ch-one-process19',
      graph: { id: 77, x: 2125, y: 1575 },
      content: 'It can, but keep in mind that because LLMs synthesize from patterns in existing data, their output tends toward the average. For code, that\'s often exactly what you want. The most efficient way to parse JSON data is probably the same way everyone else does it.',
      options: {
        ok: (e) => e.goTo('ch-one-process20')
      }
    },
    {
      id: 'ch-one-process20',
      graph: { id: 78, x: 2275, y: 1575 },
      content: 'But for ideas? The average is the last thing you want. We\'re after work that pushes the cultural conversation forward, not rehashes what\'s already been done. AI generated <i>ideas</i> tend to be fairly derivative, which makes sense when you understand how they work.',
      options: {
        'I see': (e) => e.goTo('ch-one-process21')
      }
    },
    {
      id: 'ch-one-process22',
      graph: { id: 79, x: 2325, y: 1250 },
      content: 'Incorporating generative AI into your creative workflow is ultimately about finding the right balance, using it to help you create rather than letting it create for you. The trick is maintaining your agency, which isn\'t always easy when these tools are designed to do as much as possible on your behalf.',
      options: {
        right: (e) => e.goTo('ch-one-process23')
      }
    },
    {
      id: 'ch-one-process23',
      graph: { id: 80, x: 2325, y: 1100 },
      content: 'This balance isn\'t just shaped by your own choices, it\'s also shaped by the tools themselves. In particular the app\'s user interfaces which package and present generative AI models.',
      options: {
        'user interfaces?': (e) => {
          e.goTo('ch-one-ui1')
          self.updateAISlide('ui')
        }
      }
    },
    {
      id: 'ch-one-ui1',
      graph: { id: 81, x: 2500, y: 100 },
      content: 'Throughout most of this guide we\'ll be interacting with AI systems directly through code, but before we do, let\'s look at the <b style="text-decoration: underline">user interfaces</b> people most commonly interact with them through today: the chatbot.',
      options: {
        ok: (e) => e.goTo('ch-one-ui2')
      }
    },
    {
      id: 'ch-one-ui2',
      graph: { id: 82, x: 2500, y: 225 },
      content: 'This is another example of the anthropomorphic metaphors we discussed earlier, but this time the metaphors aren\'t just in the words we use to talk about AI, they\'re built into the user interface itself.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui3')
      }
    },
    {
      id: 'ch-one-ui3',
      graph: { id: 83, x: 2500, y: 350 },
      content: 'Typically this is a prompt box followed by a back-and-forth "conversation" between you and the "chatbot." Beyond not being a very imaginative interface for a Large Language Model (LLM), it suggests a very specific sort of relationship you should have with this system.',
      options: {
        'what kind?': (e) => e.goTo('ch-one-ui4')
      }
    },
    {
      id: 'ch-one-ui4',
      graph: { id: 84, x: 2500, y: 475 },
      content: 'One that frames the LLM less like a <i>tool</i> and more like an <i>assistant</i>, less like something you might use to create work, and more like something designed to do your work for you. I\'ll give you an example.',
      options: {
        ok: (e) => e.goTo('ch-one-ui5')
      }
    },
    {
      id: 'ch-one-ui5',
      graph: { id: 85, x: 2500, y: 600 },
      content: 'Say you\'re a writer, maybe a poet or lyricist, and you\'d like to incorporate an LLM into your writing process. Using a chatbot, that might look like asking for an initial draft, asking for feedback on something you\'ve written, or maybe just asking for ideas in general.',
      options: {
        'right?': (e) => e.goTo('ch-one-ui6')
      }
    },
    {
      id: 'ch-one-ui6',
      graph: { id: 86, x: 2500, y: 725 },
      content: 'This makes sense, it\'s how you\'d engage with a human collaborator. But remember, LLMs aren\'t thinking about your work. They\'re predicting the most likely next words based on patterns in its trainig data. Which means its "advice" will be generic and its "suggestions" derivative by design.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui7')
      }
    },
    {
      id: 'ch-one-ui7',
      graph: { id: 87, x: 2500, y: 850 },
      content: 'But what if we created an entirely different interface for the LLM? One that leverages this pattern recognition as a strength, not a weakness. One that doesn\'t have it pretend to be a conversational assistant and instead presents it as it really is: an algorithmic tool.',
      options: {
        'how so?': (e) => {
          e.goTo('ch-one-ui8')
          self.updateAISlide('textfx2')
        }
      }
    },
    {
      id: 'ch-one-ui8',
      graph: { id: 88, x: 2500, y: 975 },
      content: 'This is exactly what the rapper Lupe Fiasco imagined when he began collaborating with creative technologists at Google to create an LLM-powered "set of tools that specifically focus on the writing process of creating raps." The result was the app <a href="https://textfx.withgoogle.com/" target="_blank">TextFX</a>.',
      options: {
        'cool!': (e) => e.goTo('ch-one-ui9')
      }
    },
    {
      id: 'ch-one-ui9',
      graph: { id: 89, x: 2500, y: 1100 },
      content: 'Despite being powered by the same LLM as Google\'s Gemini, this novel interface creates a drastically different relationship between the user and the LLM, one that presents it less as a human replacement and more as a creative tool.',
      options: {
        interesting: (e) => {
          e.goTo('ch-one-ui10')
          self.updateAISlide('textfx')
        }
      }
    },
    {
      id: 'ch-one-ui10',
      graph: { id: 90, x: 2500, y: 1225 },
      content: 'As Lupe explains in the <a href="https://textfx.withgoogle.com/" target="_blank">TextFX</a> intro page, "[it] won\'t write Raps for you. Instead, these tools are designed to empower your writing, provide creative possibilities and help you see text in new ways. Like with any tool, you still need to bring your own creativity and skillset to them."',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-ui11')
          self.updateAISlide('ui-compare')
        }
      }
    },
    {
      id: 'ch-one-ui11',
      graph: { id: 91, x: 2500, y: 1350 },
      content: 'I\'m focusing on LLMs here because that\'s what we\'ll experiment with in the next couple of chapters, but this critique applies to the interfaces of other types of models as well. Consider these two image generation apps: OpenAI\'s DALL-E and <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#stable-diffusion-web-ui" target="_blank">AUTOMATIC1111</a> (A1111) for Stable Diffusion.',
      options: {
        ok: (e) => e.goTo('ch-one-ui12')
      }
    },
    {
      id: 'ch-one-ui12',
      graph: { id: 92, x: 2500, y: 1475 },
      content: 'Both apps are powered by the same type of model, an image diffusion model that creates pictures from text descriptions. The difference is entirely in the interface.',
      options: {
        'go on': (e) => e.goTo('ch-one-ui13')
      }
    },
    {
      id: 'ch-one-ui13',
      graph: { id: 93, x: 2500, y: 1600 },
      content: 'DALL-E presents you with a prompt box and a button. You type what you want, and it gives you a result. A1111, on the other hand, gives you far more control: not just a prompt describing what you want, but a negative prompt describing what you don\'t want, control over which denoising algorithm is used, how many passes it makes, and much more.',
      options: {
        'go on': (e) => {
          e.goTo('ch-one-ui18')
          self.updateAISlide('ui-compare')
        },
        'denoising?': (e) => {
          e.goTo('ch-one-ui14')
          self.updateAISlide('sd-steps')
        }
      }
    },
    {
      id: 'ch-one-ui18',
      graph: { id: 94, x: 2750, y: 1600 },
      content: 'One of the most revealing settings A1111 exposes is the seed value, a number that determines the starting noise. Lock the seed, and you\'ll get the exact same image every time you run the same prompt. This turns the model into a proper experimentation tool: you can make tiny tweaks to your prompt or settings and see precisely what effect each change has.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui19'),
        'starting noise?': (e) => {
          e.goTo('ch-one-ui14')
          self.updateAISlide('sd-steps')
        }
      }
    },
    {
      id: 'ch-one-ui14',
      graph: { id: 95, x: 2500, y: 1775 },
      content: 'Diffusion models work by starting with pure noise (imagine colorful television static) and gradually removing that noise, step by step, until an image emerges. This is the "denoising" process. The prompt you provide guides the direction of that denoising, nudging the noise toward an image that matches your description.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui15')
      }
    },
    {
      id: 'ch-one-ui15',
      graph: { id: 96, x: 2600, y: 1925 },
      content: 'With DALL-E the type and number of denoising passes is chosen for you, which is unfortunate. Some interesting things happen when we reduce the number of passes to what OpenAI might consider sub-optimal.',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-ui18')
          self.updateAISlide('ui-compare')
        },
        'like what?': (e) => e.goTo('ch-one-ui16')
      }
    },
    {
      id: 'ch-one-ui16',
      graph: { id: 97, x: 2725, y: 1925 },
      content: 'Here\'s an example of an image generated with Stable Diffusion using A1111 with the prompt "ocean sunrise", with the default setting of 20 "sampling steps" or denoising passes. Adjust the slider below the image to see what the same prompt looks like with less denoising.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui17')
      }
    },
    {
      id: 'ch-one-ui17',
      graph: { id: 98, x: 2850, y: 1925 },
      content: 'Personally I think some of the images generated from much fewer passes would make for a more interesting album cover than the image generated from the default number of 20 passes.',
      options: {
        'yea, i get that': (e) => {
          e.goTo('ch-one-ui18')
          self.updateAISlide('ui-compare')
        }
      }
    },
    {
      id: 'ch-one-ui19',
      graph: { id: 99, x: 2750, y: 1475 },
      content: 'It also demystifies the model. When apps like DALL-E randomize the seed behind the scenes, each result feels spontaneous, as if the model is making creative choices. But when we\'re given an interface to control this value, we quickly realize how deterministic these systems are. Any illusion of the model being "conscious" quickly breaks down soon as we lock that seed.',
      options: {
        'so A1111 is better?': (e) => e.goTo('ch-one-ui20')
      }
    },
    {
      id: 'ch-one-ui20',
      graph: { id: 100, x: 2750, y: 1350 },
      content: 'I don\'t mean to imply that A1111 is the perfect tool, only that it provides more control over the process than DALL-E. As Nick discusses in the Orientation tutorial, all graphical user interfaces inherently limit you to the parameters the creator of that interface thought to expose.',
      options: {
        'got it': (e) => e.goTo('ch-one-ui22'),
        'orientation?': (e) => e.goTo('ch-one-ui21')
      }
    },
    {
      id: 'ch-one-ui22',
      graph: { id: 101, x: 2750, y: 1200 },
      content: 'To some extent, all creative tools come with inherent limitations. For this reason, if you do decide to use AI apps like these in your work, it\'s smart to experiment with many different kinds.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui27'),
        'limits to all tools?': (e) => e.goTo('ch-one-ui23')
      }
    },
    {
      id: 'ch-one-ui21',
      graph: { id: 102, x: 2875, y: 1350 },
      content: 'Oh have you not gone through it yet? That\'s the first interactive tutorial listed in my <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b>. Definitely worth a watch later.',
      options: {
        'will do': (e) => e.goTo('ch-one-ui22')
      }
    },
    {
      id: 'ch-one-ui27',
      graph: { id: 103, x: 2750, y: 925 },
      content: 'For example, if you\'re a documentary filmmaker you may be tempted by a commercial AI product that claims to edit all your video interviews for you, perhaps anthropomorphized as an "AI video editor." But this sort of product robs you of much of your creative agency and could influence the final product in ways you might not realize.',
      options: {
        oh: (e) => e.goTo('ch-one-ui28')
      }
    },
    {
      id: 'ch-one-ui23',
      graph: { id: 104, x: 2875, y: 1200 },
      content: 'Take the piano for instance, the go-to instrument for many composers and musicians. Seemingly limitless, but it\'s built around 12-tone equal temperament, which means entire worlds of pitch, like microtones or the subtle bends of a human voice, are simply unavailable.',
      options: {
        'go on': (e) => e.goTo('ch-one-ui25'),
        '12-tone what?': (e) => e.goTo('ch-one-ui24')
      }
    },
    {
      id: 'ch-one-ui25',
      graph: { id: 105, x: 2875, y: 1050 },
      content: 'Most people never notice this limitation, because the piano is so embedded in Western music that its constraints feel like the natural boundaries of music itself. The limitations of popular tools/instruments and the influence it has on us are often invisible to us.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui26')
      }
    },
    {
      id: 'ch-one-ui24',
      graph: { id: 106, x: 3000, y: 1200 },
      content: '12-tone equal temperament is a tuning system that divides the octave into twelve evenly spaced notes, the white and black keys on a piano. It\'s the standard in Western music, but just one of many possible systems. Much of the music across the Middle East, South Asia, and East Asia uses intervals that fall between those keys, notes a piano literally can not play.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui25')
      }
    },
    {
      id: 'ch-one-ui26',
      graph: { id: 107, x: 2875, y: 925 },
      content: 'Which is what makes a tool\'s user interface worth critically examining, and one of the best ways to do that is by comparing it to others.',
      options: {
        'got it': (e) => e.goTo('ch-one-ui27')
      }
    },
    {
      id: 'ch-one-ui28',
      graph: { id: 108, x: 2750, y: 800 },
      content: 'Instead, you could use a collection of AI tools: one to remove background noise from the recording, another to transcribe the interview, another to help verify claims the subject made, another to edit out gaps of silence and produce a rough cut you could use as a starting point for your edit.',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-ui29')
          self.updateAISlide('quote-google')
        }
      }
    },
    {
      id: 'ch-one-ui29',
      graph: { id: 109, x: 2750, y: 675 },
      content: 'Using a number of different AI tools to help with different parts of the process keeps you in creative control. Outsourcing the entire project to a single AI "agent" does not.',
      options: {
        right: (e) => e.goTo('ch-one-ui30')
      }
    },
    {
      id: 'ch-one-ui30',
      graph: { id: 110, x: 2750, y: 550 },
      content: 'The design of an app\'s user interface, like all technology, encodes the biases and worldviews of its creators. DALL-E, with its single prompt box, represents a vision of AI as a replacement for visual artists. Whereas A1111, with its array of controls and customizable options, represents a vision of AI as a tool to help visual artists.',
      options: {
        'I see': (e) => e.goTo('ch-one-ui31')
      }
    },
    {
      id: 'ch-one-ui31',
      graph: { id: 111, x: 2750, y: 425 },
      content: 'These interfaces, and the biases they represent, have a lot to do with their creators\' intentions for the software, which may or may not align with your own. One way to gauge that alignment is to look at the business model driving the app\'s development.',
      options: {
        'business model?': (e) => {
          e.goTo('ch-one-biz1')
          self.updateAISlide('biz-model')
        }
      }
    },
    {
      id: 'ch-one-biz1',
      graph: { id: 112, x: 3200, y: 100 },
      content: 'Understanding the business model behind the tech we use shines a light on important, though often overlooked, aspects of the tech which we might want to consider before deciding to use it. For example, the most dominant business model behind "big tech" products today is surveillance capitalism.',
      options: {
        'oh dear': (e) => e.goTo('ch-one-biz2')
      }
    },
    {
      id: 'ch-one-biz2',
      graph: { id: 113, x: 3200, y: 225 },
      content: 'Rather than paying for a service with money, you pay with your attention and your data. This is a topic we touch on throughout the notes and guides in this studio, so I won\'t go into too much depth here, but as they say: if you\'re not paying for it with money, you\'re likely not the customer, you\'re the product.',
      options: {
        yikes: (e) => e.goTo('ch-one-biz3')
      }
    },
    {
      id: 'ch-one-biz3',
      graph: { id: 114, x: 3200, y: 350 },
      content: 'OpenAI, like many big tech companies before them, built their user base while saying they would never run ads, but now they\'ve started rolling out <a href="https://techcrunch.com/2026/02/09/chatgpt-rolls-out-ads/" target="_blank">ads on ChatGPT</a>. This means recording and analyzing our interactions (our thoughts, work, anything we share or type), for patterns and insights they can package and sell to advertisers.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz4')
      }
    },
    {
      id: 'ch-one-biz4',
      graph: { id: 115, x: 3200, y: 475 },
      content: 'This isn\'t inherent in the technology. A company building an AI chatbot can monetize their service while protecting user privacy. A good example is <a href="https://lumo.proton.me/about" target="_blank">Lumo</a>, by <a href="https://proton.me/about" target="_blank">Proton</a>, a privacy-focused chatbot that keeps no logs of your conversations and uses zero-access encryption so that not even Proton itself can read your chats.',
      options: {
        'how do they make money?': (e) => e.goTo('ch-one-biz5')
      }
    },
    {
      id: 'ch-one-biz5',
      graph: { id: 116, x: 3200, y: 600 },
      content: 'Great question! They do it the old-fashioned way: charging for their service. They do provide a free tier, as they do with many of their products, which is subsidized by paid subscribers who get access to more storage and resources.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz6')
      }
    },
    {
      id: 'ch-one-biz6',
      graph: { id: 117, x: 3200, y: 725 },
      content: 'Proton\'s products prove that you can make money, while also offering a free tier, without compromising user privacy and security. I could imagine a number of other ways to fund AI products, but this isn\'t a business lesson. My point is simply that learning how a service makes money surfaces important factors that affect us.',
      options: {
        'got it': (e) => e.goTo('ch-one-biz17'),
        'what other funding?': (e) => e.goTo('ch-one-biz7')
      }
    },
    {
      id: 'ch-one-biz17',
      graph: { id: 118, x: 3500, y: 975 },
      content: 'Let\'s talk about open source, because this is another factor with major implications for us. When software is open source it\'s freely accessible, not only (or necessarily) in terms of cost, but more importantly in terms of agency. Open source software makes the code itself available, allowing us to inspect and modify it.',
      options: {
        'go on': (e) => {
          e.goTo('ch-one-biz18')
          self.updateAISlide('dalle')
        }
      }
    },
    {
      id: 'ch-one-biz7',
      graph: { id: 119, x: 3200, y: 850 },
      content: 'Well, another obvious one is donations, which fund nonprofits (that may also rely on grants or government support). Many popular open-source projects, though not all, are funded this way.',
      options: {
        'open source?': (e) => e.goTo('ch-one-biz17'),
        'ok, besides donations?': (e) => e.goTo('ch-one-biz8')
      }
    },
    {
      id: 'ch-one-biz8',
      graph: { id: 120, x: 3325, y: 1100 },
      content: 'What about ads? Not third-party, exploitative, data-gathering targeted ads. I\'m talking DIY ads, like the kind <a href="https://www.wired.com/story/can-killing-cookies-save-journalism/" target="_blank">used by Nederlandse Publieke Omroep</a> (the Dutch public broadcaster), who dropped third-party trackers in favor of self-hosted contextual ads and saw their ad revenue increase significantly as a result.',
      options: {
        'got it': (e) => e.goTo('ch-one-biz17'),
        'ok, what else?': (e) => e.goTo('ch-one-biz9')
      }
    },
    {
      id: 'ch-one-biz9',
      graph: { id: 121, x: 3450, y: 1225 },
      content: 'How about bartering resources? AI requires lots of compute. If that compute could be efficiently distributed, I could imagine a service where you paid not with money, or your attention, or your data, but by sharing your computer\'s resources (while using the app) with a network of users.',
      options: {
        'I get it now': (e) => e.goTo('ch-one-biz17'),
        'that wouldn\'t work': (e) => e.goTo('ch-one-biz10'),
        'ok, what else?': (e) => e.goTo('ch-one-biz14')
      }
    },
    {
      id: 'ch-one-biz14',
      graph: { id: 122, x: 3775, y: 1175 },
      content: 'Ok, what about AI as a public service? We take for granted that search engines, tasked with helping us find information, should be provided by private companies fueled by ads. But what if the public library took over that job? What if our internet service provider got replaced with a public utility?',
      options: {
        'trust the government?': (e) => e.goTo('ch-one-biz15')
      }
    },
    {
      id: 'ch-one-biz10',
      graph: { id: 123, x: 3450, y: 1375 },
      content: 'Not with that attitude! There are plenty of examples of apps that have worked this way, like <a href="https://en.wikipedia.org/wiki/SETI%40home" target="_blank">SETI@home</a> by the Berkeley SETI Research Center. Rather than paying for large amounts of compute, they created a screensaver supporters could run at home so that when they weren\'t using their computers, SETI could use them to analyze radio signals from outer space!',
      options: {
        oh: (e) => e.goTo('ch-one-biz11')
      }
    },
    {
      id: 'ch-one-biz11',
      graph: { id: 124, x: 3575, y: 1375 },
      content: 'Or how some online publications have experimented with running crypto miners on their sites instead of ads, so their readers pay by sharing compute resources (while reading an article) to mine cryptocurrency. I\'m not promoting crypto, just offering it as another example of distributed computing.',
      options: {
        'who tried that?': (e) => e.goTo('ch-one-biz12'),
        'ok, what else': (e) => e.goTo('ch-one-biz14')
      }
    },
    {
      id: 'ch-one-biz12',
      graph: { id: 125, x: 3725, y: 1375 },
      content: 'Like <a href="www.creativeapplications.net/" target="_blank">Creative Applications</a>, who ran an experiment trading visitors\' CPU for an ad-free environment using a JavaScript miner for the Monero blockchain. You can <a href="https://www.creativeapplications.net/mining-for-xmr/" target="_blank">read about it here</a>. These sorts of cryptocurrency alternatives should be made transparent to visitors, and they are admittedly a bit radical, but inspiring.',
      options: {
        'I get it now': (e) => e.goTo('ch-one-biz17'),
        'ok, what else': (e) => e.goTo('ch-one-biz14')
      }
    },
    {
      id: 'ch-one-biz15',
      graph: { id: 126, x: 3900, y: 1175 },
      content: 'I\'m not suggesting the government would do a better job than Google, just helping you think outside that corporate box and realize that other paradigms are possible.',
      options: {
        'ok, what else?': (e) => e.goTo('ch-one-biz16')
      }
    },
    {
      id: 'ch-one-biz16',
      graph: { id: 127, x: 3900, y: 1050 },
      content: 'I think we\'re getting sidetracked. The point is there are plenty of ways to sustain an online product that don\'t require mass surveillance and exploitation of its users.',
      options: {
        'fair point': (e) => e.goTo('ch-one-biz17')
      }
    },
    {
      id: 'ch-one-biz18',
      graph: { id: 128, x: 3500, y: 850 },
      content: 'Consider the image generation tools I mentioned in the <b style="text-decoration:underline">user interfaces</b> section. OpenAI\'s DALL-E is closed source. The company started as a nonprofit dedicated to developing AI in the open (hence the name), before pivoting to a closed-source company not long before they created DALL-E.',
      options: {
        'right?': (e) => {
          e.goTo('ch-one-biz19')
          self.updateAISlide('a1111')
        }
      }
    },
    {
      id: 'ch-one-biz19',
      graph: { id: 129, x: 3500, y: 725 },
      content: 'I mentioned earlier how one of the open-source alternatives, <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#stable-diffusion-web-ui" target="_blank">A1111</a>  for Stable Diffusion, provides much more creative control over the AI model than DALL-E\'s singular prompt box. But those controls weren\'t created by the same folks who trained the model.',
      options: {
        'who trained it?': (e) => e.goTo('ch-one-biz20')
      }
    },
    {
      id: 'ch-one-biz21',
      graph: { id: 130, x: 3500, y: 475 },
      content: 'In fact, because Stable Diffusion is open source, there have been a number of different apps built for it. Maybe you don\'t like the Adobe-esque UI of A1111, with its menus, fields, and sliders. Maybe you prefer a node-based UI, like you\'d find in Blender, TouchDesigner, or Max/MSP. If so, you might try <a href="https://github.com/Comfy-Org/ComfyUI?tab=readme-ov-file#comfyui" target="_blank">ComfyUI</a> instead.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz22')
      }
    },
    {
      id: 'ch-one-biz22',
      graph: { id: 131, x: 3500, y: 350 },
      content: 'Because both the model and the apps that package it are open source, you not only have a range of options to choose from but could also remix them or create your own. The creators of Stable Diffusion still make money, just in other ways.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz25'),
        'how so?': (e) => e.goTo('ch-one-biz23')
      }
    },
    {
      id: 'ch-one-biz25',
      graph: { id: 132, x: 3700, y: 100 },
      content: 'Like many other open-source companies, you can pay them if you\'d like their help, but you could also download the model for free and make use of it yourself in whatever creative and unconventional way you\'d like.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz26')
      }
    },
    {
      id: 'ch-one-biz23',
      graph: { id: 133, x: 3500, y: 225 },
      content: '<a href="https://ommer-lab.com/" target="_blank">CompVis</a> is an academic research group at LMU Munich, funded through the university and research grants. <a href="https://runwayml.com/" target="_blank">Runway</a> is a commercial company that builds creative tools on top of the research. And <a href="https://stability.ai/" target="_blank">Stability AI</a> makes money not by selling the model directly, but through API access, enterprise licensing, and hosting services.',
      options: {
        'I see': (e) => e.goTo('ch-one-biz24')
      }
    },
    {
      id: 'ch-one-biz24',
      graph: { id: 134, x: 3500, y: 100 },
      content: 'Essentially, you can download the model for free, but if you want someone else to run it for you at scale, that\'s where they charge. It\'s a common pattern in open source: the code is free, the convenience is not.',
      options: {
        'got it': (e) => e.goTo('ch-one-biz26')
      }
    },
    {
      id: 'ch-one-biz26',
      graph: { id: 135, x: 3700, y: 300 },
      content: 'Open-source models come with a lot of freedom, but just because you can use one however you\'d like and wrap it in whatever user interface you can imagine doesn\'t mean you have full control over how it works. You weren\'t the one who trained the model, after all.',
      options: {
        'right, follow the data!': (e) => {
          e.goTo('ch-one-data1')
          self.updateAISlide('train-data')
        }
      }
    },
    {
      id: 'ch-one-biz20',
      graph: { id: 136, x: 3500, y: 600 },
      content: '<a href="https://en.wikipedia.org/wiki/Stable_Diffusion" target="_blank">Stable Diffusion</a>, the AI model itself, was a collaborative effort led by researchers from CompVis (LMU Munich) and Runway, with a compute donation from Stability AI. The user interface for it, the A1111 WebUI we discussed earlier, was created by an entirely separate group of <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/graphs/contributors" target="_blank">open-source developers</a>.',
      options: {
        'I see': (e) => {
          e.goTo('ch-one-biz21')
          self.updateAISlide('comfyui')
        }
      }
    },
    {
      id: 'ch-one-data1',
      graph: { id: 137, x: 4050, y: 100 },
      content: 'Because these algorithms are "trained" into existance, not coded by hand, one of the most important steps in creating an AI model is curating the <b style="text-decoration: underline">training data</b>. For example, maybe you\'re familiar with the issue around "bias" and AI?',
      options: {
        'of course': (e) => e.goTo('ch-one-data8'),
        'no?': (e) => e.goTo('ch-one-data2')
      }
    },
    {
      id: 'ch-one-data8',
      graph: { id: 138, x: 4050, y: 425 },
      content: 'Incidents like Google mislabeling Black folks have led some to call the company, or even the model itself, "racist." But as we\'ve discussed, anthropomorphic metaphors can misdirect. When we understand how these systems work, the more productive question isn\'t "is AI racist?", it\'s "should we be training a model on this data in the first place?"',
      options: {
        'go on': (e) => e.goTo('ch-one-data9'),
        'Google racism incident?': (e) => e.goTo('ch-one-data3')
      }
    },
    {
      id: 'ch-one-data2',
      graph: { id: 139, x: 4175, y: 100 },
      content: 'When we say an AI model is "biased," we mean it reflects patterns in its training data that can lead to problematic outputs. For example, if a facial recognition model is trained mostly on photos of light-skinned faces, it will perform poorly on darker-skinned faces. Like what happened to Google Photos when they first introduced AI sorting.',
      options: {
        'yea, I\'ve heard': (e) => e.goTo('ch-one-data7'),
        'Google Photos?': (e) => e.goTo('ch-one-data3')
      }
    },
    {
      id: 'ch-one-data7',
      graph: { id: 140, x: 4275, y: 325 },
      content: 'Because image classification models were among the first developed in machine learning, image and facial recognition became one of the earliest use cases and thus one of the first examples of models failing due to bias. But there are loads of other examples from this early period.',
      options: {
        'I see': (e) => e.goTo('ch-one-data8')
      }
    },
    {
      id: 'ch-one-data3',
      graph: { id: 141, x: 4300, y: 100 },
      content: 'Back in 2015, when Google Photos introduced AI image tagging, a user named <a href="https://www.bbc.com/news/technology-33347866" target="_blank">Jacky Alciné discovered</a> that photos of him and a friend, both Black, had been labeled as "gorillas." The incident became a widely cited example of AI bias.',
      options: {
        yikes: (e) => e.goTo('ch-one-data4')
      }
    },
    {
      id: 'ch-one-data4',
      graph: { id: 142, x: 4425, y: 225 },
      content: 'It happened because the system had been trained on data that didn\'t adequately represent darker skin tones, so it failed to correctly classify human faces in those cases. This led to public backlash and pressure on Google to "fix the bug."',
      options: {
        'of course': (e) => e.goTo('ch-one-data5')
      }
    },
    {
      id: 'ch-one-data5',
      graph: { id: 143, x: 4425, y: 350 },
      content: 'When this incident occurred, most of the public had never heard of "machine learning" or "AI", these were early days, so they didn\'t understand that Google couldn\'t just "fix" the algorithm by editing some code. They would need to retrain the entire model, a very time-consuming and costly endeavor.',
      options: {
        'what did they do?': (e) => e.goTo('ch-one-data6')
      }
    },
    {
      id: 'ch-one-data6',
      graph: { id: 144, x: 4425, y: 475 },
      content: 'Instead, Google simply blocked the words "gorilla," "chimpanzee," "monkey," and all related tags from the system entirely. Essentially making it "gorilla-blind." Nearly a decade later, that fix remains in place, and it has remained <a href="https://www.wired.com/story/when-it-comes-to-gorillas-google-photos-remains-blind/" target="_blank">a cautionary tale</a> ever since.',
      options: {
        'I see': (e) => e.goTo('ch-one-data7')
      }
    },
    {
      id: 'ch-one-data9',
      graph: { id: 145, x: 4050, y: 550 },
      content: 'In 2016, ProPublica published a landmark investigation called <a href="https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing" target="_blank">Machine Bias</a> which examined a risk-scoring algorithm called COMPAS, used in courtrooms across the country to predict whether a defendant was likely to commit future crimes. Their analysis found that Black defendants were twice as likely to be incorrectly labeled as high risk compared to white defendants.',
      options: {
        'go on': (e) => e.goTo('ch-one-data10')
      }
    },
    {
      id: 'ch-one-data10',
      graph: { id: 146, x: 4050, y: 675 },
      content: 'The model had been trained on historical criminal justice data, data shaped by decades of racial disparities in policing, sentencing, and incarceration. The model itself isn\'t racist, the system is, and the model becomes like a mirror, a reflection of that systemic racism.',
      options: {
        'I see': (e) => e.goTo('ch-one-data11')
      }
    },
    {
      id: 'ch-one-data11',
      graph: { id: 147, x: 4050, y: 800 },
      content: 'Some bias problems can be improved; image recognition has gotten much better as datasets have become more representative. But when the data itself is a product of systemic inequality, no amount of tuning will fix it. When the stakes are as high as someone\'s freedom, it\'s likely best to keep AI out of it entirely.',
      options: {
        'got it': (e) => e.goTo('ch-one-data12')
      }
    },
    {
      id: 'ch-one-data12',
      graph: { id: 148, x: 4175, y: 800 },
      content: 'But bias isn\'t always a problem to be solved. In creative contexts, like generative AI, a dataset\'s <i>bias</i> is essentially its <i>style</i>. The same pattern finding mechanism that encodes systemic inequality in a criminal justice model can encode a particular aesthetic sensibility in a creative one.',
      options: {
        oh: (e) => e.goTo('ch-one-data13')
      }
    },
    {
      id: 'ch-one-data13',
      graph: { id: 149, x: 4300, y: 800 },
      content: 'For artists who train or fine-tune their own models, curating a dataset is itself a creative act, a way of encoding a particular sensibility into the system. For some artists who fundamentally understand this aspect of machine learning, the act of curating the data itself becomes the art.',
      options: {
        'I see': (e) => e.goTo('ch-one-data16'),
        'data curation as art?': (e) => e.goTo('ch-one-data14')
      }
    },
    {
      id: 'ch-one-data16',
      graph: { id: 150, x: 4300, y: 950 },
      content: 'That said, for artists who aren\'t as directly involved in AI, machine learning has become a source of real tension. Their work has been scraped from the internet and used to train models without their consent, effectively encoding their style into systems they have no control over.',
      options: {
        'I\'ve heard': (e) => e.goTo('ch-one-data17')
      }
    },
    {
      id: 'ch-one-data14',
      graph: { id: 151, x: 4450, y: 800 },
      content: 'Yes! One example is Caroline Sinders\' <a href="https://carolinesinders.com/feminist-data-set/" target="_blank">Feminist Data Set</a>, an ongoing art project that treats data collection itself as an artistic and political act, gathering feminist essays, interviews, and artworks through public workshops.',
      options: {
        interesting: (e) => e.goTo('ch-one-data15')
      }
    },
    {
      id: 'ch-one-data15',
      graph: { id: 152, x: 4450, y: 950 },
      content: 'Then there\'s Mimi Ọnụọha\'s <a href="https://mimi-onuoha-9s0o.squarespace.com/the-library-of-missing-datasets" target="_blank">Library of Missing Datasets</a> which takes the opposite approach. The work is a filing cabinet of empty folders, each labeled with a dataset that should exist but doesn\'t, revealing what society has chosen not to measure.',
      options: {
        'I see': (e) => e.goTo('ch-one-data16')
      }
    },
    {
      id: 'ch-one-data17',
      graph: { id: 153, x: 4300, y: 1075 },
      content: 'This has led to a wave of lawsuits against AI companies, and while I\'m designed to help support artists, I don\'t think copyright litigation is the most strategic response. The reality is that many of the models being sued today could just as easily be trained on legally sourced data, leaving artists feeling just as displaced but with no one left to sue.',
      options: {
        'I see': (e) => e.goTo('ch-one-data25'),
        'what should artists do?': (e) => e.goTo('ch-one-data18')
      }
    },
    {
      id: 'ch-one-data24',
      graph: { id: 154, x: 4425, y: 1700 },
      content: 'The frustration artists are feeling about generative AI is understandable, but if they lead with claims of intellectual property, they may quickly find themselves hitting a hypocritical dead-end.',
      options: {
        'I see': (e) => e.goTo('ch-one-data25')
      }
    },
    {
      id: 'ch-one-data18',
      graph: { id: 155, x: 4425, y: 1200 },
      content: 'It\'s important to remember that all artists copy. They study, borrow, and build on the work and styles that came before them. AI developers will argue that their models are doing the same thing, creating new works "inspired" by others.',
      options: {
        'go on': (e) => e.goTo('ch-one-data19')
      }
    },
    {
      id: 'ch-one-data19',
      graph: { id: 156, x: 4425, y: 1325 },
      content: 'But to say that machine learning is doing the same thing is to make that anthropomorphic mistake again. AI is not an artist. It\'s not inherently creative. It doesn\'t study your work and develop a point of view, it encodes statistical patterns from data and in the case of generative AI, learns to reproduce them.',
      options: {
        'I see': (e) => e.goTo('ch-one-data24'),
        'not creative? move 37!': (e) => e.goTo('ch-one-data20')
      }
    },
    {
      id: 'ch-one-data20',
      graph: { id: 157, x: 4550, y: 1325 },
      content: 'Ah yes, the infamous Move 37. During <a href="https://en.wikipedia.org/wiki/AlphaGo" target="_blank">AlphaGo</a>\'s 2016 match against world champion Lee Sedol, the AI made a move so unexpected that commentators thought it was a mistake, until it turned out to be brilliant! It\'s one of the most cited examples of AI "creativity."',
      options: {
        'exactly!': (e) => e.goTo('ch-one-data21')
      }
    },
    {
      id: 'ch-one-data21',
      graph: { id: 158, x: 4550, y: 1450 },
      content: 'But let\'s look at what actually happened. AlphaGo was trained with extraordinary specificity on one thing: the game of Go. Through millions of games, it explored the space of possible moves so thoroughly that it found some no human had discovered in thousands of years of play.',
      options: {
        'go on': (e) => e.goTo('ch-one-data22')
      }
    },
    {
      id: 'ch-one-data22',
      graph: { id: 159, x: 4550, y: 1575 },
      content: 'That\'s remarkable, but it\'s not <i>creativity</i> in the way we usually mean it. It\'s more like <i>discovery</i>, a hyper-focused, sped-up search through possibilities that were always there, but hadn\'t been discovered by a human player... yet.',
      options: {
        'I see': (e) => e.goTo('ch-one-data23')
      }
    },
    {
      id: 'ch-one-data23',
      graph: { id: 160, x: 4550, y: 1700 },
      content: 'If we avoid anthropomorphizing AlphaGo as a <i>competitor</i> we can see it for what it is, a <i>discovery tool</i>. Go players didn\'t quit after Move 37, they studied it and leveled up. Just like <a href="https://en.wikipedia.org/wiki/AlphaFold" target="_blank">AlphaFold</a> isn\'t replacing scientists, it\'s helping them make discoveries they couldn\'t have made alone.',
      options: {
        'got it': (e) => e.goTo('ch-one-data24')
      }
    },
    {
      id: 'ch-one-data25',
      graph: { id: 161, x: 4300, y: 1825 },
      content: 'Instead they should ask "who controls the model and who is it for?" As we\'ve discussed, there\'s a big difference between open-source tools built to empower artists and commercial products designed to replace them.',
      options: {
        'got it': (e) => e.goTo('ch-one-data26')
      }
    },
    {
      id: 'ch-one-data26',
      graph: { id: 162, x: 4300, y: 1950 },
      content: 'An important theme I hope you\'re starting to pick up on at this point is that understanding how these systems actually work, from the training data to the user interface, is key, whether we choose to criticize AI or creatively  embrace it (or, ideally, a bit of both).',
      options: {
        'I see': (e) => e.goTo('ch-one-data27')
      }
    },
    {
      id: 'ch-one-data27',
      graph: { id: 163, x: 4300, y: 2075 },
      content: 'You don\'t have to be a machine learning expert. You just need to be literate enough not to be fooled by anthropomorphic metaphors, sensationalized headlines, or marketing copy.',
      options: {
        right: (e) => e.goTo('ch-one-data28')
      }
    },
    {
      id: 'ch-one-data28',
      graph: { id: 164, x: 4425, y: 2075 },
      content: 'When it comes to the data, there are some important questions you should always ask: Where did it come from? Who collected it and why? How was it filtered, by who? Who gave consent and who didn\'t? What\'s included and what\'s missing?',
      options: {
        'I see': (e) => e.goTo('ch-one-data29')
      }
    },
    {
      id: 'ch-one-data29',
      graph: { id: 165, x: 4550, y: 2075 },
      content: 'Sometimes the answers are provided for us. In 2018, AI researcher Timnit Gebru and colleagues proposed "<a href="https://arxiv.org/abs/1803.09010" target="_blank">Datasheets for Datasets</a>", standardized documents, inspired by datasheets in the electronics industry, that accompany a dataset and describe its motivation, composition, collection process, and recommended uses.',
      options: {
        interesting: (e) => e.goTo('ch-one-data30')
      }
    },
    {
      id: 'ch-one-data30',
      graph: { id: 166, x: 4675, y: 2075 },
      content: 'A related effort, "<a href="https://arxiv.org/abs/1810.03993" target="_blank">Model Cards for Model Reporting</a>" was proposed in 2019 by Margaret Mitchell, Timnit Gebru, and others. Like a nutrition label for AI, model cards document the model itself, rather than just the data it was trained on.',
      options: {
        'like what?': (e) => e.goTo('ch-one-data31')
      }
    },
    {
      id: 'ch-one-data31',
      graph: { id: 167, x: 4800, y: 2075 },
      content: 'Model cards include information like its intended use cases, how it performs across different demographic groups, its known limitations, and practical details like the model\'s size. Of course knowing this information isn\'t the same as understanding it\'s implications.',
      options: {
        'implications?': (e) => {
          e.goTo('ch-one-size1')
          self.updateAISlide('size')
        }
      }
    },
    {
      id: 'ch-one-size1',
      graph: { id: 168, x: 4900, y: 100 },
      content: 'Perhaps you\'ve heard about AI\'s impact on the environment, the heavy power consumption, the water needed to cool these systems, the strain on local resources, and you\'ve concluded that AI is bad for the environment.',
      options: {
        'I\'ve heard': (e) => e.goTo('ch-one-size2')
      }
    },
    {
      id: 'ch-one-size2',
      graph: { id: 169, x: 4900, y: 225 },
      content: 'But that conclusion conflates the technology with the scale at which a handful of companies have chosen to deploy it. Machine learning itself isn\'t inherently resource-hungry. You could instead train and run models on your laptop, want me to show you?',
      options: {
        'ok!': (e) => {
          e.goTo('ch-one-size3')
          self.updateAISlide('rnn')
        }
      }
    },
    {
      id: 'ch-one-size3',
      graph: { id: 170, x: 4900, y: 350 },
      content: 'The model behind this UI isn\'t an LLM, it\'s a small Recurrent Neural Network (RNN), an early type of language model. It has two controls: one to toggle training and one to synthesize text. Before you start training, try clicking synthesize, you\'ll see the output is complete gibberish. That\'s the untrained model, all random parameters, no patterns learned yet.',
      options: {
        ok: (e) => e.goTo('ch-one-size4')
      }
    },
    {
      id: 'ch-one-size4',
      graph: { id: 171, x: 4900, y: 475 },
      content: 'Now start training. Behind the scenes, the model is learning from a corpus of Shakespeare\'s sonnets, adjusting its weights and biases with each pass through the data. You\'ll notice the output evolving from nonsense, to something that resembles words and eventually to text that sounds like Shakespeare.',
      options: {
        'I see': (e) => e.goTo('ch-one-size5')
      }
    },
    {
      id: 'ch-one-size5',
      graph: { id: 172, x: 4900, y: 600 },
      content: 'The environmental cost people worry about comes from doing this same process at an enormously larger scale, models with trillions of parameters, trained on the entire internet, in massive data centers filled with specialized hardware.',
      options: {
        'what about this RNN?': (e) => e.goTo('ch-one-size6')
      }
    },
    {
      id: 'ch-one-size6',
      graph: { id: 173, x: 4900, y: 725 },
      content: 'Our RNN, by contrast, has about 12,000 parameters and is training on nothing but Shakespeare\'s sonnets. Same fundamental process, vastly different scale, and the implications of that scale go beyond energy consumption.',
      options: {
        'like what?': (e) => e.goTo('ch-one-size7')
      }
    },
    {
      id: 'ch-one-size7',
      graph: { id: 174, x: 4900, y: 850 },
      content: 'The fact that we can run a model directly on our computer also means our data stays on our computer. We\'re not sending anything back and forth to a data center run by a company that is very likely recording and analyzing everything we feed it.',
      options: {
        'good point! what else?': (e) => e.goTo('ch-one-size8')
      }
    },
    {
      id: 'ch-one-size8',
      graph: { id: 175, x: 4900, y: 975 },
      content: 'It also means we can build these models directly into our projects. Rather than relying on a third-party API (with usage limits, costs, restrictions) we can embed the model right in our code and include it as part of the work itself. In Chapter 5 of my AI Notes I\'ll show you a few demos where we do exactly that.',
      options: {
        'cool!': (e) => e.goTo('ch-one-size9')
      }
    },
    {
      id: 'ch-one-size9',
      graph: { id: 176, x: 4900, y: 1100 },
      content: 'Our local Shakespeare RNN might not seem that impressive, but not every model needs trillions of parameters to be useful. There are all sorts of smaller models that work remarkably well, from audio models trained to produce new musical timbres to visual models that can track our bodies, which I\'ll demo in Chapter 5.',
      options: {
        'so why are LLMs so big?': (e) => e.goTo('ch-one-size10')
      }
    },
    {
      id: 'ch-one-size10',
      graph: { id: 177, x: 4900, y: 1225 },
      content: 'LLMs are so large because at that scale, they can do a bit of everything: write code, summarize legal documents, answer trivia questions. But that generality is a design choice driven by very corporate goals: these companies want one product that serves the widest possible audience, because they want all of us using the same model... theirs.',
      options: {
        'I see': (e) => e.goTo('ch-one-size11')
      }
    },
    {
      id: 'ch-one-size11',
      graph: { id: 178, x: 4900, y: 1350 },
      content: 'But as artists, using the same model as everyone else might not actually be what we want. Early language models like RNNs couldn\'t write essays or pass the bar exam, but the short, strange fragments they produced had a poetic quality all their own.',
      options: {
        'I see': (e) => e.goTo('ch-one-size12')
      }
    },
    {
      id: 'ch-one-size12',
      graph: { id: 179, x: 4900, y: 1475 },
      content: 'Artists found them genuinely inspiring precisely because they were imperfect. Ths is what Google\'s <a href="https://www.youtube.com/watch?v=iXTG8ZiLs1s" target="_blank">Precursors to a Digital Muse</a> project explored, using smaller language models not as replacements for writers, but as tools to help them see language differently and get over writer\'s block.',
      options: {
        interesting: (e) => e.goTo('ch-one-size13')
      }
    },
    {
      id: 'ch-one-size13',
      graph: { id: 180, x: 4900, y: 1600 },
      content: 'Sometimes smaller, crappier models are better. Not only because they\'re more energy efficient, or because we can include them directly in our code, or because they protect our privacy. Sometimes they\'re better precisely because they\'re crappy.',
      options: {
        'ha! thanks': (e) => {
          e.hide()
          self.slide.updateSlide(self.theAIOpts)
        }
      }
    }
  ]
}
