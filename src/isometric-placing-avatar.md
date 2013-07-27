# Pixi.js Isometric Map Part 3 - Placing Avatar

:::BEGIN Example

In this example, we'll add an avatar/character to the map the can be moved.
Move the orb using `ARROW` or `SHIFT + ARROW` to lock to axis. (click the
map first)

{{{EXAMPLE style='height: 310px;'}}}

:::@ --hide

```js
// account for tile thickness
/* globals PIXI, kd, requestAnimFrame */
"use strict";

// avatar is 32x32 + 6px for shadow
var AVATAR_X_OFFSET = 32 / 2;
var AVATAR_Y_OFFSET = 32 / 2;
var MAP_WIDTH = 250;
var MAP_HEIGHT = 250;
var STAGE_WIDTH = 700;
var STAGE_HEIGHT = 300;
var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;
var THICKNESS = 8; // 10 pixels of dirt height

// isometric view and anchor at bottom left skews everything,
// basically moves the map so iso (0, 0) is near the middle top
var SKEW_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH;
var SKEW_Y_OFFSET = TILE_HEIGHT * 2;

var avatar;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT);
document.body.appendChild(renderer.view);

var loader = new PIXI.AssetLoader(['img/roadTiles.json']);

// map
var G=0, D=1, W=2;
var terrain = [
  [D, D, G, G, W],
  [D, D, G, G, W],
  [D, G, G, W, W],
  [D, G, W, W, W],
  [D, G, W, W, W],
];

// Tiles with height can exceed these dimensions.
var tileHeight = 50;
var tileWidth = 50;

// tiles
var grass = isoTile('grass.png');
var dirt = isoTile('dirt.png');
var water = isoTile('water.png');
var tileMethods = [grass, dirt, water];

function isoTile(filename) {
  return function(x, y) {
    var tile = PIXI.Sprite.fromFrame(filename);
    tile.position.x = x;
    tile.position.y = y;

    // bottom-left
    tile.anchor.x = 0.0;
    tile.anchor.y = 1;
    stage.addChild(tile);
  };
}

// 2D to isometric
function ddToIso(x, y) {
  return {
    x: x - y,
    y: (x + y) / 2
  };
}

function stageMap(terrain) {
  var stageTile, tileType, x, y, iso;

  for (var i = 0, iL = terrain.length; i < iL; i++) {
    for (var j = 0, jL = terrain[i].length; j < jL; j++) {
      // dd 2D coordinate
      x = j * tileWidth;
      y = i * tileHeight;

      // iso coordinate
      iso = ddToIso(x, y);

      tileType = terrain[i][j];
      stageTile = tileMethods[tileType];
      stageTile(iso.x + SKEW_X_OFFSET, iso.y + SKEW_Y_OFFSET);
    }
  }
}

function Coordinates() {
  // Converts 2D coordinates to tile coordinates taking into
  // account anchor placement and thickness of tile
  function ddToTile(x, y) {
    var iso = ddToIso(x, y);
    return {
      x: iso.x + SKEW_X_OFFSET + TILE_WIDTH,
      y: iso.y + SKEW_Y_OFFSET - TILE_WIDTH - THICKNESS
    };
  }

  // Offset a 2D point keeping the point within the boundaries
  // of the map.
  function ddOffset(pt, byX, byY) {
    pt.x = Math.max(0, Math.min(pt.x + byX, MAP_WIDTH));
    pt.y = Math.max(0, Math.min(pt.y + byY, MAP_HEIGHT));
  }

  // Avatars avatar has depth too so we must ensure
  function ddToAvatar(x, y) {
    x = Math.min(MAP_WIDTH - 10, Math.max(0, x));
    y = Math.min(MAP_HEIGHT - 10, Math.max(0, y));

    var tile = ddToTile(x, y);
    return {
      x: tile.x - AVATAR_X_OFFSET,
      y: tile.y + AVATAR_Y_OFFSET
    };
  }

  return {
    ddToTile: ddToTile,
    ddToAvatar: ddToAvatar,
    ddOffset: ddOffset
  };
}
var coords = Coordinates();
```

## Loading Avatar

Placing the avatar onto the stage is not much different than placing a tile.

1.  Load the avatars texture and create a sprite from it.
2.  Transform the avatar's 2D position in isometric coordinates.

We must track the current avatar location which should not be confused
with the sprite position. The sprite position is used to render an
image on the screen and is affected by zoom, pan, etc.

The avatar's location is stored in `avatar.location`.
I do this because it is convenient for this tutorial. In your game,
consider using an entity-component library to encapsulate the logic
of an avatar.

```js

function stageAvatar(x, y) {
  var avatar = PIXI.Sprite.fromImage('img/redOrb.png');

  // track 2D position
  avatar.location = new PIXI.Point(x, y);

  var pt = coords.ddToAvatar(x, y);
  avatar.position.x = pt.x;
  avatar.position.y = pt.y;
  avatar.anchor.x = 0;
  avatar.anchor.y = 1;

  stage.addChild(avatar);
  return avatar;
}
```

`ddToAvatar` is a function which converts a 2D point into a point on
the map. There are several things to consider

1. Isometric conversion
2. Tile thickness
3. The footprint of the avatar
4. Restricting avatar within the map dimension
5. Avatar's anchor point

I won't go into much of the particular details. The constants in
the equations help explain the logic.

:::@ --no-capture

```js
// Converts 2D coordinates to tile coordinates taking into
// account anchor placement and thickness of tile
function ddToTile(x, y) {
  var iso = ddToIso(x, y);
  return {
    x: iso.x + SKEW_X_OFFSET + TILE_WIDTH,
    y: iso.y + SKEW_Y_OFFSET - TILE_WIDTH - THICKNESS
  };
}

// Offset a 2D point keeping the point within the boundaries
// of the map.
function ddOffset(pt, byX, byY) {
  pt.x = Math.max(0, Math.min(pt.x + byX, MAP_WIDTH));
  pt.y = Math.max(0, Math.min(pt.y + byY, MAP_HEIGHT));
}

// Avatars avatar have depth
function ddToAvatar(x, y) {
  x = Math.min(MAP_WIDTH - 10, Math.max(0, x));
  y = Math.min(MAP_HEIGHT - 10, Math.max(0, y));

  var tile = ddToTile(x, y);
  x = tile.x - AVATAR_WIDTH / 2; // 32 width
  y = tile.y + AVATAR_HEIGHT - 6; // 32 height + ?px shadow

  return {
    x: x,
    y: y
  };
}
```
## Avatar Movement

The avatar moves using the keyboard. We need to do a couple of things.

1. Hook into keyboard events
2. For each keyboard event, determine the next location for the avatar

I use a custom version of [keydrown](https://github.com/jeremyckahn/keydrown)
to also capture the original event. That is needed to detech the shift key.

```js
function moveAvatar(byX, byY) {
  // ensures avatar stays within bounds
  coords.ddOffset(avatar.location, byX, byY);

  var p = coords.ddToAvatar(avatar.location.x, avatar.location.y);
  avatar.position.x = p.x;
  avatar.position.y = p.y;
}

// keyboard input, ARROW to move, SHIFT + ARROW to move on axis
function moveUp(e) {
  e.shiftKey ? moveAvatar(0, -2) : moveAvatar(-2, -2);
}
function moveDown(e) {
  e.shiftKey ? moveAvatar(0, 2) : moveAvatar(2, 2);
}
function moveLeft(e) {
  e.shiftKey ? moveAvatar(-2, 0) : moveAvatar(-2, 2);
}
function moveRight(e) {
  e.shiftKey ? moveAvatar(2, 0) : moveAvatar(2, -2);
}

// game loop optimized keyboard handling
kd.UP.down(moveUp);
kd.DOWN.down(moveDown);
kd.LEFT.down(moveLeft);
kd.RIGHT.down(moveRight);
```

## Game Loop

It is important to render objects in depth order. The code below works
but it would fail miserably if say a tile closest to you was a tall tree.
The avatar would be walking on a branch instead of behind it on the
ground. This covers the basics :)


```js
loader.onComplete = start;
loader.load();
function start() {
  stageMap(terrain);
  avatar = stageAvatar(0, 0);

  function animate() {
    // keyboard handler
    kd.tick();
    requestAnimFrame(animate);
    renderer.render(stage);
  }
  requestAnimFrame(animate);
}
```
:::@ --hide

```html
<script src='js/vendor/keydrown.js'></script>
```

:::> support/common.md

:::END
