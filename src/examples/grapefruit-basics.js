/* globals $,_,window,gf */
"use strict";

//{{{ Content assets
var assets = [
    {name: 'world', src: 'img/isometric_grass_and_water.json'},
    {name: 'avatar', src: 'img/redOrb.png'}
];
//}}}


//{{{ Content game-class
var Game = function(containerId, options) {
    this.options = options;
    _.defaults(this.options, {
        gravity: 0,
        friction: 0
    });
    gf.Game.call(this, containerId, this.options);
};
//}}}

//{{{ Content game-start
gf.inherits(Game, gf.Game, {
    start: function() {
        var that = this;
        this.loader.on('complete', function() {
            that.onGameReady();
            that.render();
        });
        this.loader.load(this.options.assets);
    },
//}}}

//{{{ Content game-ready
    onGameReady: function() {
        var state = new gf.GameState('world');
        this.addState(state);

        state.loadWorld('world');
        state.world.interactive = true;
        state.world.mousedown = mapDown;
        state.world.mouseup = mapUp;
        state.world.mousemove = mapMove;
        state.world.on('object.mousedown', objDown);
        state.input.keyboard.on(gf.input.KEY.DOWN, onKeyboardDown);
        state.input.keyboard.on(gf.input.KEY.UP, onKeyboardUp);
        state.input.keyboard.on(gf.input.KEY.LEFT, onKeyboardLeft);
        state.input.keyboard.on(gf.input.KEY.RIGHT, onKeyboardRight);

        this.enableState('world');
        var layer = this.world.findLayer('beings');
        layer.spawn();

        // start with the world centered and slightly down
        this.world.pan(this.camera.size.x / 2, 100);
    }
});
//}}}


//{{{ Content pan-world
function mapDown(e) {
    var pos = e.getLocalPosition(this.parent);
    this.drag = pos;
}

function mapUp(e) {
    this.drag = null;
}

function mapMove(e) {
    if (this.drag) {
        var pos = e.getLocalPosition(this.parent);
        var dx = pos.x - this.drag.x;
        var dy = pos.y - this.drag.y;
        this.pan(dx, dy);
        this.drag = pos;
    }
}

//}}}

//{{{ Content activate-object
var activeObject = null;
var DISTANCE = 4;

function preventDefault(e) {
    e.input.preventDefault(e.originalEvent);
}

function moveActive(dx, dy, e) {
    if (!activeObject && !activeObject.location) return;
    var location = activeObject.location;
    activeObject.setPosition(location.x + dx, location.y + dy);
    preventDefault(e);
}

function objDown(e) {
    if (activeObject)
        activeObject.alpha = 1;
    activeObject = e.object;
    activeObject.alpha = 0.5;
}
//}}}

//{{{ Content move-object
function onKeyboardDown(e) {
    e.originalEvent.shiftKey ? moveActive(0, DISTANCE, e) :
            moveActive(DISTANCE, DISTANCE, e);
}

function onKeyboardRight(e) {
    e.originalEvent.shiftKey ? moveActive(DISTANCE, 0, e) :
            moveActive(DISTANCE, -DISTANCE, e);
}

function onKeyboardLeft(e) {
    e.originalEvent.shiftKey ? moveActive(-DISTANCE, 0, e) :
            moveActive(-DISTANCE, DISTANCE, e);
}

function onKeyboardUp(e) {
    e.originalEvent.shiftKey ? moveActive(0, -DISTANCE, e) :
            moveActive(-DISTANCE, -DISTANCE, e);
}
//}}}


//{{{ Content start-game
$(function() {
    var $game = $('#game');
    var game = new Game('game', {
        width: $game.width() - 3,
        height: $game.height() - 3,
        background: 0xEEFFFF,
        assets: assets
    });
    window.dbgGame = game;
    game.start();
});
//}}}