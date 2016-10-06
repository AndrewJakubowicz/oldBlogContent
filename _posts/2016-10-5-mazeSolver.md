---
layout: post
title: Maze Solver Demo
thumbnail: images/p1/cat_and_mouse.png

myjs:
  - myjs/mazeSolver.js
  - libjs/polyfill.js

---

<div style='width:100%; text-align:center;'>
<canvas id="mazeSolver-canvas" style="display:inline-block;background-color:#212121;padding:3px;">Your browser doesn't support canvas!</canvas>
<br>
<button onclick="runAnimation()">SOLVE MAZE</button>
</div>

## Instructions

  - __EDIT__ : click and drag around.
    - Clicking on a wall sets your mouse to __delete mode__.
    - Clicking on empty space sets your mouse to __build mode__.
  - Click the __SOLVE MAZE__ button for magic!


## What I learnt

### States

I really wanted to play with a program with distinct states.

My functional programming brain was not impressed with my use of a global variable.
I've learnt that a trivial program can become very messy once there are global mutable states.
Mix that together with asynchronous programming...

The three states are:

  - User editting
  - Animation playing
  - Solution playing

Solution animation was seperate to include easing.
And wow easing is fun and not too challenging.

### Optimization

Many funny lagging bugs were fixed.
All were associated with getting a good user editting experience.
Editting the maze would run initialization code for the maze finding algorithm, or do an expensive array allocation of empty arrays!!!

Making code run _only_ when needed made for a fast program.


### Generators

The algorithm is basically a simple [backtracking implementation](https://en.wikipedia.org/wiki/Backtracking).
Using generators I can pause it using `yield` expressions.
Thus logic and timing is __separated__.

This allows the animation to call `requestAnimationFrame` at 60 fps, only grabbing the next change in the algorithm when needed.
I call `yield` every time the algorithm takes some kind of step. Hitting walls do not call `yield`.


### But generators don't work on all devices!

In order to target older browsers I transpile the code twice.
The code is written in __Typescript__. This is transpiled into __ECMAScript6__.
Finally I use __Babel__ and a generator polyfill to transpile the code into a form that is supported by _most_ browsers.


### Difficulty of mini-project

`MODERATE`

  - Many small pieces
  - Easy to get tangled
  - Mouse drag script tricky