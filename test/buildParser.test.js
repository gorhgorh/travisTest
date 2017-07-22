/* global describe it */
var expect = require('chai').expect
var buildParser = require('../buildParser')
var fs = require('fs')
var testMsg = fs.readFileSync('./testData/failed.json', 'utf-8')

var failedExtract = {
  repo: 'travisTest',
  commiter: 'gorhgorh',
  cId: '9321c3cd6b5df61783d79798b5c1ec833f488063',
  cBranch: 'master',
  cMsg: 'cleanup + init func + test failing to get failing test data... for tests )',
  cStatus: 1,
  cState: 'errored',
  id: 246807723,
  started_at: '2017-06-25T15:33:49Z',
  finished_at: '2017-06-25T15:35:38Z',
  build_url: 'https://travis-ci.org/gorhgorh/travisTest/builds/246807723',
  language: 'node_js',
  status: 1
}

describe('it should return false for incorrect travis json', function () {
  it('test if it is a string', function () {
    var testObj = buildParser({test: false})
    var testArr = buildParser([{test: false}])
    expect(testObj.err).to.equal('not a string')
    expect(testArr.err).to.equal('not a string')
  })

  it('test invalid JSON', function () {
    var testBadJson = buildParser("{test: 'false'}")
    expect(testBadJson.err).to.equal('invalid JSON object')
  })

  it('refuse builds missing travis specific keys', function () {
    var testKey = buildParser('{"test": "yo"}')
    expect(testKey.err).to.equal('not a travis build')
  })
})

describe('it should extract data of the travis build', function () {
  var good = buildParser(testMsg)
  it('should output an object', function () {
    expect(typeof good).to.equal('object')
  })
  it('should contain relevant keys', function () {
    expect(good).to.deep.equal(failedExtract)
  })
})
