var ref = require('ref');

var lib = require('./libvlc');
var TrackInfo = require('./libvlc_types').TrackInfo;

var metaName = require('./media_enum').metaName;

var trackType = {
  unknown: -1,
  '-1': 'unknown',
  audio: 0,
  '0': 'audio',
  video: 1,
  '1': 'video',
  text: 2,
  '2': 'text',
}

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
    self.instance = lib.libvlc_media_new_as_node(parent);
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

  Object.defineProperty(this, 'track_info', {
    get: function () {
      var i, ptr, tmp;
      var results = [];

      var info = new Buffer(ref.sizeof.pointer);
      var tracks = lib.libvlc_media_get_tracks_info(self.instance, info);
      info = info.readPointer(0, TrackInfo.size * tracks);

      for (i = 0; i < tracks; i++) {
        ptr = ref.get(info, i * TrackInfo.size, TrackInfo);

        tmp = {
          codec: ptr.i_codec,
          id: ptr.i_id,
          type: trackType[ptr.i_type],
          profile: ptr.i_profile,
          level: ptr.i_level,
        };

        switch (tmp.type) {
          case 'audio':
            tmp.channels = ptr.union1;
            tmp.rate = ptr.union2;
            break;
          case 'video':
            tmp.height = ptr.union1;
            tmp.width = ptr.union2;
            break;
        }

        results.push(tmp);
      }

      //TODO XXX FIXME
      //info.free();

      return results;
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
