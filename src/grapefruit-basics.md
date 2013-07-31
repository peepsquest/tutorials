# Grapefruit.js Basics in CoffeeScript

:::BEGIN Example

In this example we'll cover the basics of using the [grapefruitjs](https://github.com/grapefruitjs/grapefruit)
game engine built on __pixi.js__.

<div class='note'><em>GrapefruitJs</em> is in its infancy and should not be used yet per its author,
[Chad Engler](https://github.com/englercj).
The author is an active contributor to __Pixi.js__. This is more of a learning
excercise for me to see how experienced game developers setup a game.

</div>

Pan by dragging with the mouse or move the orb around with the arrow keys. The orb is not constrained with
the world (still learning __grapefruit__).

{{{EXAMPLE style='height: 600px;'}}}

## Defining Assets

`gf.AssetLoader` loads assets using an array of URLs or objects.
I opt for objects to show `gf.assetCache` is in use later when the orb is loaded. __grapefruit.js__ supports
the popular[Tiled Map Editor](http://www.mapeditor.org/) TMX (JSON) format as well as the Texture Packer
format supported by __pixi.js__.

(Is a world analogous to a scene?)

:::< examples/grapefruit-basics.coffee --block resources

## Configure the Game

The main thing to do is to configure an instance of `gf.Game` and attach it to
an HTMLElement container of fixed width and size.

:::< examples/grapefruit-basics.coffee --block game-class

The `start` method loads `Data.resources` and when completed `onGameReady` is invoked.

:::< examples/grapefruit-basics.coffee --block game-start

## Loading a World

AFAICT a world is just a display container. The important data structure is the `GameState` and
more importantly the active game state. Hidden within `GameState` is the game loop `_tick` which
makes everything run.

:::< examples/grapefruit-basics.coffee --block game-ready

## Panning the World

Here we take advantage of the `gf.TiledMap` object to do panning. __Grapefruit__ does all the work for us.

:::< examples/grapefruit-basics.coffee --block panning


## Add an Avatar

The avatar is a `gf.Sprite` and loads a `gf.Texture` from the asset cache populate the the `load` above.
I use a class to encapsulate the keyboard binding. (Not sure if this is the best way to handle keyboard event).

:::< examples/grapefruit-basics.coffee --block avatar


## Starting the Game

The game is attached to a `div`.

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

:::< examples/grapefruit-basics.coffee --as-tab scripts.coffee --clean

:::< ../docs/examples/grapefruit-basics.js --hide

:::END
