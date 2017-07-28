var hapi = require('hapi')
var path = require('path')
var debug = require('debug')('travisBot:hookServer')
var fs = require('fs-extra')
var bParse = require('./buildParser')
var inert = require('inert')
var port = 3001
var socketPort = 4001

var emitter = require('./emitter')

const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'testData')
      },
      cors: {
        origin: ['*']
      }
    }
  }
})

var botStatus = {
  isConnected: false,
  fromServer: true
}

var db = require('./db')
var getB = db.getB
var putB = db.putB
var getAllB = db.getAllBuilds

var createBot = require('./bot.js')
var trBot = createBot()

server.register(inert, () => {
})

server.connection({ port: port, labels: ['api'] })
server.connection({ port: socketPort, labels: ['chat'] })

var io = require('socket.io')(server.select('chat').listener)

io.on('connection', function (socket) {
  console.log('something connected', socket.id)
  socket.emit('bot:status', botStatus)
  emitter.eventBus.on('bot', function (data) {
    botStatus.isConnected = data.isConnected
    socket.emit('bot:status', botStatus)
  })
})

// Create the POST route for the travis hook
server.route({
  method: 'POST',
  path: '/build',
  handler: function (request, reply) {
    debug(request.headers['content-type'])
    var replyObj = {}
    if (request.headers['content-type'] !== 'application/x-www-form-urlencoded') {
      replyObj.err = 'not a form'
      return reply(replyObj)
    }
    // debug(request.payload.payload)
    var parsedBuild = bParse(request.payload.payload)
    if (trBot.isReady === true) {
      trBot.showB(parsedBuild)
    } else {
      debug('bot is not ready yet')
    }

    fs.writeFile('./testData/lastBuild.json', parsedBuild, function (err) {
      if (err) throw err
      debug('written currBuild')
    })

    putB(parsedBuild, function () {
      replyObj.build = parsedBuild.id
      replyObj.status = parsedBuild.cState
      // debug(parsedBuild)
      reply(replyObj)
    })
  }
})

// test test build json files
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

// route to get a build
server.route({
  method: 'GET',
  path: '/getbuild/{param*}',
  handler: function (request, reply) {
    var p = request.params.param.replace(/(^\d+)(.+$)/i, '$1')
    debug('build route called', p)
    getB(p, function (build) {
      var response
      var message
      if (build.status === 0) {
        message = `{err: '${build}}`
        debug(`build not found, ${p}`)
        response = reply('{err: "no build found"}')
        response.header('Content-Type', 'application/json')
      } else {
        debug('build', build)
        response = reply(build.payload)
        response.header('Content-Type', 'application/json')
      }
    })
  }
})

// route to get the builds keys in an array
server.route({
  method: 'GET',
  path: '/getbuilds/',
  handler: function (request, reply) {
    debug('builds route called')
    getAllB(function (builds) {
      var response = reply(JSON.stringify(builds))
      response.header('Content-Type', 'application/json')
    })
  }
})

function startServer () {
  server.start(function (err) {
    if (err) {
      throw err
    }

    console.log(`Server started on port: http://localhost:${port}`)
  })
}

// console.log(module)
module.exports = startServer

if (module.parent === null) {
  debug('module is top level, starting server')
  startServer()
}
