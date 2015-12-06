---
layout: post
title:  "Making a Post-Install Script: Setup and Organization"
date:   2014-09-09 22:24:24
redirect_from:
  - /dev-tools/2014/09/09/making-a-post-install-setup-variables/
---

Previusly I covered the whole [#!/bin/bash]({% post_url 2014-09-02-making-a-post-install-script-bin-bash %}) thing—which is a good start. Now I’m going to go over some of the setup and organization for a post-install. This will hopefully help describe why I chose certain things to be in certain areas of [my post-install script](https://github.com/derrickorama/post-install/blob/master/post-install.sh).

## Variables

Variables are useful if you need to repeat the same code throughout your post-install. For me that’s usually directories and colors.

_If you’re curious, the colors are for printing messages to the console in green instead of the default. Specifically, `\e[0;32m` will print all following characters in green and `\e[0m` restores default colors (or black? I’m actually not sure)._

## Sudo prompt

{% highlight bash %}
sudo -v
{% endhighlight %}

This wonderful little line is made to prompt the user for sudo at the beginning of the script instead of at the middle. There were many times that I started a few downloads at the beginning of the script and it ended up prompting me after I had already walked away—basically stopping everything and waiting until I entered my password. This solves that problem.

_You could also just run the script with “sudo”._

{% highlight bash %}
sudo ./script.sh
{% endhighlight %}

## Configurations that don’t need any installations

Next I put all the stuff that is already available to me. There isn’t much, but at least you get something done if everything else fails.

{% highlight bash %}
# Example: Enable 4x4 grid of workspaces
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ hsize 2
gsettings set org.compiz.core:/org/compiz/profiles/unity/plugins/core/ vsize 2
{% endhighlight %}

## Non-APT installations

If there’s anything that cannot be installed with `apt-get`, I put those first. apt-get takes a while to run, might as well install things that don’t need the update or repos right away.

{% highlight bash %}
# Example: Installing Faenza icons via direct download
mkdir tmp
mkdir -p ~/.icons
wget http://faenza-icon-theme.googlecode.com/files/faenza-icon-theme_1.3.zip --quiet -O tmp/faenza.zip
unzip -qq tmp/faenza.zip -d tmp/faenza
tar zxf tmp/faenza/Faenza.tar.gz -C ~/.icons
rm -rf tmp
gsettings set org.gnome.desktop.interface icon-theme 'Faenza'
{% endhighlight %}

## Adding APT repositories

There are plenty of things that you install that aren’t in your list of repositories that come with Ubuntu. You, of course, need the repository info to install certain applications.

{% highlight bash %}
# Example: Adding repo for Ubuntu Tweak
sudo add-apt-repository -y ppa:tualatrix/ppa
{% endhighlight %}

## apt-get update

This is the first process that takes a while to complete. It’s going to pull down all of the updates so we get all up-to-date stuff for our `apt-get install`s.

{% highlight bash %}
sudo apt-get update
{% endhighlight %}

## apt-get installs

This is by far the longest portion of the process. apt-get will have to download all apps/libraries/dependencies and install them appropriately. That’s usually when I walk away.

{% highlight bash %}
# Example: Installing Dropbox
sudo apt-get install -y dropbox
{% endhighlight %}

## Post app install stuff

After apt-get install finishes, it’s whatever from then on out. Mainly, you just need to install all dependencies first, things that required dependencies next, configurations, then any “start” scripts (by “start” I mean things like `sudo service apache2 start`).

{% highlight bash %}
# Example: Changing default shell to zsh
sudo chsh -s /bin/zsh $USER
{% endhighlight %}

## You’ll figure it out either way

This is my preferred method for organization. I don’t always follow this, but I generally tend to put things together in this way. It’s largely based on dependencies. It takes time to figure out the best way to put a script together. You’ll likely find the best way after several failures. Put together everything the best way you know how, test, re-test, and optimize your script as you go. You’ll eventually come out with something clean and awesome.
