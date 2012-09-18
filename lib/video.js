var lib = require('./libvlc');

var util = require('./util');

var properties = {
  fullscreen: { get: true, set: true },
  size: { get: true },
  height: { get: true },
  width: { get: true },
  cursor: { get: true },
  scale: { get: true, set: true },
  aspect_ratio: { get: true, set: true },
  spu: { get: true, set: true },
  spu_count: { get: true },
  spu_description: { get: true },
  spu_delay: { get: true, set: true },
  crop_geometry: { get: true, set: true },
  teletext: { get: true, set: true },
  track_count: { get: true },
  track: { get: true, set: true },
};

var Video = function (mediaplayer) {
  util.makeProperties(this, mediaplayer, properties, 'libvlc_video_');

  this.take_snapshot = function (track, file, width, height) {
    var ret = lib.libvlc_video_take_snapshot(mediaplayer, track, file, width, height);
    return ret === 0 ? true : util.throw();
  };

  Object.defineProperty(this, 'description', {
    get: function () {
      var ret = [], tmp, start;

      start = tmp = lib.libvlc_video_get_track_description(mediaplayer);

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
};

module.exports = Video;
