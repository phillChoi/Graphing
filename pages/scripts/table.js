var socket = io.connect('http://localhost:1000');

//var lineArr = [];
//var MAX_LENGTH = 100;
var duration = 10;
//var chart = realTimeLineChart();
function randomNumberBounds(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function seedData(ARRAY, MAX_LENGTH, vitals) {
  var now = new Date();
  for (var i = 0; i < MAX_LENGTH; ++i) {
    var object = {time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration))};
    vitals.forEach(function(variable){
      var pair = {[variable]:0};
      object = {...object,...pair};
    });
    ARRAY.push(object);
  }
}

function updateECG(array, chart, tag, data) {
  var now = new Date();
  var lineData = {
    time: now,
    ECG: (parseInt(data/3)),
    //TEMP: randomNumberBounds(0,50),
  };
  //Necessary to remove old data in the array. Starts removing when over 500 entries in the array.
  array.push(lineData);
  if (array.length > 500) {
    array.shift();
  }
  d3.select(tag).datum(array).call(chart);
}

function updateTemp(array, chart, tag, data) {
  var now = new Date();
   var lineData = {
    time: now,
    TEMP: data,
    };
  array.push(lineData);
  if (array.length > 500) {
    array.shift();
  }
  d3.select(tag).datum(array).call(chart);
}


function updateResp(array, chart, tag, data) {
  var now = new Date();
    var lineData = {
    time: now,
    RESP: (parseInt(data/3))
    };
  array.push(lineData);
  if (array.length > 500) {
    array.shift();
  }
  d3.select(tag).datum(array).call(chart);
}

function resize() {
  if (d3.select("#chart svg").empty()) {
    return;
  }
  chart.width(+d3.select(".chart").style("width").replace(/(px)/g, ""));
  chart2.width(+d3.select(".chart").style("width").replace(/(px)/g, ""));
  d3.select(".chart").call(chart).call(chart2);
}