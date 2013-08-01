
# Grapefruitjs UML Diagrams

## High Level Class Diagram

These are the key classes in understanding __grapefruitjs__.

A `Game` has many `GameState`s but, a game can only be in one of those states, stored in the `activeState`.
Interaction is evented through `InputManager`. The `Camera` provides visual effects and the
viewport into the world. The `AudioManager` provides auditory effects. The `PhysicsSystem`
mixes in physics traits into sprites. The world is a `TiledMap` comprised of one or more layers.
A `TiledObjectGroup` layer reprepsents entities like players, creeps and neutrals. A `TileLayer` is
the terrain made of orthogonal or isometric tiles.


```uml
class "gf.assetCache" << (S, #FF7700) >>

class "gf.Game" {
    - _tick()
    - update()

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

"gf.TiledMap" o-- "gf.Layer"

"gf.Layer" <|-- "gf.TiledLayer"
"gf.Layer" <|-- "gf.TiledObjectGroup"

"gf.Layer" o- "gf.Sprite"

"gf.assetCache" - "gf.AssetLoader"
"gf.AssetLoader" -- "gf.Loader"

"gf.GameState" o-- "gf.AudioManager"
"gf.GameState" o-- "gf.PhysicsSystem"
"gf.GameState" o-- "gf.InputManager"
"gf.GameState" o-- "gf.Camera"
"gf.GameState" o-- "gf.TiledMap"

"gf.Game" o-- "gf.GameState"
"gf.Game" o-- "gf.AssetLoader"

"gf.Loader" <|-- "gf.AudioLoader"
"gf.Loader" <|-- "gf.JsonLoader"
"gf.Loader" <|-- "gf.TextureLoader"
```