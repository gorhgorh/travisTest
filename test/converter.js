/* global describe it */
var expect = require('chai').expect
var request = require('request')
var server = require('../app/server')
var converter = require('../app/converter')

describe('Color Code Converter', function () {
  describe('RGB to Hex conversion', function () {
    it('converts the basic colors', function () {
      var redHex = converter.rgbToHex(255, 0, 0)
      var greenHex = converter.rgbToHex(0, 255, 0)
      var blueHex = converter.rgbToHex(0, 0, 255)

      expect(redHex).to.equal('ff0000')
      expect(greenHex).to.equal('00ff00')
      expect(blueHex).to.equal('0000ff')
    })
  })

  describe('Hex to RGB conversion', function () {
    it('converts the basic colors', function () {
      var red = converter.hexToRgb('ff0000')
      var green = converter.hexToRgb('00ff00')
      var blue = converter.hexToRgb('0000ff')

      expect(red).to.deep.equal([255, 0, 0])
      expect(green).to.deep.equal([0, 255, 0])
      expect(blue).to.deep.equal([0, 0, 255])
    })
  })
})

describe('Color Code Converter API', function () {
  describe('RGB to Hex conversion', function () {
    var postObj = {url: 'http://localhost:3000/rgbToHex', form: {red: 255, green: 255, blue: 255}}

    it('returns status 200', function (done) {
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(response.statusCode).to.equal(200)
        done()
      })
    })

    it('returns the color in hex', function (done) {
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(body).to.equal('ffffff')
        done()
      })
    })
  })

  describe('Hex to RGB conversion', function () {
    var postObj = {url: 'http://localhost:3000/hexToRgb', form: {hex: '00ff00'}}
    it('returns status 200', function (done) {
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(response.statusCode).to.equal(200)
        done()
      })
    })

    it('returns the color in RGB', function (done) {
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(body).to.equal('[0,255,0]')
        done()
      })
    })
  })

  describe('fail test', function () {
    it('should fail or not depending on the needs', function () {
      expect(1).to.equal(1)
    })
  })
})
