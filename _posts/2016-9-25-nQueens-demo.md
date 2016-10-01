---
layout: post
title: N-queens Problem Backtracking Animation
thumbnail: images/p1/cat_and_mouse.png
myjs:
  - libjs/polyfill.js
  - myjs/nQueens.js
---

A visualization and explanation of how a backtracking algorithm searches for a solution to a problem.

<div style="display:block; width:400px; height: 400px; margin:0 auto;" id="canvas-nqueens">
  <canvas id="nQueens-canvas"></canvas>
</div>
<label for="nQueens-n">Number of Queens:</label>
<input id="nQueens-n" type="number">
<button id="btn-submit">Play Animation</button>

**For performance reasons n is bound between 4 and 10.**

*Note: Requires canvas supported browser. Tested on Chrome, Safari, Edge, Firefox.*

## N-queens problem

If I have a chessboard of width and length **n** where **n** is a number.

How can **n** queens be placed so that none of the queens are attacking one another?

[Try it yourself here with 8 queens.](http://www.hbmeyer.de/backtrack/achtdamen/eight.htm)

## What would the algorithm do without backtracking?

Without backtracking a program would place *all n queens* before checking if any queens are attacking.
This leads to wasteful solutions such as an entire row of queens.

We don't need a whole row full of queens before we know that the solution failed.
Instead we only need 2 queens to be attacking each other to know that the solution is wrong.

## Introducing backtracking

A backtracking algorithm is a way of computing a solution to a problem when constraints are known.

The algorithm places one queen at a time.
If the queen placed is attacking another queen, the queen is removed and we try again in the next position.
This is the *backtracking* step.

If you want to see this in action. Run the animation and look for the queens being taken off the board.
This is obvious when solving for 10 queens.

[For more detail check out the wiki page on backtracking.](https://en.wikipedia.org/wiki/Backtracking)

