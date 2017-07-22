var hapi = require('hapi')
var debug = require('debug')('travisbot:appServer')
var converter = require('./converter')

var server = new hapi.Server()

server.connection({ port: 3000 })

server.route({
  method: 'POST',
  path: '/rgbToHex',
  handler: function (req, reply) {
    var red = parseInt(req.payload.red, 10)
    var green = parseInt(req.payload.green, 10)
    var blue = parseInt(req.payload.blue, 10)

    var hex = converter.rgbToHex(red, green, blue)
    var response = reply(hex)

    response.header('Content-Type', 'text/plain')
  }
})

server.route({
  method: 'POST',
  path: '/hexToRgb',
  handler: function (req, reply) {
    var hex = req.payload.hex
    var rgb = converter.hexToRgb(hex)
    var response = reply(rgb)

    response.header('Content-Type', 'text/plain')
  }
})

function startServer () {
  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server started on port 3000')
  })
}

module.exports = startServer

if (module.parent === null) {
  debug('module is top level, starting server')
  startServer()
}
