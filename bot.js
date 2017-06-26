var five = require('johnny-five')
var pngtolcd = require('png-to-lcd')
var Oled = require('oled-js')
var font = require('oled-font-5x7')
var temporal = require('temporal')
var path = require('path')
var debug = require('debug')('travisBot:bot')
// testing features

function createBot () {
  var board = new five.Board()
  board.on('ready', function () {
    console.log('Connected to Arduino, ready.')

    // I2C va USB
    var opts = {
      width: 128,
      height: 64,
      address: 0x3C
    }
    var oled = new Oled(board, five, opts)

    this.showMsg = showMessage.bind(oled)
    init(oled)
  })


  return board
}

module.exports = createBot

if (module.parent === null) {
  debug('module is top level, creating bot')
  createBot()
}

function init (oled) {
  oled.stopScroll()
  oled.update()
  oled.dimDisplay(true)

  temporal.queue([
    {
      delay: 0,
      task: function () {
        oled.clearDisplay()
        // display a bitmap
        pngtolcd(path.join(__dirname, '/images/cnsLogo.png'), false, function (err, bitmapbuf) {
          if (err) throw err
          oled.buffer = bitmapbuf
          oled.update()
        })
      }
    },
    {
      delay: 5000,
      task: function () {
        oled.stopScroll()
        oled.update()
        oled.clearDisplay()

        // display text
        oled.setCursor(0, 30)
        oled.writeString(font, 1, 'bot is ready...', 1, false, 1)
        oled.startScroll('left', 0, 6)
      }
    }
  ])
}

// for this func "this is bound to the oled instance"
function showMessage (msg) {
  this.stopScroll()

  // clear first just in case
  this.update()

  // make it prettier
  this.dimDisplay(true)
  this.stopScroll()
  this.clearDisplay()
  this.setCursor(1, 1)
  this.writeString(font, 2, msg, 1, true, 1)
  this.update()
}
