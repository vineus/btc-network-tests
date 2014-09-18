var hash = require('hash.js');
var btcConstants = require('bitcoin-constants');
var btcBuffer = require('bitcoin-buffer');

module.exports = Message;

function Message(payload, command) {
  this.command = command;
  this.payload = payload;
  if (Buffer.isBuffer(payload)) {
    this.checksum = new Buffer(hash.sha256().update(hash.sha256().update(payload).digest()).digest());
    this.length = this.payload.length;
  }
}

Message.prototype.unpack = function(binary) {
  var pos = 0;
  this.magic = binary.readUInt32LE(pos);
  pos += 4;
  var endCommand = pos + 12;
  for (var i = pos; i < pos + 12; ++i)
    if (binary[i] === 0) {
      endCommand = i;
      break;
    }
  this.command = binary.toString('utf8', pos, endCommand);
  pos += 12;
  this.length = binary.readUInt32LE(pos);
  pos += 4;
  this.checksum = binary.readUInt32LE(pos);
  pos += 4;
  this.payload = new Buffer(this.length);
  binary.copy(this.payload, 0, pos, pos + this.length);
};

Message.prototype.pack = function() {
  var message = new Buffer(24 + this.length);
  message.fill(0);
  message.writeUInt32LE(btcConstants.test.magic, 0); // magic number
  message.write(this.command, 4); // command name
  message.writeUInt32LE(this.length, 16); // payload length
  this.checksum.copy(message, 20, 0, 4); // payload checksum
  this.payload.copy(message, 24); // payload
  return message;
};
