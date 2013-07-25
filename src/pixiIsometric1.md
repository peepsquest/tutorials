<a href='index.html'>
  <img id="logo" src="img/pixi.png" />
</a>

# Pixi.js Isometric Map Part 1

:::BEGIN Example

This example draws an isometric map using a tile created from Pixi.js primitives. Inspired by [Juwal Bose's Isometric Worlds](http://gamedev.tutsplus.com/tutorials/implementation/creating-isometric-worlds-a-primer-for-game-developers/).

{{{EXAMPLE style='height: 310px;'}}}

## Setup Stage and Renderer

Setup the stage as usual.

```js
var WIDTH = 700;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

document.body.appendChild(renderer.view);
```

## Rendering a Tile

Let's use Pixi.js primitives to draw isometric tiles. An isometric tile
is twice as wide as it is tall. So, a 60x60 square tile becomes a 120x60
isometric tile.

```js
var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// an iso tile is twice as wide as it is tall (h is original dimension)
function isoTile(backgroundColor, borderColor, w, h) {
    var h_2 = h/2;

    return function(x, y) {
        graphics.beginFill(backgroundColor);
        graphics.lineStyle(1, borderColor, 1);
        graphics.moveTo(x, y);
        graphics.lineTo(x + w, y + h_2);
        graphics.lineTo(x, y + h);
        graphics.lineTo(x - w, y + h_2);
        graphics.lineTo(x , y);
        graphics.endFill();
    }
}
```

## Map and Tile Metadata

To better visualize how the tiles are drawn let's define some constants.
Note, game logic should remain in 2D coordinates. Transformation to iso
coordinates occurs when placing or hit testing on the stage.

```js
// map
var rows = 5;
var cols = 4;
var G = 0, D = 1, W = 2, X  = 3;
var terrain = [
    G, G, G, G,
    D, D, X, D,
    D, G, X, W,
    D, G, W, W,
    G, G, W, W
];

var tileHeight =  60;
var tileWidth = 60;

// tiles
var grass = isoTile(0x80CF5A, 0x339900, tileWidth, tileHeight);
var dirt = isoTile(0x96712F, 0x403014, tileWidth, tileHeight);
var water = isoTile(0x85b9bb, 0x476263, tileWidth, tileHeight);
var empty = function(){};
var tileMethods = [grass, dirt, water, empty];
```

## Rendering the Isometric Map

This algorithm draws the map with the x-axis increasing
in southeast direction and the y-axis increasing in a southwest direction.

```js

function drawMap(xOffset, rows, cols) {
    var tileType, x, y, isoX, isoY, idx, iso={};

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            idx = i * cols + j;
            tileType = terrain[idx];

            // cartesian 2D coordinate
            x = j * tileWidth;
            y = i * tileHeight;

            // iso coordinate
            isoX = x - y;
            isoY = (x + y) / 2;

            drawTile = tileMethods[tileType];
            drawTile(xOffset + isoX, isoY);
        }
    }
}

drawMap(WIDTH / 2, rows, cols);
```

Since there is no interactivity, render the map once.

```js
function animate() {
  renderer.render(stage);
}

requestAnimFrame(animate);
```

:::> support/common.md


:::END
