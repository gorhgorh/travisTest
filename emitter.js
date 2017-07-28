var util = require('util')
var eventEmitter = require('events').EventEmitter
var debug = require('debug')('travisBot:emitter')
function Event () {
  eventEmitter.call(this)
}

util.inherits(Event, eventEmitter)

Event.prototype.sendEvent = function (type, data) {
  debug(type, data)
  this.emit(type, data)
}
var eventBus = new Event()
module.exports = {
  emitter: Event,
  eventBus: eventBus
}
