var btcBuffer = require('bitcoin-buffer');
var InvVector = require('../structures/invvector.js');

module.exports = Inv;

function Inv(payload) {
  var pos = 0;
  var countAndPos = btcBuffer.readVarInt(payload, pos);
  pos = countAndPos.offset;
  this.count = countAndPos.res;
  for (var i = 0; i < this.count; i++) {
    var invVector = new InvVector(pos, payload);
    pos += 36;
    console.log("invVector: " + invVector.type + " " + invVector.hash.toString('hex'));
  }
}
