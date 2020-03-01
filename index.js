var dgram = require('dgram');
var buffer = require('buffer');
var express = require('express');
var socket = require('socket.io');


//-------------------Express HTML Page redirect-----------------
var app = express();
app.use(express.static('pages'));
var page = app.listen(1000, function () {
  console.log('Hello on, index page is at port 1000.')
});

//----------------------------Socket Setup-------------------------
var io = socket(page);
io.on('connection', function (socket) {
  console.log('Connection made with', socket.id);
});
//-----------------------------------Server setup-----------------------------------------

var server = dgram.createSocket('udp4');
var data = 'E';
//var ipAdd = "10.83.22.123";
var port = 1000;
var ipAdd = 'localhost';
var handshake = 'S';

// Error handler
server.on('error', function (error) {
  console.log("Error has occurred: " + error);
  server.close();
})

//Server listener
server.on('listening', function () {
  const address = server.address();
  console.log("Server is listening on: " + address.address + ":" + address.port);
});

//When server receives a message.
server.on('message', function (message, rinfo) {
  console.log("Server: received " + message.toString() + " from " + rinfo.address + ":" + rinfo.port);
  var counter = 0;
  
  var i = setInterval(function(){
    var signal = "#E"+counter.toString()+"#T"+counter.toString()+"#B"+counter.toString();
    server.send(signal, rinfo.port, rinfo.address, function (error) {
      if (error) {
        console.log("error: " + error);
      } else {
        console.log("Server: Data sent to " + rinfo.address + ":" + rinfo.port);
      }
    });

  counter++;
  if(counter === 100000) {
    clearInterval(i);
  }
  }, 80);
});

server.bind(port);

//------------------------------------------Client Set up----------------------------
var client = dgram.createSocket('udp4');
var regex = new RegExp(/^ET/);
var ecgRegex = new RegExp(/(?<=#E)-?\d+(\.\d+)?/);
var tempRegex = new RegExp(/(?<=#T)-?\d+(\.\d+)?/);
var rrRegex = new RegExp(/(?<=#B)-?\d+(\.\d+)?/);
var hrRegex = new RegExp(/(?<=#R)-?\d+(\.\d+)?/);

//Function for when a message is received.
client.on('message', function (msg, info) {
  console.log('Client: Data received from server : ' + msg);
  var string = msg.toString();
  var result;
  //io.emit('result',msg.toString());
  //console.log('regex is working');
  if (ecgRegex.test(string)){
    result = string.match(ecgRegex);
    io.emit('ECG',parseInt(result[0]));
    console.log('Trying to extract ECG: '+result[0]);
  };
  if (tempRegex.test(string)){
    result = string.match(tempRegex);
    io.emit('temp',result[0]);
    console.log('Trying to extract temp: '+result[0]);
  };
  if (rrRegex.test(string)){
    result = string.match(rrRegex);
    io.emit('resp',result[0]);
    console.log('Trying to extract respirations: '+result[0]);
  };  
 
  //for (var count = 0; count < 10; count++) {
  //io.emit('data', data.readInt32BE(0));
  //};
  //for (var count = 0; count < 10; count++) {
  //io.emit('data', data);
  //};

});

//Sending first message.
io.on('connection', function () {
  client.send(handshake, port, ipAdd, function (error) {
    if (error) {
      client.close();
    } else {
      console.log('Client: Sending message: "' +  handshake.toString() + '" to: ' + ipAdd + ":" + port);
    }
  });
})


//conversion function

function byteArraytoInt( /*byte[]*/ byteArray) {
  var value = 0;
  for (var i = 0; i < byteArray.length; i++) {
    value = (value * 32) + byteArray[i];
  }
  return value;
};