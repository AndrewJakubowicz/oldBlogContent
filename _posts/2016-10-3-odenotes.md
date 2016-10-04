---
layout: post
title: Ways to solve simple Ordinary Differential Equations (ODEs)
thumbnail: images/p1/cat_and_mouse.png
loadMathjax: true
myjs:
  - libjs/anchor.min.js
  - myjs/anchor_init.js

---

I wrote this up as a refresher for myself. This is not meant to be indepth and it barely scratches the surface of the topics presented.


### Contents
  - [Linear Second order ODEs]({% post_url 2016-10-3-odenotes %}#linear-second-order-odes)

## Linear Second order ODEs

Generally take the form of:

<div>
$$P(x) \frac {d^{2}y}{dx^2} + Q(x) \frac {dy}{dx} + R(x)y = S(x)$$
</div>

As this is difficult we will only consider these when <span>$$P(x)$$</span>, <span>$$Q(x)$$</span>, <span>$$R(x)$$</span>
and <span>$$S(x)$$</span> are constants.

This simplifies into a _constant coefficient_ equation:

<div>
$$a \frac {d^{2}y}{dx^2} + b \frac {dy}{dx} + cy = S(x)$$
</div>

There are two cases to consider to solve this equation.

 - Homogeneous equation where <span>$$S(x) = 0$$</span>
 - Non-homogeneous equation where <span>$$P(x) \ne 0$$</span>

The solution is the addition of the homoegeneous and non-homogeneous equation.

<span>$$y(x) = y_h(x) + y_p(x)$$</span>


## Solving constant coefficient 2nd order homogeneous ODEs

I am summarazing a lot of what is happening as I really just want to present the algorithm.

For the ODE:

<div>
$$a \frac {d^{2}y}{dx^2} + b \frac {dy}{dx} + cy = 0$$
</div>

  - Solve the below quadratic for <span>$$\lambda$$</span>:

<div>
$$a \lambda ^ 2 + b \lambda + c = 0$$
</div>

  - Let the two roots be <span>$$\lambda_1$$</span> and <span>$$\lambda_2$$</span>. General solution can be found based on 3 cases.

#### Case 1

If <span>$$\lambda_1 \ne \lambda_2$$</span> and <span>$$ \lambda_1, \lambda_2$$</span> are real.

General solution: <span>$$y_h(x) = Ae^{\lambda_1x} + Be^{\lambda_2x}$$</span>

#### Case 2

If <span>$$\lambda$$</span> is a complex number, (<span>$$\lambda = \alpha \pm i\beta$$</span>)

General solution: <span>$$y_h(x) = e^{\alpha x}(A \cos(\beta x) + B \sin(\beta x))$$</span>

#### Case 3

If <span>$$\lambda_1 = \lambda_2$$</span>

General solution: <span>$$y_h(x) = (A + Bx)e^{\lambda x}$$</span>


## Solving constant coefficient non-homogeneous ODEs

We want to solve the following equation for when <span>$$S(x) \ne 0$$</span>.

<div>
$$a \frac {d^{2}y}{dx^2} + b \frac {dy}{dx} + cy = S(x)$$
</div>

__First__ we guess the form of the solution.
We'll 'guess' by looking at the form of our <span>$$S(x)$$</span>.

There is no general theory which we can follow. But here are some examples for simple cases.

#### Polynomials

<span>$$S(x) = a_0 + a_1x + a_2x^2 + ... + a_nx^n$$</span>

General solution:

<span>$$y_p(x) = C_0 + C_1x + C_2x^2 + ... + C_nx^n$$</span>

#### Exponential

<span>$$S(x) = (a_0 + a_1x + a_2x^2 + ... + a_nx^n)e^{kx}$$</span>

General solution:

<span>$$y_p(x) = (C_0 + C_1x + C_2x^2 + ... + C_nx^n)e^{kx}$$</span>

#### Trigonometry

<span>$$S(x) = (a_1 \sin(bx) + a_2 \cos(bx))e^{kx}$$</span>

General solution:

<span>$$y_p(x) = (C_1 \sin(bx) + C_2 \cos(bx))e^{kx}$$</span>

### Exceptions

If any term of <span>$$y_p(x)$$</span> is a solution of the homogeneous equation <span>$$y_h(x)$$</span>, multiply <span>$$y_p(x)$$</span> by <span>$$x$$</span> or <span>$$x^2$$</span>.


### Using the guess to solve for particular solution

Using your guess for <span>$$y_p(x)$$</span>, find <span>$$y'_p(x)$$</span> and <span>$$y''_p(x)$$</span>
and then solve for the constants in your guess.

<div>
  $$ay''_p(x) + by'_p(x) + cy_p(x) = S(x)$$
</div>


With your wonderful non-homogeneous equation solved, you can now simply add it to the homogeneous solution to find the general equation.
Your answer will still have constants and these can be worked out with given initial values.