var ref = require('ref');
var ffi = require('ffi');
var Struct = require('ref-struct');
var Union = require('ref-union');

exports.audio=Struct({
	i_channels:ref.types.uint32,
	i_rate:ref.types.uint32
});

exports.video=Struct({
	i_height:ref.types.uint32,
	i_width:ref.types.uint32
});

exports.TrackInfo = Union({
  i_codec: ref.types.uint32,
  i_id: ref.types.int32,
  i_type: ref.types.uint32,
  i_profile: ref.types.int32,
  i_level: ref.types.int32,
  audio: exports.audio,
  video: exports.video,
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

var libvlc_time_t=ref.types.int64;

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

exports.Media=Struct({});

var EventUnion = Union({
  media_meta_changed: Struct({ meta_type: ref.types.int32 }),
  media_subitem_added: Struct({ new_child: ref.refType(ref.types.void) }),
  media_duration_changed: Struct({ new_duration: ref.types.int64 }),
  media_parsed_changed: Struct({ new_status: ref.types.int32 }),
  media_freed: Struct({ md: ref.refType(ref.types.void) }),
  media_state_changed: Struct({ new_state: ref.types.uint32 }),
  media_player_buffering: Struct({ new_cache: ref.types.float }),
  media_player_position_changed: Struct({ new_position: ref.types.float }),
  media_player_time_changed: Struct({ new_time: libvlc_time_t }),
  media_player_title_changed: Struct({ new_title: ref.types.int32 }),
  media_player_seekable_changed: Struct({ new_seekable: ref.types.int32 }),
  media_player_pausable_changed: Struct({ new_pausable: ref.types.int32 }),
  media_player_vout: Struct({ new_count: ref.types.int32 }),
  media_list_item_added: Struct({ item: ref.refType(ref.types.void), index:ref.types.int32 }),
  media_list_will_add_item: Struct({ item: ref.refType(ref.types.void), index:ref.types.int32 }),
  media_list_item_deleted: Struct({ item: ref.refType(ref.types.void), index:ref.types.int32 }),
  media_list_will_delete_item: Struct({ item: ref.refType(ref.types.void), index:ref.types.int32 }),
  media_list_player_next_item_set: Struct({ item: ref.refType(ref.types.void) }),
  media_player_snapshot_taken: Struct({ psz_filename: ref.types.CString }),
  media_player_length_changed: Struct({ new_length: libvlc_time_t }),
  vlm_media_event: Struct({ psz_media_name: ref.types.CString, psz_instance_name:ref.types.CString }),
  media_player_media_changed: Struct({ new_media:ref.refType(ref.types.void) })
});

exports.Event = Struct({
  type: ref.types.int32,
  p_obj: ref.refType(ref.types.void),
  u: EventUnion,
});

exports.EventPtr = ref.refType(exports.Event);

var VALID_EVENTS = {
  0x100: 'MediaChanged',
  0x101: 'NothingSpecial',
  0x102: 'Opening',
  0x103: 'Buffering',
  0x104: 'Playing',
  0x105: 'Paused',
  0x106: 'Stopped',
  0x107: 'Forward',
  0x108: 'Backward',
  0x109: 'EndReached',
  0x10A: 'EncounteredError',
  0x10B: 'TimeChanged',
  0x10C: 'PositionChanged',
  0x10D: 'SeekableChanged',
  0x10E: 'PausableChanged',
  0x10F: 'TitleChanged',
  0x110: 'SnapshotTaken',
  0x111: 'LengthChanged',
  0x112: 'Vout',
  MediaChanged: 0x100,
  NothingSpecial: 0x101,
  Opening: 0x102,
  Buffering: 0x103,
  Playing: 0x104,
  Paused: 0x105,
  Stopped: 0x106,
  Forward: 0x107,
  Backward: 0x108,
  EndReached: 0x109,
  EncounteredError: 0x10A,
  TimeChanged: 0x10B,
  PositionChanged: 0x10C,
  SeekableChanged: 0x10D,
  PausableChanged: 0x10E,
  TitleChanged: 0x10F,
  SnapshotTaken: 0x110,
  LengthChanged: 0x111,
  Vout: 0x112,
};

var EventEmitter=require('events').EventEmitter;

var VlcEventManager=exports.VlcEventManager=function(){


  EventEmitter.call(this);
  
  var _on = this.on;
  var self=this;

  var event_handler = function(e) {
	  var event = e.deref();
	  var union = event.u;
	  var name, arg;

	  
	  if (self.instance.address() != event.p_obj.address())
		return;

	  name = VALID_EVENTS[event.type];

	  if (!name)
		return;

	  switch (event.type) {
		case VALID_EVENTS.Buffering:
		  arg = union.media_player_buffering.new_cache;
		  break;
		case VALID_EVENTS.TimeChanged:
		  arg = union.media_player_time_changed.new_time;
		  break;
		case 0x10C:
		  arg = union.media_player_position_changed.new_position;
		  break;
		case 0x10D:
		  arg = union.media_player_seekable_changed.new_seekable;
		  break;
		case 0x10E:
		  arg = union.media_player_pausable_changed.new_pausable;
		  break;
		case 0x10F:
		  arg = union.media_player_title_changed.new_title;
		  break;
		case 0x112:
		  arg = union.media_player_vout.new_count;
		  break;
	  };

	  self.emit(name, arg);
	};

	var callback = ffi.Callback(ref.types.void, [
		  exports.EventPtr,
		  ref.refType(ref.types.Object)
	], event_handler);
  
  var lib=require('./libvlc');
  var eventmgr;
  this.on = function (e, cb) {
    var tmp;

    if (!eventmgr) {
      eventmgr = self.eventManagerInstance;
    }
    if (VALID_EVENTS[e] !== undefined) {
      if (!self._events || !self._events[e]) {
        tmp = lib.libvlc_event_attach(eventmgr, VALID_EVENTS[e], callback, null);
        if (tmp != 0) util.throw();
      }
      
	  _on.call(self, e, cb);
	  
    } else {
      throw new Error("Not a valid event type: " + e + " not in " + Object.keys(VALID_EVENTS));
    }
  };

  var _rl = this.removeListener;
  this.removeListener = function (e, cb) {
    if (!eventmgr)
      return;
    if (VALID_EVENTS[e] !== undefined) {
      if (self._events && ((self._events[e] instanceof Function) || self._events[e].length === 1)) {
        lib.libvlc_event_detach(eventmgr, VALID_EVENTS[e], callback, null);
      }
      _rl.call(self, e, cb);
    } else {
      throw new Error("Not a valid event type: " + e + " not in " + Object.keys(VALID_EVENTS));
    }
  };
};

require('util').inherits(VlcEventManager, EventEmitter);