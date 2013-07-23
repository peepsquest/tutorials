<a href='index.html'>
  <img id="logo" src="img/pixi.png" />
</a>

# Pixi.js Basics

:::BEGIN Example

In this example (example1 from pixi.js project) we'll cover the basics of using a `Stage`, `Renderer`,
`Sprite` and `Texture`.

{{{EXAMPLE style='height: 310px;'}}}

## Setup Stage and Renderer

First create a stage which is a logical rectangular area to place
content. A renderer is responsible for drawing the stage onto the
page using either Canvas or WebGL depending on the features of the browser.

```js
var WIDTH = 400;
var HEIGHT = 300;
var stage = new PIXI.Stage(0x66FF99);

// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

// attach render to page
document.body.appendChild(renderer.view);
```

## Adding a Sprite

Let's create a sprite which is a basic drawing unit. A texture
is assigned to a sprite to give it its visual appearance. The sprite
must be added to a stage for rendering.

```js
var texture = PIXI.Texture.fromImage('img/bunny.png');
var bunny = new PIXI.Sprite(texture);

// rotate around center
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// center in stage
bunny.position.x = WIDTH / 2;
bunny.position.y = HEIGHT / 2;

stage.addChild(bunny);
```

## Animation

To animate it, we'll request an animation frame repeatedly using the
same function, each time rotating the bunny sprite 1/10th of a radian.

```js
function animate() {
  bunny.rotation += 0.1;
  renderer.render(stage);
  requestAnimFrame(animate);
}

requestAnimFrame(animate);
```

:::> support/common.md

:::END
