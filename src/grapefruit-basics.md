# Grapefruitjs Basics

:::BEGIN Example

In this CoffeeScript example we'll cover the basics of using the [Grapefruitjs](https://github.com/grapefruitjs/grapefruit)
game engine built on __pixi.js__.

<div class='note'><em>GrapefruitJs</em> is in its infancy and should not be used yet per its author,
[Chad Engler](https://github.com/englercj). The author is an active contributor to __pixi.js__.
This is more of a learning excercise to see how experienced game developers setup a game.
</div>

Pan by dragging with the mouse or move the orb around with the arrow keys. The orb is not constrained with
the world (still learning __grapefruitjs__).

{{{EXAMPLE style='height: 600px;'}}}


## Loading Assets

`gf.AssetLoader` loads assets given an array of URLs or objects.
I opt for objects to show `gf.assetCache` is in use later when the orb is loaded. __Grapefruitjs__ supports
the popular [Tiled Map Editor](http://www.mapeditor.org/) TMX (JSON) format as well as Texture Packer
format supported by __pixi.js__.

:::< examples/grapefruit-basics.coffee --block assets


## Configure the Game

The main thing to do is to configure an instance of `gf.Game` and attach it to
an HTMLElement container of fixed width and size. Hidden within `Game` is the `_tick` game loop
which makes everything run.

:::< examples/grapefruit-basics.coffee --block game-class

The `start` method loads the `assets` and when completed `onGameReady` is invoked.

:::< examples/grapefruit-basics.coffee --block game-start


## Loading a World

AFAICT a world is just a display container. The important data structure is the `GameState` and
more importantly the active game state.

:::< examples/grapefruit-basics.coffee --block game-ready


## Panning the World

Here we take advantage of the `gf.TiledMap` object to do panning. __Grapefruitjs__ does all the work.

:::< examples/grapefruit-basics.coffee --block panning


## Add an Avatar

The avatar is a `gf.Sprite` and loads a `gf.Texture` from the asset cache populate by `load` above.
I use a class to encapsulate keyboard bindings. Keyboard events are global within a game
state and another display object could be listening for the save events.

:::< examples/grapefruit-basics.coffee --block avatar


## Start the Game

The game needs a `div` to attach to.

```html
<div id='game'><!-- game goes here --></div>
```

Calculate the width of the div, which is set by CSS, and pass the `div` info to the game and start it.

:::< examples/grapefruit-basics.coffee --block start-game

:::@ --hide

```css
#game {
  height: 590px;
}
```

:::< support/common.md --raw

:::# Loads the complete Coffee script for user to view
:::< examples/grapefruit-basics.coffee --as-tab scripts.coffee --clean

:::# The compiled JS runs the example
:::< ../docs/examples/grapefruit-basics.js --hide

:::END
