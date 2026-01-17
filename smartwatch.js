//// clock screen ////
function battInfo(v){v=v?v:battVolts();return `${E.getBattery()|0}% ${v.toFixed(2)}V`;}
function battVolts(){ return 4.20/0.320*analogRead(D4);}

var lastsec=-1;
var volts;
var batt=battInfo();

function drawClock(){
  var d=Date();
  volts= volts ? (volts+battVolts())/2:battVolts(); // average until shown
  if (d.getSeconds()==lastsec) return;
  lastsec=d.getSeconds();
  g.clear();
  g.drawImage(require("Storage").read("nyan.img"), 0, 0);
  if (lastsec%5==0){
    batt=battInfo(volts);volts=0;
  }
  g.setFont("6x8",1);
  if (Bangle.isCharging()){g.setColor(0xf00);}else{g.setColor(0x0f0);}
  g.drawString(batt,40-g.stringWidth(batt)/2,0);
  g.setFontVector(45);
  d=d.toString().split(' ');
  var sec=d[4].substr(-2);
  //var tm=d[4].substring(0,5);
  var hr=d[4].substr(0,2);
  var min=d[4].substr(3,2);
  g.setColor(0x0f0);
  g.drawString(hr,43-g.stringWidth(hr)/2,15);
  g.setColor(0x00f);
  g.drawString(min,43-g.stringWidth(min)/2,60);
  //g.setColor(8+4);
  g.setFontVector(28);
  //if (sec&1)g.drawString("o o",40-g.stringWidth("o o")/2,60);
  //if (sec&1)g.drawString(":",40-g.stringWidth(":")/2,42);
   g.setColor(0x0f0);
  if (sec&1)g.drawString(". .",43-g.stringWidth(". .")/2,36);

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
  g.drawString(dt,40-g.stringWidth(dt)/2,144);
}


//// info screen with 3D rotating cube ////

function info(){
  g.clear();
  g.setFont("4x6",1/*2*/);g.setColor(0x0f0);
  g.drawString("Espruino "+process.version,5,10);
  g.setFont("4x6",1);g.setColor(0xff0);
  g.drawString("ST7735 12 bit mode\n8Mbps SPI\nmoped",4,22);
  for (var c=0;c<64;c++){
    g.setColor(rainbow(c*360/64));g.fillRect(8+c,130,9+c,150);
  }
  return setInterval(function(){
    stepCube();
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
  g.setColor(0);g.fillRect(0,40,80,120);g.setColor(rainbow(cc*4%360));cc=(cc+1);
  drawCube(40,80,80);
}

function rainbow(angle){ //  rainbow color for 0-360 degree angle
  var red,green,blue;
  if (angle<60) {red = 15; green = Math.round(angle*0.25-0.01); blue = 0;} else
  if (angle<120) {red = Math.round((120-angle)*0.25-0.01); green = 15; blue = 0;} else 
  if (angle<180) {red = 0, green = 15; blue = Math.round((angle-120)*0.25-0.01);} else 
  if (angle<240) {red = 0, green = Math.round((240-angle)*0.25-0.01); blue = 15;} else 
  if (angle<300) {red = Math.round((angle-240)*0.25-0.01), green = 0; blue = 15;} else 
                 {red = 15, green = 0; blue = Math.round((360-angle)*0.25-0.01);} 
  ret = (red<<8) | (green<<4) | blue;
  return ret;
}

//// accelerometer screen ////
function plot_acc(){
  g.clear();
  accs = Bangle.getAccel();
  g.setFont("4x6",1/*2*/);g.setColor(0x0f0);
  g.drawString("x: "+accs.x.toFixed(3),5,10);
  g.drawString("y: "+accs.y.toFixed(3),5,22);
  g.drawString("z: "+accs.z.toFixed(3),5,34);
 
  y1=100; //y middle/zero position
  h1g=50; // height at 1g
  xstart=5;
  xstep=5;
  width=20;
  x1=xstart;
  x2=x1+width;
  for (var axis in accs){
    switch(axis) {
      case "x":
        g.setColor(0xf00);
        break;
      case "y":
        g.setColor(0x0f0);
        break;
      case "z":
        g.setColor(0x00f);
        break;
    }
    y2 = Math.round( y1 + accs[axis]*h1g*(-1));
    g.fillRect(x1,Math.min(y1,y2),x2, Math.max(y1,y2));
    x1=x2+xstep;
    x2=x1+width;
  }
}

//// speed/GPS screen ////
var lastspeed=0;
var lasttrackdata=undefined;
var lasttrackdist=0;
var trackpoints=0;
var trackthreshold=5; // meters

function draw_speed(){
  g.clear();
  g.setFontVector(30);
  g.setColor(0x0f0);
  g.drawString(lastspeed.toFixed(1),5,10);
  g.drawString(lasttrackdist.toFixed(1),5,50);
  g.drawString(trackpoints,5,90);
}

function handleGPSdata(data) {
  console.log(data);

  lastspeed=data.speed;
  console.log(lastspeed);

  //save tracking point
  if (data != undefined && !isNaN(data.lon) && !isNaN(data.lat)){//valid data?
    if (lasttrackdata == undefined){//no last track point -> save current value directly
      savepoint(data);
    }else{//existing last point
      lasttrackdist = distance(lasttrackdata,data);
      console.log('Dist:');
      console.log(lasttrackdist);
      if (lasttrackdist > trackthreshold){ //we moved enough?
        savepoint(data);
      }
    }
  }
};
// set GPS data handler
Bangle.on('GPS', handleGPSdata);

var f = require("Storage").open("track","a");
function savepoint(point) {
  lasttrackdata = point;
  f.write(getTime().toFixed(1)+","+point.lat.toFixed(5)+","+point.lon.toFixed(5)+"\n");
  trackpoints++;
  console.log('New point logged');
}

function distance(point1, point2) {
  var degToRad = Math.PI / 180;
  R = 6371000;// meters
  return R * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad ) * (point1.lon - point2.lon) , 2) + Math.pow(point1.lat - point2.lat, 2));
}


//// random shapes ////
bpp = 12;

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
  },5);
}

//// random lines ////

function randomLines(){
  g.clear();
  var cols=(bpp==1)?14:(1<<bpp)-1,w=g.getWidth(),h=g.getHeight(),r=Math.random;
  return setInterval(function(){
    g.setColor(1+r()*cols);
    g.drawLine(r()*w,r()*h,r()*w,r()*h);
  },5);
}

//// BLE scanner ////

function ble_scan(){
  Bangle.setGPSPower(0); // turn off GPS, was on from speed screen
  if (!Bangle.isLCDOn()) Bangle.setLCDPower(1);
  g.setFont("4x6",1/*2*/);g.setColor(0x0f0);
  g.clear();
  g.drawString("BLE Scanner",0,0,true);
  return setInterval(function(){
    //g.fillRect(0,0,70,6);
    g.drawString("Scan...     ",0,0,true);
    NRF.findDevices(function(d) {
      var devices;
      devices = d;

      g.clear();
      g.drawString("Idle       ",0,0,true);

      devices.sort(function(a, b){return b.rssi - a.rssi;});
      devices.forEach(function(item,idx){
          idString="N/A";
          if (item.name){
            idString= item.name;
            if (idString[0]=='B' && idString[1]=='5' && idString[2]==' ') vibrate(1,1,100,0); //alarm for other B5 watches
          }else if (item.id) idString=item.id;
          g.drawString(idString,0,8+idx*8);
          if (item.rssi) g.drawString(item.rssi,68,8+idx*8,true);
      });
    }, 1500);
  },2000);
}

//// screen redraw setup and switching ////

function clock(){
  volts=null;
  drawClock();
  return setInterval(function(){
    drawClock();
  },250);
}

function accelerometer(){
  plot_acc();
  return setInterval(function(){
    plot_acc();
  },100);
}

function speed(){
  Bangle.setGPSPower(1); // turn on GPS
  draw_speed();
  return setInterval(function(){
    draw_speed();
  },1000);
}

var screens=[clock,info,accelerometer,speed,ble_scan,randomShapes,randomLines];
var currscr= 0; 
var currint=0;
function switchScreen(){
  currscr++;
  if (currscr>=screens.length) currscr=0;
  if (currint>0) clearInterval(currint); // stop current screen
  currint=screens[currscr](); // start new screen
}

setWatch( // trigger screen switch on BTN1 press
  switchScreen,
  BTN1,
  {repeat:true, edge:'rising',debounce:25 }
);

// handle display on/off
Bangle.on('lcdPower',on=>{
  if (!on) {//off
    if (currint>0) clearInterval(currint); // stop current screen
  } else {//on
    currint=screens[currscr](); // (re)start current screen
  }
});

// initial setup before launching
Bangle.setOptions({
  gestureStartThresh: 640000,
  gestureEndThresh: 4000000,
  gestureInactiveCount: 4,
  gestureMinLength: 10,
  stepCounterThresholdLow: 1,
  stepCounterThresholdHigh: 536876204,
  twistThreshold: 800,
  twistTimeout: 1000,
  twistMaxY: -800,
  wakeOnBTN1: true,
  wakeOnBTN2: true,
  wakeOnBTN3: true,
  wakeOnFaceUp: false,
  wakeOnTouch: false,
  wakeOnDoubleTap: false,
  wakeOnTwist: false,
  powerSave: true,
  manualWatchdog: false,
  lockTimeout: 10000,
  lcdPowerTimeout: 10000,
  backlightTimeout: 10000,
  btnLoadTimeout: 1500 });

E.setTimeZone(1);
Bangle.setLCDPower(1); // make sure screen is triggered on after reload