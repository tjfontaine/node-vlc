var lib = require('./libvlc');
exports.throw = function () {
  var err = new Error(lib.libvlc_errmsg());
  throw err;
};

exports.makeProperties = function (obj, instance, properties, prefix) {
  var props = [];

  Object.keys(properties).forEach(function (prop) {
    var getter = prefix;
    var setter;

    if (properties[prop].get) {
      getter += 'get_';
    }

    getter += prop;

    if (properties[prop].set) {
      setter = prefix + 'set_' + prop;
   }

    props.push({
      name: prop,
      get: getter,
      set: setter,
    });
  });

  props.forEach(function (prop) {
    var get, set;

    get = function () {
      return lib[prop.get](instance);
    };

    if (prop.set) {
      set = function (val) {
        return lib[prop.set](instance, val);
      };
    }

    Object.defineProperty(obj, prop.name, {
      get: get,
      set: set,
    });
  });
}
