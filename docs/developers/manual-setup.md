# Setup a Local Development Environment *MANUALLY*

For those looking for a much easier way to set things up locally, see our [Contributor Workflow](contributor-workflow) doc. This page documents how to setup a local development environment manually for those interested in doing things the hard way or for those interested in learning about what exactly our setup script `npm run setup` is doing behind the scenes (the [setup-script.js](https://github.com/netizenorg/netnet.studio/blob/main/my_modules/setup-script.js)).

## 1. fork our repo

First, [fork](https://guides.github.com/activities/forking/) the netnet.studio repo and then clone it to your local computer (replacing "YOUR_USER_NAME" in the git URL below with your own)

```
git clone https://github.com/YOUR_USER_NAME/netnet.studio.git
```

## 2. add remote "upstream"

Then you'll need to `cd` (change directory) and then add a remote "upstream" to our repository so you can pull changes from our repo when need be.

```
cd netnet.studio
git remote add upstream https://github.com/netizenorg/netnet.studio.git
```

You can confirm this worked by running `git remote -v`, you should see both your "origin" and the new "upstream". Another way to confirm this is to open up your git config locally in your preferred editor, for example `nano .git/config`, you should see something like this:

```
[remote "origin"]
	url = https://github.com/YOUR_USER_NAME/netnet.studio.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main
[remote "upstream"]
	url = https://github.com/netizenorg/netnet.studio.git
	fetch = +refs/heads/*:refs/remotes/upstream/*
```

**NOTE:** unless you've already authorized your preferred editor to push code to your GitHub account, you'll need to generate a [personal access token](https://github.com/settings/tokens) and add that to your git config by either removing your "origin" and re-adding it with the token embedded in the URL, or simply manually edit this file so that the [remote "origin"] url includes it like so:

```
[remote "origin"]
	url = https://YOUR_ACCESS_TOKEN@github.com/YOUR_USER_NAME/netnet.studio.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

This is something the startup script (optionally) handles for you as well. *note the `@` symbol between your token and `github.com/`*


## 3. create the `.env` file

In the project's root directory, use your preferred editor to create a `.env` and set your preferred development port:

```
PORT = 8001
```

netnet allows its netizens to open any of their GitHub repos (assuming they're web projects) in the studio as well as save (commit, push, etc) changes they make in the studio back to their GitHub accounts. If you want to test this functionality locally and/or work on any aspects of the code base that deals with it, you'll have to [create your own GitHub OAuth credentials](https://docs.github.com/en/developers/apps/creating-an-oauth-app). for **Homepage URL** enter `http://localhost:8001` (ensuring that `:8001` matches the port number defined in the previous step) and for **Authorization callback URL** enter `http://localhost:8001/user/signin/callback`. Then copy and paste your **Client ID** and **Client Secret** into the `.env`:

```
PORT = 8001
GITHUB_CLIENT_ID = YOUR_CLIENT_ID_HERE
GITHUB_CLIENT_SECRET = YOUR_CLIENT_SECRET_
TOKEN_PASSWORD = MAKE_UP_SOME_RANDOM_PASSWORD_HERE
```

**NOTE:** the `TOKEN_PASSWORD` should be a long, randomly generated string. Although we store the user's session GitHub auth token in a secure, same-site restricted, http-only cookie, we also use three extra layers on encryption to protect this locally stored cookie because we believe you can never be too carefully when it comes to our user's privacy and security. This random password is used in this extra encryption process.

## 4. install (and update) the dependencies

Lastly, you'll need to install all the server-side (and a few client-side) dependencies (listed in the [package.json](https://github.com/netizenorg/netnet.studio/blob/fd71acd7c99eca82702600236051a74babc27e09/package.json#L24-L37)), as you would with most nodejs projects, by running:

```
npm install
```

**Updating Submodules**

In addition to the server-side (back-end) dependencies, this repo also contains [git submodules](https://github.com/netizenorg/netnet.studio/blob/main/.gitmodules) for a couple of the client-side (front-end) dependencies, maintained by us (@netizenorg). Specifically, those are the [netnet-standard-library](https://github.com/netizenorg/netnet-standard-library) (itself a collection of other sub-modules) as well as the [netitor](https://github.com/netizenorg/netitor), netnet's core code editor.

There are two npm scripts, one for pulling and the other for updating the submodules:
```
npm run pull-modules
npm run update-modules
```

**NOTE:** we've noticed issues running these scripts, where sometimes they don't actually pull updates (*plz open an issue if you think you might know why*), but alternatively you can also `cd` into the individual submodule folders found in [www/core](https://github.com/netizenorg/netnet.studio/tree/main/www/js/core) and pull the code using `git pull`


## 5. running the local server

Once everything is setup you can run the server:

```
node server
```

Then visit http://localhost:8001 (ensuring that `:8001` matches the port number defined in your `.env` file) in the browser.
