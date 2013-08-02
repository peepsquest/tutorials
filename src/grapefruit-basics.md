# Grapefruitjs Basics

:::BEGIN Example

In this I'll cover the basics of using the [Grapefruitjs](https://github.com/grapefruitjs/grapefruit)
game engine built on __pixi.js__.

<div class='note'><em>Grapefruitjs</em> is in its infancy and should not be used yet per its author,
[Chad Engler](https://github.com/englercj). The API is in flux. The author is an active contributor to __pixi.js__.
This is more an excercise to learn the design patterns an experienced game developer uses in creating
a game.
</div>

Pan by dragging the map with the mouse or move the orsb/leaves around by first clicking on one then using arrow
keys. None of the objects are constrained to the world yet (still learning __grapefruitjs__).

{{{EXAMPLE style='height: 600px;'}}}


## Loading Assets

`gf.AssetLoader` loads assets given an array of URLs or objects.
I opt for objects to show `gf.assetCache` which is used later when loading the orb. __Grapefruitjs__ supports
the popular [Tiled Map Editor](http://www.mapeditor.org/) TMX (JSON) format as well as Texture Packer
format supported by __pixi.js__.

:::< examples/grapefruit-basics.js --no-capture --block assets


## Configure the Game

The main thing to do is to configure an instance of `gf.Game` and attach it to
an HTMLElement container of fixed width and size. Hidden within `Game` is the `_tick` game loop
which makes everything run.

:::< examples/grapefruit-basics.js --no-capture --block game-class

The `start` method loads the `assets` and when completed `onGameReady` is invoked.

:::< examples/grapefruit-basics.js --no-capture --block game-start


## Loading a World

AFAICT a world is just a display container. The important data structure is the `GameState` and
more importantly the active game state.

:::< examples/grapefruit-basics.js --no-capture --block game-ready


## Interacting with the World

Interacting with objects is through events, although it's a little bit
inconsistent. Mouse events are by assigning functions and keyboard and
object events are through pub-sub.

On mouse drag we'll pan the world.

:::< examples/grapefruit-basics.js --no-capture --block pan-world

On mouse click make an object active.

:::< examples/grapefruit-basics.js --no-capture --block activate-object

On keyboard move the active object.

:::< examples/grapefruit-basics.js --no-capture --block move-object


## Start the Game

The game needs a `div` to attach to.

```html
<div id='game'><!-- game goes here --></div>
```

Calculate the width of the div, which is set by CSS, and pass the `div` info to the game and start it.

```css
#game {
  height: 590px;
}
```

:::< examples/grapefruit-basics.js --no-capture --block start-game

:::# Injects common scripts to be loaded
:::< support/common.md --raw

:::# Add the script as an asset, which adds a tab and adds <script> tag to head
:::< examples/grapefruit-basics.js --as-asset grapefruit-basics.js

:::END
