var FFI = require('ffi');
var ref = require('ref');

var lib = require('./lib/libvlc');

var MediaPlayer = require('./lib/mediaplayer');
var Media = require('./lib/media');
var VLM = require('./lib/vlm');

var VLC = function (args) {
  if (!(this instanceof VLC)) {
    return new VLC(args);
  }

  var mediaplayer, vlm;
  var released = false;

  var cargs = new Buffer(ref.sizeof.pointer * args.length);
  for (var i = 0; i < args.length; i++) {
    cargs.writePointer(ref.allocCString(args[i]), i * ref.sizeof.pointer);
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
  
  this.mediaFromUrl = function(url){
    return new Media(instance, undefined, { url: url });
  };

  this.mediaFromFd = function(fd){
    return new Media(instance, undefined, { fd: fd });
  };

  this.mediaFromNode = function(node){
    return new Media(instance, undefined, node);
  };

  this.mediaFields = require('./lib/media_enum').metaEnum;
};

module.exports = VLC;
