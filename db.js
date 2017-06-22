var levelup = require('levelup')

var db = levelup('./buildDb')

var debug = require('debug')('travisBot:db')

function putBuild (data, cb) {
  var key = Date.now()

  if (typeof data !== 'String') {
    debug(data)
    data = JSON.stringify(data)
    debug(data)
  }

  db.put(key, data, function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error

    db.get(key, function (err, value) {
      if (err) return console.log('Ooops!', err) // likely the key was not found

      debug('entry saved', key, ':', value)
      if (cb) cb()
    })
  })
}

putBuild({data: 'yo'})

module.exports = {
  putBuild
}
