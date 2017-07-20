var levelup = require('levelup')

var db = levelup('./buildDb')

var debug = require('debug')('travisBot:db')

function putB (data, cb) {
  // var key
  // if (data.id) key = data.id
  // else key = Date.now()
  var key = Date.now()
  if (typeof data !== 'string') {
    debug(typeof (data.id))
      key = data.id
    data = JSON.stringify(data)
  }

  db.put(key, data, function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error

    db.get(key, function (err, value) {
      if (err) return console.log('Ooops!', err) // likely the key was not found

      // debug('entry saved', key, ':', value)
      debug('entry saved', key)
      if (cb) cb()
    })
  })
}

function getB (key, cb) {
  db.get(key, function (err, value) {
    var entry = {}
    if (err) {
      debug(`not found ${key}`)
      entry.status = 0
      entry.payload = 'build not found: ' + key
    } else {
      debug('entry read', key, ':', value)
      entry.status = 1
      entry.payload = value
    }
    if (cb) cb(entry)
    return entry
  })
}

function getAllBuilds (cb) {
  var currKeys = []

  db.createKeyStream()
    .on('data', function (data) {
      currKeys.push(data)
    })
    .on('end', function (data) {
      debug(currKeys)
      if (cb) cb(currKeys)
    })
}

db.put('123', JSON.stringify({data: 'yesss'}))

module.exports = {
  putB,
  getB,
  getAllBuilds}
