node-vlc
--------

node bindings for libvlc using ffi

Currently this package depends on VLC >= 2.0.1, if you're on Mac OS X or Windows
it tries to detect the location of your VLC installation and find libvlc under
that.

On linux (and most other unicies) it relies on libvlc being found in your normal
library searching preferences (`/etc/ld.so.conf` or `LD_LIBRARY_PATH` etc).
However, it's quite likely that you have a versioned dynamic library, for
instance on Debian like systems the file is actually `libvlc.so.5` and there's
no symlink to `libvlc.so`. To handle this case currently you'll need to create
a symlink manually, so the loader will find it. You can even place the symlink
in your current working directory to satisfy the loading:
`ln -s /usr/lib/libvlc.so.5 ./libvlc.so`

Usage
-----
