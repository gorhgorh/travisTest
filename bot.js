var five = require('johnny-five')
var pngtolcd = require('png-to-lcd')
var Oled = require('oled-js')
var font = require('oled-font-5x7')
var temporal = require('temporal')
var path = require('path')
var debug = require('debug')('travisBot:bot')

// testing data
var failedExtract = {
  repo: 'travisTest',
  commiter: 'gorhgorh',
  cId: '9321c3cd6b5df61783d79798b5c1ec833f488063',
  cBranch: 'master',
  cMsg: 'cleanup + init func + test failing to get failing test data... for tests )',
  cStatus: 1
}

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
    this.showB = showBuild.bind(oled)
    // this.getPos = getPos.bind(oled)
    // this.showB(failedExtract)
    init(oled)
  })

  return board
}

function getPos () {
  return {x: this.cursor_x, y: this.cursor_y}
}

function init (oled) {
  oled.stopScroll()
  oled.update()
  oled.dimDisplay(true)
  oled.clearDisplay()

  temporal.queue([
    {
      delay: 0,
      task: function () {
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
        oled.writeString(font, 1, 'bot is ready...', 1, true, 1)
        console.log('x,y:', oled.cursor_x, '-', oled.cursor_y)
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

function showBuild (bObj) {
  var oled = this
  this.stopScroll()

  // clear first just in case
  oled.update()

  // make it prettier
  oled.dimDisplay(true)
  oled.stopScroll()
  oled.clearDisplay()
  temporal.loop(10000, function () {
    console.log(this.called)
    temporal.queue([
      {
        delay: 0,
        task: function () {
          oled.setCursor(0, 0)
          if (bObj.cStatus === 1) {
            oled.writeString(font, 2, 'BUILD FAILED', 1, true, 1)
          } else {
            oled.writeString(font, 2, 'BUILD PASSED', 1, true, 1)
          }
          oled.startScroll('left', 0, 6)
        }
      },
      {
        delay: 1000,
        task: function () {
          oled.stopScroll()
          oled.update()
          oled.clearDisplay()

          // display text
          oled.setCursor(0, 7)
          oled.writeString(font, 1, 'repo: ' + bObj.repo, 1, true, 1)
          oled.setCursor(1, oled.cursor_y + 10)
          oled.writeString(font, 1, 'commiter: ' + bObj.commiter, 1, true, 1)
          oled.setCursor(1, oled.cursor_y + 10)
          oled.writeString(font, 1, 'branch: ' + bObj.cBranch, 1, true, 1)
          // oled.startScroll('left', 0, 6)
        }
      }
    ])
  })
}

module.exports = createBot

if (module.parent === null) {
  debug('module is top level, creating bot')
  createBot()
}
