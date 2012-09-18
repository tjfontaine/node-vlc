var os = require('os');
var path = require('path');

var FFI = require('ffi');
var ref = require('ref');

var LIBRARY_PATHS = [];

switch (os.platform()) {
  case 'darwin':
    LIBRARY_PATHS.push('/Applications/VLC.app/Contents/MacOS/lib/libvlc.dylib');
    LIBRARY_PATHS.push(path.join(process.env.HOME, 'Applications/VLC.app/Contents/MacOS/lib/libvlc.dylib'));
    break;
  case 'win32':
    if (process.env['ProgramFiles(x86)']) {
      LIBRARY_PATHS.push(path.join('',
        process.env['ProgramFiles(x86)'],
        'VideoLAN',
        'VLC',
        'libvlc.dll'
      ));
    }
    LIBRARY_PATHS.push(path.join(
      process.env['ProgramFiles'],
      'VideoLAN',
      'VLC',
      'libvlc.dll'
    ));
    break;
  default:
    LIBRARY_PATHS.push('/usr/lib/libvlc.so');
    LIBRARY_PATHS.push('/usr/lib/libvlc.so.5');
    break;
}

exports.LIBRARY_PATHS = LIBRARY_PATHS;

var lib, MediaPlayer, Media, VLM;

var VLC = function (args) {
  if (!(this instanceof VLC)) {
    return new VLC(args);
  }

  if (!lib) {
    lib = require('./lib/libvlc').initialize(LIBRARY_PATHS);
    MediaPlayer = require('./lib/mediaplayer');
    Media = require('./lib/media');
    VLM = require('./lib/vlm');
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

  Object.defineProperty(this, 'audio_filters', {
    get: function() {
      var ret = [], tmp, start;
      start = tmp = lib.libvlc_audio_filter_list_get(instance);

      while (!tmp.isNull()) {
        tmp = tmp.deref();
        ret.push({
          name: tmp.psz_name,
          shortname: tmp.psz_shortname,
          longname: tmp.psz_longname,
          help: tmp.psz_help,
        });
        tmp = tmp.p_next;
      }

      if (!start.isNull())
        lib.libvlc_module_description_list_release(start);

      return ret;
    },
  });

  Object.defineProperty(this, 'video_filters', {
    get: function() {
      var ret = [], tmp, start;
      start = tmp = lib.libvlc_video_filter_list_get(instance);

      while (!tmp.isNull()) {
        tmp = tmp.deref();
        ret.push({
          name: tmp.psz_name,
          shortname: tmp.psz_shortname,
          longname: tmp.psz_longname,
          help: tmp.psz_help,
        });
        tmp = tmp.p_next;
      }

      if (!start.isNull())
        lib.libvlc_module_description_list_release(start);

      return ret;
    },
  });
};

module.exports = VLC;
