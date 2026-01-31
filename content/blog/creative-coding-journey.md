---
title: "My Creative Coding Journey"
description: "How exploring generative art and creative coding transformed my perspective on software development."
date: "2026-01-01"
category: "Creative"
tags: ["creative coding", "generative art", "p5.js", "personal"]
---

# My Creative Coding Journey

There's something magical about writing code that creates beauty. Not functional beauty—the elegance of a well-structured algorithm—but actual visual beauty. Art that emerges from logic. This is the world of creative coding, and falling into it changed everything about how I approach software development.

## The Accidental Beginning

It started with a simple question: "What if code could paint?"

I was burnt out. After years of building CRUD applications and wrestling with state management, I needed something different. I stumbled upon a p5.js sketch someone had shared—simple circles growing and overlapping, creating unexpectedly organic patterns.

```javascript
function setup() {
  createCanvas(800, 800);
  background(0);
}

function draw() {
  noStroke();
  fill(255, 10);
  let x = width/2 + cos(frameCount * 0.02) * 200;
  let y = height/2 + sin(frameCount * 0.03) * 200;
  circle(x, y, 50);
}
```

This tiny snippet of code created something mesmerizing. I was hooked.

## The First Experiments

My early experiments were humble. Basic shapes, simple movements. But even these revealed something profound: code isn't just for solving problems. It's a medium for expression.

### Playing with Noise

Perlin noise became my first obsession. Unlike random(), which creates jarring, disconnected values, Perlin noise flows smoothly:

```javascript
function draw() {
  loadPixels();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let noiseVal = noise(x * 0.01, y * 0.01, frameCount * 0.01);
      let brightness = map(noiseVal, 0, 1, 0, 255);
      set(x, y, color(brightness));
    }
  }
  
  updatePixels();
}
```

The result? Flowing, cloud-like patterns that seemed almost alive.

## What Creative Coding Taught Me

### 1. Embrace Imperfection

In traditional programming, bugs are failures. In creative coding, they're often gifts. Some of my favorite pieces emerged from mistakes—a misplaced decimal point, an off-by-one error, a forgotten variable reset.

> "The computer is a bicycle for the mind, but sometimes the most interesting paths are the ones we take by accident."

### 2. Constraints Breed Creativity

Working within limitations forces innovation. A 140-character tweet-sized sketch. A piece that only uses circles. Black and white only. These constraints don't limit creativity—they focus it.

### 3. Process Over Product

The creative coding community values the process as much as (or more than) the final result. It's about exploration, experimentation, and the joy of discovery. This mindset has transformed how I approach all my work.

### 4. Math is Beautiful

I never truly appreciated mathematics until creative coding made it visual. Now I see beauty in:

- **Trigonometry** - The endless curves of sine and cosine
- **Vectors** - Forces and movements that feel natural
- **Fractals** - Infinite complexity from simple rules
- **Recursion** - Patterns within patterns within patterns

## Tools of the Trade

My creative coding toolkit has evolved over time:

**Languages & Frameworks:**
- **p5.js** - Perfect for beginners, great for web
- **Processing** - The original, still powerful
- **Three.js** - When you need 3D
- **GLSL** - Direct GPU programming for maximum performance

**Inspiration Sources:**
- #genart on Twitter/X
- r/generative on Reddit
- OpenProcessing
- The Coding Train on YouTube

## A Simple Example: Flow Fields

One of my favorite techniques is the flow field. It creates organic, flowing patterns by guiding particles along invisible currents:

```javascript
let particles = [];
let flowField;
let scale = 20;
let cols, rows;

function setup() {
  createCanvas(800, 800);
  cols = floor(width / scale);
  rows = floor(height / scale);
  
  for (let i = 0; i < 1000; i++) {
    particles.push(createVector(random(width), random(height)));
  }
  
  background(10);
}

function draw() {
  // Generate flow field
  flowField = [];
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let angle = noise(xoff, yoff, frameCount * 0.005) * TWO_PI * 2;
      flowField.push(p5.Vector.fromAngle(angle));
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  
  // Move particles
  for (let p of particles) {
    let x = floor(p.x / scale);
    let y = floor(p.y / scale);
    let index = x + y * cols;
    let force = flowField[index];
    
    p.add(force);
    
    // Draw
    stroke(255, 5);
    point(p.x, p.y);
    
    // Wrap around
    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
  }
}
```

Run this for a few minutes, and watch as intricate patterns emerge from simple rules.

## How It Changed My "Real" Work

The skills I developed through creative coding have directly improved my professional work:

- **Better debugging intuition** - When you're hunting for why a pattern looks wrong, you develop keen observational skills
- **Performance awareness** - Creative coding pushes hardware limits, teaching optimization by necessity
- **New perspectives on problems** - Sometimes the solution to a UX problem is visual, not logical
- **Renewed passion** - The joy of creating carries over to all projects

## Getting Started

If you're curious about creative coding, here's my advice:

1. **Start with p5.js** - Go to editor.p5js.org and just play
2. **Copy and modify** - Find sketches you like and tweak them
3. **Join the community** - Creative coders are incredibly welcoming
4. **Share your work** - Even the "bad" stuff. Especially the bad stuff.
5. **Make it daily** - #dailycode or #genuary are great motivators

## Looking Forward

Creative coding has become an integral part of who I am as a developer. It's not just a hobby—it's a lens through which I see all of programming.

Every function is a brush stroke. Every algorithm is a composition. Every bug is a happy accident waiting to be discovered.

If you've never tried creative coding, I encourage you to give it a shot. You might just find, like I did, that it changes everything.

---

*Creating anything interesting with code? I'd love to see it. Share your work with me on Twitter—let's celebrate the art that emerges from our keyboards.*
