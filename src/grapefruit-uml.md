
# Grapefruitjs UML Diagrams

## High Level Class Diagram

These are the key classes in understanding __grapefruitjs__. _Only selected classes and notable
properties are diagrammed._

Class | Description
------|------------
assetCache | Contains assets loaded by `AssetLoader`.
AssetLoader | Loads external assets by delegating to `Loader` concrete classes based on type.
AudioManager | Provides auditory effects.
Camera | Provides visual effects and is the viewport into the world.
Game | Controls the entire instance of the game. A game has many `GameState` states but, a game can only be in one of those states, stored in `activeState`. _This object shadows active `GameState` notable attributes._
GameState | Game can be in many states.
InputManger | Exposes events and callbacks for input devices: gamepad, keyboard and mouse.
PhysicsSystem | Mixes in physics traits into `Sprite` objects.
Sprite | Visual entity whose appearance is provided from a `Texture`.
TileLayer | Is the terrain made of orthogonal or isometric tiles.
TiledMap | Comprised of one or more `Layer` objects.
TiledObjectGroup | A `Layer` comprised of one or more `Sprite` entities like players, enemies, neutrals...

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
    +Layer layers[]
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