var request = require('request')
var fs = require('fs')
var failedData = fs.readFileSync('./testData/failed.json', 'utf-8')
// var passeddData = fs.readFileSync('./testData/passed.json', 'utf-8')
var expect = require('chai').expect
var server = require('../hookServer')
server()
describe('it accept builds from the travis hook', function () {
  describe('failed build', function () {
    var res
    var body
    it('returns status 200', function (done) {
      var postObj = {
        url: 'http://localhost:3001/build',
        form: {payload: failedData}
      }
      request.post(postObj, function (error, response, body) {
        if (error) throw error
        expect(response.statusCode).to.equal(200)
        res = response
        body = response.body
        // debug('body', body)
        done()
      })
    })
    it('should be a json string', function () {
      expect(/application\/json/.test(res.headers['content-type'])).to.equal(true)
    })
    it('contain the errored build status in the response', function () {
      body = JSON.parse(res.body)
      expect(body.status).to.equal('errored')
    })
    it('contain the errored build id in the response', function () {
      expect(/246807723/.test(res.body)).to.equal(true)
    })
  })
})
