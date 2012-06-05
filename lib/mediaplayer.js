var lib = require('./libvlc');
var util = require('./util');

var Media = require('./media');

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
  time: { get: true, set: true, },
  position: { get: true, set: true, },
  chapter: { get: true, set: true, },
  title: { get: true, set: true, },
  rate: { get: true, set: true, },
};

var props = [];

Object.keys(properties).forEach(function (prop) {
  var getter = 'libvlc_media_player_';
  var setter;

  if (properties[prop].get) {
    getter += 'get_';
  }

  getter += prop;

  if (properties[prop].set) {
    setter = 'libvlc_media_player_set_' + prop;
  }

  props.push({
    name: prop,
    get: getter,
    set: setter,
  });
});

var MediaPlayer = module.exports = function (parent) {
  var self = this;
  var released = false;

  this.parent = parent;
  this.instance = lib.libvlc_media_player_new(parent);

  this.release = function () {
    if (!released) {
      lib.libvlc_media_player_release(self.instance);
      released = true;
    }
  };

  props.forEach(function (prop) {
    var get, set;

    get = function () {
      return lib[prop.get](self.instance);
    };

    if (prop.set) {
      set = function (val) {
        return lib[prop.set](self.instance, val);
      };
    }

    Object.defineProperty(self, prop.name, {
      get: get,
      set: set,
    });
  });

  Object.defineProperty(this, 'media', {
    get: function () {
      var mi = lib.libvlc_media_player_get_media(self.instance);
      return new Media(self.parent, mi);
    },
    set: function (val) {
      lib.libvlc_media_player_set_media(self.instance, val.instance);
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
};
