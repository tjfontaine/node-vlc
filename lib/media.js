var lib = require('./libvlc');

var metaEnum = [
  'title',
  'artist',
  'genre',
  'copyright',
  'album',
  'tracknumber',
  'description',
  'rating',
  'date',
  'setting',
  'url',
  'language',
  'nowplaying',
  'publisher',
  'encodedby',
  'artworkurl',
  'trackid',
];

var metaName = {};

metaEnum.forEach(function (meta, index) {
  metaName[meta] = index;
});

var Media = module.exports = function (parent, reinit, opts) {
  var self = this;
  var released = false;

  if (reinit) {
    self.instance = reinit;
  } else if (opts.path) {
    self.instance = lib.libvlc_media_new_path(parent, opts.path);
  } else if (opts.url) {
    self.instance = lib.libvlc_media_new_location(parent, opts.url);
  } else if (opts.fd) {
    self.instance = lib.libvlc_media_new_fd(parent, opts.fd);
  } else {
    self.instance = lib.libvlc_media_new_node(parent);
  }

  this.release = function () {
    if (!released) {
      lib.libvlc_media_release(self.instance);
      released = true;
    }
  };

  this.parseSync = function () {
    lib.libvlc_media_parse(self.instance);
  };

  this.saveSync = function () {
    lib.libvlc_media_save_meta(self.instance);
  };

  Object.defineProperty(this, 'mrl', {
    get: function () {
      return lib.libvlc_media_get_mrl(self.instance);
    },
  });

  Object.defineProperty(this, 'is_parsed', {
    get: function () {
      return lib.libvlc_media_is_parsed(self.instance);
    },
  });

  Object.defineProperty(this, 'duration', {
    get: function () {
      return lib.libvlc_media_get_duration(self.instance);
    },
  });

  Object.keys(metaName).forEach(function (meta) {
    Object.defineProperty(self, meta, {
      get: function () {
        return lib.libvlc_media_get_meta(self.instance, metaName[meta]);
      },
      set: function (val) {
        lib.libvlc_media_set_meta(self.instance, metaName[meta], val);
      },
      enumerable: true,
      configurable: true,
    });
  });
};
