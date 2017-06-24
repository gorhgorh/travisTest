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

    test(oled)
  })
  function test (oled) {
    // if it was already scrolling, stop
    oled.stopScroll()

    // clear first just in case
    oled.update()

    // make it prettier
    oled.dimDisplay(true)
    function showMessage (msg) {
      oled.stopScroll()
      oled.clearDisplay()
      oled.setCursor(1, 1)
      oled.writeString(font, 2, msg, 1, true, 1)
      oled.update()
    }
    showMessage('yarrr')

    // temporal.queue([
    //   {
    //     delay: 0,
    //     task: function () {
    //       oled.clearDisplay()
    //       // display a bitmap
    //       pngtolcd(path.join(__dirname, '/images/cnsLogo.png'), false, function (err, bitmapbuf) {
    //         if (err) throw err
    //         oled.buffer = bitmapbuf
    //         oled.update()
    //       })
    //     }
    //   },
    //   {
    //     delay: 10000,
    //     task: function () {
    //       oled.startScroll('left', 0, 15)
    //     }
    //   },
    //   {
    //     delay: 1000,
    //     task: function () {
    //       oled.stopScroll()
    //       oled.update()
    //       oled.clearDisplay()

    //       // display text
    //       oled.setCursor(0, 7)
    //       oled.writeString(font, 2, 'SCROLL!', 1, true, 1)
    //       oled.startScroll('left', 0, 6)
    //     }
    //   }
    // ])
  }
  return board
}

module.exports = createBot

if (module.parent === null) {
  debug('module is top level, creating bot')
  createBot()
}
