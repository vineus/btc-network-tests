module.exports = InvVector;

function InvVector(pos, payload) {
  this.type = payload.readUInt32LE(pos);
  pos += 4;
  this.hash = new Buffer(32);
  payload.copy(this.hash, 0, pos, pos + 32);
}

InvVector.prototype.pack = function() {
  var result = new Buffer(36);
  var pos = 0;
  result.writeUInt32LE(this.type, pos);
  pos += 4;
  this.hash.copy(result, pos, 0, 32);
  return result;
};
