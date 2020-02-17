var socket = io.connect('http://localhost:5000');
var value = 0;


var lineArr2 = [];
var MAX_LENGTH = 100;
var duration = 10;
var chart2 = realTimeLineChart();

function seedData() {
  var now = new Date();
  for (var i = 0; i < MAX_LENGTH; ++i) {
    lineArr2.push({
      time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
      x: 0,
      y: 0
      //z: 0
    });
  }
}

function updateData() {
  var now = new Date();
  socket.on('data',function(data){
    value = data;
  });
  var lineData = {
    time: now,
    y: randomNumberBounds(0,10),
    x: value
  };
  lineArr2.push(lineData);
  if (lineArr2.length > 500) {
    lineArr2.shift();
  }
  d3.select("#chart2").datum(lineArr2).call(chart2);
}

function resize() {
  if (d3.select("#chart svg").empty()) {
    return;
  }
  chart2.width(+d3.select("#chart2").style("width").replace(/(px)/g, ""));
  d3.select("#chart2").call(chart2);
}
document.addEventListener("DOMContentLoaded", function() {
  seedData();
  window.setInterval(updateData, 100);
  d3.select("#chart2").datum(lineArr2).call(chart2);
  d3.select(window).on('resize', resize);
});


