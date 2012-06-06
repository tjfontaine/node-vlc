var lib = require('./libvlc');
var util = require('./util');

var VLM = module.exports = function (parent) {
  var self = this;
  var released = false;

  self.parent = parent;

  this.release = function () {
    if (!released) {
      lib.libvlc_vlm_release(parent);
      released = true;
    }
  }; 

  this.addBroadcast = function (name, mrl, sout, opts, enabled, loop) {
    return lib.libvlc_vlm_add_broadcast(parent, name, mrl, sout, 0, null, enabled ? 1 : 0, loop ? 1 : 0) === 0 ? true : util.throw();
  }

  this.setMedia = function (name, mrl) {
    return lib.libvlc_vlm_set_input(parent, name, mrl) === 0 ? true : util.throw();
  };

  this.changeMedia = function (name, mrl, sout, opts, enabled, loop) {
    return lib.libvlc_vlm_change_media(parent, name, mrl, sout, 0, null, enabled ? 1 : 0, loop ? 1 : 0) === 0 ? true : util.throw();
  }

  this.setEnabled = function (name, enabled) {
    return lib.libvlc_vlm_set_enabled(parent, name, enabled) === 0 ? true : util.throw();
  };

  this.setOutput = function (name, sout) {
    return lib.libvlc_vlm_set_output(parent, name, sout) === 0 ? true : util.throw();
  };

  this.showMedia = function (name) {
    return lib.libvlc_vlm_show_media(parent, name);
  };

  this.stopMedia = function (name) {
    return lib.libvlc_vlm_stop_media(parent, name) === 0 ? true : util.throw();
  };

  this.playMedia = function (name) {
    return lib.libvlc_vlm_play_media(parent, name) === 0 ? true : util.throw();
  };

  this.pauseMedia = function (name) {
    return lib.libvlc_vlm_pause_media(parent, name) === 0 ? true : util.throw();
  };
};
