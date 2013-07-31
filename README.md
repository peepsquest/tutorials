# pixi.js Tutorials

This is the source project, view the [HTML Site](http://peepsquest.github.io/tutorials).

## Building

    npm install projmate-cli@0.1.0-dev -g
    npm istall -d
    pm run all

## Adding another tutorial

*   Add markdown file  to `src`
*   Update `src/toc.md`
*   Rebuild

        pm run all

## Isometric Art

Set degrees to

    26.56505118 == arctan(0.5)

This sets a 1 px rise for 2 px run which is optimal for screen
lines.
