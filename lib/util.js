var lib = require('./libvlc');
exports.throw = function () {
  var err = new Error(lib.libvlc_errmsg());
  throw err;
};
