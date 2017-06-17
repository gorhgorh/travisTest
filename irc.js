var config = {
  channels: ['#cibot'],
  server: 'irc.freenode.net',
  botName: 'cibot'
}

var irc = require('irc')

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
})

// Listen for any message, PM said user when he posts
bot.addListener('message', function (from, to, text, message) {
  console.log(text)
  var passed = /The build passed/g.test(text)

  if (passed) {
    console.log('build passed yay')
  } else { console.log(message) }
  //    bot.say(config.channels[0], "¿Que? " + from)
})
