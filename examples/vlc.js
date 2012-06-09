var vlc = require('../vlc');

var media = vlc.mediaFromFile(process.argv[2]);
media.parseSync();

media.track_info.forEach(function (info) {
  console.log(info);
});

console.log(media.artist, '--', media.album, '--', media.title);

var player = vlc.mediaplayer;
player.media = media;
console.log('Media duration:', media.duration);

//player.play();

var poller = setInterval(function () {
  console.log('Poll:', player.position);
}, 500);

setTimeout(function () {
  console.log('--- stoping ---', player.position);
  player.stop();
  clearInterval(poller);
}, media.duration + 100);
