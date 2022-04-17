E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(20, false);
E.kickWatchdog();



var VIB=D30;
function vibon(vib){
 if(vib.i>=1)VIB.set();else analogWrite(VIB,vib.i);
 setTimeout(viboff,vib.on,vib);
}
function viboff(vib){
 VIB.reset();
 if (vib.c>1){vib.c--;setTimeout(vibon,vib.off,vib);}
}

vibrate=function(intensity,count,onms,offms){
 vibon({i:intensity,c:count,on:onms,off:offms});
};

function battVolts(){
return 4.20/0.320*analogRead(D4);
}
function battLevel(v){
  var l=3.5,h=4.19;
  v=v?v:battVolts();
  if(v>=h)return 100;
  if(v<=l)return 0;
  return 100*(v-l)/(h-l);
}
function battInfo(v){v=v?v:battVolts();return `${battLevel(v)|0}% ${v.toFixed(2)}V`;}

/*var GPS ={
GPTXT : function(a){
  if (a[2]!='01') print(a.join(' '));
},
GNRMC : function(a){
  print("RMC ",a[0],a[8]);
}
};
// handle one line from GPS
function gpsline(line){
  var garr=line.split(',');
  var f=GPS[garr[0]];
  if(f) f(garr.slice(1));
  else print(line);
}

function gpsum(s){
  var xor=0;
  [].forEach.call(s,(c)=>{xor^=c.charCodeAt(0);});
  return xor.toString(16).toUpperCase();
}

function gpsformat(line){
return '$'+line+'*'+gpsum(line)+'\x0d\x0a';
}*/
// PCAS00 save config to flash
// PCAS01,1 - speed 0=4800,1=9600,2=19200,3=38400,4=57600,5=115200
// PCAS02,1000 - 1Hz, 500 250 200 100
// PCAS03,0,0,0,0,0,0,0 - frequency of GGA,GLL,GSA,GSV,RMC,VTG,ZDA in periods set by PSCAS02 (0-9)
// Serial1.write(gpsformat("PCAS03,0,0,0,0,0,0,0")) - off
// gpsformat("PCAS04,5") systems 1 gps, 2 bds, 4 glonas, combinations 5 6 7


/*var gpsbuff="";
function gpsdata(data){
  gpsbuff+=data;
  var idx = gpsbuff.indexOf("\n");
  while (idx>=0) {
    var line = gpsbuff.substr(0,idx);
    gpsbuff = gpsbuff.substr(idx+1);
    if(line.startsWith("$")) gpsline(line.substr(1,line.lastIndexOf('*')-1));
    idx = gpsbuff.indexOf("\n");
  }
}

function gpson(){
  gpsbuff="";
  Serial1.setup(9600,{tx:D27,rx:D28});
  Serial1.on('data',gpsdata);
  D7.write(1);
}

function gpsoff(){
  D7.write(0);
  Serial1.removeListener('data',gpsdata);
  Serial1.unsetup();
}
// some stuff in https://github.com/infusion/GPS.js/blob/master/gps.js
*/

//new gps test
D7.write(0);
Serial1.setup(9600,{tx:D27,rx:D28});
var gps = require("GPS").connect(Serial1, function(data) {
  console.log(data);
});

function gpson(){
  D7.write(1);
}

function gpsoff(){
  D7.write(0);
}

bpp=4;
g=require("B5LCD.js").connect(bpp);

function randomLines(){
  g.clear();
  var cols=(bpp==1)?14:(1<<bpp)-1,w=g.getWidth(),h=g.getHeight(),r=Math.random;
  return setInterval(function(){
    g.setColor(1+r()*cols);
    g.drawLine(r()*w,r()*h,r()*w,r()*h);
      g.flip();
  },5);
}


function randomShapes(){
  g.clear();
  var cols=(bpp==1)?14:(1<<bpp)-1,w=g.getWidth()-10,h=g.getHeight()-10,r=Math.random;
  return setInterval(function(){
    g.setBgColor(0);
    g.setColor(1+r()*cols);
    x1=r()*w;x2=10+r()*w;
    y1=r()*h;y2=10+r()*h;
    if (bpp==1 && ((x1&31)==1)) g.clear(); // for bpp==1 clear sometimes so we can see ellipses again
    if (x1&1)
      g.fillEllipse(Math.min(x1,x2), Math.min(y1,y2),Math.max(x1,x2), Math.max(y1,y2));
    else
      g.fillRect(Math.min(x1,x2), Math.min(y1,y2),Math.max(x1,x2), Math.max(y1,y2));
    g.flip();
  },5);
}

// cube from https://www.espruino.com/Pixl.js+Cube+Badge
var rx = 0, ry = 0, cc = 1;
// Draw the cube at rotation rx and ry
function drawCube(xx,yy,zz) {
  // precalculate sin&cos for rotations
  var rcx=Math.cos(rx), rsx=Math.sin(rx);
  var rcy=Math.cos(ry), rsy=Math.sin(ry);
  // Project 3D into 2D
  function p(x,y,z) {
    var t;
    t = x*rcy + z*rsy;
    z = z*rcy - x*rsy;
    x=t;
    t = y*rcx + z*rsx;
    z = z*rcx - y*rsx;
    y=t;
    z += 4;
    return [xx + zz*x/z, yy + yy*y/z];
  }
  var a,b;
  // -z
  a = p(-1,-1,-1); b = p(1,-1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  b = p(-1,1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,-1,-1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  // z
  a = p(-1,-1,1); b = p(1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  b = p(-1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  // edges
  a = p(-1,-1,-1); b = p(-1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,-1,-1); b = p(1,-1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(1,1,-1); b = p(1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
  a = p(-1,1,-1); b = p(-1,1,1);
  g.drawLine(a[0],a[1],b[0],b[1]);
}

function stepCube() {
  rx += 0.05;
  ry += 0.05;
  g.setColor(0);g.fillRect(0,40,80,120);g.setColor(1+8+(cc/20%7));cc=(cc+1);
  drawCube(40,80,80);
  g.flip();
}
//require("Font6x8").add(Graphics);
//require("Font6x12").add(Graphics);
//require("Font8x12").add(Graphics);
//require("Font8x16").add(Graphics);

function info(){
  g.clear();
  g.setFont("4x6",1/*2*/);g.setColor(10);
  g.drawString("Espruino "+process.version,5,10);
  if (bpp==1) g.flip();
  g.setFont("4x6",1);g.setColor(14);
  g.drawString("ST7735 12 bit mode\n8Mbps SPI with DMA\nmoped",4,22);
  if (bpp==1) g.flip();
  for (var c=0;c<8;c++){
    g.setColor(c+8);g.fillRect(8+8*c,130,16+8*c,138);
    if (bpp==1) g.flip();
  }
  for ( c=0;c<8;c++) {g.setColor(c);g.fillRect(8+8*c,142,16+8*c,150);
    if (bpp==1) g.flip();
  }
  g.flip();
  return setInterval(function(){
    stepCube();
  },5);
}

function ble_scan(){
  if (!g.isOn) g.on();
  g.setFont("4x6",1/*2*/);g.setColor(10);
  g.clear();
  g.drawString("BLE Scanner",0,0,true);
  g.flip();
  return setInterval(function(){
    //g.fillRect(0,0,70,6);
    g.drawString("Scan...     ",0,0,true);
    g.flip();
    NRF.findDevices(function(d) {
      var devices;
      devices = d;

      g.clear();
      g.drawString("Idle       ",0,0,true);

      devices.sort(function(a, b){return b.rssi - a.rssi;});
      devices.forEach(function(item,idx){
          idString="N/A";
          if (item.name) idString= item.name;
          else if (item.id) idString=item.id;
          g.drawString(idString,0,8+idx*8);
          if (item.rssi) g.drawString(item.rssi,68,8+idx*8,true);
      });
      g.flip();
    }, 1500);
  },2000);
}

var lastsec=-1;
var volts;
var batt=battInfo();
function drawClock(){
  var d=Date();
  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  if (d.getSeconds()==lastsec) return;
  lastsec=d.getSeconds();
  g.clear();
  if (lastsec%10==0){
    batt=battInfo(volts);volts=0;
  }
  g.setFont("6x8",1);g.setColor(15);
  g.drawString(batt,40-g.stringWidth(batt)/2,0);
  g.setFontVector(50);
  g.setColor(8+2);
  d=d.toString().split(' ');
  var sec=d[4].substr(-2);
  //var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  g.drawString(hr,40-g.stringWidth(hr)/2,15);
  g.drawString(min,40-g.stringWidth(min)/2,80);
  //g.setColor(8+4);
  g.setFontVector(28);
  //if (sec&1)g.drawString("o o",40-g.stringWidth("o o")/2,60);
  //if (sec&1)g.drawString(":",40-g.stringWidth(":")/2,42);
  if (sec&1)g.drawString(". .",40-g.stringWidth(". .")/2,50);

/*
  if (sec&1)g.drawString(":",36-g.stringWidth(":")/2,3);
  var sx=sec*72/60;
  g.drawLine(sx,0,71,0);
  g.drawLine(sx,1,71,1);
  //g.setFont8x16();
*/
  g.setFontVector(18); 
  g.setColor(8+3);
  var dt=/*d[0]+" "+*/d[1]+" "+d[2];//+" "+d[3];
  g.drawString(dt,40-g.stringWidth(dt)/2,140);
  g.flip();
}
function clock(){
  volts=null;
  drawClock();
  return setInterval(function(){
    drawClock();
  },250);
}

function accelerometer(){
  accelKX022.enable();
  plot_acc();
  return setInterval(function(){
    plot_acc();
  },100);
}

function sleep(){
  g.clear();//g.flip();
  g.off();
  accelKX022.disable();
  currscr=-1;
  return 0;
}

var screens=[clock,info,accelerometer,ble_scan,randomShapes,randomLines,sleep];
var currscr= -1;
var currint=0;
setWatch(function(){
  if (!g.isOn) g.on();
  currscr++;if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint);
  currint=screens[currscr]();
},BTN1,{ repeat:true, edge:'rising',debounce:25 }
);

/*
NRF.whitelist=[];
NRF.on('connect',function(addr) {
  if (!NRF.whitelist.includes(addr)){
    if (BTN1.read()){ // add to whitelist when button is held while connecting
      NRF.whitelist.push(addr);
      vibrate(1,1,100,0);
    } else
        NRF.disconnect();
  }
  NRF.connection = {};
  NRF.connection.addr = addr;
  NRF.connected=true;
  NRF.setRSSIHandler((rssi)=>{NRF.connection.RSSI=rssi;});
});
NRF.on('disconnect',function(reason) {
  NRF.connected=false;
  NRF.connection = {};
  NRF.lastReason=reason;
});
*/

flash = require("Flash");
function printPage(page){  
  print("page="+page.toString());
  pageData=flash.read(256,0x60000000 + page*256);

  msg = "";
  for (var x of pageData)msg+=(256+x).toString(16).substr(-2);
  print(msg);
}

// accelerometer test
// set up I2C
i2c = new I2C(); //only works with software i2c?
i2c.setup({ scl : 18, sda: 17 });

accelKX022 = require("KX022.js").connect(i2c);

function plot_acc(){
  g.clear();
  accs = accelKX022.getAcc();
  g.setFont("4x6",1/*2*/);g.setColor(10);
  g.drawString("x: "+accs.x.toFixed(3),5,10);
  g.drawString("y: "+accs.y.toFixed(3),5,22);
  g.drawString("z: "+accs.z.toFixed(3),5,34);
  
  y1=100; //y middle/zero position
  h1g=50; // height at 1g
  xstart=5;
  xstep=5;
  width=20;
  col= 10;
  x1=xstart;
  x2=x1+width;
  for (var axis in accs){
    g.setColor(col);
    col++;
    y2 = Math.round( y1 + accs[axis]*h1g*(-1));
    g.fillRect(x1,Math.min(y1,y2),x2, Math.max(y1,y2));
    x1=x2+xstep;
    x2=x1+width;
  }
  g.flip();
}

E.setTimeZone(2);