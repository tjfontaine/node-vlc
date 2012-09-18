var ref = require('ref');
var Struct = require('ref-struct');

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
