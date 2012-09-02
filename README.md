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
