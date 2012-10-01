node-vlc
--------

node bindings for libvlc using ffi

Currently this package depends on VLC >= 2.0.1, if you're on Mac OS X or Windows
it tries to detect the location of your VLC installation and find libvlc under
that.

Usage
-----

The ffi library can currently only be initialized once per process, so you can't
use multiple versions of libvlc in the same process.

The library tries to deduce the common location libvlc.so, `/usr/lib/libvlc.so`
or `/Applications/VLC.app/Contents/MacOS/lib/libvlc.dylib` for instance. If
your `libvlc` is named or versioned differently set `vlc.LIBRARY_PATHS` to the
full path (including filename) of your preferred version.

If libvlc isn't found after trying all of `vlc.LIBRARY_PATHS` it attempts to
load from your systems normal library loading parameters (i.e. `/etc/ld.so/conf`)

Searching is in array order, and is synchronous, but only happens on the first
initialization i.e. the first time you call `var instance = new vlc('-I', 'dummy');`
After the first successful initialization all dependent modules will use that
file for interactions.

For a quick example see `examples/vlc.js`

There are some operations that vlc performs that are synchronous. Currently
this library makes no attempt to work around such things, so be sure you know
what you're doing.

libvlc does have an event interface, but it is not as robust as nodes nor does
it necessarily match the node pattern.

There is not much documentation at the moment, use the source luke. For that
matter, there's not much documentation around libvlc either.

Events
------

Currently you can attach to the following events

 * Media -- odd bug, on osx you need to parseSync before attaching any handlers
else the process freezes, I haven't investigated fully to understand why yet.
   * `MetaChanged` - callback receives metadata field name that changed
   * `SubItemAdded` - callback receives new media item
   * `DurationChanged` - callback receives the new duration
   * `ParsedChanged` - callback receives the new parsed state
   * `Freed` - callback receives media item that was freed (wtf this seems like a bad idea)
   * `StateChanged` - callback receives the new media state
 * MediaPlayer
   * `MediaChanged` - no argument
   * `NothingSpecial` - no argument
   * `Opening` - no argument
   * `Buffering` - callback receives percent full of cache
   * `Playing` - no argument
   * `Paused` - no argument
   * `Stopped` - no argument
   * `Forward` - no argument
   * `Backward` - no argument
   * `EndReached` - no argument
   * `EncounteredError` - no argument
   * `TimeChanged` - callback receives the new time (constantly update while playing)
   * `PositionChanged` - callback receives new position (constantly updated while playing)
   * `SeekableChanged` - callback receives truthy of seekable
   * `PausableChanged` - callback receives truthy of pausable
   * `TitleChanged` - callback receives truthy of title changed
   * `SnapshotTaken` - no argument
   * `LengthChanged` - no argument
   * `Vout` - callback receives the new number of vout channels

