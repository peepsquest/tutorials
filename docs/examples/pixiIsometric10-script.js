var WIDTH = 700;
var HEIGHT = 300;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

document.body.appendChild(renderer.view);

var graphics = new PIXI.Graphics();
stage.addChild(graphics);

// create a closure to simplify code
function colorRhombus(backgroundColor, borderColor, w, h) {
    return function(x, y) {
        graphics.beginFill(backgroundColor);
        graphics.lineStyle(1, borderColor, 1);
        graphics.moveTo(x + w/2, y);
        graphics.lineTo(x + w, y + h/2);
        graphics.lineTo(x + w/2, y + h);
        graphics.lineTo(x, y + h/2);
        graphics.lineTo(x + w/2, y);
        graphics.endFill();
    }
}

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

var twoDHeight =  120;
var twoDWidth =  120;
var tileWidth = twoDWidth;
var tileHeight = twoDHeight / 2;

// tiles
var grass = colorRhombus(0x80CF5A, 0x339900, tileWidth, tileHeight);
var dirt = colorRhombus(0x96712F, 0x403014, tileWidth, tileHeight);
var water = colorRhombus(0x85b9bb, 0x476263, tileWidth, tileHeight);
var empty = function(){};
var tileMethods = [grass, dirt, water, empty];

function drawMap(xOffset, rows, cols) {
    var tileType, x, y, idx;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            idx = i * cols + j;
            tileType = terrain[idx];

            // 2D coordinate
            x = j * twoDWidth;
            y = i * twoDHeight;

            // image placement coordinates
            x = (x - y) / 2;
            y = (x + y) / 2;

            drawTile = tileMethods[tileType];
            drawTile(xOffset + x, y);
        }
    }
}

drawMap(WIDTH / 2, rows, cols);

function animate() {
  renderer.render(stage);
}

requestAnimFrame(animate);