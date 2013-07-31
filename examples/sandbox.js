(function() {
  var Avatar, CAMERA_X_OFFSET, CAMERA_Y_OFFSET, Coordinates, D, Debug, Diagnostics, G, IsoSprite, MAP_HEIGHT, MAP_WIDTH, STAGE_HEIGHT, STAGE_WIDTH, THICKNESS, TILE_HEIGHT, TILE_WIDTH, Tile, W, avatar, buildTopoDeps, coords, dirt, grass, isoTile, loader, moveAvatar, moveDown, moveLeft, moveRight, moveUp, pxToIso, renderer, stage, stageAvatar, stageMap, start, terrain, tileMethods, topoSort, updateBounds, water, _halfTileHeight, _halfTileWidth, _ref, _viewport,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Debug = {
    _id: -1,
    winspect: function(name, o) {
      if (arguments.length === 1) {
        o = name;
        name = "";
      }
      Debug._id += 1;
      name = 'dbg' + name + Debug._id;
      window[name] = o;
      return console.log("window." + name, o);
    }
  };

  STAGE_WIDTH = 700;

  STAGE_HEIGHT = 300;

  TILE_WIDTH = 50;

  TILE_HEIGHT = 50;

  THICKNESS = 8;

  MAP_WIDTH = 250;

  MAP_HEIGHT = 250;

  CAMERA_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH;

  CAMERA_Y_OFFSET = TILE_HEIGHT * 2;

  stage = new PIXI.Stage(0xEEFFFF);

  renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT);

  document.body.appendChild(renderer.view);

  Diagnostics = (function() {
    function Diagnostics(selector) {
      var my;
      this.fps = 0;
      this.lastUpdate = Date.now() - 1;
      this.fpsFilter = 50;
      this.el = document.getElementById(selector);
      my = this;
      setInterval(function() {
        return my.el.innerHTML = "" + my.fps.toFixed(1) + " fps";
      }, 1000);
    }

    Diagnostics.prototype.tick = function() {
      var fps, now;
      now = Date.now();
      fps = 1000 / (now - this.lastUpdate);
      this.fps += (fps - this.fps) / this.fpsFilter;
      return this.lastUpdate = now;
    };

    return Diagnostics;

  })();

  IsoSprite = (function(_super) {
    __extends(IsoSprite, _super);

    IsoSprite.SURFACE_DEPTH = 8;

    IsoSprite.TILE_HEIGHT = 50;

    IsoSprite.TILE_WIDTH = 50;

    IsoSprite.TILE_Z_HEIGHT = 50 + IsoSprite.SURFACE_DEPTH;

    IsoSprite.stage = stage;

    IsoSprite.prototype.iso = {
      x: 0,
      y: 0,
      z: 0,
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
      minZ: 0,
      maxZ: 0,
      minXRelative: 0,
      maxXRelative: 0,
      minYRelative: 0,
      maxYRelative: 0,
      minZRelative: 0,
      maxZRelative: 0,
      depth: 0,
      spritesBehind: [],
      visited: 0
    };

    function IsoSprite() {
      IsoSprite.__super__.constructor.apply(this, arguments);
      this.state.add(this);
    }

    return IsoSprite;

  })(PIXI.Sprite);

  Tile = (function(_super) {
    __extends(Tile, _super);

    function Tile(texture, x, y) {
      var iso;
      Tile.__super__.constructor.call(this, texture);
      x = j * TILE_WIDTH;
      y = i * TILE_HEIGHT;
      iso = pxToIso(x, y);
      this.iso.x = iso.x;
      this.iso.y = iso.y;
      this.anchor.x = 0;
      this.anchor.y = 1;
      this.iso.z = this.texture.height - IsoSprite.TILE_Z_HEIGHT;
      if (this.isoZ > 0) {
        console.log(Coordinates.pxIndices(x, y));
      }
    }

    Tile.prototype.draw = function() {
      this.position.x = this.iso.x + CAMERA_X_OFFSET;
      return this.position.y = this.iso.y + CAMERA_Y_OFFSET;
    };

    return Tile;

  })(IsoSprite);

  _viewport = {
    x: 0,
    y: 0
  };

  _halfTileWidth = 25;

  _halfTileHeight = 25;

  Avatar = (function(_super) {
    __extends(Avatar, _super);

    function Avatar() {
      _ref = Avatar.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Avatar.fromImage = function(image) {
      return new Avatar(PIXI.Texture.fromImage(image));
    };

    return Avatar;

  })(IsoSprite);

  updateBounds = function(sprites) {
    var sprite, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = sprites.length; _i < _len; _i++) {
      sprite = sprites[_i];
      sprite.x = -_viewport.x + (sprite.isoX - sprite.isoY) * _halfTileWidth;
      sprite.y = -_viewport.y + (sprite.isoX + sprite.isoY - sprite.isoZ) * _halfTileHeight;
      sprite.isoMinX = sprite.isoX + sprite.isoMinXRelative;
      sprite.isoMaxX = sprite.isoX + sprite.isoMaxXRelative;
      sprite.isoMinY = sprite.isoY + sprite.isoMinYRelative;
      sprite.isoMaxY = sprite.isoY + sprite.isoMaxYRelative;
      sprite.isoMinZ = sprite.isoZ + sprite.isoMinZRelative;
      _results.push(sprite.isoMaxZ = sprite.isoZ + sprite.isoMaxZRelative);
    }
    return _results;
  };

  buildTopoDeps = function(sprites) {
    var a, b, behindIndex, i, j, _i, _j, _len, _len1, _results;
    behindIndex = 0;
    _results = [];
    for (i = _i = 0, _len = sprites.length; _i < _len; i = ++_i) {
      a = sprites[i];
      behindIndex = 0;
      for (j = _j = 0, _len1 = sprites.length; _j < _len1; j = ++_j) {
        b = sprites[j];
        if (i !== j) {
          if (b.minX < a.maxX && b.minY < a.maxY && b.minZ < a.maxZ) {
            a.isoSpritesBehind[behindIndex] = b;
            behindIndex++;
          }
        }
      }
      _results.push(a.isoVisited = 0);
    }
    return _results;
  };

  topoSort = function(sprites) {
    var sortDepth, sprite, visit, _i, _len, _results;
    sortDepth = 0;
    visit = function(node) {
      var i, sprite, _i, _len, _ref1;
      if (!node.isoVisitedFlag) {
        node.isoVisited = true;
        _ref1 = node.isoSpritesBehind;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          sprite = _ref1[i];
          if (sprite === null) {
            break;
          } else {
            visit(sprite);
            node.isoSpritesBehind[i] = null;
          }
        }
        return node.isoDepth = sortDepth++;
      }
    };
    _results = [];
    for (_i = 0, _len = sprites.length; _i < _len; _i++) {
      sprite = sprites[_i];
      _results.push(visit(sprite));
    }
    return _results;
  };

  loader = new PIXI.AssetLoader(['img/roadTiles.json']);

  G = 0;

  D = 1;

  W = 2;

  terrain = [[D, D, G, G, W], [D, D, G, G, W], [D, G, G, W, W], [D, G, W, W, W], [D, G, W, W, W]];

  isoTile = function(filename) {
    return function(x, y) {
      var texture, tile;
      texture = PIXI.Texture.fromFrame(filename);
      tile = new Tile(texture, x, y);
      return tile.draw();
    };
  };

  grass = isoTile('grass.png');

  dirt = isoTile('dirt.png');

  water = isoTile('water.png');

  tileMethods = [grass, dirt, water];

  pxToIso = function(x, y) {
    return {
      x: x - y,
      y: (x + y) / 2
    };
  };

  stageMap = function(terrain) {
    var col, i, iso, j, row, stageTile, tileType, x, y, _i, _len, _results;
    _results = [];
    for (i = _i = 0, _len = terrain.length; _i < _len; i = ++_i) {
      row = terrain[i];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
          col = row[j];
          x = j * TILE_WIDTH;
          y = i * TILE_HEIGHT;
          iso = pxToIso(x, y);
          tileType = col;
          stageTile = tileMethods[tileType];
          _results1.push(stageTile(iso.x + CAMERA_X_OFFSET, iso.y + CAMERA_Y_OFFSET));
        }
        return _results1;
      })());
    }
    return _results;
  };

  Coordinates = {
    isoToPxIndices: function(x, y) {
      return {
        row: (y + x) / 2,
        col: (y - x) / 2
      };
    },
    pxIndices: function(x, y) {
      return {
        row: Math.floor(x / TILE_WIDTH),
        col: Math.floor(y / TILE_HEIGHT)
      };
    },
    pxToTile: function(x, y) {
      var iso;
      iso = pxToIso(x, y);
      return {
        x: iso.x + CAMERA_X_OFFSET + TILE_WIDTH,
        y: iso.y + CAMERA_Y_OFFSET - TILE_WIDTH - THICKNESS
      };
    },
    pxOffset: function(pt, byX, byY) {
      pt.x = Math.max(0, Math.min(pt.x + byX, MAP_WIDTH));
      return pt.y = Math.max(0, Math.min(pt.y + byY, MAP_HEIGHT));
    },
    pxToAvatar: function(x, y) {
      var tile;
      x = Math.min(MAP_WIDTH - 10, Math.max(0, x));
      y = Math.min(MAP_HEIGHT - 10, Math.max(0, y));
      tile = Coordinates.pxToTile(x, y);
      x = tile.x - 16;
      y = tile.y + 16 - 6;
      return {
        x: x,
        y: tile.y + 16 - 6
      };
    }
  };

  avatar = null;

  coords = Coordinates;

  stageAvatar = function(x, y) {
    var pt;
    avatar = Avatar.fromImage('img/redOrb.png');
    avatar.dd = new PIXI.Point(x, y);
    pt = coords.pxToAvatar(x, y);
    avatar.position.x = pt.x;
    avatar.position.y = pt.y;
    avatar.anchor.x = 0;
    avatar.anchor.y = 1;
    return stage.addChild(avatar);
  };

  moveAvatar = function(byX, byY) {
    var p;
    coords.pxOffset(avatar.dd, byX, byY);
    p = coords.pxToAvatar(avatar.dd.x, avatar.dd.y);
    avatar.position.x = p.x;
    return avatar.position.y = p.y;
  };

  moveUp = function(e) {
    if (e.shiftKey) {
      return moveAvatar(0, -2);
    } else {
      return moveAvatar(-2, -2);
    }
  };

  moveDown = function(e) {
    if (e.shiftKey) {
      return moveAvatar(0, 2);
    } else {
      return moveAvatar(2, 2);
    }
  };

  moveLeft = function(e) {
    if (e.shiftKey) {
      return moveAvatar(-2, 0);
    } else {
      return moveAvatar(-2, 2);
    }
  };

  moveRight = function(e) {
    if (e.shiftKey) {
      return moveAvatar(2, 0);
    } else {
      return moveAvatar(2, -2);
    }
  };

  kd.UP.down(moveUp);

  kd.DOWN.down(moveDown);

  kd.LEFT.down(moveLeft);

  kd.RIGHT.down(moveRight);

  start = function() {
    var diag, gameLoop;
    stageMap(terrain);
    stageAvatar(0, 0);
    diag = new Diagnostics('diagnostics');
    gameLoop = function() {
      requestAnimFrame(gameLoop);
      diag.tick();
      kd.tick();
      return renderer.render(stage);
    };
    return requestAnimFrame(gameLoop);
  };

  loader.onComplete = start;

  loader.load();

}).call(this);


/*
//@ sourceMappingURL=sandbox.map
*/