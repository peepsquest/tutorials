#{{{ Content assets
assets = [
  {name: 'world', src: 'img/isometric_grass_and_water.json'}
  {name: 'avatar', src: 'img/redOrb.png'}
]
#}}}


#{{{ Content game-class
class Game extends gf.Game

  constructor: (containerId, @options) ->
    _.defaults @options,
      gravity: 0
      friction: 0
    super
#}}}

#{{{ Content game-start
  start: ->
    @loader.on 'complete', =>
      @onGameReady()
      @render()

    @loader.load @options.assets
#}}}

#{{{ Content game-ready
  onGameReady: ->
    state = new gf.GameState('world')
    @addState state
    state.loadWorld 'world'

    state.world.interactive = true
    state.world.mousedown = mapDown
    state.world.mouseup = mapUp
    state.world.mousemove = mapMove
    @enableState 'world'

    # start with the world centered and slightly down
    @world.pan @camera.size.x / 2, 100

    hero = new Avatar({assetId: 'avatar', game: @})
    state.addChild hero
#}}}


#{{{ Content panning
# context for these are TiledMap, which means Function.bind is being used
mapDown = (e) ->
  pos = e.getLocalPosition(@parent)
  @drag = pos

mapUp = (e) ->
  @drag = null

mapMove = (e) ->
  if @drag
    pos = e.getLocalPosition(@parent)
    dx = pos.x - @drag.x
    dy = pos.y - @drag.y
    @pan dx, dy
    @drag = pos
#}}}


#{{{ Content avatar
class Avatar extends gf.Sprite

  constructor: (options) ->
    {game, assetId} = options
    super gf.assetCache[assetId]
    @setupKeyboardHandlers game

  ###
  * Sets up keyboard handlers using closures instead of bind.
  ###
  setupKeyboardHandlers: (game) ->
    that = @

    preventDefault = (e) ->
      e.input.preventDefault e.originalEvent

    onKeyboardDown = (e) ->
      that.position.y += 5
      preventDefault e

    onKeyboardRight = (e) ->
      that.position.x += 5
      preventDefault e

    onKeyboardLeft = (e) ->
      that.position.x -= 5
      preventDefault e

    onKeyboardUp = (e) ->
      that.position.y -= 5
      preventDefault e

    game.input.keyboard.on gf.input.KEY.DOWN, onKeyboardDown
    game.input.keyboard.on gf.input.KEY.UP, onKeyboardUp
    game.input.keyboard.on gf.input.KEY.LEFT, onKeyboardLeft
    game.input.keyboard.on gf.input.KEY.RIGHT, onKeyboardRight
#}}}


#{{{ Content start-game
$ ->
  $game = $('#game')
  game = new Game 'game',
    width: $game.width() - 3
    height: $game.height() - 3
    background: 0xEEFFFF
    assets: assets
  window.dbgGame = game
  game.start()

#}}}
