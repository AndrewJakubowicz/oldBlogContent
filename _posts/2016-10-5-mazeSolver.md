---
layout: post
title: Maze Solver Demo
thumbnail: images/p1/cat_and_mouse.png

myjs:
  - _myjs/mazeSolver.js

---


<canvas id="mazeSolver-canvas" style="margin: 0 auto"></canvas>
<button onclick="runAnimation()">SOLVE MAZE</button>

## Instructions

  - __EDIT__ : click and drag around.
    - Clicking on a wall sets your mouse to __delete mode__.
    - Clicking on empty space sets your mouse to __build mode__.
  - Click the __SOLVE MAZE__ button for magic!


## What I learnt

### States

Something I really wanted to play with was a program with distinct states.

I have a functional background and I've heard how global mutable states can bite you.
This project has shown me that even with something extremely trivial with 3 states, can still start getting pretty messy.
The three states are:

  - User editting
  - Animation playing
  - Solution playing

Each state must be able to interrupt the other. (With the exception of the Animation and Solution interrupting editting.)

I also wanted to seperate the animation of the solution as I wanted to play with easing.
This tiny implementation of easing taught me so much.

### Optimization

I also ran into some very interesting optimization problems.
These were mostly caused by the act of the user editting the maze.
Editting the maze would run initialization code for the maze finding algorithm, or doing an expensive array allocation of empty arrays.

Fixing these made the editor feel extremely responsive.


### Generators

The algorithm is basically a simple backtracking implementation. However I can pause it using `yield` expressions.
This allows the animation to call `requestAnimationFrame` at 60 fps, only grabbing the next change in the algorithm.
I call `yield` every time the algorithm takes some kind of step. Hitting walls do not call `yield`.


### But generators don't walk on all devices!

In order to target older browsers I transpile the code twice.
The code is written in __Typescript__. This is transpiled into __ECMAScript6__.
Finally I use __Babel__ and a generator polyfill to transpile the code into a form that is supported by _most_ browsers.


### Difficulty of mini-project

The difficulty of the maze is tying all the small pieces together.
Therefore I rate this project as: `MODERATE`.