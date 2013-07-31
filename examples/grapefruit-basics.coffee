#{{{ Content resources
Data =
  resources: [
    'img/isometric_grass_and_water.json'
    'img/redOrb.png'
  ]
  worlds: [
    'img/isometric_grass_and_water.json'
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

    @loader.load Data.resources
#}}}

#{{{ Content game-ready
  onGameReady: ->
    for world in Data.worlds
      state = new gf.GameState(world)

      @addState state
      state.loadWorld world

      state.world.interactive = true
      state.world.mousedown = mapDown
      state.world.mouseup = mapUp
      state.world.mousemove = mapMove

    @enableState Data.worlds[0]
    hero = new Avatar({resourceUrl: 'img/redOrb.png', state})
    state.addChild hero


#}}}

#{{{ Content map-functions
# context for these are TiledMap, which means Function.bind is being used
mapDown = (e) ->
  pos = e.getLocalPosition(@parent)
  @drag = pos

mapUp = (e) ->
  @drag = null

mapMove = (e) ->
  if @drag
    pos = e.getLocalPosition(@parent)
    dx = (pos.x - @drag.x)
    dy = (pos.y - @drag.y)
    @pan dx, dy
    @drag = pos
#}}}


#{{{ Content avatar
class Avatar extends gf.Sprite

  constructor: (options) ->
    {state, resourceUrl} = options
    t = PIXI.Texture.fromImage(resourceUrl)
    super t
    @setupKeyboardHandlers state

  ###
  * Sets up keyboard handlers using closure instead of bind.
  ###
  setupKeyboardHandlers: (state) ->
    that = @

    onKeyboardDown = (e) ->
      {position} = that
      position.y += 2
      #e.originalEvent.preventDefault()

    onKeyboardRight = (e) ->
      {position} = that
      position.x += 2

    onKeyboardLeft = (e) ->
      {position} = that
      position.x -= 2

    onKeyboardUp = (e) ->
      {position} = that
      position.y -= 2

    state.input.keyboard.on gf.input.KEY.DOWN, onKeyboardDown
    state.input.keyboard.on gf.input.KEY.UP, onKeyboardUp
    state.input.keyboard.on gf.input.KEY.LEFT, onKeyboardLeft
    state.input.keyboard.on gf.input.KEY.RIGHT, onKeyboardRight
#}}}


#{{{ Content start-game

# addEventListener is not ready until document is ready

$ ->
  $game = $('#game')

  game = new Game 'game',
    width: $game.width() - 3
    height: $game.height() - 3
    background: 0x808080
  game.start()
#}}}
