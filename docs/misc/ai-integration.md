# Connecting netnet to a local LLM

If you choose to connect netnet to an LLM and you would prefer to use a local model, the info below guides you through the setup process.

## netnet's AI lessons

In netnet's Learning Guide there's a section devoted to **Artificial "Intelligence"** which begins with Ch.1 "When Choosing to Use AI" where netnet guides you through a presentation introducing core concepts of machine learning, then in Ch.2 "AI as Coding Assistants: Crafting the Right Prompt" netnet introduces the the AI Prompt Generator widget which guides you through crafting prompts that help steer mainstream LLM chat bots (ChatGPT, Claude, Gemeni, etc) away from their default behavior (solving your coding bugs for you) and towards behaving more like a tutor (teaching you how to solve it yourself). Then, in Ch.3, we go deeper by connecting netnet to an LLM through a REST API by choosing a commercial provider (OpenAI or Anthropic) or choosing to connect it to an LLM running on your computer using Ollama. Ch.4 "AI as Creative Materials" goes even deeper, netnet teaches you about other types of neural networks (beyond transformer based LLMs) and how we can use small local models directly into our own projects before diving to the deepest level, Ch.5 "AI as Art" where netnet teaches you to craft your own neural network from scratch.

The notes on this page are specifically for **Ch.3 "AI as Coding Assistants: Editor Integration with APIs"** when you decide to connect netnet to an open source LLM you have running locally on your computer using Ollama. While it's easier to connect netnet to a commercial provider (OpenAI, Anthropic) that requires you sign-up and pay that company. It also means sending your data back/fourth to that company's datacenter (where they run large energy hungry models). Connecting to a locally run model might not be as performant and does require a bit more of a setup, but comes with the benefit of keeping your data private and running a more energy efficient model.


## DISCLAIMER

The **LLM-API Conduit** widget supports connecting to a locally running Ollama instance. Beyond a basic install, Ollama requires environment variable configuration before it will accept requests from the app. This is still a fairly experimental widget so you may have mixed success (but if you like experimenting it's worth a shot! We've had fun playing with this).

**Chrome incompatibility (Private Network Access policy)**

If you're using **Google Chrome**, this feature currently won’t work, even if everything is set up correctly. Chrome has additional security rules that blocks encrypted websites (like https://netnet.studio) from communicating with programs running on your computer (like **Ollama**). Because of this, you’ll need to use **Mozilla [Firefox](https://www.firefox.com/en-US/?redirect_source=mozilla-org)** if you want to connect netnet to local models.

This isn’t an issue with netnet, and it may be resolved in the future if Ollama updates how it handles these requests. Still, Firefox is a great browser that aligns with our mission (much more so than Chrome), but if you really want to use netnet's LLM integration on Chrome you still can, you'll just need to connect it to a commercial provider like OpenAI or Anthropic instead of a local model.


## Step 1: Download + Install Ollama

Visit [https://ollama.com/download](https://ollama.com/download) to download and install Ollama. After you've installed Ollama, you'll also need to download a model, Ollama is just the app that runs models locally and provides the REST API so that netnet can communicate with your local models.

You can download models using the Ollama app's interface, but you can also download them via the terminal:
```
ollama pull gemma4:e2b
```

This will automatically download the 2-billion parameter version of [gemma4](https://deepmind.google/models/gemma/gemma-4/) the newest/smallest open source model by Google's DeepMind (as of early 2026). If you have a more powerful machine (16GB+ RAM), you can try a slightly larger model:
```
ollama pull gemma4:e4b
```

There are [loads of models](https://ollama.com/search) to choose from, it's worth experimenting with a few, just make sure you have enough storage space on your hard drive (even these local LLMs are still fairly big, we're talking multiple Gigs) to download them, as well as enough memory (your RAM) to run them.

## Step 2: Verfiy it's working

You can test that Ollama is running by visiting [http://localhost:11434/api/tags](http://localhost:11434/api/tags). You should see a JSON response listing your installed models. If your browser can't seem to connect to the page, then Ollama might not be running (double check). If it does connect, but you don't see any models listed, then you might not have successfully downloaded a local model yet (return to step 1)


## Step 3: Allow netnet to connect to Ollama


After installing Ollama and downloading a model, two environment variables must be set in order for netnet (running in your browser) to communicate with Ollama: `OLLAMA_HOST` (to expose the API) and `OLLAMA_ORIGINS` (to allow requests from netnet). The commands differ by OS:

### macOS

The simplest way is to open a Terminal and run:
```
launchctl setenv OLLAMA_HOST "0.0.0.0:11434"
launchctl setenv OLLAMA_ORIGINS "https://netnet.studio"
```

Then restart Ollama and you should be good to go. However, this won't persist after rebooting your computer. To avoid having to run this command after every restart, you could go with a more persistent approach by creating a LaunchAgent plist that sets the variables automatically at every login. In Terminal, run:

```
cat > ~/Library/LaunchAgents/com.user.ollama-env.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.user.ollama-env</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/sh</string>
    <string>-c</string>
    <string>launchctl setenv OLLAMA_HOST "0.0.0.0:11434" &amp;&amp; launchctl setenv OLLAMA_ORIGINS "https://netnet.studio"</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
</dict>
</plist>
EOF
launchctl load ~/Library/LaunchAgents/com.user.ollama-env.plist
```

This loads immediately and will re-run at every login. Restart Ollama once after running this.

### Windows

Open Command Prompt and run:

```
setx OLLAMA_HOST "0.0.0.0:11434"
setx OLLAMA_ORIGINS "https://netnet.studio"
```

Restart Ollama after running these. The variables will persist across reboots.

### Linux

If running Ollama manually from the terminal, add the variables to `~/.bashrc` (or `~/.profile` for login shells):

```
echo 'export OLLAMA_HOST="0.0.0.0:11434"' >> ~/.bashrc
echo 'export OLLAMA_ORIGINS="https://netnet.studio"' >> ~/.bashrc
source ~/.bashrc
```

If Ollama is installed as a **systemd service**, `~/.bashrc` won't affect it. Instead, create a systemd drop-in:

```
sudo systemctl edit ollama
```

Add the following and save:

```
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=https://netnet.studio"
```

Then reload and restart:

```
sudo systemctl daemon-reload
sudo systemctl restart ollama
```
