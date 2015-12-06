---
layout: post
title:  "Cross-language testing with REST and JSON"
date:   2014-09-25 22:24:24
redirect_from:
  - /programming/2014/09/25/cross-language-testing-with-rest-and-json/
---
I’ve been using Node for some time now in a production environment. I love Node & JavaScript in general… but it has got some bad memory leak issues. I found that even the simplest of scripts has memory leaks (e.g. an HTTP server, a socket server, etc.). It’s not a big deal most of the time, but when you have a huge application and a long running process, your application eventually grinds to a halt.

Anyway! I started dipping back into Python—which doesn’t have memory leak issues like that.

## But, I still want to use Node

I can’t help it. My JS roots are urging me to use JavaScript. I figured out a way to do that even when I’m writing a Python app.

This may sound like a bad idea… but wait! I’m actually just using it to test out REST functionality. Basically, I’m using the actual server instance, making requests, and making sure the result is what I expect it to be.

## What I’ll be using

Just to be specific, this is what I was using at the time I wrote this post:

* [Node](http://nodejs.org) (v0.10.32)
  * [Mocha](http://visionmedia.github.io/mocha/) (v1.21.4)
  * [Request](https://github.com/mikeal/request) (v2.44.0)
  * [Should](https://github.com/visionmedia/should.js/) (v4.0.4)
* [Python](https://www.python.org) (v3.4.1)
  * [Flask](http://flask.pocoo.org) (v0.10.1)

## TDD with Node + Mocha

Let’s begin with writing some tests. I’m a big fan of Mocha and I was giddy when I realized that I could still use it for my Python servers. To start, let’s just write some code to make a GET request.

### File structure

Okay, there is some setup. You’ll need a “test” folder and a “mocha.opts” file.

{% highlight bash %}
/ (root)
-- test/
-- mocha.opts
{% endhighlight %}

Inside mocha.opts, I’m setting two flags: use “should” and use the “spec” reporter.

{% highlight bash %}
--require should
--reporter spec
{% endhighlight %}

“Should” is awesome, you _should_ definitely use it.

### getSpec.js

You’ll probably want a more clever name than “getSpec”, but that’ll do for now. Here’s what I came up with:

{% highlight js %}
// test/getSpec.js

var request = require('request');

describe('GET requests', function () {

  it('can be made', function (done) {
    request.get({ url: 'http://localhost:5000/stuff', json: true }, function (err, response, body) {
      body.should.eql({
        items: [{
          name: 'Couch',
          cost: 400
        }, {
          name: 'Chair',
          cost: 20
        }]
      });
      done();
    });
  });

});
{% endhighlight %}

Now, you really should separate the tests to check for specific sitations vs checking the entire response in a single “it” function. For the purposes of this post, I’m just doing it all in one.

If you try this test using the `mocha test` command in the root directory, you’ll see that it fails:

{% highlight bash %}
$ mocha test


  GET requests
    1) can be made


  0 passing (16ms)
  1 failing

  1) GET requests can be made:
     Uncaught TypeError: Cannot read property 'should' of undefined
      ... other stack trace stuff ...
{% endhighlight %}

This is expected. We don’t have a server or anything yet.

## Flask

First, let’s make a simple REST API. Oh, and I mean simple.

{% highlight python %}
# server.py

from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/stuff')
def get_stuff():
  return jsonify(items=[dict(name="Couch", cost=400), dict(name="Chair", cost=20)])

if __name__ == "__main__":
  app.run()
{% endhighlight %}

See, told you it’d be simple. Normally, you’d be generating the response from a database and you’d have POST, UPDATE, and DELETE handlers. We’re just using GET here.

## Get ‘em both running

Now all you have to do is start up the server and run the tests.

_console 1:_

{% highlight bash %}
$ python server.py
 * Running on http://127.0.0.1:5000/
{% endhighlight %}

_console 2:_

{% highlight bash %}
$ mocha test


  GET requests
    ✓ can be made


  1 passing (20ms)
{% endhighlight %}

Sweet! Works. Node and Python working together to make a better world for all of us.

Oh, I’d also like to note that I usually script the starting/stopping of the server via the Mocha tests.

## Super awesome example

{% highlight js %}
// test/getSpec.js

var pathlib = require('path');
var request = require('request');
var spawn = require('child_process').spawn;

describe('GET requests', function () {

  var server;

  beforeEach(function (done) {
    // Start server
    server = spawn('python', ['server.py'], { cwd: pathlib.join(__dirname, '..'), stdio: ['ignore', 'pipe', process.stdout] });
    server.stdout.on('data', function (data) {
      if (data.toString().indexOf('Running on http://127.0.0.1:5000') > -1) {
        // Server has started, run tests
        done();
      }
    });
  });

  afterEach(function () {
    // Stop server
    server.kill();
  });

  it('can be made', function (done) {
    request.get({ url: 'http://localhost:5000/stuff', json: true }, function (err, response, body) {
      body.should.eql({
        items: [{
          name: 'Couch',
          cost: 400
        }, {
          name: 'Chair',
          cost: 20
        }]
      });
      done();
    });
  });

});
{% endhighlight %}

This way you don’t even have to run the server process separately! Woot!

## This is only the beginning

I was excited to be able to use some Node with my Python. Python is great for long running processes, Node is great for testing, I feel like I can have the best of both worlds. I’ve developed multi-language apps before, but I hadn’t one language for testing another language. Creating mini REST APIs seems like a good way to connect different languages and services together. I’m a fan. I will likely be employing this technique in more apps like this in the future.
