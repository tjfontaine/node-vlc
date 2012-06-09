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
