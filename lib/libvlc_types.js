var ref = require('ref');
var Struct = require('ref-struct');
var Union = require('ref-union');

exports.TrackInfo = Struct({
  i_codec: ref.types.uint32,
  i_id: ref.types.int32,
  i_type: ref.types.uint32,
  i_profile: ref.types.int32,
  i_level: ref.types.int32,
  union1: ref.types.uint32,
  union2: ref.types.uint32,
});

exports.MediaStats = Struct({
  i_read_bytes: ref.types.int32,
  f_input_bitrate: ref.types.float,
  i_demux_read_bytes: ref.types.int32,
  f_demux_bitrate: ref.types.float,
  i_demux_corrupted: ref.types.int32,
  i_demux_discontinuity: ref.types.int32,
  i_decoded_video: ref.types.int32,
  i_decoded_audio: ref.types.int32,
  i_displayed_pictures: ref.types.int32,
  i_lost_pictures: ref.types.int32,
  i_played_abuffers: ref.types.int32,
  i_lost_abuffers: ref.types.int32,
  i_sent_packets: ref.types.int32,
  i_sent_bytes: ref.types.int32,
  f_send_bitrate: ref.types.float,
});
exports.MediaStatsPtr = ref.refType(exports.MediaStats);

var TrackDescription = exports.TrackDescription = Struct({
  i_id: ref.types.int32,
  psz_name: ref.types.CString,
});
var TrackDescriptionPtr = exports.TrackDescriptionPtr = ref.refType(TrackDescription);
TrackDescription.defineProperty('p_next', TrackDescriptionPtr);

exports.ModuleDescription = Struct({
  psz_name: ref.types.CString,
  psz_shortname: ref.types.CString,
  psz_longname: ref.types.CString,
  psz_help: ref.types.CString,
});
exports.ModuleDescriptionPtr = ref.refType(exports.ModuleDescription);
exports.ModuleDescription.defineProperty('p_next', exports.ModuleDescriptionPtr);

var EventUnion = Union({
  media_meta_changed: Struct({ meta_type: ref.types.int32 }),
  media_subitem_added: Struct({ new_child: ref.refType(ref.types.void) }),
  media_duration_changed: Struct({ new_duration: ref.types.int64 }),
  media_parsed_changed: Struct({ new_status: ref.types.int32 }),
  media_freed: Struct({ md: ref.refType(ref.types.void) }),
  media_state_changed: Struct({ new_state: ref.types.uint32 }),
  media_player_buffering: Struct({ new_cache: ref.types.float }),
  media_player_position_changed: Struct({ new_position: ref.types.float }),
  media_player_time_changed: Struct({ new_time: ref.types.int64 }),
  media_player_title_changed: Struct({ new_title: ref.types.int32 }),
  media_player_seekable_changed: Struct({ new_seekable: ref.types.int32 }),
  media_player_pausable_changed: Struct({ new_pausable: ref.types.int32 }),
  media_player_vout: Struct({ new_count: ref.types.int32 }),
});

exports.Event = Struct({
  type: ref.types.int32,
  p_obj: ref.refType(ref.types.void),
  u: EventUnion,
});

exports.EventPtr = ref.refType(exports.Event);
