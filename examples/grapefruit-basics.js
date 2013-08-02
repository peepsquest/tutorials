(function() {
  var Avatar, DISTANCE, Game, TmxObject, activeObject, assets, mapDown, mapMove, mapUp, moveActive, objDown, onKeyboardDown, onKeyboardLeft, onKeyboardRight, onKeyboardUp, preventDefault, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  assets = [
    {
      name: 'world',
      src: 'img/isometric_grass_and_water.json'
    }, {
      name: 'avatar',
      src: 'img/redOrb.png'
    }
  ];

  TmxObject = (function(_super) {
    __extends(TmxObject, _super);

    function TmxObject() {
      _ref = TmxObject.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return TmxObject;

  })(gf.Sprite);

  Game = (function(_super) {
    __extends(Game, _super);

    function Game(containerId, options) {
      this.options = options;
      _.defaults(this.options, {
        gravity: 0,
        friction: 0
      });
      Game.__super__.constructor.apply(this, arguments);
    }

    Game.prototype.start = function() {
      var _this = this;
      this.loader.on('complete', function() {
        _this.onGameReady();
        return _this.render();
      });
      return this.loader.load(this.options.assets);
    };

    Game.prototype.onGameReady = function() {
      var layer, state, world;
      state = new gf.GameState('world');
      this.addState(state);
      world = state.loadWorld('world');
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
      layer = this.world.findLayer('beings');
      return layer.spawn();
    };

    return Game;

  })(gf.Game);

  mapDown = function(e) {
    var pos;
    pos = e.getLocalPosition(this.parent);
    return this.drag = pos;
  };

  mapUp = function(e) {
    return this.drag = null;
  };

  mapMove = function(e) {
    var dx, dy, pos;
    if (this.drag) {
      pos = e.getLocalPosition(this.parent);
      dx = pos.x - this.drag.x;
      dy = pos.y - this.drag.y;
      this.pan(dx, dy);
      return this.drag = pos;
    }
  };

  activeObject = null;

  DISTANCE = 4;

  preventDefault = function(e) {
    return e.input.preventDefault(e.originalEvent);
  };

  moveActive = function(dx, dy, e) {
    var x, y, _ref1;
    if (!(activeObject != null ? activeObject.location : void 0)) {
      return;
    }
    _ref1 = activeObject.location, x = _ref1.x, y = _ref1.y;
    activeObject.setPosition(x + dx, y + dy);
    return preventDefault(e);
  };

  objDown = function(e) {
    if (activeObject) {
      activeObject.alpha = 1;
    }
    activeObject = e.object;
    return activeObject.alpha = 0.5;
  };

  onKeyboardDown = function(e) {
    if (e.originalEvent.shiftKey) {
      return moveActive(0, DISTANCE, e);
    } else {
      return moveActive(DISTANCE, DISTANCE, e);
    }
  };

  onKeyboardRight = function(e) {
    if (e.originalEvent.shiftKey) {
      return moveActive(DISTANCE, 0, e);
    } else {
      return moveActive(DISTANCE, -DISTANCE, e);
    }
  };

  onKeyboardLeft = function(e) {
    if (e.originalEvent.shiftKey) {
      return moveActive(-DISTANCE, 0, e);
    } else {
      return moveActive(-DISTANCE, DISTANCE, e);
    }
  };

  onKeyboardUp = function(e) {
    if (e.originalEvent.shiftKey) {
      return moveActive(0, -DISTANCE, e);
    } else {
      return moveActive(-DISTANCE, -DISTANCE, e);
    }
  };

  Avatar = (function(_super) {
    __extends(Avatar, _super);

    function Avatar(options) {
      var assetId, game;
      game = options.game, assetId = options.assetId;
      Avatar.__super__.constructor.call(this, gf.assetCache[assetId]);
      this.setupKeyboardHandlers(game);
    }

    /*
    * Sets up keyboard handlers using closures instead of bind.
    */


    Avatar.prototype.setupKeyboardHandlers = function(game) {
      var that;
      that = this;
      onKeyboardDown = function(e) {
        that.position.y += 5;
        return preventDefault(e);
      };
      onKeyboardRight = function(e) {
        that.position.x += 5;
        return preventDefault(e);
      };
      onKeyboardLeft = function(e) {
        that.position.x -= 5;
        return preventDefault(e);
      };
      onKeyboardUp = function(e) {
        that.position.y -= 5;
        return preventDefault(e);
      };
      game.input.keyboard.on(gf.input.KEY.DOWN, onKeyboardDown);
      game.input.keyboard.on(gf.input.KEY.UP, onKeyboardUp);
      game.input.keyboard.on(gf.input.KEY.LEFT, onKeyboardLeft);
      return game.input.keyboard.on(gf.input.KEY.RIGHT, onKeyboardRight);
    };

    return Avatar;

  })(gf.Sprite);

  $(function() {
    var $game, game;
    $game = $('#game');
    game = new Game('game', {
      width: $game.width() - 3,
      height: $game.height() - 3,
      background: 0xEEFFFF,
      assets: assets
    });
    window.dbgGame = game;
    return game.start();
  });

}).call(this);


/*
//@ sourceMappingURL=grapefruit-basics.map
*/