fs = require('fs')
async = require('async')

{readFileSync} = fs

exports.project = (pm) ->
  {$, Utils, f} = pm

  pm.filters require('pm-spritesheet')
  pm.filters require('pm-tutdown')

  $.registerExecutable 'git'
  $.registerExecutable 'grunt'

  changeToDocs = f.tap (asset) ->
    asset.filename = asset.filename.replace(/^src/, 'docs')

  all: ['clean', 'scripts', 'stylesheets', 'staticFiles', 'spritesheet', 'docs']

  _toc:
    files: 'src/toc.md'
    dev: [
      f.tutdown assetsDirname: 'docs/examples'
      f.writeFile _filename: 'docs/toc.html'
    ]

  docs:
    desc: 'Builds docs'
    deps: ['_toc']
    files: [
      'src/*.md'
    ]
    dev: [
      f.tutdown
        templates:
          example: readFileSync('src/support/_example.mustache', 'utf8')
          uml: readFileSync('src/support/_uml.mustache', 'utf8')
        assetsDirname: 'docs/examples'
      f.tap (asset) ->
        asset.nav = readFileSync('docs/toc.html')
        asset.filename = asset.filename.replace(/^src/, 'docs')
      f.template
        delimiters: 'mustache'
        filename: 'src/support/_layout.mustache'
        navHeader: ''
      f.writeFile
    ]

  scripts:
    files: 'src/examples/**/*.coffee'
    dev: [
      f.coffee sourceMap: true
      changeToDocs
      f.writeFile
    ]

  stylesheets:
    desc: 'Builds less files'
    files: ['src/css/*.less']
    dev: [
      f.less dumpLineNumbers: null
      changeToDocs
      f.writeFile
    ]

  staticFiles:
    desc: 'Copies static files'
    watch: 'src/examples'
    dev: ->
      $.xcopy 'src/examples/', 'docs/examples'
      $.xcopy 'src/img/', 'docs/img'

  clean: ->
    $.rm '-rf', 'docs'
    $.mkdir '-p', 'docs'

  # grapefruit:
  #   desc: 'Builds and updates grapefruit script'
  #   dev: (done) ->
  #     this.timeout = 10000
  #     $.inside '~/peepsquest/grapefruit', (popcb) ->
  #       cb = popcb(done)
  #       $.git 'pull origin master', ->
  #         $.grunt 'build --force', ->
  #           $.cp '-f', 'build/gf.js',  __dirname + "/src/examples/js/vendor/gf.js"
  #           cb()

  grapefruitSource:
    desc: 'Builds and updates grapefruit script'
    watch: '../grapefruit/src/**/*.js'
    dev: (done) ->
      this.timeout = 10000
      $.inside '~/peepsquest/grapefruit', (popcb) ->
        cb = popcb(done)
        $.grunt 'build --force', ->
          $.cp '-f', 'build/gf.js',  __dirname + "/src/examples/js/vendor/gf.js"
          cb()

  pixi:
    desc: 'Fetches Pixi edge scripts'
    dev: (done) ->
      files =
        'https://raw.github.com/GoodBoyDigital/pixi.js/dev/bin/pixi.dev.js': 'src/examples/js/vendor/pixi.dev.js'
        'https://raw.github.com/bestiejs/lodash/v1.3.1/dist/lodash.min.js': 'src/examples/js/vendor/lodash.min.js'
      $.wget(files).then done


  "gh-pages":
    desc: "Creates/updates gh-pages branch"
    dev: (cb) ->
      this.timeout = 30000

      GH_PAGES = '_gh-pages'
      ensureGhPagesBranch = (cb) ->
        if $.test('-d', GH_PAGES)
          cb()
        else
          $ .git "clone git@github.com:peepsquest/tutorials #{GH_PAGES}", (err) ->
            return cb(err) if err
            $.inside GH_PAGES, (popcb) ->
              $.git "checkout -t origin/gh-pages", popcb(cb)

      updateRepo = (cb) ->
        $.inside GH_PAGES, (popcb) ->
          $ .git("checkout gh-pages")
            .git("pull origin gh-pages")
            .start popcb(cb)

      updateFiles = (cb) ->
        $.cp '-rf', 'docs/*', GH_PAGES
        cb()

      async.series [ensureGhPagesBranch, updateRepo, updateFiles], (err) ->
        if err
          $.error 'ERROR', err
        else
          $.info '_gh-pages updated. cd into it and `git push origin gh-pages`'
        cb()

  spritesheet:
    files: 'src/examples/img/tp/*.png'
    dev: [
      f.spritesheet filename: 'docs/examples/img/tp/spritesheet.png', root: 'src/examples/img/tp'
    ]

  roadTiles:
    dev:'Create spritesheet for roadTiles_nova'
    files: 'src/examples/vendor/roadTiles/png/*.png'
    dev: [
      f.spritesheet filename: 'src/examples/img/roadTiles.png', root: 'src/examples/vendor/roadTiles/png/'
    ]
