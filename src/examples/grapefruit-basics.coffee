#{{{ Content resources
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
    {world, avatar} = @options.assets

    state = new gf.GameState('world')
    @addState state
    state.loadWorld 'world'

    state.world.interactive = true
    state.world.mousedown = mapDown
    state.world.mouseup = mapUp
    state.world.mousemove = mapMove

    @enableState 'world'
    hero = new Avatar({assetId: 'avatar', state})
    state.addChild hero
#}}}


#{{{ Content panning
# context for these are TiledMap, which means Function.bind is being used
mapDown = (e) ->
  # needed to capture events in iframe of this example (not needed otherwise)
  window.focus()
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
    {state, assetId} = options
    super gf.assetCache[assetId]
    @setupKeyboardHandlers state

  ###
  * Sets up keyboard handlers using closure instead of bind.
  ###
  setupKeyboardHandlers: (state) ->
    that = @

    onKeyboardDown = (e) ->
      {position} = that
      position.y += 5
      e.originalEvent.preventDefault()

    onKeyboardRight = (e) ->
      {position} = that
      position.x += 5
      e.originalEvent.preventDefault()

    onKeyboardLeft = (e) ->
      {position} = that
      position.x -= 5
      e.originalEvent.preventDefault()

    onKeyboardUp = (e) ->
      {position} = that
      position.y -= 5
      e.originalEvent.preventDefault()

    state.input.keyboard.on gf.input.KEY.DOWN, onKeyboardDown
    state.input.keyboard.on gf.input.KEY.UP, onKeyboardUp
    state.input.keyboard.on gf.input.KEY.LEFT, onKeyboardLeft
    state.input.keyboard.on gf.input.KEY.RIGHT, onKeyboardRight
#}}}


#{{{ Content start-game
$ ->
  $game = $('#game')

  game = new Game 'game',
    width: $game.width() - 3
    height: $game.height() - 3
    background: 0xEEFFFF
    assets: assets
  game.start()
#}}}
