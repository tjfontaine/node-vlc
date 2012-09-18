var lib = require('./libvlc');

var util = require('./util');

var properties = {
  mute: { get: true, set: true },
  volume: { get: true, set: true },
  track_count: { get: true },
  track: { get: true, set: true },
  channel: { get: true, set: true },
  delay: { get: true, set: true },
};

var Audio = function (mediaplayer) {
  util.makeProperties(this, mediaplayer, properties, 'libvlc_audio_');

  Object.defineProperty(this, 'description', {
    get: function () {
      var ret = [], tmp, start;

      start = tmp = lib.libvlc_audio_get_track_description(mediaplayer);

      while(!tmp.isNull()) {
        tmp = tmp.deref();
        ret.push({
          id: tmp.i_id,
          name: tmp.psz_name,
        });
        tmp = tmp.p_next;
      }

      if (!start.isNull())
        lib.libvlc_track_description_list_release(start);

      return ret;
    },
  });

  this.toggle_mute = function () {
    lib.libvlc_audio_toggle_mute(mediaplayer);
  }
};

module.exports = Audio;
