var btcBuffer = require('bitcoin-buffer');

module.exports = NetAddr;

function NetAddr(ipAddress, port) {
  this.ip = ipAddress;
  this.port = port;
}

NetAddr.prototype.unpack = function(pos, binary) {
  this.timeStamp = binary.readUInt32LE(pos);
  pos += 4;
  var services = btcBuffer.readUInt64LE(binary, pos);
  pos += 8;
  this.ip = new Buffer(16);
  binary.copy(this.ip, 0, pos, pos + 16);
  pos += 16;
  this.port = binary.readInt16BE(pos);
};

NetAddr.prototype.pack = function() {
  var netAddr = new Buffer(26);
  netAddr.fill(0);
  var pos = 0;
  btcBuffer.writeUInt64LE(netAddr, 1, pos); //services
  pos += 8;
  var ipPos = pos + 15;
  this.ip.reverse().forEach(function(b) {
    netAddr.writeUInt8(b, ipPos); // IP bytes
    ipPos -= 1;
  });
  pos += 16;
  netAddr.writeUInt16BE(this.port, pos);
  return netAddr;
};

NetAddr.prototype.toString = function() {
  return this.ip.toString('hex') + ":" + this.port;
};
