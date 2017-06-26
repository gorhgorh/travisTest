'use strict'

var hapi = require('hapi')
var debug = require('debug')('travisBot:hookServer')
var server = new hapi.Server()
// var db = require('./db')
var createBot = require('./bot.js')
var trBot = createBot()
var fs = require('fs-extra')
var bParse = require('./buildParser')
// Tell our app to listen on port 3000
server.connection({ port: 3000 })

// Create the POST route to /sms
server.route({
  method: 'POST',
  path: '/build',
  handler: function (request, reply) {
    var body = JSON.parse(request.payload.payload)
    fs.writeFile('./testData/lastBuild.json', request.payload.payload, function (err) {
      if (err) throw err
      debug('written currBuild')
    })
    debug(body)
    var response = reply(`build: ${body.commit_id} status is: ${body.state}`)
    if (trBot.isReady === true) {
      console.log('yoo')
      trBot.showMsg('build route triggered')
    } else {
      console.log('bot is not ready yet')
    }
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

// console.log(module)
module.exports = startServer

if (module.parent === null) {
  debug('module is top level, starting server')
  startServer()
}
