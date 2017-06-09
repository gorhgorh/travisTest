var config = {
	channels: ["#cibot"],
	server: "irc.freenode.net",
	botName: "cibot"
}

var irc = require("irc");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen for any message, PM said user when he posts
bot.addListener("message", function(from, to, text, message) {

    var passed = message.test(/The build passed/g)
	console.log(passed)
    if (passed.lenght) {
        console.log("build passed yay")
    }
//    bot.say(config.channels[0], "¿Que? " + from);

});
