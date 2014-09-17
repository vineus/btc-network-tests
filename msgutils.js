var hash = require('hash.js');
var net = require('net');
var crypto = require('crypto');

var MAGIC = 0xd9b4bef9;
var MAGICTEST = 0x0709110B;

function writeUInt64LE(buffer, value, offset) {
  buffer.writeInt32LE(value & -1, offset);
  buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
}

function buildMessage(command, payload) {
  var checksum = new Buffer(hash.sha256().update(hash.sha256().update(payload).digest()).digest());
  var message = new Buffer(24 + payload.length);
  message.fill(0);
  message.writeUInt32LE(MAGICTEST, 0); // magic number
  message.write(command, 4); // command name
  message.writeUInt32LE(payload.length, 16); // payload length
  checksum.copy(message, 20, 0, 4); // payload checksum
  payload.copy(message, 24); // payload
  return message;
}

function buildNetAddr(ipAddress, port) {
  var netAddr = new Buffer(26);
  netAddr.fill(0);
  var pos = 0;
  writeUInt64LE(netAddr, 1, pos); //services
  pos += 8;
  var ipPos = pos + 15;
  ipAddress.reverse().forEach(function(b) {
    netAddr.writeUInt8(b, ipPos); // IP bytes
    ipPos -= 1;
  });
  pos += 16;
  netAddr.writeUInt16BE(port, pos);
  return netAddr;
}

function buildVersion() {
  var userAgentLength = 0;
  var versionMessage = new Buffer(85 + userAgentLength);
  versionMessage.fill(0);
  var pos = 0;
  versionMessage.writeUInt32LE(70001, pos); // version number
  pos += 4;
  writeUInt64LE(versionMessage, 1, pos); // services
  pos += 8;
  var timeStamp = Math.round(new Date().getTime() / 1000);
  writeUInt64LE(versionMessage, timeStamp, pos); // timestamp
  pos += 8;
  var ip = buildNetAddr([127, 0, 0, 1], 18333);
  ip.copy(versionMessage, pos); // addr recv
  pos += 26;
  ip.copy(versionMessage, pos); // addr from
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
}

// test
var payload = buildMessage("version", buildVersion());
//console.log(payload);

var ip = '46.4.120.71';
//var ip = '127.0.0.1';
var port = 18333;

var client = new net.Socket();
client.connect(port, ip, function() { //'connect' listener
  console.log('client connected');

  client.write(payload, function() {
    console.log('payload sent');
  });
});

client.on('data', function(data) {
  console.log('got data');
  console.log(data);
  client.end();
});


client.on('error', function(data) {
  console.log('ERROR');
  console.log(data);
});

client.on('end', function() {
  console.log('client disconnected');
});

client.on('close', function() {
  console.log('Connection closed');
});
