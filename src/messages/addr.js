var NetAddr = require('../structures/netaddr.js');

module.exports = Addr;

function Addr(payload) {
  var pos = 0;
  var countAndPos = btcBuffer.readVarInt(payload, pos);
  pos = countAndPos.offset;
  this.count = countAndPos.res;
  var netAddr = new NetAddr();
  this.netAddr = netAddr.unpack(pos, payload);
}
