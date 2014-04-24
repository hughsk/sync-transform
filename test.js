'use strict'

var transform = require('./')
var test = require('tape')
var fs = require('fs')
var vm = require('vm')

test('coffeescript', coffee)

function coffee(t) {
  var file = __dirname + '/fixtures/index.coffee'
  var src = transform(file
    , fs.readFileSync(file)
    , [require.resolve('coffeeify')]
  )

  t.equal('hello', eval(src))
  t.ended = true
  process.exit()
}
