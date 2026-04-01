var ref = require('ref');

var lib = require('./libvlc');
var util = require('./util');

var TrackInfo = require('./libvlc_types').TrackInfo;
var MediaStats = require('./libvlc_types').MediaStats;
var EventPtr = require('./libvlc_types').EventPtr;
var Media = require('./Media');
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
  
  this.at=function(index)
  {
	lib.libvlc_media_list_lock(self.instance);
	var mi=lib.libvlc_media_list_item_at_index(self.instance, index);
	lib.libvlc_media_list_unlock(self.instance);
	return new Media(parent, mi);
  };
  
  Object.defineProperty(this, 'length', {
	get: function()
	{
		return lib.libvlc_media_list_count(self.instance);
	}
  });
  
};

MediaList.prototype.__get__=function(index){
	return this.at(index);
};
  
MediaList.prototype.__set__=function(index, media){
	return this.insert(self.instance, media.instance, index);
};

