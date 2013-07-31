# http://mazebert.com/2013/04/18/isometric-depth-sorting/

# what is Z?
class IsoSprite extends PIXI.Sprite
  isoX: 0
  isoY: 0
  isoZ: 0

  minX: 0
  maxX: 0

  minY: 0
  maxY: 0

  minZ: 0
  maxZ: 0

  minXRelative: 0
  maxXRelative: 0

  minYRelative: 0
  maxYRelative: 0

  minZRelative: 0
  maxZRelative: 0

  isoDepth: 0
  isoSpritesBehind: []
  isoVisitedFlag: 0

_viewport = x: 0, y:0
_halfTileWidth = 25
_halfTileHeight = 25

# call within game loop

# Bounds of each sprite need to be updated
updateBounds = (sprites) ->
  for sprite in sprites
    # Project sprite to screen coordinates
    sprite.x = -_viewport.x + (sprite.isoX - sprite.isoY) * _halfTileWidth
    sprite.y = -_viewport.y + (sprite.isoX + sprite.isoY - sprite.isoZ) * _halfTileHeight

    # Update bounds
    sprite.minX = sprite.isoX + sprite.minXRelative
    sprite.maxX = sprite.isoX + sprite.maxXRelative
    sprite.minY = sprite.isoY + sprite.minYRelative
    sprite.maxY = sprite.isoY + sprite.maxYRelative
    sprite.minZ = sprite.isoZ + sprite.minZRelative
    sprite.maxZ = sprite.isoZ + sprite.maxZRelative


# Determine dependencies of the topological graph sort
buildTopoDeps = (sprites) ->
  behindIndex = 0

  for a, i in sprites
    behindIndex = 0

    for b, j in sprites
      if i != j
        if b.minX < a.maxX && b.minY < a.maxY && b.minZ < a.maxZ
          a.isoSpritesBehind[behindIndex] = b
          behindIndex++

    a.isoVisitedFlag = 0

# Topo sort
#{{{ Content foo
topoSort = (sprites) ->
  sortDepth = 0

  visit = (node) ->
    if !node.isoVisitedFlag
      node.isoVisitedFlag = true

      for sprite, i in node.isoSpritesBehind
        if sprite is null
          break
        else
          visit sprite
          node.isoSpritesBehind[i] = null

      node.isoDepth = sortDepth++

  for sprite in sprites
    visit sprite
#}}}
