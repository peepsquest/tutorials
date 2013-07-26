var WIDTH = 700;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
document.body.appendChild(renderer.view);

var loader = new PIXI.AssetLoader(['img/roadTiles.json']);

// map
var G=0, D=1, W=2;
var terrain = [
    [G, G, G, G, W],
    [D, D, G, G, W],
    [D, G, G, W, W],
    [D, G, W, W, W],
    [G, G, W, W, W],
];

var tileHeight = 50;
var tileWidth = 50;

// tiles
var grass = isoTile('grass.png');
var dirt = isoTile('dirt.png');
var water = isoTile('water.png');
var sand = isoTile('beach.png');
var tileMethods = [grass, dirt, water, sand];

function isoTile(filename) {
  return function(x, y) {
    var tile = PIXI.Sprite.fromFrame(filename);
    tile.position.x = x;
    tile.position.y = y;

    // bottom-left
    tile.anchor.x = 0;
    tile.anchor.y = 1;
    stage.addChild(tile);
  }
}

function drawMap(terrain, xOffset, yOffset) {
    var tileType, x, y, isoX, isoY, idx;

    for (var i = 0, iL = terrain.length; i < iL; i++) {
        for (var j = 0, jL = terrain[i].length; j < jL; j++) {
            // cartesian 2D coordinate
            x = j * tileWidth;
            y = i * tileHeight;

            // iso coordinate
            isoX = x - y;
            isoY = (x + y) / 2;

            tileType = terrain[i][j];
            drawTile = tileMethods[tileType];
            drawTile(isoX + xOffset, isoY + yOffset);
        }
    }
}

loader.onComplete = start;
loader.load();

function start() {
  drawMap(terrain, WIDTH / 2, tileHeight * 1.5);

  function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
  }
  requestAnimFrame(animate);
}