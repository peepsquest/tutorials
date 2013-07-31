/*! Keydrown - v0.1.5 - 2013-07-20 - http://jeremyckahn.github.com/keydrown */
;
(function(window) {

  var util = (function() {

    var util = {};

    /**
     * @param {Object} obj The Object to iterate through.
     * @param {function(*, string)} iterator The function to call for each property.
     */
    util.forEach = function(obj, iterator) {
      var prop;
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          iterator(obj[prop], prop);
        }
      }
    };
    var forEach = util.forEach;


    /**
     * Create a transposed copy of an Object.
     *
     * @param {Object} obj
     * @return {Object}
     */
    util.getTranspose = function(obj) {
      var transpose = {};

      forEach(obj, function(val, key) {
        transpose[val] = key;
      });

      return transpose;
    };


    /**
     * Implementation of Array#indexOf because IE<9 doesn't support it.
     *
     * @param {Array} arr
     * @param {*} val
     * @return {number} Index of the found element or -1 if not found.
     */
    util.indexOf = function(arr, val) {
      if (arr.indexOf) {
        return arr.indexOf(val);
      }

      var i, len = arr.length;
      for (i = 0; i < len; i++) {
        if (arr[i] === val) {
          return i;
        }
      }

      return -1;
    };
    var indexOf = util.indexOf;


    /**
     * An empty function.  NOOP!
     */
    util.noop = function() {
    };

    return util;

  }());


  /**
   * Cross-browser function for listening for and handling an event on the document element.
   *
   * @param {string} eventName
   * @param {function} handler
   */
  function documentOn(eventName, handler) {
    if (window.addEventListener) {
      window.addEventListener(eventName, handler, false);
    } else if (document.attachEvent) {
      document.attachEvent('on' + eventName, handler);
    }
  };


  /**
   * Lookup table of keys to keyCodes.
   *
   * @type {Object.<number>}
   */
  var KEY_MAP = {
    'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70, 'G': 71, 'H': 72, 'I': 73, 'J': 74, 'K': 75, 'L': 76, 'M': 77, 'N': 78, 'O': 79, 'P': 80, 'Q': 81, 'R': 82, 'S': 83, 'T': 84, 'U': 85, 'V': 86, 'W': 87, 'X': 88, 'Y': 89, 'Z': 90, 'ENTER': 13, 'ESC': 27, 'SPACE': 32, 'LEFT': 37, 'UP': 38, 'RIGHT': 39, 'DOWN': 40
  };


  /**
   * The transposed version of KEY_MAP.
   *
   * @type {Object.<string>}
   */
  var TRANSPOSED_KEY_MAP = util.getTranspose(KEY_MAP);

  /*!
   * @type Object
   */
  var keysDown = {};

  var Key = (function() {

    'use strict';

    /**
     * Represents a key on the keyboard.  You'll never actually call this method directly; Key Objects for every key that Keydrown supports are created for you when the library is initialized (as in, when the file is loaded).  You will, however, use the `prototype` methods below to bind functions to key states.
     * @constructor
     */
    function Key() {
    }


    /*!
     * The function to be invoked on every tick that the key is held down for.
     *
     * @type {function}
     */
    Key.prototype._downHandler = util.noop;


    /*!
     * The function to be invoked when the key is released.
     *
     * @type {function}
     */
    Key.prototype._upHandler = util.noop;


    /*!
     * The function to be invoked when the key is pressed.
     *
     * @type {function}
     */
    Key.prototype._pressHandler = util.noop;


    /**
     * Bind a function to be called when the key is held down.
     *
     * @param {function=} handler The function to be called when the key is held down.  If omitted, this function invokes whatever handler was previously bound.
     */
    Key.prototype.down = function(handler) {
      this._downHandler = handler;
    };


    /**
     * Bind a function to be called when the key is released.
     *
     * @param {function=} handler The function to be called when the key is released.  If omitted, this function invokes whatever handler was previously bound.
     */
    Key.prototype.up = function(handler) {
      this._upHandler = handler;
    };


    /**
     * Bind a function to be called when the key is pressed.  This handler will not fire again until the key is released — it does not repeat.
     *
     * @param {function=} handler The function to be called once when the key is pressed.  If omitted, this function invokes whatever handler was previously bound.
     */
    Key.prototype.press = function(handler) {
      this._pressHandler = handler;
    };


    /**
     * Remove the handler that was bound with [`kd.Key#down`](#down).
     */
    Key.prototype.unbindDown = function() {
      this._downHandler = util.noop;
    };


    /**
     * Remove the handler that was bound with [`kd.Key#up`](#up).
     */
    Key.prototype.unbindUp = function() {
      this._upHandler = util.noop;
    };


    /**
     * Remove the handler that was bound with [`kd.Key#press`](#press).
     */
    Key.prototype.unbindPress = function() {
      this._pressHandler = util.noop;
    };

    return Key;

  }());

  var kd = (function(keysDown) {
    'use strict';

    var kd = {};
    kd.Key = Key;

    var isRunning = false;


    /**
     * Evaluate which keys are held down and invoke their handler functions.
     */
    kd.tick = function() {
      var key, evt, keyCode;
      for (key in keysDown) {
        evt = keysDown[key];
        if (!evt) continue;

        keyCode = evt.keyCode;
        var keyName = TRANSPOSED_KEY_MAP[keyCode];
        if (keyName) {
          kd[keyName]._downHandler(evt);
        }
      }
    };


    // SETUP
    //


    // Initialize the KEY Objects
    util.forEach(KEY_MAP, function(keyCode, keyName) {
      kd[keyName] = new Key();
    });

    documentOn('keydown', function(evt) {
      var keyCode = evt.keyCode;
      var keyName = TRANSPOSED_KEY_MAP[keyCode];
      var isNew = !keysDown[keyCode];
      keysDown[keyCode] = evt;

      if (isNew && kd[keyName]) {
        kd[keyName]._pressHandler(evt);
      }
      evt.preventDefault();
    });

    documentOn('keyup', function(evt) {
      var keyCode = evt.keyCode;
      keysDown[keyCode] = null;

      var keyName = TRANSPOSED_KEY_MAP[keyCode];
      if (keyName) {
        kd[keyName]._upHandler(evt);
      }
      evt.preventDefault();
    });

    // Stop firing the "down" handlers if the user loses focus of the browser
    // window.
    documentOn('blur', function(evt) {
      for (var key in keysDown) {
        keysDown[key] = null;
      }
    });


    return kd;

    /*!
     * The variables passed into the closure here are defined in kd.key.js.
     */
    /*!*/
  }(keysDown));

  if (typeof module === "object" && typeof module.exports === "object") {
    // Keydrown was loaded as a CommonJS module (by Browserify, for example).
    module.exports = kd;
  } else if (typeof define === "function" && define.amd) {
    // Keydrown was loaded as an AMD module.
    define(function() {
      return kd;
    });
  }

  window.kd = kd;

}(window));
