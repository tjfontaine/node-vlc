var ref = require('ref');
var ffi = require('ffi');

var lib = require('./libvlc');
var types = require('./libvlc_types');

var Callback=types.Callback;
var VlcEventManager=types.VlcEventManager;
var util = require('./util');

var Media = require('./media');
var Video = require('./video');
var Audio = require('./audio');

var properties = {
  is_playing: { },
  is_seekable: { },
  will_play: { },
  can_pause: { },
  state: { get: true, },
  length: { get: true, },
  fps: { get: true, },
  chapter_count: { get: true, },
  title_count: { get: true, },
  length: { get: true, },
  time: { get: true, set: true, },
  position: { get: true, set: true, },
  chapter: { get: true, set: true, },
  title: { get: true, set: true, },
  rate: { get: true, set: true, },
};

var MediaPlayer = module.exports = function (parent) {

  VlcEventManager.call(this);

  var self = this;
  var released = false;
  var video, audio;

  this.parent = parent;
  this.instance = lib.libvlc_media_player_new(parent);

  this.release = function () {
    if (!released) {
      lib.libvlc_media_player_release(self.instance);
      released = true;
    }
  };

  Object.defineProperty(this, 'eventManagerInstance', {
	get: function(){
	    return lib.libvlc_media_player_event_manager(self.instance);  
	}
  });
  
  util.makeProperties(self, self.instance, properties, 'libvlc_media_player_');

  Object.defineProperty(this, 'media', {
    get: function () {
      var mi = lib.libvlc_media_player_get_media(self.instance);
	  if(ref.isNull(mi))
		return null;
      return new Media(self.parent, mi);
    },
    set: function (val) {
      lib.libvlc_media_player_set_media(self.instance, val.instance);
    },
  });

  Object.defineProperty(this, 'video', {
    get: function () {
      if (!video) {
        video = new Video(self.instance);
      }
      return video;
    },
  });

  Object.defineProperty(this, 'audio', {
    get: function () {
      if (!audio) {
        audio = new Audio(self.instance);
      }
      return audio;
    },
  });
  
  this.play = function () {
    return lib.libvlc_media_player_play(self.instance) < 0 ? util.throw() : true;
  };

  this.pause = function () {
    lib.libvlc_media_player_pause(self.instance);
  };

  this.stop = function () {
    lib.libvlc_media_player_stop(self.instance);
  };
  
  this.toggleFullscreen=function(){
	lib.libvlc_toggle_fullscreen(self.instance);
  }
};
require('util').inherits(MediaPlayer, VlcEventManager);
