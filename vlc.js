var FFI = require('ffi');
var ref = require('ref');

var lib = require('./lib/libvlc');

var MediaPlayer = require('./lib/mediaplayer');
var Media = require('./lib/media');
var VLM = require('./lib/vlm');

var VLC = function (args) {
  var mediaplayer, vlm;
  var released = false;

  var cargs = new Buffer(ref.refType(ref.types.char) * args.length);
  for (var i = 0; i < args.length; i++) {
    var cstr = new Buffer(args[i].length + 1);
    cstr.writeCString(args[i], 0, 'ascii');
    cargs.writePointer(cstr.ref(), i * ref.sizeof.pointer);
  }

  instance = lib.libvlc_new(args.length, cargs);

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

  this.mediaFields = require('./lib/media_enum').metaEnum;
};

module.exports = new VLC(['-I', 'dummy']);
