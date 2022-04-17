const REG = {
    XOUT_L: 0x06,
    XOUT_H: 0x07,
    YOUT_L: 0x08,
    YOUT_H: 0x09,
    ZOUT_L: 0x0A,
    ZOUT_H: 0x0B,
    WHO_AM_I: 0x0F,
    CNTL1: 0x18,
    CNTL2: 0x19,
    CNTL3: 0x1A,
    ODCNTL: 0x1B,
    TILT_TIMER: 0x22,
}

const C = {
    WAI_VAL: 0x14,
}

function KX022(i2c) {
    this.i2c = i2c;
    this.addr = 0x1f;
    this.initDone =false;
    this.init()
}

KX022.prototype.read = function (reg, len) { // read
    this.i2c.writeTo({ address: this.addr, stop: true }, reg);
    return this.i2c.readFrom(this.addr, len);
}

KX022.prototype.write = function (reg, data) { // write
    this.i2c.writeTo(this.addr, [reg, data]);
}

KX022.prototype.disable = function(){
    this.write(REG.CNTL1, 0x00); //disable accelerometer to save power
}
KX022.prototype.enable = function(){
    this.write(REG.CNTL1, 0x80);//enable operation
}

KX022.prototype.init = function () {
    print("KX022 init start");
    wai=undefined;
    tries=5
    while(tries>0){
        wai = this.read(REG.WHO_AM_I, 1);
        if (wai != C.WAI_VAL) {
            print("kx022: error: unexpected 'who am i' value:");
            print(wai)
        }else{
            break;
        }
        tries--;
    }
    if (tries==0){
        print("all tries failed, aborting");
        return;
    }
    this.write(REG.CNTL1, 0x00); //disable
    this.write(REG.CNTL2, 0xBF); //reset to get rid of old configuration
    cntl2 = 0;
    while (cntl2 != 0x3f) { //wait for reset to finish
        cntl2 = this.read(REG.CNTL2, 1);
    }
    //leave CNTL2 at reset values
    //leave CNTL3 at reset values
    this.write(REG.ODCNTL, 0x02); // set data rate and filter (50Hz, Filter on)    
    this.enable();
    var self = this ; //for access in callback
    setTimeout(function () {
        print("kx022 init done")
        self.initDone= true;
      }, 40);
}

KX022.prototype.getAcc = function () {
    if (!this.initDone){
        print("KX022 init has not finished")
        return undefined
    }
    var d = new DataView(this.read(REG.XOUT_L, 6).buffer);
    return {
        x: d.getInt16(0, 1) / 16384,
        y: d.getInt16(2, 1) / 16384,
        z: d.getInt16(4, 1) / 16384
    };
}

exports.connect = function (/*=I2C*/i2c) {
    return new KX022(i2c);
};
