
# Grapefruitjs UML Diagrams

## High Level Class Diagram

These are the key classes in understanding __grapefruitjs__. You should
also familiarize yourself with [Tiled](http://www.mapeditor.org/) whose
concepts form the basis of the world in __grapefruitjs__. _Only select classes and notable
properties are diagrammed._

Class | Description
------|------------
assetCache | Contains assets loaded by `AssetLoader`.
AssetLoader | Loads external assets by delegating to `Loader` concrete classes based on type.
AudioManager | Provides auditory effects.
Camera | Provides visual effects and is the viewport into the world.
Game | Controls the entire instance of the game. A game has many `GameState` states but, a game can only be in one of those states, stored in `activeState`. _A game shadows active `GameState` important properties._
GameState | Game can be in many states.
InputManger | Exposes events and callbacks for input devices: gamepad, keyboard and mouse.
PhysicsSystem | Mixes in physics traits into `Sprite` objects.
Sprite | Visual entity whose appearance is from its `Texture`.
TileLayer | Is the terrain made of orthogonal or isometric tiles.
TiledMap | Represents a Tiled editor map.
TiledObjectGroup | A `Layer` comprised of one or more `Sprite` entities like players, enemies, neutrals... _Spawnable objects must be contained in a `TiledObjectGroup`._

```uml
class "gf.assetCache" << (S, #FF7700) >>

class "gf.Game" {
    - _tick()

    +loadWorld()
    +GameState activeState
    +AssetLoader loader
    +SpritePool spritePool
}

class "gf.GameState" {
  +AudioManager audio
  +PhysicsSystem physics
  +InputManager input
  +Camera camera
  +TiledMap world
}

class "gf.InputManager" {
  +Keyboard keyboard
  +Gamepad gamepad
}

class "gf.AssetLoader" {
    +load(assetUrls[])
}

class "gf.TiledMap" {
    +Layer children[]
    +Tileset tilesets[]

    +findLayer()
    +pan()
    +spawnObjects()
}

class "gf.TiledObjectGroup" {
    +Sprite objects[]
    +spawn()
}

class "gf.Sprite" {
    +position

    +setPosition(x, y)
    +setVelocity(x, y)
}

"gf.TiledMap" *-- "gf.Layer"

"gf.Layer" <|-- "gf.TiledLayer"
"gf.Layer" <|-- "gf.TiledObjectGroup"

"gf.Layer" *- "gf.Sprite"

"gf.AssetLoader" - "gf.assetCache" : updates
"gf.AssetLoader" -- "gf.Loader"  : uses

"gf.GameState" o-- "gf.AudioManager"
"gf.GameState" o-- "gf.PhysicsSystem"
"gf.GameState" o-- "gf.InputManager"
"gf.GameState" o-- "gf.Camera"
"gf.GameState" o-- "gf.TiledMap"

"gf.Game" *-- "gf.GameState" : manages
"gf.Game" o-- "gf.AssetLoader"

"gf.Loader" <|-- "gf.AudioLoader"
"gf.Loader" <|-- "gf.JsonLoader"
"gf.Loader" <|-- "gf.TextureLoader"
```
