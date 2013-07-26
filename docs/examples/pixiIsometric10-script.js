var WIDTH = 700;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// An iso tile is twice as wide as it is tall (2w x h)
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

// map
var G = 0, D = 1, W = 2, X  = 3;
var terrain = [
    [G, G, G, G],
    [D, D, X, D],
    [D, G, X, W],
    [D, G, W, W],
    [G, G, W, W],
];

var tileHeight =  60;
var tileWidth = 60;

// tiles
var grass = isoTile(0x80CF5A, 0x339900, tileWidth, tileHeight);
var dirt = isoTile(0x96712F, 0x403014, tileWidth, tileHeight);
var water = isoTile(0x85b9bb, 0x476263, tileWidth, tileHeight);
var empty = function(){};
var tileMethods = [grass, dirt, water, empty];


function drawMap(terrain, xOffset) {
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
            drawTile(xOffset + isoX, isoY);
        }
    }
}

drawMap(terrain, WIDTH / 2);

function animate() {
  renderer.render(stage);
}

requestAnimFrame(animate);