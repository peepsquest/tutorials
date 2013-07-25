<style>
img  {
  border: solid 3px #ccc;
}
</style>

<div id="text-logo">PeepsQuest</div>

# Creating Sprite Sheets

We were somewhat dismayed that Pixi.js uses a proprietary commercial app to build sprite sheets,
so we built a free solution for our node.js build tool---[Projmate](http://projmate.github.io).
The `pm-spritesheet` filter generates sprite sheets compatible with Texture Packer (as used by pixi.js).

In this tutorial, we'll start with four images

![](examples/img/tp/eggHead.png)
![](examples/img/tp/flowerTop.png)
![](examples/img/tp/helmlok.png)
![](examples/img/tp/skully.png)

then generate a single sprite sheet containing those images. These are the same images
used by pixi.js in its `Example 2`.

![](examples/img/tp/spritesheet.png)

:::BEGIN Example

### Installing Projmate

First install these pre-requisites on your box

*   imagemagick
*   node.js + npm

With those intalled, proceed to installing Projmate globally

    npm install -g projmate-cli@0.1.0-dev

Then inside your project install the sprite sheet filter

    npm install pm-spritesheet


### Creating Task

Here is the folder layout for pixi.js' second example

    ▾ tp/
        eggHead.png
        flowerTop.png
        helmlok.png
        skully.png

To create a sprite sheet task, first create a file `Projfile.js` at the root of your
project. The pipeline for `spritesheet` task only requires
the `spritesheet` filter. When run or watched, the `spritesheet` task generates
`SpriteSheet.png`

<div class='note'>
Projmate has many more filters: CoffeeScript (Iced), CommonJS, PreProcessor,
Template, Handlebars, Uglify, Less, YUI Docs, Tap ... to name a few
</div>

:::@ --no-capture

```js
exports.project = function(pm) {
  var f = pm.filters(require('pm-spritesheet'));

  return {
    spritesheet: {
      files: 'tp/*.png',
      dev: [
        f.spritesheet({filename: 'SpriteSheet.png', root: 'tp/', jsonStyle:'texturePacker'})
      ]
    }
  };

};
```

To run the `spritesheet` task from the terminal

    pm run spritesheet

<div class='note'>
The generated sprite sheet and JSON meta file is supported by pixi.js. We'll
cover this in a future example.
</div>

Look at this project's `Projfile.coffee` which has the `spritesheet` task for this tutorial.

:::END
