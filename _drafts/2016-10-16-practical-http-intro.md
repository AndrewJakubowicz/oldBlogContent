---
layout: post
title: Practical Introduction to HTTP for beginners
thumbnail: images/p1/cat_and_mouse.png
myjs:
  - libjs/anchor.min.js
  - myjs/anchor_init.js
---

It has taken me a long time to become _somewhat_ comfortable with HTTP.
Instead of just telling you how HTTP works, I've tried to make the post interactive to show you how simple it is to make requests.
Once you can send requests and recieve responses, you'll be able to code your own online apps and microservices.
Understanding these concepts helped me create my first JavaScript weather web app.
I would send requests to another website, and it would send me back weather information.
I then dressed this information up nicely with pictures and animations.

# Where does it start?

Everything starts with a request.
HTTP always starts with the client sending a *request*.
This makes sense because in general, a server waits for someone to ask it for something.
When you type `www.google.com`, you're sending a request to google that basically says: 
"Excuse me google server. Could you send me back the google home page! :3".

Your request is basically a letter.
On a letter you'd usually write a name and an address.
A request is exactly the same.
It follows the following format.

- An HTTP request contains:
  - A request line: (GET /cuteImage.jpg HTTP/1.1)
  - zero or more request headers (User-agent: Person who wants a cute image)
  - empty line
  - message body (optional stuff you might want to put in your 'letter'.)

Here are 2 practical ways you can start sending requests ("letters to servers"). The second way is the online easier way.

1. If you have cURL installed type `curl -vs http://i.imgur.com/ncquuJb.jpg > /dev/null` into your terminal.
Anything starting with `>` is your HTTP request. Things starting with `<` are the response from the server.

2. Use this [free online tool](https://www.hurl.it/). Select **GET** and copy paste `http://i.imgur.com/ncquuJb.jpg`.
Clicking **Launch Request** will bring up the request and response.

With these open, hopefully I can demystify what is going on.

## Request line

```
GET /ncquuJb.jpg HTTP/1.1
```

The first word is the **request method**. In this case it is `GET`.
Basically you are telling the server that we want to `GET` something.
It's no more complicated than that.

There are a [couple others worth exploring](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods).
Again they are all ways of telling the server what we want it to do.

As a quick note. These methods are **safe** if they don't change anything server side (`GET`, `HEAD`...).
Something like `DELETE` is definitely **unsafe**.
You don't want to give any user the power to delete things on the server.

After the request method is the relative path to the resource that you're trying to access.
In this case: `/ncquuJb.jpg`.

<img src="http://i.imgur.com/ncquuJb.jpg" alt="I call this cutie ncquuJb!" title="I call this cutie ncquuJb!" style="height: 200px; width: auto; margin: 0 auto;">

The final bit `HTTP/1.1` is the protocol used.



Stretching the letter analogy. `GET /ncquuJb.jpg HTTP/1.1` would be like writing:


> I WOULD LIKE a cute picture of a cat, and I'm writing in ENGLISH.

## Headers

The lines below the request line are your request headers.
Think of them as a way to define variables for the server.

A simple one is the header `HOST`.
This names the server.
Combining the `HOST` with the `/ncquuJb.jpg` completes the full URL.

Another fun one is `User-Agent`.
If you've ever been spooked by a website telling you what browser you're on, it's **because the browser tells the server!**

Your request sent by the above methods contains: `User-Agent: curl/7.43.0` or `User-Agent: runscope/0.1`.
However your browser will send something like this:

<code>User-Agent: <span id="yourUserAgent"></span></code>
<script type="text/javascript" async>
    document.getElementById("yourUserAgent").innerText = window.navigator.userAgent
</script>


[More info here!](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html)

# Response

The server responds to your request with a response!
The response has a very similar structure to the request.

Again the structure follows:

- Status line
- Zero or more response headers
- Empty line
- The message body(optional)


The first line of the HTTP response is the _status line_.
`HTTP/1.1 200 OK`

The server returns the protocol that it is using, then the **status code** and **reason phrase**.
The reason phrase is used to make the status code readable by a person.
Enjoy this list of [status codes matched with cat pictures.](http://boingboing.net/2011/12/14/http-status-cats-by-girliemac.html)

Under the status line there are more headers.
These are basically variables sent by the server to help your browser create the page.

Finally the body is sent.
This is the content that you want to view.
The browser reads the response headers, and then displays the body in your browser.








