# sync-transform [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Synchronously retrieve the output of a browserify-style transform stream.

Note: this is a hack, but a little kinder on your system than using
[exec-sync](https://github.com/jeremyfa/node-exec-sync).

## Usage ##

[![sync-transform](https://nodei.co/npm/sync-transform.png?mini=true)](https://nodei.co/npm/sync-transform)

### result = transform(filename, contents, transforms) ###

* `filename` is the absolute path to the original file.
* `contents` should be the contents of said file, as either a string or a
  buffer.
* `transforms` is an array of transform modules – these should be specified as
  absolute paths.

Returns the transformed contents of a file as a string.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/sync-transform/blob/master/LICENSE.md) for details.
