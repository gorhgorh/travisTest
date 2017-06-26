var debug = require('debug')('travisBot:bParser')

// var fs = require('fs')
// var testMsg = fs.readFileSync('./testData/failed.json', 'utf-8')

function buildParser (msg) {
  if (typeof (msg) !== 'string') {
    debug('msg should be a string', typeof (msg))
    return false // msg should be a json sting
  }
  // check if it is a valid json file, and parse it
  try {
    msg = JSON.parse(msg)
  } catch (error) {
    debug('invalid JSON object')
    return false
  }
  // check if the message is a valid travis build json
  if ((!msg.id && !msg.repository.id) || Array.isArray === true) {
    debug('not a travis build')
    return false
  }
  var buildInfo = {
    repo: msg.repository.name,
    commiter: msg.committer_name,
    cId: msg.commit,
    cBranch: msg.branch,
    cMsg: msg.message,
    cStatus: msg.status
  }

  return buildInfo
}

module.exports = buildParser

// buildParser(testMsg)
