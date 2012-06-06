var FFI = require('ffi');
var lib = require('./lib/libvlc');

var MediaPlayer = require('./lib/mediaplayer');
var Media = require('./lib/media');
var VLM = require('./lib/vlm');

var VLC = function () {
  var mediaplayer, vlm;
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

  Object.defineProperty(this, 'vlm', {
    get: function () {
      if (!vlm) {
        vlm = new VLM(instance);
      }
      return vlm;
    },
  });

  this.release = function () {
    if (!released) {
      if (mediaplayer) {
        mediaplayer.release();
      }
      if (vlm) {
        vlm.release();
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
