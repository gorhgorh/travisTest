var levelup = require('levelup')

var db = levelup('./buildDb')

var debug = require('debug')('travisBot:db')

function putB (data, cb) {
  var key = Date.now()
  debug(data)
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
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

function getB (key) {

}

// putBuild({data: 'yo'})

module.exports = {
  putB
}
