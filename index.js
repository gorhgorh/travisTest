'use strict'

var hapi = require('hapi')
var debug = require('debug')('tb:main')
var server = new hapi.Server()

// Tell our app to listen on port 3000
server.connection({ port: 3000 })

// Create the POST route to /sms
server.route({
  method: 'POST',
  path: '/build',
  handler: function (request, reply) {
    var body = JSON.parse(request.payload.payload)

    debug(request.headers)
    var response = reply(`build: ${body.commit_id} status is: ${body.state}`)

    response.header('Content-Type', 'text/plain')
  }
})

server.start(function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3000')
})
