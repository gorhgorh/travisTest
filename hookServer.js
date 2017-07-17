var hapi = require('hapi')
var path = require('path')
var debug = require('debug')('travisBot:hookServer')

var port = 3001

const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'testData')
      }
    }
  }
})
// var db = require('./db')
var createBot = require('./bot.js')
var trBot = createBot()
var fs = require('fs-extra')
var bParse = require('./buildParser')
var inert = require('inert')
server.register(inert, () => {})
// Tell our app to listen on port 3000
server.connection({ port: port })

// Create the POST route to /sms
server.route({
  method: 'POST',
  path: '/build',
  handler: function (request, reply) {
    if (trBot.isReady === true) {
      trBot.showB(bParse(request.payload.payload))
    } else {
      console.log('bot is not ready yet')
    }

    fs.writeFile('./testData/lastBuild.json', request.payload.payload, function (err) {
      if (err) throw err
      debug('written currBuild')
    })

    var body = JSON.parse(request.payload.payload)
    debug(body)
    var response = reply(`build: ${body.commit_id} status is: ${body.state}`)
    response.header('Content-Type', 'text/plain')
  }
})

server.route({
  method: 'GET',
  path: '/testdata/{param*}',
  handler: {
    directory: {
      path: './',
      redirectToSlash: true,
      index: true
    }
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
