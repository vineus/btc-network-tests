var btcBuffer = require('bitcoin-buffer');

var NetAddr = require('../structures/netaddr.js');

module.exports = Addr;

function Addr(payload) {
  var pos = 0;
  var countAndPos = btcBuffer.readVarInt(payload, pos);
  pos = countAndPos.offset;
  this.count = countAndPos.res;
  this.netAddr = [];
  for (var i = 0; i < this.count; i++) {
    var netAddr = new NetAddr();
    try {
      netAddr.unpack(pos, payload);
      this.netAddr.push(netAddr);
    } catch (ex) {
      console.log('Error unpacking addr #' + i + ':' + ex);
    }
    pos += 30;
    console.log(i);
  }
}
