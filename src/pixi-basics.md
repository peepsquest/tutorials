# Pixi.js Basics

:::BEGIN Example

In this example we'll cover the basics of using a `Stage`, `Renderer`,
`Sprite` and `Texture`. We'll draw a simple leaf and rotate it.

{{{EXAMPLE style='height: 310px;'}}}

## Setup Stage and Renderer

First create a stage which is a logical rectangular area to place
content. A renderer is responsible for drawing the stage onto the
page using either Canvas or WebGL depending on the features of the browser.

```js
var WIDTH = 400;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);

// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

// attach render to page
document.body.appendChild(renderer.view);
```

## Adding the Leaf

Let's create a sprite which is a basic visual entity in games. The visual
appearance of a sprite is the texture assigned to it.

```js
var texture = PIXI.Texture.fromImage('img/leaf.png');
var leaf = new PIXI.Sprite(texture);

// rotate around center
leaf.anchor.x = 0.5;
leaf.anchor.y = 0.5;

// center in stage
leaf.position.x = WIDTH / 2;
leaf.position.y = HEIGHT / 2;

// place it on the stage for rendering
stage.addChild(leaf);
```

## Animation

To animate it, we'll request an animation frame repeatedly using the
same function, each time rotating the leaf by a fraction of a radiant.
In this example, we use a negative value which animates in a counter-clockwise
direction.

```js
function animate() {
  leaf.rotation -= 0.02;
  renderer.render(stage);
  requestAnimFrame(animate);
}

requestAnimFrame(animate);
```

:::> support/common.md

:::END
