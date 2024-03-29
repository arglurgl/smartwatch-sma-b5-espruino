/* Copyright (c) 2013 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission. */
/*
Module for interfacing with serial (NMEA) GPS devices

```
Serial4.setup(9600,{tx:C10,rx:C11});
var gps = connect(Serial4, function(data) {
  console.log(data);
});
```
*/
function handleGPSLine(line, callback) {
    var tag = line.substr(3,3);
    //console.log(line);
    if (tag=="GGA") {
      if (!valid(line)) {
        return;
      }
      var d = line.split(",");
      var dlat = d[2].indexOf(".");
      var dlon = d[4].indexOf(".");
      callback({
        time : d[1].substr(0,2)+":"+d[1].substr(2,2)+":"+d[1].substr(4,2),
        lat : (parseInt(d[2].substr(0,dlat-2),10)+parseFloat(d[2].substr(dlat-2))/60)*(d[3]=="S"?-1:1),
        lon : (parseInt(d[4].substr(0,dlon-2),10)+parseFloat(d[4].substr(dlon-2))/60)*(d[5]=="W"?-1:1),
        fix : parseInt(d[6],10),
        satellites : parseInt(d[7],10),
        hdop: parseFloat(d[8]),
        altitude : parseFloat(d[9])
      });
    }
  }
  
  function valid(line) {
    var len = line.length;
    var s = 0;
    for (let i = 1; i < len - 3; i++) {
      s ^= line.charCodeAt(i);
    }
    return parseInt(line.substr(len - 2), 16) === s;
  }
  
  exports.connect = function(serial, callback) {
    var gps = {line:""};
    if (callback) gps.on('line', function(line){handleGPSLine(line, callback)});
    serial.on('data', function(data) {
      gps.line += data;
      var idx = gps.line.indexOf("\n");
      while (idx>=0) {
        gps.emit('line', gps.line.substr(0, idx-1));
        gps.line = gps.line.substr(idx+1);
        idx = gps.line.indexOf("\n");
      }
      if (gps.line.length > 80)
        gps.line = gps.line.substr(-80);
    });
    return gps;
  }