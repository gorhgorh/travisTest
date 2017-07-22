var levelup = require('levelup')

var db = levelup('./buildDb')

var debug = require('debug')('travisBot:db')

function putB (data, cb) {
  // var key
  // if (data.id) key = data.id
  // else key = Date.now()
  var key = Date.now()
  if (typeof data !== 'string') {
    key = data.id
    data = JSON.stringify(data)
  }

  db.put(key, data, function (err) {
    if (err) return console.log('io err!', err)
    else if (cb) cb()
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

  db.createReadStream()
    .on('data', function (data) {
      var parsedData = JSON.parse(data.value)
      currKeys.push({
        key: data.key,
        repo: parsedData.repo,
        start: parsedData.started_at,
        lang: parsedData.language
      })
    })
    .on('end', function (data) {
      debug(currKeys)
      if (cb) cb(currKeys)
    })
}

module.exports = {
  putB,
  getB,
  getAllBuilds
}
