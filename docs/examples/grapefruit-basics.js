(function() {
  var Avatar, Data, Game, mapDown, mapMove, mapUp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Data = {
    resources: ['img/isometric_grass_and_water.json', 'img/redOrb.png'],
    worlds: ['img/isometric_grass_and_water.json']
  };

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
      return this.loader.load(Data.resources);
    };

    Game.prototype.onGameReady = function() {
      var hero, state, world, _i, _len, _ref;
      _ref = Data.worlds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        world = _ref[_i];
        state = new gf.GameState(world);
        this.addState(state);
        state.loadWorld(world);
        state.world.interactive = true;
        state.world.mousedown = mapDown;
        state.world.mouseup = mapUp;
        state.world.mousemove = mapMove;
      }
      this.enableState(Data.worlds[0]);
      hero = new Avatar({
        resourceUrl: 'img/redOrb.png',
        state: state
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
      var resourceUrl, state, t;
      state = options.state, resourceUrl = options.resourceUrl;
      t = PIXI.Texture.fromImage(resourceUrl);
      Avatar.__super__.constructor.call(this, t);
      this.setupKeyboardHandlers(state);
    }

    /*
    * Sets up keyboard handlers using closure instead of bind.
    */


    Avatar.prototype.setupKeyboardHandlers = function(state) {
      var onKeyboardDown, onKeyboardLeft, onKeyboardRight, onKeyboardUp, that;
      that = this;
      onKeyboardDown = function(e) {
        var position;
        position = that.position;
        return position.y += 2;
      };
      onKeyboardRight = function(e) {
        var position;
        position = that.position;
        return position.x += 2;
      };
      onKeyboardLeft = function(e) {
        var position;
        position = that.position;
        return position.x -= 2;
      };
      onKeyboardUp = function(e) {
        var position;
        position = that.position;
        return position.y -= 2;
      };
      state.input.keyboard.on(gf.input.KEY.DOWN, onKeyboardDown);
      state.input.keyboard.on(gf.input.KEY.UP, onKeyboardUp);
      state.input.keyboard.on(gf.input.KEY.LEFT, onKeyboardLeft);
      return state.input.keyboard.on(gf.input.KEY.RIGHT, onKeyboardRight);
    };

    return Avatar;

  })(gf.Sprite);

  $(function() {
    var $game, game;
    $game = $('#game');
    game = new Game('game', {
      width: $game.width() - 3,
      height: $game.height() - 3,
      background: 0x808080
    });
    return game.start();
  });

}).call(this);


/*
//@ sourceMappingURL=grapefruit-basics.map
*/