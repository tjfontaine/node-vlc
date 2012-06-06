var metaEnum = [
  'title',
  'artist',
  'genre',
  'copyright',
  'album',
  'tracknumber',
  'description',
  'rating',
  'date',
  'setting',
  'url',
  'language',
  'nowplaying',
  'publisher',
  'encodedby',
  'artworkurl',
  'trackid',
];

var metaName = {};

metaEnum.forEach(function (meta, index) {
  metaName[meta] = index;
});

exports.metaName = metaName;
exports.metaEnum = metaEnum;
