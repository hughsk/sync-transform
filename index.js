var tmp = require('quick-tmp')('deviant')()
var spawn = require('child_process').spawn
var mkdirp = require('mkdirp')
var crypto = require('crypto')
var path = require('path')
var fs = require('fs')

module.exports = syncTransform
mkdirp.sync(tmp)

var readyFile = path.resolve(tmp, 'ready')
var ready = true

var worker = spawn(process.execPath, [
    require.resolve('./worker')
  , readyFile
  , tmp
], {
    cwd: process.cwd()
  , env: process.env
}).once('exit', function(code) {
  if (code != 0) {
    throw new Error('Deviant worker crashed with exit code ' + code)
  }
})

process.once('exit', function() {
  worker.kill()
})

function syncTransform(filename, contents, transforms) {
  // block until the process is ready
  if (!ready) while (!fs.existsSync(readyFile));;

  ready = true

  var hex = crypto
    .createHash('md5')
    .update(filename)
    .update(String(Date.now()))
    .digest('hex')

  var ready = path.resolve(tmp, hex + '-ready')
  var src = path.resolve(tmp, hex + '-src')
  var dst = path.resolve(tmp, hex + '-dst')

  var data = JSON.stringify({
    transforms: transforms
    , contents: String(contents)
    , filename: filename
    , result: dst
    , ready: ready
  })

  fs.writeFileSync(src, data)

  // block until the file is ready
  while (!fs.existsSync(ready));;

  var result = fs.readFileSync(dst, 'utf8')

  fs.unlinkSync(src)
  fs.unlinkSync(dst)
  fs.unlinkSync(ready)
  fs.unlinkSync(readyFile)

  return result
}
