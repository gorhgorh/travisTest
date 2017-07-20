var request = require('request')
var fs = require('fs')
var failedData = fs.readFileSync('./testData/failed.json', 'utf-8')
var passeddData = fs.readFileSync('./testData/passed.json', 'utf-8')
var debug = require('debug')('travisbot:testRequest')
var expect = require('chai').expect
var server = require('../hookServer')
server()
describe('it accept builds from the travis hook', function () {
  describe('failed build', function () {
    var res

    it('returns status 200', function (done) {
      var postObj = {
        url: 'http://localhost:3001/build',
        form: {payload: failedData}
      }
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(response.statusCode).to.equal(200)
        res = response
        done()
      })
    })
    it('contain the errored build status in the response', function () {
      expect(/errored/.test(res.body) === true)
    })
    it('contain the errored build id in the response', function () {
      expect(/71652077/.test(res.body) === true)
    })
  })
})
