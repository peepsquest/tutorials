var WIDTH = 400;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);

// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

// attach render to page
document.body.appendChild(renderer.view);

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

function animate() {
  leaf.rotation -= 0.02;
  renderer.render(stage);
  requestAnimFrame(animate);
}

requestAnimFrame(animate);