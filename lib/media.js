var ref = require('ref');

var lib = require('./libvlc');
var util = require('./util');

var TrackInfo = require('./libvlc_types').TrackInfo;
var MediaStats = require('./libvlc_types').MediaStats;

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

var ffi = require('ffi')
var libc = ffi.Library(null, {
  'free': ['void', [ 'pointer' ]],
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

      libc.free(info);
      info = undefined;

      return results;
    },
  });

  Object.defineProperty(this, 'stats', {
    get: function () {
      var ret, stats, tmp;
      stats = ref.alloc(MediaStats);
      ret = lib.libvlc_media_get_stats(self.instance, stats);
      stats = stats.deref();
      tmp = {
        read_bytes: stats.i_read_bytes,
        input_bitrate: stats.f_input_bitrate,
        demux_read_bytes: stats.i_demux_read_bytes,
        demux_bitrate: stats.f_demux_bitrate,
        demux_corrupted: stats.i_demux_corrupted,
        demux_discontinuity: stats.i_demux_discontinuity,
        decoded_video: stats.i_decoded_video,
        decoded_audio: stats.i_decoded_audio,
        displayed_pictures: stats.i_displayed_pictures,
        lost_pictures: stats.i_lost_pictures,
        played_abuffers: stats.i_played_abuffers,
        lost_abuffers: stats.i_lost_abuffers,
        sent_packets: stats.i_sent_packets,
        sent_bytes: stats.i_sent_bytes,
        send_bitrate: stats.f_send_bitrate,
      };
      return ret === 0 ? util.throw() : tmp;
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
