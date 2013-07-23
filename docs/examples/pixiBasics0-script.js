var WIDTH = 400;
var HEIGHT = 300;
var stage = new PIXI.Stage(0x66FF99);

// let pixi choose WebGL or canvas
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

// attach render to page
document.body.appendChild(renderer.view);

var texture = PIXI.Texture.fromImage('img/bunny.png');
var bunny = new PIXI.Sprite(texture);

// rotate around center
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// center in stage
bunny.position.x = WIDTH / 2;
bunny.position.y = HEIGHT / 2;

stage.addChild(bunny);

function animate() {
  bunny.rotation += 0.1;
  renderer.render(stage);
  requestAnimFrame(animate);
}

requestAnimFrame(animate);