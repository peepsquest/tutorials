(function() {
  var Avatar, Game, assets, mapDown, mapMove, mapUp,
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
      var hero, state;
      state = new gf.GameState('world');
      this.addState(state);
      state.loadWorld('world');
      state.world.interactive = true;
      state.world.mousedown = mapDown;
      state.world.mouseup = mapUp;
      state.world.mousemove = mapMove;
      this.enableState('world');
      hero = new Avatar({
        assetId: 'avatar',
        game: this
      });
      return state.addChild(hero);
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
      var onKeyboardDown, onKeyboardLeft, onKeyboardRight, onKeyboardUp, preventDefault, that;
      that = this;
      preventDefault = function(e) {
        return e.input.preventDefault(e.originalEvent);
      };
      onKeyboardDown = function(e) {
        var position;
        position = that.position;
        position.y += 5;
        return preventDefault(e);
      };
      onKeyboardRight = function(e) {
        var position;
        position = that.position;
        position.x += 5;
        return preventDefault(e);
      };
      onKeyboardLeft = function(e) {
        var position;
        position = that.position;
        position.x -= 5;
        return preventDefault(e);
      };
      onKeyboardUp = function(e) {
        var position;
        position = that.position;
        position.y -= 5;
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
    return game.start();
  });

}).call(this);


/*
//@ sourceMappingURL=grapefruit-basics.map
*/