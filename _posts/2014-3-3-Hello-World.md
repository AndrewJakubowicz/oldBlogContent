---
layout: post
title: What is programming, with pictures!
---


Before reading this, install Dr Racket and set the language to "Beginner Student".

## Introduction to programming!

Coding is a way to tell the computer what to do. Computers are very stupid, so we have to be very specific in the instructions we give. This little introduction will show you how easy it is to make a simple animation.



## Programming Basics
Everything is a function! You already know a bunch of functions without even knowing you know. Plus is a function, and so is minus!. So let's see how these "functions" work.

If you haven't already open Dr Racket and set the language to "Beginning Student".

The screen is divided into two sections. The bottom section has a little arrow ">" which you can type next to. This is a place where you can write code to be immediately read by the computer.

Type the following next to the arrow, `(+ 2 1)` and press enter. You should get something similar to what's shown below.

```
> (+ 2 1)
3
>
```
Try to guess how these work while you type them in.

```
> (+ 1 2 3)

> (- 10 2)

> (/ 6 2)

> (* 2 5)

```

But computers are awesome and can do a lot more than just maths. Especially because people have written functions for us to use to do amazing things!

Before drawing pictures. Let's write some code in the top window. This panel lets us write larger programs. The code only runs when we click the green run arrow.

Type the following into the top area. Try to guess what's going to happen when you click *Run*.

```
(+ (- 5 2) 2 (* 5 (- 6 4)))
```

If you click *Step* the code will execute step by step. This allows us to see exactly how the computer is reading the code. The computer moves from left to right, evaluating the contents of brackets whenever a closing bracket is encountered.
This is easier seen so I've written out the steps below.

```
(+ (- 5 2) 2 (* 5 (- 6 4)))
(+ 3 2 (* 5 (- 6 4)))
(+ 3 2 (* 5 2))
(+ 3 2 10)
15
```
Finally it's time for cats!

> Note: If you ever want to look at a function in more detail. Click on it, and press *F1*. This will open documentation for it.

## Let's draw some pictures.

The first thing we must do is *import functions that let us draw*. This is really easy. At the top of your code window type:

```
(require 2htdp/image)
```

From now on I'll leave out the `(require 2htdp/image)` from examples. Make sure it's at the top of your file though!



This is a very special kind of text editor. You can copy images into it!
![Little Cartoon Cat]({{ site.baseurl }}/images/p1/p1_little_cartoon_cat.jpg)
![Small Mouse]({{ site.baseurl }}/images/p1/p1_little_mouse.png)

Let's put this cat into a scene! Before we can use images we need to import the functions.

In the top window, as the first line of your code write the following:

``` (require 2htdp/image) ```

Click run! Now you can use all sorts of fun image drawing functions.

In the bottom panel lets try out some new functions.

```
> (square 50 "solid" "blue")
```

This one lets us place images onto a scene.
Write it in the upper window and the press Run to see the result.

```
(place-image (circle 30 "outline" "red")
             50
             50
             (empty-scene 100 100))
```
The computer has to know where to draw the cat and the mouse. To do this the computer uses X and Y co-ordinates.

The top left corner of the screen has an X value of 0 and a Y value of 0. Travelling down the screen increases Y and travelling right increases X.

[*place-image*](https://docs.racket-lang.org/teachpack/2htdpimage.html#%28def._%28%28lib._2htdp%2Fimage..rkt%29._place-image%29%29) takes an image, an X and Y co-ordinate, and finally a drawing. This drawing can be another place-image function. This is how we will put our cat and mouse on the screen!

```
(place-image <Image> <Xposition> <Yposition> <Image>)
```
> Note that this template matches the way we used the function above.

Let's define our cat and mouse images. This lets us use the word *CAT* or *MOUSE* in the code to refer to the different pictures.


(define CAT ![Little Cartoon Cat]({{ site.baseurl }}/images/p1/p1_little_cartoon_cat.jpg))

(define MOUSE ![Small Mouse]({{ site.baseurl }}/images/p1/p1_little_mouse.png))

```
(place-image MOUSE 50 100
             (place-image CAT 100 70 (empty-scene 200 140)))
```

When you run your code you should see your cat and mouse staring lovingly at each other.

![cat and mouse on scene]({{ site.baseurl }}/images/p1/cat_and_mouse.png)

This is not quite animated yet, but we've done almost all the work.

## Functions bring life

We are going to write our own function. Not a boring function like *plus* or *minus* but a cool function that draws a cat and a mouse in the right positions.

We've actually done most of the work. All we need to do now is make the mouse move across the screen. If you play with the code you should notice you can change numbers to move the mouse around the screen. We'll focus on just changing the X value.

Let's modify the code to turn it into a function.

```
(define (draw-cat-mouse-scene x-mouse)
  (place-image MOUSE x-mouse 100
               (place-image CAT 100 70 (empty-scene 200 140))))
```

Let's remove the place-image code so we can focus on what was added.

```
(define (draw-cat-mouse-scene x-mouse)
  ...
  )
```

We have given our block of code a name. The name we gave it is *"draw-cat-mouse-scene"*. We also gave it a single argument *"x-mouse"*.
Notice that within the code we changed the X position of the mouse to the *"x-mouse"*.

If you press Run, nothing should happen. However you can now type the following into the bottom window:

```
> (draw-cat-mouse-scene 30)
```

This will draw the scene with the mouse at an X position of 30.

Finally we can use a magic function to make the mouse move!
Add the following to the top of your code.

```
(require 2htdp/universe)
```

Run the program. In the bottom window you can now type:

```
(animate draw-cat-mouse-scene)
```

*animate* is a function that takes any function you give it, and inputs a frame number. Starting from 0 and increasing as long as your animation keeps playing. You'll notice when you close the window a number appears. That number is the number of frames that your animation ran for.

We are abusing the fact that the mouse starts at an X position 0, and moves in an increasing x direction. This allows us to use the frame number to move the mouse.




### Resources

Cartoon animals

- [Cat](http://cliparts.co/clipart/3608707)
- [Mouse](http://cliparts.co/clipart/5908)
