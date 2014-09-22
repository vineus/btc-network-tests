var hash = require('hash.js');
var net = require('net');
var btcBuffer = require('bitcoin-buffer');
var btcConstants = require('bitcoin-constants');
var Message = require('./src/structures/message.js');
var Inv = require('./src/messages/inv.js');
var Addr = require('./src/messages/addr.js');
var NetAddr = require('./src/structures/netaddr.js');
var Version = require('./src/messages/version.js');

// test
var version = new Version(70001);
var msgVersion = new Message(version.pack(), "version");

var ip = '46.4.120.71';
//var ip = '127.0.0.1';
var port = 18333;

var client = new net.Socket();
client.connect(port, ip, function() { //'connect' listener
  console.log('client connected');

  client.write(msgVersion.pack(), function() {
    console.log('Version sent');
  });
});

client.on('data', function(data) {
  if (data.length < 16)
    throw new Error('invalid data: ' + data);
  var message = new Message();
  message.unpack(data);
  switch (message.command) {
    case "version":
      console.log("got version");
      break;
    case "verack":
      console.log("got verack");
      break;
    case "inv":
      console.log("got inventory command");
      var inv = new Inv(message.payload);
      var invVector = inv.invVectors[0];
      switch (invVector.type) {
        case 0:
          console.log('inv vector error');
          break;
        case 1:
          console.log('transaction');
          var getDataPayload = new Buffer(1 + 36);
          getDataPayload.writeInt8(1, 0);
          invVector.pack().copy(getDataPayload, 1, 0, 36);
          var msgGetData = new Message(getDataPayload, "getdata");
          client.write(msgGetData.pack());
          break;
        case 2:
          console.log('data block');
          break;
      }
      break;
    case "addr":
      console.log("got addresses command");
      var addr = new Addr(message.payload);
      console.log(addr.netAddr.ip.toString('hex'));
      break;
    case "tx":
      console.log("got tx");
      break;
    default:
      console.log("Unkown command: '" + command + "'");
  }
  //  client.end();
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
