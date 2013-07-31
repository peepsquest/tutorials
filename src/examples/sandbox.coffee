Debug =
  _id: -1
  winspect: (name, o) ->
    if arguments.length is 1
      o = name
      name = ""

    Debug._id += 1
    name = 'dbg' + name + Debug._id
    window[name] = o
    console.log "window.#{name}", o




# http://mazebert.com/2013/04/18/isometric-depth-sorting/

STAGE_WIDTH = 700
STAGE_HEIGHT = 300

TILE_WIDTH = 50
TILE_HEIGHT = 50
THICKNESS = 8 #pixels below surface

MAP_WIDTH = 250
MAP_HEIGHT = 250

# isometric view and anchor at bottom left skews everything,
# basically moves the map so iso (0, 0) is near the middle top
CAMERA_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH
CAMERA_Y_OFFSET = TILE_HEIGHT * 2

stage = new PIXI.Stage(0xEEFFFF)
renderer = PIXI.autoDetectRenderer STAGE_WIDTH, STAGE_HEIGHT
document.body.appendChild renderer.view


class Diagnostics
  constructor: (selector) ->
    @fps = 0
    # ensures we don't have divide by zero
    @lastUpdate = Date.now() - 1
    @fpsFilter = 50
    @el = document.getElementById(selector)

    my = @
    setInterval ->
      my.el.innerHTML = "" + my.fps.toFixed(1) + " fps"
    , 1000

  tick: ->
    now = Date.now()
    fps = 1000 / (now - @lastUpdate)
    @fps += (fps - @fps) / @fpsFilter
    @lastUpdate = now


# what is Z?
class IsoSprite extends PIXI.Sprite
  @SURFACE_DEPTH: 8
  @TILE_HEIGHT: 50
  @TILE_WIDTH: 50
  @TILE_Z_HEIGHT: 50 + IsoSprite.SURFACE_DEPTH
  @stage: stage

  iso:
    x: 0
    y: 0
    z: 0

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

    depth: 0
    spritesBehind: []
    visited: 0

  constructor: ->
    super
    @state.add @


class Tile extends IsoSprite

  constructor: (texture, x, y) ->
    super texture

    x = j * TILE_WIDTH
    y = i * TILE_HEIGHT

    # iso coordinate
    iso = pxToIso(x, y)
    @iso.x = iso.x
    @iso.y = iso.y

    @anchor.x = 0
    @anchor.y = 1

    @iso.z = @texture.height - IsoSprite.TILE_Z_HEIGHT
    if @isoZ > 0
      console.log Coordinates.pxIndices(x, y)

  draw: ->
    @position.x = @iso.x + CAMERA_X_OFFSET
    @position.y = @iso.y + CAMERA_Y_OFFSET


_viewport = x: 0, y:0
_halfTileWidth = 25
_halfTileHeight = 25

class Avatar extends IsoSprite

  @fromImage: (image) ->
    new Avatar(PIXI.Texture.fromImage(image))



# call within game loop

# Bounds of each sprite need to be updated
updateBounds = (sprites) ->

  for sprite in sprites
    # Project sprite to screen coordinates
    sprite.x = -_viewport.x + (sprite.isoX - sprite.isoY) * _halfTileWidth
    sprite.y = -_viewport.y + (sprite.isoX + sprite.isoY - sprite.isoZ) * _halfTileHeight

    # Update bounds
    sprite.isoMinX = sprite.isoX + sprite.isoMinXRelative
    sprite.isoMaxX = sprite.isoX + sprite.isoMaxXRelative
    sprite.isoMinY = sprite.isoY + sprite.isoMinYRelative
    sprite.isoMaxY = sprite.isoY + sprite.isoMaxYRelative
    sprite.isoMinZ = sprite.isoZ + sprite.isoMinZRelative
    sprite.isoMaxZ = sprite.isoZ + sprite.isoMaxZRelative


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

    a.isoVisited = 0

# Topo sort
#{{{ Content foo
topoSort = (sprites) ->
  sortDepth = 0

  visit = (node) ->
    if !node.isoVisitedFlag
      node.isoVisited = true

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



loader = new PIXI.AssetLoader(['img/roadTiles.json'])

# map
G=0; D=1; W=2

terrain = [
  [D, D, G, G, W]
  [D, D, G, G, W]
  [D, G, G, W, W]
  [D, G, W, W, W]
  [D, G, W, W, W]
]

isoTile = (filename) ->
  return (x, y) ->
    texture = PIXI.Texture.fromFrame(filename)
    tile = new Tile(texture, x, y)
    tile.draw()

# tiles
grass = isoTile('grass.png')
dirt = isoTile('dirt.png')
water = isoTile('water.png')
tileMethods = [grass, dirt, water]


# 2D to isometric
pxToIso = (x, y) ->
  return {
    x: x - y
    y: (x + y) / 2
  }

stageMap = (terrain) ->
  for row, i in terrain
    for col, j in row
      x = j * TILE_WIDTH
      y = i * TILE_HEIGHT

      # iso coordinate
      iso = pxToIso(x, y)

      tileType = col
      stageTile = tileMethods[tileType]
      stageTile iso.x + CAMERA_X_OFFSET, iso.y + CAMERA_Y_OFFSET

Coordinates =
  # Converts iso coodinates into 2D array indices
  isoToPxIndices: (x, y) ->
    return {
      row: (y + x) / 2
      col: (y - x) / 2
    }

  pxIndices: (x, y) ->
    return {
      row: Math.floor(x / TILE_WIDTH)
      col: Math.floor(y / TILE_HEIGHT)
    }

  # Converts 2D coordinates to tile coordinates taking into
  # account anchor placement and thickness of tile
  pxToTile: (x, y) ->
    iso = pxToIso(x, y)

    return {
      x: iso.x + CAMERA_X_OFFSET + TILE_WIDTH
      y: iso.y + CAMERA_Y_OFFSET - TILE_WIDTH - THICKNESS
    }

  # Offset a 2D point keeping the point within the boundaries
  # of the map.
  pxOffset: (pt, byX, byY) ->
    pt.x = Math.max(0, Math.min(pt.x + byX, MAP_WIDTH))
    pt.y = Math.max(0, Math.min(pt.y + byY, MAP_HEIGHT))

  # Avatars avatar has depth too so we must ensure
  pxToAvatar: (x, y) ->
    x = Math.min(MAP_WIDTH - 10, Math.max(0, x))
    y = Math.min(MAP_HEIGHT - 10, Math.max(0, y))

    tile = Coordinates.pxToTile(x, y)
    x = tile.x - 16; # 32 width
    y = tile.y + 16 - 6; # 32 height + ?px shadow

    return {
      x: x
      y: tile.y + 16 - 6 # 38 height
    }

avatar = null
coords = Coordinates

stageAvatar = (x, y) ->
  avatar = Avatar.fromImage('img/redOrb.png')
  avatar.dd = new PIXI.Point(x, y)

  pt = coords.pxToAvatar(x, y)

  avatar.position.x = pt.x
  avatar.position.y = pt.y
  avatar.anchor.x = 0
  avatar.anchor.y = 1

  stage.addChild avatar

moveAvatar = (byX, byY) ->
  # ensures avatar stays within bounds
  coords.pxOffset avatar.dd, byX, byY

  p = coords.pxToAvatar(avatar.dd.x, avatar.dd.y)
  avatar.position.x = p.x
  avatar.position.y = p.y


# keyboard input, ARROW to move, SHIFT + ARROW to move on axis
moveUp = (e) ->
  if e.shiftKey then moveAvatar(0, -2) else moveAvatar(-2, -2)

moveDown = (e) ->
  if e.shiftKey then moveAvatar(0, 2) else moveAvatar(2, 2)

moveLeft = (e) ->
  if e.shiftKey then moveAvatar(-2, 0) else moveAvatar(-2, 2)

moveRight = (e) ->
  if e.shiftKey then moveAvatar(2, 0) else moveAvatar(2, -2)


# game loop optimized keyboard handling
kd.UP.down moveUp
kd.DOWN.down moveDown
kd.LEFT.down moveLeft
kd.RIGHT.down moveRight

#{{{ Content start
start = ->
  stageMap terrain
  stageAvatar 0, 0
  diag = new Diagnostics('diagnostics')

  gameLoop = ->
    # keyboard handler
    requestAnimFrame gameLoop
    diag.tick()
    kd.tick()
    renderer.render stage

  requestAnimFrame gameLoop

loader.onComplete = start
loader.load()
#}}}
