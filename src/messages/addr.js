var btcBuffer = require('bitcoin-buffer');

var NetAddr = require('../structures/netaddr.js');

module.exports = Addr;

function Addr(payload) {
  var pos = 0;
  var countAndPos = btcBuffer.readVarInt(payload, pos);
  pos = countAndPos.offset;
  this.count = countAndPos.res;
  var netAddr = new NetAddr();
  netAddr.unpack(pos, payload);
  this.netAddr = netAddr;
}
