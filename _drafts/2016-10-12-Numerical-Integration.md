---
layout: post
title: Numerical Integration
thumbnail: images/p1/cat_and_mouse.png
myjs:
  - libjs/anchor.min.js
  - myjs/anchor_init.js
  - libjs/MathJax/MathJax.js?config=TeX-MML-AM_CHTML
---


Delete this part

Consider the following:

<div>
$$\frac {dy} {dt} = 3e^t - \frac {8y}{3}$$
</div>

Find <span>$$y(3)$$</span> by hand using a step size of <span>$$h=1$$</span> and the initial condition of <span>$$y(0)=3$$</span>.


## Euler's method

Follows this formula:

<div>
$$y_{n+1} = y_n + hf(t_n, y_n)$$
</div>

In english terms. You must start with some point.
The next point is found by adding the change in axis.
This is not without various forms of error.
But we can explore this idea and minimize the error.

### Task 1 a)

<div>
$$\frac {dy} {dt} = 3e^t - \frac {8y}{3}$$
</div>

Start with the initial value.

<div>$$n = 0$$</div>
<div>$$y_n = 3$$</div>
<div>$$t_n = 0$$</div>
<div>$$f(t_n,y_n) = -5$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = -5$$</div>
<div>$$y_{n+1} = 3 - 5 = -2$$</div>

Then find the next point.

<div>$$n = 1$$</div>
<div>$$y_n = -2$$</div>
<div>$$t_n = 1$$</div>
<div>$$f(t_n,y_n) = 13.4881788187$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = 13.4881788187$$</div>
<div>$$y_{n+1} = -2 + 13.4881788187 = 11.4881788187$$</div>

And again...

<div>$$n = 2$$</div>
<div>$$y_n = 11.4881788187$$</div>
<div>$$t_n = 2$$</div>
<div>$$f(t_n,y_n) = -8.46797521974$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = -8.46797521974$$</div>
<div>$$y_{n+1} = 11.4881788187 - 8.46797521974 = 3.02020359896$$</div>

And once more...

<div>$$n = 3$$</div>
<div>$$y_n = 3.02020359896$$</div>
<div>$$t_n = 3$$</div>
<div>$$f(t_n,y_n) = 52.2027345057$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = 52.2027345057$$</div>
<div>$$y_{n+1} = 3.02020359896 + 52.2027345057 = 55.2229381047$$</div>

Therefore we have:

<div>$$y(4) = 55.2229381047$$</div>

### Task 1 b)

Do the same as above using midpoint method.

This time use 2 steps.

1. <span>$$y_{i+1 / 2} = y_i + \frac{h}{2}f(t_i,y_i)$$</span>
2. <span>$$y_{i+1} = y_i + hf(t_{i+1/2}, y_{i+1/2})$$</span>

Once again start with initial value.

<div>$$n = 0$$</div>
<div>$$y_n = 3$$</div>
<div>$$t_n = 0$$</div>
<div>$$f(t_{n+1/2},y_{n+1/2}) = 3.6128$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = 3.6128$$</div>
<div>$$y_{n+1} = 6.6128$$</div>

and again

<div>$$n = 1$$</div>
<div>$$y_n = 6.6128$$</div>
<div>$$t_n = 1$$</div>
<div>$$f(t_{n+1/2},y_{n+1/2}) = 8.45$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = 8.45$$</div>
<div>$$y_{n+1} = 15.0628$$</div>

and again...

<div>$$n = 2$$</div>
<div>$$y_n = 15.0628$$</div>
<div>$$t_n = 2$$</div>
<div>$$f(t_{n+1/2},y_{n+1/2}) = 20.3804922102$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = 20.3804922102$$</div>
<div>$$y_{n+1} = 35.443292210238610$$</div>


Therefore we have:

<div>$$y(3) = 35.443292210238610$$</div>

### Task 1 c)

Huens method

Find the gradient at the initial point and the next point.

Then move by the average of the two points.


Once again start with initial value.

Note this time delta y is the average of the two gradients.

<div>$$n = 0$$</div>
<div>$$y_n = 3$$</div>
<div>$$t_n = 0$$</div>
<div>$$f(t_n, y_n) = -5$$</div>
<div>$$f(t_{n+1}, y_{n+1}) = f(1, -2) = 13.4881788187$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = \frac {13.4881788187 - 5} {2} = 4.24408940935$$</div>
<div>$$y_{n+1} = 3 + 4.24408940935 = 7.24408940935$$</div>

and again...

<div>$$n = 1$$</div>
<div>$$y_n = 7.24408940935$$</div>
<div>$$t_n = 1$$</div>
<div>$$f(t_n, y_n) = -11.1627262729$$</div>
<div>$$f(t_{n+1}, y_{n+1}) = f(2, 7.24408940935-11.1627262729) = 32.6168665996$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = \frac {32.6168665996 - 11.1627262729} {2} = 10.7270701633$$</div>
<div>$$y_{n+1} = 7.24408940935 + 10.7270701633 = 17.9711595727$$</div>

and again...

<div>$$n = 2$$</div>
<div>$$y_n = 17.9711595727$$</div>
<div>$$t_n = 2$$</div>
<div>$$f(t_n, y_n) = -25.7559238971$$</div>
<div>$$f(t_{n+1}, y_{n+1}) = f(3, 17.9711595727-25.7559238971) = 81.0159823013$$</div>
<div>$$h = 1$$</div>
<div>$$\Delta y = \frac {81.0159823013 - 25.7559238971} {2} = 27.6300292021$$</div>
<div>$$y_{n+1} = 17.9711595727 + 27.6300292021 = 45.601188774771686$$</div>


And thus <span>$$y(3)= 45.601188774771686$$</span>

