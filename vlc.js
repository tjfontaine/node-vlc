var FFI = require('ffi');
var lib = require('./lib/libvlc');

var MediaPlayer = require('./lib/mediaplayer');
var Media = require('./lib/media');

var VLC = function () {
  var mediaplayer;
  var released = false;

  instance = lib.libvlc_new(0, null);

  Object.defineProperty(this, 'mediaplayer', {
    get: function () {
      if (!mediaplayer) {
        mediaplayer = new MediaPlayer(instance);
      }
      return mediaplayer;
    },
  });

  this.release = function () {
    if (!released) {
      if (mediaplayer) {
        mediaplayer.release();
      }
      lib.libvlc_release(instance);
      released = true;
    }
  };

  this.mediaFromFile = function (path) {
    return new Media(instance, undefined, { path: path });
  };
};

module.exports = new VLC();
