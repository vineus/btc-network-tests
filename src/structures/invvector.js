module.exports = InvVector;

function InvVector(pos, payload) {
  this.type = payload.readUInt32LE(pos);
  pos += 4;
  this.hash = new Buffer(32);
  payload.copy(this.hash, 0, pos, pos + 32);
}
