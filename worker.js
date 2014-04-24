var combine = require('stream-combiner')
var chokidar = require('chokidar')
var from = require('from')
var path = require('path')
var fs = require('fs')

var readyFile = process.argv[2]
var tmpDir = process.argv[3]

if (!readyFile) throw new Error('No readyFile supplied')
if (!tmpDir) throw new Error('No tmpdir supplied')

var ignore = {}
var watcher = chokidar.watch(tmpDir, {
    ignored: /\-dst$/g
  , persistent: true
})

fs.writeFileSync(readyFile, '')

watcher.on('add', function(file) {
  if (path.basename(file) === 'ready') return
  if (ignore[file]) return

  ignore[file] = true

  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw err

    console.error(file)
    data = JSON.parse(data)

    var transforms = data.transforms.map(function(tr) {
      return require(tr)(data.filename, {})
    })

    combine.apply(null, []
      .concat(from([data.contents]))
      .concat(transforms)
      .concat(fs.createWriteStream(data.result))
    ).once('close', done)
     .once('error', done)

    function done() {
      done = function(){}
      ignore[file] = false
      fs.writeFileSync(data.ready, '')
    }
  })
})
