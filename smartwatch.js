E.kickWatchdog();
function KickWd(){
  if( (typeof(BTN1)=='undefined')||(!BTN1.read()) ) E.kickWatchdog();
}
var wdint=setInterval(KickWd,2000);
E.enableWatchdog(20, false);

// MIT License (c) 2020 fanoush https://github.com/fanoush
// see full license text at https://choosealicense.com/licenses/mit/
// SPI display driver below compiled with options LCD_BPP=12
var SPI2 = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8QtQNMfEQigGCAoYDjgBC92P///wdLe0QbiUOxBEoTaAAr/NAAIxNgA0p6RBOBcEcYMQJAxv///7L///8t6fBHkEYZTBlO//fl/xlK3/hkwAAjASUTYE/w/w5TYKlGI2AQMh9G/ykA6wMKwvgAoIu//zMxYMb4AOAAIYi//znM+ACQuPEADwbQKbkLS3tEHYEAIL3o8IfU+ACguvEAD/rQJ2AAKd7R8+cYMQJASDUCQDQ1AkAQMAJAUP///y3p8E+bsM3pARJQSnpEBkaS+ACQACgA8JGAACkA8I6ACfH/MwcrAPKJgAEjA/oJ8wE727IDkwR4Q3iXiETqAyQCmxxB02gA8QILpLILsT1KE2BP6kkD27IEkz1Le0QRqAWTCKvN6QYwT/AACEFGBZsCnbP4AqADmwGaI0BE+gn0MvgTwAObI0BE+gn0MvgTIASbHUTtsgctQNiksk/qLBNDVBMSAfECDkPqDBxDGAMxqvECCiMpg/gBwB/6ivoA+A4gCd0BIv/3W//Y8QEIC78HmAaYQUYAIbrxAA/L0R1Le0QBP9uIHkS/snN4NHhE6gMkApscQQbxAguksgAvttHJsTpG//c8/xNLe0TYaBCxDUsYYAAgG7C96PCP3kYIPR74ATvtssXxCAsD+gvzHEOksvNGsuf/9w//5edP8P8w6ecAvwwFAFAIBQBQFP///8T+//9A/v//Fv7//xVKekRwtQ5GEWkFRuGxEEsZYNJoArEaYAAiASEoRv/3Af8OSwtMe0QBLhppImAE3QAicR5oHP/39f4JS3tE2GgIsSBgACBwvU/w/zD75wC/DAUAUAgFAFDC/f//nv3//4j9//8TtQAoHtsAKaa/jfgFEAIkASQAKqS/AqkJGY34BACkvwE0AfgELAAror8CqhIZATQhRgGoqL8C+AQ8//ev/yBGArAQvQAk+udwtQVGiLFGGAAkKEYQ+AEbGbFFGLVCAtlkQiBGcL3/95n/ACj50QE07+cERvXnAAA4tQ9Le0QaaZKxiLGBsdtoC7EJShNgC00ITH1EACIraSNg//eR/uhoCLEgYAAgOL1P8P8w++cAvwwFAFAIBQBQ5Pz//878//8PSjC1FGjEuQ5LG2gLsQ5MI2ARSw1Me0QABl1pJWCdaWVg3GkKS0kAHGBYYVlkByMTYAhLASAYYDC9T/D/MPvnADUCQAQzAkAIMwJACDUCQBA1AkAUMAJAivz//wVKACMTYKL1fnITYANLG2gLscL4ADJwRwA1AkAEMwJAELUGTHxExOkFAQEhAfoC8gH6A/PiYCNhEL0AvyD8//8=");
  return {
    cmd:E.nativeCall(569, "int(int,int)", bin),
    cmds:E.nativeCall(741, "int(int,int)", bin),
    cmd4:E.nativeCall(669, "int(int,int,int,int)", bin),
    data:E.nativeCall(789, "int(int,int)", bin),
    setpins:E.nativeCall(985, "void(int,int,int,int)", bin),
    enable:E.nativeCall(861, "int(int,int)", bin),
    disable:E.nativeCall(953, "void()", bin),
    blit_setup:E.nativeCall(33, "void(int,int,int,int)", bin),
    blt_pal:E.nativeCall(221, "int(int,int,int)", bin),
  };
})();

E.kickWatchdog();

// B5 display pins
var RST=D8,CS=D5,DC=D6,PWR=D29,SCK=D2,MOSI=D3;

function delayms(ms){
  digitalPulse(DC,0,ms); // just to wait 10ms
  digitalPulse(DC,0,0);
}

CS.write(1); // CS
DC.write(1); // CD
RST.write(1); // RESET
PWR.write(0); //backlight
digitalPulse(RST,0,10);
SCK.write(0);
MOSI.write(0);
//SPI2.save();
SPI2.disable();
SPI2.setpins(SCK,MOSI,CS,DC); // CLK,MOSI,CS,DC

function toFlatString(arr){
  var b=E.toString(arr);if (b) return b;
  print("toFlatString() fail&retry!");E.defrag();b=E.toString(arr);if (b) return b;
  print("fail&retry again!");E.defrag();b=E.toString(arr);if (b) return b;
  print("failed!"); return b;
}
function toFlatBuffer(a){return E.toArrayBuffer(toFlatString(a));}

function cmd(a){
  //CS.reset();
  if (typeof(a)=='number') SPI2.cmd4(a,-1,-1,-1);
  else switch (a.length){
    case 2: SPI2.cmd4(a[0],a[1],-1,-1); break;
    case 3: SPI2.cmd4(a[0],a[1],a[2],-1); break;
    case 4: SPI2.cmd4(a[0],a[1],a[2],a[3]); break;
    case 1: SPI2.cmd4(a[0],-1,-1,-1); break;
    default:
    var b=toFlatString(a);
    SPI2.cmd(E.getAddressOf(b,true),b.length);
  }
  //CS.set();
}

function cmds(arr){
  var b=toFlatString(arr);
  //CS.reset();
  var c=SPI2.cmds(E.getAddressOf(b,true),b.length);
  //CS.set();
  if (c<0)print('lcd_cmds: buffer mismatch, cnt='+c);
  return c;
}


function init(){
  cmd(0x11); // sleep out
  delayms(10);
  cmd([0xb1,5,0x3c,0x3c]);
  cmd([0xb2,5,0x3c,0x3c]);
  cmd([0xb3,5,0x3c,0x3c,5,0x3c,0x3c]);
  cmd([0xb4,3]);
  cmd([0xc0,0x0e,0xe,0x40]);
  cmd([0xc1,0xc5]);
  cmd([0xc2,0xd,0xc5]);
  cmd([0xc3,0x8d,0x2a]);
  cmd([0xc4,0x8d,0xee]);
  cmd([0xc5,6]);
  cmd([0x36,200]);
  cmd([0xe0, 0x0b,0x17,0x0a,0x0d, 0x1a,0x19,0x16,0x1d, 0x21,0x26,0x37,0x3c, 0,9,5,0x10]);
  cmd([0xe1, 0x0c,0x19,0x09,0x0d, 0x1b,0x19,0x15,0x1d, 0x21,0x26,0x39,0x3e, 0,9,5,0x10]);
  cmd([0x3a,3]);// 5
}


var bpp=4; // powers of two work, 3=8 colors would be nice
var g=Graphics.createArrayBuffer(80,160,bpp);
var pal;
switch(bpp){
  case 2: pal= Uint16Array([0x000,0xf00,0x0f0,0x00f]);break; // white won't fit
//  case 1: pal= Uint16Array([0x000,0xfff]);break;
  case 1:
  pal= Uint16Array( // same as 16color below, use for dynamic colors
    [ 0x000,0x00a,0x0a0,0x0aa,0xa00,0xa0a,0xa50,0xaaa,
      0x555,0x55f,0x5f5,0x5ff,0xf55,0xf5f,0xff5,0xfff ]);
  g.sc=g.setColor;
  c1=pal[1]; //save color 1
  g.setColor=function(c){ //change color 1 dynamically
    c=Math.floor(c);
    if (c > 1) {
      pal[1]=pal[c]; g.sc(1);
    } else if (c==1) {
      pal[1]=c1; g.sc(1);
    } else g.sc(c);
  }; break;
  case 4: pal= Uint16Array( // CGA
    [
// 12bit RGB444
      0x000,0x00a,0x0a0,0x0aa,0xa00,0xa0a,0xa50,0xaaa,
     0x555,0x55f,0x5f5,0x5ff,0xf55,0xf5f,0xff5,0xfff
//16bit RGB565
//      0x0000,0x00a8,0x0540,0x0555,0xa800,0xa815,0xaaa0,0xad55,
//      0x52aa,0x52bf,0x57ea,0x57ff,0xfaaa,0xfabf,0xffea,0xffff

    ]);break;
}

// preallocate setwindow command buffer for flip
g.winCmd=toFlatBuffer([
  5, 0x2a, 0, 0, 0,0,
  5, 0x2b, 0, 0, 0,0,
  1, 0x2c,
  0 ]);
// precompute addresses for flip
g.winA=E.getAddressOf(g.winCmd,true);
g.palA=E.getAddressOf(pal.buffer,true); // pallete address
g.buffA=E.getAddressOf(g.buffer,true); // framebuffer address
g.stride=g.getWidth()*bpp/8;

g.flip=function(force){
  var r=g.getModified(true);
  if (force)
    r={x1:0,y1:0,x2:this.getWidth()-1,y2:this.getHeight()-1};
  if (r === undefined) return;
  var x1=r.x1&0xfe;var x2=(r.x2+2)&0xfe; // for 12bit mode align to 2 pixels
  var xw=(x2-x1);
  var yw=(r.y2-r.y1+1);
  if (xw<1||yw<1) {print("empty rect ",xw,yw);return;}
/*
  cmd([0x2a,0,24+x1,0,23+x2]); //offset by (128-80)/2=24
  cmd([0x2b,0,r.y1,0,r.y2]);
  cmd([0x2c]);
*/
  var c=g.winCmd;
  c[3]=24+x1;c[5]=23+x2; //0x2a params
  c[9]=r.y1;c[11]=r.y2; // 0x2b params
  SPI2.blit_setup(xw,yw,bpp,g.stride);
  var xbits=x1*bpp;
  var bitoff=xbits%8;
  var addr=g.buffA+(xbits-bitoff)/8+r.y1*g.stride; // address of upper left corner
  //CS.reset();
  //VIB.set();//debug
  SPI2.cmds(g.winA,c.length);
  SPI2.blt_pal(addr,g.palA,bitoff);
  //VIB.reset();//debug
  //CS.set();
};

g.lev=256;
g.setBrightness=function(lev){
  if (lev>=0 && lev<=256)
    this.lev=lev;
  else
    lev=this.lev;
  if (this.isOn){
    val=lev/256;
    if (val==0||val==1)
      digitalWrite(PWR,val);
    else
      analogWrite(PWR,val,{freq:60});
  }
};

g.isOn=false;
//g.doInit=true;
SPI2.enable(0x80,0); //8MBit, mode 0
init();
//SPI2.disable();

g.on=function(){
  if (this.isOn) return;
  //[DC,SCK,MOSI,RST,CS].forEach((p)=>{p.mode("input_pullup");p.mode("output");});
//  CS.write(1); // CS
//  DC.write(1); // CD
//  RST.write(1); // RESET
//  SCK.write(0);
//  MOSI.write(0);
  //SPI2.enable(0x80,0);
  if (g.doInit) {init();g.doInit=false;} else cmd(0x11);
  g.flip();
  //cmd(0x13); //ST7735_NORON: Set Normal display on, no args, w/delay: 10 ms delay
  cmd(0x29); //ST7735_DISPON: Set Main screen turn on, no args w/delay: 100 ms delay
  //PWR.reset(); // full brightness
  this.isOn=true;
  this.setBrightness();
};


g.off=function(){
  if (!this.isOn) return;
  cmd(0x28);
  cmd(0x10);
  PWR.reset();
  //SPI2.disable();
  //6,3,2,8,7
//  [DC,SCK,MOSI,RST,CS].forEach((p)=>{p.mode("analog");} ); // disconnect like  poke32(0x50000700+4*pin,2);
  this.isOn=false;
};

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

E.setTimeZone(1);