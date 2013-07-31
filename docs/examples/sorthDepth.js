(function() {
  var IsoSprite, buildTopoDeps, topoSort, updateBounds, _halfTileHeight, _halfTileWidth, _ref, _viewport,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  IsoSprite = (function(_super) {
    __extends(IsoSprite, _super);

    function IsoSprite() {
      _ref = IsoSprite.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    IsoSprite.prototype.isoX = 0;

    IsoSprite.prototype.isoY = 0;

    IsoSprite.prototype.isoZ = 0;

    IsoSprite.prototype.minX = 0;

    IsoSprite.prototype.maxX = 0;

    IsoSprite.prototype.minY = 0;

    IsoSprite.prototype.maxY = 0;

    IsoSprite.prototype.minZ = 0;

    IsoSprite.prototype.maxZ = 0;

    IsoSprite.prototype.minXRelative = 0;

    IsoSprite.prototype.maxXRelative = 0;

    IsoSprite.prototype.minYRelative = 0;

    IsoSprite.prototype.maxYRelative = 0;

    IsoSprite.prototype.minZRelative = 0;

    IsoSprite.prototype.maxZRelative = 0;

    IsoSprite.prototype.isoDepth = 0;

    IsoSprite.prototype.isoSpritesBehind = [];

    IsoSprite.prototype.isoVisitedFlag = 0;

    return IsoSprite;

  })(PIXI.Sprite);

  _viewport = {
    x: 0,
    y: 0
  };

  _halfTileWidth = 25;

  _halfTileHeight = 25;

  updateBounds = function(sprites) {
    var sprite, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = sprites.length; _i < _len; _i++) {
      sprite = sprites[_i];
      sprite.x = -_viewport.x + (sprite.isoX - sprite.isoY) * _halfTileWidth;
      sprite.y = -_viewport.y + (sprite.isoX + sprite.isoY - sprite.isoZ) * _halfTileHeight;
      sprite.minX = sprite.isoX + sprite.minXRelative;
      sprite.maxX = sprite.isoX + sprite.maxXRelative;
      sprite.minY = sprite.isoY + sprite.minYRelative;
      sprite.maxY = sprite.isoY + sprite.maxYRelative;
      sprite.minZ = sprite.isoZ + sprite.minZRelative;
      _results.push(sprite.maxZ = sprite.isoZ + sprite.maxZRelative);
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
      _results.push(a.isoVisitedFlag = 0);
    }
    return _results;
  };

  topoSort = function(sprites) {
    var sortDepth, sprite, visit, _i, _len, _results;
    sortDepth = 0;
    visit = function(node) {
      var i, sprite, _i, _len, _ref1;
      if (!node.isoVisitedFlag) {
        node.isoVisitedFlag = true;
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

}).call(this);


/*
//@ sourceMappingURL=sorthDepth.map
*/