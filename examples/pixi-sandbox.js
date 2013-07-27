// account for tile thickness
/* globals PIXI, kd, requestAnimFrame */
"use strict";

var STAGE_WIDTH = 700;
var STAGE_HEIGHT = 300;

var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;
var THICKNESS = 8; // 10 pixels of dirt height

var MAP_WIDTH = 250;
var MAP_HEIGHT = 250;

// isometric view and anchor at bottom left skews everything,
// basically moves the map so iso (0, 0) is near the middle top
var SKEW_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH;
var SKEW_Y_OFFSET = TILE_HEIGHT * 2;

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
    x = tile.x - 16; // 32 width
    y = tile.y + 16 - 6; // 32 height + ?px shadow

    return {
      x: x,
      y: tile.y + 16 - 6 // 38 height
    };
  }

  return {
    ddToTile: ddToTile,
    ddToAvatar: ddToAvatar,
    ddOffset: ddOffset
  };
}

var avatar;
var coords = Coordinates();


function stageAvatar(x, y) {
  avatar = PIXI.Sprite.fromImage('img/redOrb.png');
  avatar.dd = new PIXI.Point(x, y);

  var pt = coords.ddToAvatar(x, y);

  avatar.position.x = pt.x;
  avatar.position.y = pt.y;
  avatar.anchor.x = 0;
  avatar.anchor.y = 1;

  stage.addChild(avatar);
}

function moveAvatar(byX, byY) {
  // ensures avatar stays within bounds
  coords.ddOffset(avatar.dd, byX, byY);

  var p = coords.ddToAvatar(avatar.dd.x, avatar.dd.y);
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

loader.onComplete = start;
loader.load();
function start() {
  stageMap(terrain);
  stageAvatar(0, 0);

  function animate() {
    // keyboard handler
    kd.tick();
    requestAnimFrame(animate);
    renderer.render(stage);
  }
  requestAnimFrame(animate);
}

