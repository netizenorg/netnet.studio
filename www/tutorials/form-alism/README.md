# *Form*-alism
## the Web as a new artistic medium

For many artists, the Web was a means to an end. As we discussed in the last tutorial, for [irational.org](https://anthology.rhizome.org/communication-creates-conflict) (Heath Bunting, Kayle Brandon, Rachel Baker, etc.) it was a tool for "hacktivist" intervention, for others like [Shu Lea Cheang](https://anthology.rhizome.org/brandon) it was a new means to "explore the construction and perception of identity" (Tribe/Jana) and for others, like [Miranda July and Harrell Fletcher](https://en.wikipedia.org/wiki/Learning_to_Love_You_More) a space to experiment with new forms of collaboration and participatory art. But the Web was also a new medium and for many artists, discovering, and perhaps also defining, what that meant was the most exciting part. What would be the Web's inherent features? it's aesthetics? it's dynamics? it's conventions? tropes? cliches? strengths? weaknesses? In this tutorial we'll look at a couple of different responses to this question by early net artists: jodi.org and "Form Art".


## jodi.org

> in 1993, at the start of the "dot com" boom, two European artists, Joan Heemskerk and Dirk Paesmans, paid a visit to California's Silicon Valley. When they returned home, they created jodi.org, a Web-site-as-art-work whose scrambled green text and flashing images seem to deconstruct the visual language of the Web. Heemskerk and Paesmans remixed found images and HTML scripts much as Dada artists played with the photographic imagery and typography of magazines and newspapers. Jodi.org changed the way many people think about the Internet, demonstrating that it didn't just provide a new way to publish information; it could also be an art medium like oil painting, photography, or video. Like other works of New Media art, jodi.org exploited an emerging technology for artistic purposes. —<i>Rachel Greene (from "Web Work")</i>.


No has influenced the aesthetic of Internet art more than jodi.org. That's an opinion of course, but it's not a difficult argument to make. From minimalist ASCII art made only from text and distributed via emails, to maximalist desktop performances encompassing as many apps as their operating system could handle, jodi.org managed to keep this aesthetic chaotically consistent.

And though browsing their work feels like perusing pure pandemonium, there's a consistent thematic thread running through their oeuvre. Whether their creating video game mods or authoring mysterious bot like social media profiles, their work is persistently asking: what is the true nature of the digital medium and what is (or should be) our relationship to it?

I could go on, but I'll let jodi.org explain it themselves.

[![jodi.org](images/jodi.png)](https://netnet.studio/api/video/jodi-intro-a.mp4)

It's worth noting how rare, and somewhat bizarre, it is to hear jodi.org speak about their work so candidly. jodi.org have rarely ever done interviews, and when they have they've often been over e-mail, consistently mostly of incomprehensible noisy glitch ASCII art. They've intentionally avoided writing a proper artist statement or artist bio (the kind every artist is forced to awkwardly write in the third person)

This carefully crafted online persona has always been a very intentional part of their practice, and as Internet artist Rafaël Rozendaal explained in <a href="https://youtu.be/YuxLGvkg-3k" target="_blank">his video tour of jodi.org's work</a>, it's also reflected in the way they've chosen to share their work on their main homepage, which is also their collective name, <a href="http://jodi.org" target="_blank">jodi.org </a>

> Most artists start with a homepage with a resume and information, maybe a picture of the artist, and a list of works organized by category, and jodi never did that. They always said the web is a medium for art, it's not a medium for documentation" —<i>Rafaël Rozendaal</i>

And so, they've largely left it up to new media art curators and theorists to analyze their work, and as Dirk alluded to in in the video, few works of net.art have been written about more than their piece <i>wwwwwwwww.jodi.org</i> (1995) aka the "misconfigured ASCII drawing".

>The front page is confusing, repetitive, discordant and alphanumeric, but the compositional effects are not what they seem: for behind this web page lies source code which reveals a cascade of traditional images and diagrams that are almost scientific or astrological. [...] Hiding coherent images in source code seems playful and riddling, a means of separating instructions (the HTML) from the completed task (the front page). This surreptitious divide of the browser is accomplished by radicalizing the source code into the pictorial, and radicalizing the executed task into the unreadable. —<i>Rachel Greene (from "Internet Art")</i>.

This is one of many examples where jodi.org brings the code to the foreground. As Rachel Green described in her book <i>Internet Art</i>, this piece flips the traditional relationship between code input and rendered output. Where typically it's the former (the code) which is opaque to most netizens and the latter (the rendered page) which is "readable", here jodi.org turns our expectations upside down, as they often do.

And while turning our exceptions upside down is classic jodi.org, this wasn't necessarily what jodi.org had set out to do as Dirk explains...

[![something wrong](images/jodi-ascii.png)](https://netnet.studio/api/video/jodi-intro-b.mp4)

Initially, they were actually working on an ASCII art drawing, a popular sub-genre of new media art at the time. It was meant to be a mysterious pseudo-scientific looking diagram, the first of many mysterious pages which you begin to discover by clicking on it (the entire drawing is a giant link).

But after making a mistake in their HTML code, what they got instead was abstract ASCII gibberish. As we discussed in the last tutorial, jodi.org is known for embracing their mistakes rather than "fixing them". In this case they felt the broken drawing helped add to the mystery, not detract from it, and so they kept it.

Another interesting point Dirk makes is how they were concerned about how people might react, they were worried they might be crossing a line. From today's perspective it might be hard to imagine why anyone might think it would be unethical to upload a playful and abstract piece like this to the Web.

But in 1995, the most common way to get anything to appear on your personal computer was to either insert a floppy disk you physically acquired from someone, or whatever you programmed yourself. For most folks, the Web was the first time anything appeared on their screen they didn't necessarily intend to put there themselves.

In this context, jodi.org's work often shocked and terrified netizens that worried their (very expensive) computers had caught a virus or been hacked! When you consider the fact jodi.org often modeled their aesthetic on computer viruses it's not surprising they received a lot of complaints like this.

![email of complaint](images/jodi-email.png)

And though the web might no longer be what it was in 1995, it's exciting to see that even all these years later, when unsuspecting netizens stumble upon jodi.org's work today, it still manages to evoke shock, mystery and all sorts of glitchy delight.

[![deep web video](images/jodi-deep-web.png)](https://youtu.be/JMC7w8kXbUs?t=25m40s)


## Form Art

Like ASCII art, another popular net.art sub-genre of the time which explored the Web's inherent aesthetic was "form art". The term was coined by net.artist Alexei Shulgin and was, in part, a response to jodi.org's on Web *form*alism.

Form art referred to net.art created predominantly from <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Forms" target="_blank">HTML form elements</a>. These are the HTML elements used to create things like buttons, drop down lists, check-boxes and text or password fields, as well other "form" components used in graphical applications.

```html
<!-- a button -->
<button> click me </button>

<!-- a drop-down list -->
<select id="pet-select">
  <option value="">--Please choose an option--</option>
  <option value="dog">Dog</option>
  <option value="cat">Cat</option>
  <option value="hamster">Hamster</option>
  <option value="parrot">Parrot</option>
  <option value="spider">Spider</option>
  <option value="goldfish">Goldfish</option>
</select>

<!-- a progress bar -->
<progress id="file" max="100" value="70"> 70% </progress>

<!-- a text field -->
<input type="text" placeholder="your username">
<!-- a password field -->
<input type="password" placeholder="secret password">

<!-- a radio button -->
<input type="radio">

<!-- a check box -->
<input type="checkbox" checked="true">
```

Rather than using these elements for their intended use, form art was an "absurdist" take on these elements, where artists used them to make playful (often interactive) formal experiments which "transformed the most bureaucratic, functional, and unsolved aspects of the web into aesthetic, ludic elements".

![Form Art](images/form-art-1.jpg)

As we've discussed, the net.art movement's anti-establishment sentiments were one of it's defining charactersistics. For these artists, one of the most exciting aspects of making work on the Internet is that they no longer needed the traditional art institutions to exhibit their work, they had the Web for that.

So, form art was also in part a response to art competitions, specifically the <a href="https://en.wikipedia.org/wiki/Prix_Ars_Electronica" target="_blank">Prix Ars Electronica</a> (which is like the Oscars or Grammy's of new media art). Alexei first announced the "sub-gnere" in the form of a call for submissions to the "Form Art Competition".

> I was absolutely sure that art after the internet would never be the same and that an artist does not need to play traditional career games, including maintaining his or her own style. –<i>Alexei Shulgin</i>

One of the "winners" was <a href="http://easylife.org/form/competition/choose/choose.htm" target="_blank">Choose</a> (1997) by net.artist Kass Schmitt. Form Art wasn't the only satirical net.art "competition" at the time, Kass was also involved in organizing another.

![Choose by Kass Schmitt](images/choose-1997.jpg)

1997 was also the year of the first <i>Cyberfeminist International</i>. The following year Kass and other cyberfeminist net.artists like Rachel Baker, Cornelia Sollfrank and Josephine Bosma, organized Mr.NetArt another satrirical online net.art competition in which, as Rachel Greene said, "the individual notion of the male artist-genius was exposed to ridicule".

![Cyberfeminist International](images/cyberfeminist-international.jpg)

In a way, the form art "aesthetic" was in part informed by the artists that crated these compositions and partly by the developers of web browsers, who are ultimately the ones defining what the <i>individual</i> form elements themselves look like.

![Choose](images/choose-then-and-now.png)

*[Choose](http://easylife.org/form/competition/choose/choose.htm) by Kass Schmitt. On the left as it appeared on Internet Explorer (Mac) in the late 90s, on the right as it appears on Firefox (Linux) in 2020*

In this way, form art is never static because browsers are never static, they're constantly evolving and changing. The form elements are often updated to match the graphic design styles of the UI (user interface) of any given platform (the latest versions of Windows, Mac, Android, iOS or Linux).

For this reason, while the original HTML code has remained hosted on Alexei's server unedited since 1997, the rendered result of what that page looks like in the browser has continued to change over the years each time browsers have updated.

![Form Art](images/form-art-90s.png)

[Form Art](http://easylife.org/form/) by Alexei Shulgin as it appeared in Netscape (Windows) in the late 90s.

![Form Art](images/form-art-2010.png)

[Form Art](http://easylife.org/form/) by Alexei Shulgin as it appeared in unidentified (Mac) browser in ~2010.

![Form Art](images/form-art-today.png)

[Form Art](http://easylife.org/form/) by Alexei Shulgin as it appears in Firefox (Mac) in 2020.


![Form Art](images/form-art-2-90s.jpg)

[Form Art](http://easylife.org/form/index1.html?) by Alexei Shulgin as it appeared in Netscape (Mac) in the late 90s.

![Form Art](images/form-art-2-2010.png)

[Form Art](http://easylife.org/form/index1.html?) by Alexei Shulgin as it appeared in Chrome (Mac) in ~2010.

![Form Art](images/form-art-2-today.png)

[Form Art](http://easylife.org/form/index1.html?) by Alexei Shulgin as it appears in Firefox (Linux) in 2020.

----

> bringing them [form elements] in focus was a declaration of the fact that a computer interface is not a 'transparent' invisible layer to be taken for granted, [...] but something that defines the way we are forced to work and even think.  –<i>Alexei Shulgin</i>

On the one hand "Form Art" refers to this particular "competition" and the series of works created in 1997, but because artists have continued to play with form elements this way ever since form art has also become an Internet art sub-genre.

![Checkboxes Ball](images/mrdoob.png)

[Checkboxes Ball](https://mrdoob.com/lab/javascript/checkboxes/) by mr.doob (aka Ricardo Cabello) (~2010) as it appears on Firefox (Mac) in 2020

![389](images/389-2009.png)

A still from the 389 series by Andrej Yasev as it appeared on Safari (Mac) in 2009 (the works are no longer online but they have [been archived](https://web.archive.org/web/20120401021522/http://the389.com/) by the Internet Archive and there is also [video documentation](https://vimeo.com/yazev) on Vimeo)

![Interface Painter](images/interface-painter.png)

[Interface Painter](http://poxparty.com/InterFacePainter/index.html) by Pox (Ben Syverson and Jon Satrom) a photoshop-like "artware" application for creating form art.

## in &lt;/closing&gt;

Before we move onto CSS there's on last "pure HTML" Internet art piece I'd like to leave you with. In 2011 new media artists Evan Roth asked a conceptual question, what would it look like if he put every HTML element inside of every other HTML element in alphabetical order. <a href="http://all-html.net/" target="_blank">This</a> was the result, a form-art like abstraction he called <i>all-html.net</i> which, in some sense, is a portrait of HTML itself a snapshot of it's "aesthetic".

![all-html.net](images/all-html-output.png)

[all-html.net](http://all-html.net/) by Evan Roth as it appears on Firefox (Linux) in 2020

![all-html.net](images/all-html-code.png)

A screenshot of all-html.net's [source code](view-source:http://all-html.net/)


<a href="" target="_blank"></a>
