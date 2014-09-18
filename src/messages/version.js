var crypto = require('crypto');

var btcBuffer = require('bitcoin-buffer');
var NetAddr = require('../structures/netaddr.js');

module.exports = Version;

function Version(version) {
  this.version = version;
}

Version.prototype.pack = function() {
  var userAgentLength = 0;
  var versionMessage = new Buffer(85 + userAgentLength);
  versionMessage.fill(0);
  var pos = 0;
  versionMessage.writeUInt32LE(this.version, pos); // version number
  pos += 4;
  btcBuffer.writeUInt64LE(versionMessage, 1, pos); // services
  pos += 8;
  var timeStamp = Math.round(new Date().getTime() / 1000);
  btcBuffer.writeUInt64LE(versionMessage, timeStamp, pos); // timestamp
  pos += 8;
  var ip = new NetAddr([127, 0, 0, 1], 18333);
  var packedIp = ip.pack();
  packedIp.copy(versionMessage, pos); // addr recv
  pos += 26;
  packedIp.copy(versionMessage, pos); // addr from
  pos += 26;
  crypto.randomBytes(8).copy(versionMessage, pos, 0, 8); // nounce
  pos += 8;
  versionMessage[pos] = 0; // UA string (skipped)
  pos += 1;

  //  versionMessage[pos] = userAgentLength // UA length
  //  pos += 1;
  //  versionMessage.write("grouik", pos); // UA value
  //  pos += userAgentLength;

  versionMessage.writeUInt32LE(0, pos); // height (last known block)

  return versionMessage;
};
