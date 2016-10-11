---
layout: post

title: Review of 'How to Code&colon; Systematic Program Design'

thumbnail: images/racketReview/sierpinski_triangle.png

myjs:
  - libjs/anchor.min.js
  - myjs/anchor_init.js
---


This course can be done by anyone, _even if you've never programmed before!_
[How to Code - Systematic Program Design](https://www.edx.org/xseries/how-code-systematic-program-design) is a **free**, three part course that builds up your fundamental concepts of programming.

The course states:

> "This series differs from other online programming courses by focusing on a general design method, rather than how to program in a specific language."


This course doesn't teach a popular programming language or fancy library.
Instead this course uses a minimilistic programming language that anyone can wrap their head around, leaving less time learning the language and more time solving problems.

Let me introduce you to [Racket](https://racket-lang.org/)!
It comes with a _fancy text editor_ called **Dr Racket** which is where your programs will live.
Therefore setting up your computer to write Racket programs is no harder than a single install.

Then it just works.

As someone who has already dabbled in programming before doing this course, I learnt/exercised:

- Writing tests before writing the program

- Programming with images. (This course inspired all the canvas javascript you see on this blog)

- All you need are functions to make pretty incredible programs

- Recursion

- General view of creating data types.


## Quick tour of the course problems

I'll quickly show you some examples of the programming language Racket.
If any of this stuff interests you, then the course is worth doing.

Feel free to copy paste the code into the bottom panel of **Dr Racket**.

### Hello World

In racket to display _Hello World_ you just type:

```
"Hello World"
```

And press Enter.

### Draw a filled in square

```
(require 2htdp/image)
(square 50 "solid" "blue")
```

### Draw a Sierpinski triangle

![Sierpinski Triangle]({{ site.baseurl }}/images/racketReview/sierpinski_triangle.png)

```
(require 2htdp/image)
(define (sierpinski s)
  (cond [(< s 5) (triangle s "outline" "black")]
        [else (overlay (triangle s "outline" "black")
                       (above (sierpinski (/ s 2))
                              (beside (sierpinski (/ s 2))
                                      (sierpinski (/ s 2)))))]))


(sierpinski 200)
```

### Create a snake game

Ok this wasn't a problem.
But this course gave me enough knowledge to be able to put together an entire snake game.
The code is too large to paste here.


![Snake Game gif]({{ site.baseurl }}/images/racketReview/snake-game-gif.gif)


### There is so much more.

There are tree diagrams, tree traversal, tail recursion, cool data structures and so much more.

I finished this course within 2 months (on top of university) and my programmers toolbox has been forever improved.


Good luck!


### Resources

- [Free book: How to Design Programs, Second Edition](http://www.ccs.neu.edu/home/matthias/HtDP2e/)
- [Racket Homepage](https://racket-lang.org/)


