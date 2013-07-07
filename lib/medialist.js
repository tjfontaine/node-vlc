var ref = require('ref');

var lib = require('./libvlc');
var util = require('./util');

var TrackInfo = require('./libvlc_types').TrackInfo;
var MediaStats = require('./libvlc_types').MediaStats;
var EventPtr = require('./libvlc_types').EventPtr;

var EventEmitter = require('events').EventEmitter;

var ffi = require('ffi')

var MediaList = module.exports = function (parent, reinit) {
  var self = this;
  var released = false;
  var eventmgr;
  this.parent = parent;

  var selfref = ref.alloc(ref.types.Object, self);

  if (reinit) {
    self.instance = reinit;
  } else {
    self.instance = lib.libvlc_media_list_new(parent);
  }

  this.release = function () {
    if (!released) {
      lib.libvlc_media_list_release(self.instance);
      released = true;
    }
  };

  this.add=function(media)
  {
	return lib.libvlc_media_list_add_media(self.instance, media.instance);
  }
  
  this.insert=function(media, pos)
  {
	return lib.libvlc_media_list_insert_media(self.instance, media.instance, pos);
  }
  
  this.__get__=function(index){
	return new Media(parent, lib.libvlc_media_list_item_at_index(self.instance, index));
  };
  
  this.__set__=function(index, media){
	return this.insert(self.instance, media.instance, index);
  };
};
