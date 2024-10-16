# Contributor Workflow

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

--------------------
## The (tl;dr) Overview:

**SETUP**

1. [fork our repo](https://github.com/netizenorg/netnet.studio/fork)
2. clone your fork `git clone https://github.com/[YOUR_USER_NAME]/netnet.studio.git`
3. cd into the repo `cd netnet.studio`
4. run the setup script `npm run setup`
5. run the server `npm run start`

**DEVELOPMENT**

1. create a "feature" branch `git checkout -b [FEATURE-NAME]` from the main branch (make sure to always `git pull upstream main` before starting a new feature branch)
2. work locally, ensuring you're conforming to our [coding style](#style) while making commits to the new feature branch and occasionally/eventually pushing to your fork `git push origin [FEATURE-NAME]` to back up your progress.
3. Create a [PR](https://github.com/netizenorg/netnet.studio/pulls) from your `feature` branch to our `main` branch.
4. Once your PR has been merged, clean things up before starting on your next feature
```
git checkout main
git pull upstream main
git push origin --delete [FEATURE-NAME]
git branch --delete [FEATURE-NAME]
```

--------------------
## The Details:

- [setup a local development environment](#env)
- [running netnet locally](#run)
- [making contributions](#contribute)
  * [setup a feature branch](#branch)
  * [make sure you conform to the style guide](#style)
  * [commit and push your changes](#push)
  * [create a PR (pull request)](#pr)
  * [post-merge clean up](#clean)
- [updating dependencies](#update)


## <a id="env"></a> setup a local development environment

netnet.studio is almost entirely a client-side application, but there is some server side logic. For this reason we need to have [nodejs](https://nodejs.org/en/) installed (to get things setup and run the server) as well as [git](https://git-scm.com/). Assuming you have both installed, you can setup a local development environment in a couple easy steps:

1. First, [fork](https://guides.github.com/activities/forking/) the netnet.studio repo and then clone it to your local computer (replacing "YOUR_USER_NAME" in the git URL below with your own)

```
git clone https://github.com/YOUR_USER_NAME/netnet.studio.git
```

2. Then you'll need to `cd` (change directory) into the netnet.studio folder and run our setup script.

```
cd netnet.studio
npm run setup
```

The setup script will guide you through a series of questions and handle the entire setup for you. You don't need to answer all of the questions the first time around you can always rerun the setup script later to return to any questions you skipped. We love setup scripts because they help lower the barrier to entry for contributors, but they can also (unintentionally) obfuscate the process. For that reason we've also put together document ion for [how to setup a local environment *manually*](Setting-Up-The-Repo-Locally) if you're curious.


## <a id="run"></a> running netnet locally

Assuming you still have a terminal open to the repo's directory, simply run:

```
npm run start
```
Then visit http://localhost:8001 in the browser (assuming you haven't changed the default port number in the `.env` file from 8001 to something else).

## <a id="contribute"></a> making contributions

#### <a id="branch"></a>  setup a feature branch

Before you start working on a new feature or bug fix ensure you're working with the latest version of netnet.studio by pulling updates from our main branch

```
git pull upstream main
```
If that failed, make sure you setup our repo as your remote "upstream" by running `git remote -v`, if you didn't setup a remote upstream during the setup you will need to do this manually by running `git remote add upstream https://github.com/netizenorg/netnet.studio.git`

Create a "feature branch" for the feature/bugfix/etc you plan on working on by running the command below (replacing `[FEATURE-NAME]` with name for this feature/task)

```
git checkout -b [FEATURE-NAME]
```

#### <a id="style"></a> make sure you conform to the style guide

We're using [standardJS](https://standardjs.com/) as our style guide, so before commuting/pushing any code you should check that everything's tidy by running:

```
npm run lint
```

But that can get annoying, so it's better to just install a [standard plugin](https://standardjs.com/#are-there-text-editor-plugins) for your preferred code editor. This way we do our linting as we code and don't have to worry about running this command and then going through all the required changes in order to conform to the style guide after the fact.

When writing any CSS, we're doing our best to stick to [BEM](http://getbem.com/introduction/), refer to this post on [CSS-Tricks](https://css-tricks.com/bem-101/) for a general introduction.

#### <a id="push"></a> commit and push your changes

Commit significant changes to your feature branch as you work (ensuring you don't have any linting errors or bugs in your console first):

```
git commit -m "a brief but useful message"
```

Push your changes to your fork's feature branch:

```
git push origin [FEATURE-NAME]
```

#### <a id="pr"></a>  create a PR (pull request)

When you're finished [create a  PR](https://github.com/netizenorg/netnet.studio/pulls) (pull request) *from* the feature branch of your form *into* the main branch of the class repo. The arrow icon in the GitHub PR interface between the two repos being merged conveys the direction of the pull request. *NOTE: If you don't see your fork in the the drop-down menus, you may first need to click on the "compare across forks" link in the PR page*

We may start a "review" for your PR before merging it. If we do give you some feedback or request some changes, the PR will remain open during the review and any future commits you push will automatically be registered in the PR page. Once everything looks good we'll accept your PR and merge your changes with our repo.

#### <a id="clean"></a> post-merge clean up

Once your PR has been merged, clean things up before starting on your next feature. Check out your main branch and pull the changes we merged from your (and any one else's) PRs:
```
git checkout main
git pull upstream main
```

Then delete the feature branch from your remote and local repos:
```
git push origin --delete [FEATURE-NAME]
git branch --delete [FEATURE-NAME]
```


## <a id="update"></a> updating dependencies

During the initial `npm run setup`, netnet would have installed a series of dependencies. In addition to the server-side (back-end) dependencies, this repo also contains [git submodules](https://github.com/netizenorg/netnet.studio/blob/main/.gitmodules) for a couple of the client-side (front-end) dependencies, maintained by us (@netizenorg). Specifically, those are the [netnet-standard-library](https://github.com/netizenorg/netnet-standard-library) (itself a collection of other sub-modules) as well as the [netitor](https://github.com/netizenorg/netitor), netnet's core code editor.

**occasionally we may update these, if/when that happens you'll want to pull those updates to your local repository as well.**

To pull updates to the submodules run:
```
npm run pull-modules
```

**NOTE:** we've noticed issues running these scripts, where sometimes they don't actually pull updates (*plz open an issue if you think you might know why*), but alternatively you can also `cd` into the individual submodule folders found in [www/core](https://github.com/netizenorg/netnet.studio/tree/main/www/js/core) and pull the code using `git pull`
