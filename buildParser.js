var debug = require('debug')('travisBot:bParser')

// var fs = require('fs')
// var testMsg = fs.readFileSync('./testData/failed.json', 'utf-8')

function buildParser (msg) {
  if (typeof (msg) !== 'string') {
    debug('msg should be a string', typeof (msg))
    return {err: 'not a string'} // msg should be a json sting
  }
  // check if it is a valid json file, and parse it
  try {
    msg = JSON.parse(msg)
  } catch (error) {
    debug('invalid JSON object')
    return {err: 'invalid JSON object'}
  }
  // check if the message is a valid travis build json
  // debug(msg)
  if (!('id' in msg) && !('repository' in msg)) {
    debug('not a travis build')
    return {err: 'not a travis build'}
  }
  var buildInfo = {
    repo: msg.repository.name,
    commiter: msg.committer_name,
    cId: msg.commit,
    cBranch: msg.branch,
    cMsg: msg.message,
    cStatus: msg.status,
    cState: msg.state,
    id: msg.id,
    started_at: msg.started_at,
    finished_at: msg.finished_at,
    build_url: msg.build_url,
    language: msg.config.language,
    status: msg.config.status
  }

  return buildInfo
}

module.exports = buildParser

// buildParser('{"test": "yo"}')
