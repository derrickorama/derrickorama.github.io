---
layout: post
title:  "Making a Post-Install Script: #!/bin/bash"
date:   2014-09-02 22:24:24
redirect_from:
  - /dev-tools/2014/09/02/making-a-post-install-script-bin-bash/
---

I’ve installed Ubuntu… SO many times. One day, I decided to create a post-install script. This is the first in many posts I’ll be writing about creating a post-install script.

What is a post install? In this case, it’s something you run right after you install your OS—specifically Ubuntu. I will be referring mostly (if not completely) to the post-install script I created on GitHub: [https://github.com/derrickorama/post-install](https://github.com/derrickorama/post-install).

Let’s start at the top: #!/bin/bash

## Why do I need #!/bin/bash ?

Yeah, it was sort of a weird thing for me at first. Basically, this tells the shell what interpreter to run. /bin/sh is the default if you do not specify anything—and this is OK a lot of the time. I’d say you should roll with the default unless you run into issues that require you to use bash (which I have with my scripts).

For example, take the script below:

{% highlight sh %}
# script.sh
MYVAR=1
let "MYVAR += 1"
echo $MYVAR
{% endhighlight %}

Now, you’d expect that MYVAR would now be 2, but instead you get something like this:

{% highlight bash %}
./script.sh: 3: ./script.sh: let: not found
1
{% endhighlight %}

Try adding the `/bin/bash` [shebang](http://en.wikipedia.org/wiki/Shebang_(Unix)) to the beginning:

{% highlight bash %}
#!/bin/bash
# script.sh
MYVAR=1
let "MYVAR += 1"
echo $MYVAR
{% endhighlight %}

Now you simply get:

{% highlight bash %}
2
{% endhighlight %}

You can even specify something completely different:

{% highlight python %}
#!/usr/bin/env python
print("I am Python now!")
{% endhighlight %}

I mainly use `/bin/bash` for my scripts. For reference, here’s a nice list of some differences between `/bin/sh` and `/bin/bash`: [Appendix B Major Differences From The Bourne Shell](http://www.gnu.org/software/bash/manual/html_node/Major-Differences-From-The-Bourne-Shell.html).

## Quick Note!

If you didn’t already figure this out, you need to make the script executable before being able to execute it. I simply did this:

{% highlight bash %}
chmod +x script.sh
{% endhighlight %}

Executable for everyone!

—and that’s it for now. Stay tuned for more posts around my post-install (and post-installs in general).
