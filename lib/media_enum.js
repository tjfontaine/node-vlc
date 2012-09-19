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

exports.state = {
  0: 'NothingSpecial',
  1: 'Opening',
  2: 'Buffering',
  3: 'Playing',
  4: 'Paused',
  5: 'Stopped',
  6: 'Ended',
  7: 'Error',
  NothingSpecial: 0,
  Opening: 1,
  Buffering: 2,
  Playing: 3,
  Paused: 4,
  Stopped: 5,
  Ended: 6,
  Error: 7
};
