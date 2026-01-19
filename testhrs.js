// test HRS ( HX3313 / HRS3313 )
// take note of needed undocumented register setup values below

const REG = {
    ID: 0x00,
    RESERVED_01: 0x01,
    ENABLE: 0x02,
    RESERVED_03: 0x03,

    LED_HRS_ON: 0x04,
    LED_PS_ON: 0x05,

    INTERRUPT_CFG1: 0x06,
    INTERRUPT_CFG2: 0x07,
    INTERRUPT_CFG3: 0x08,

    SLEEP_ENABLE: 0x09,

    OFFSET_IDAC_PS: 0x14,
    OFFSET_IDAC_HRS: 0x15,
    PS_INTERVAL: 0x16,

    HRS_DATA_L: 0xA0,
    HRS_DATA_M: 0xA1,
    HRS_DATA_H: 0xA2,

    ALS_DATA1_L: 0xA3,
    ALS_DATA1_M: 0xA4,
    ALS_DATA1_H: 0xA5,

    PS1_DATA_L: 0xA6,
    PS1_DATA_M: 0xA7,
    PS1_DATA_H: 0xA8,

    ALS_DATA2_L: 0xA9,
    ALS_DATA2_M: 0xAA,
    ALS_DATA2_H: 0xAB,

    LED_DRIVE: 0xC0
};


ADDR = 0x44;
SDA = D19;
SCL = D20;
HRS_ENABLE = D31;

i2c = new I2C();
i2c.setup({ scl: SCL, sda: SDA });


function HRS_read(reg, len) { // read
    i2c.writeTo({ address: ADDR, stop: true }, reg);
    return i2c.readFrom(ADDR, len);
}

// 8-bit write to a register
function HRS_write(reg, val) {
    // writeTo(address, [register, value])
    this.i2c.writeTo({ address: ADDR, stop: true }, [reg, val & 0xFF]);
}

// 8-bit read from a register
function HRS_read8(reg) {
    this.i2c.writeTo({ address: ADDR, stop: true }, reg);
    var d = this.i2c.readFrom(ADDR, 1);
    return d[0];
}

// 24-bit read from a register (little-endian)
// this might be wrong as the format might be twos complement 
function HRS_read24(reg) {
    this.i2c.writeTo({ address: ADDR, stop: true }, reg);
    var d = this.i2c.readFrom(ADDR, 3);
    return (d[2] << 16) | (d[1] << 8) | d[0];
}

function dumpAllRegisters() {
    for (var name in REG) {
        var addr = REG[name];
        var val;

        try {
            val = HRS_read(addr, 1)[0];
            console.log(
                name + " (0x" + addr.toString(16).padStart(2, "0") + 
                ") = 0x" + val.toString(16).padStart(2, "0")
            );
        } catch (e) {
            console.log(
                name + " (0x" + addr.toString(16).padStart(2, "0") + 
                ") = READ ERROR"
            );
        }
    }
}


digitalWrite(HRS_ENABLE, 1); // enable HRS

print("HRS ID: " + (HRS_read(REG.ID, 1)[0]).toString(16));

print("---------------- configuration ----------------");

// set registers to "recommended" startup values
HRS_write(REG.ENABLE, 0x33);
HRS_write(REG.LED_HRS_ON, 0x10); // HRS LED on-time
HRS_write(REG.LED_PS_ON,0x20); // PS LED on-time
HRS_write(REG.INTERRUPT_CFG1, 0x50); // 0x50
HRS_write(REG.INTERRUPT_CFG2, 0x07); // 0x07
HRS_write(REG.INTERRUPT_CFG3, 0x00); // 0x00
HRS_write(REG.SLEEP_ENABLE, 0x02); // sleep enable, standard 0x02
HRS_write(REG.OFFSET_IDAC_PS, 0x40); // PS offset, device seems only to work 0x40 - 0x5b (64 - 91) (undocumented, signed?, 7 bit?)
HRS_write(REG.OFFSET_IDAC_HRS, 0x40); // HRS offset, device seems only to work with 0x40 - 0x7f (64-127) (undocumented, signed?, 7 bit?)
HRS_write(REG.PS_INTERVAL, 0x40); // PS measurement interval
HRS_write(REG.LED_DRIVE, 0x86); // drive current

HRS_write(REG.ENABLE, 0x07); //final enable

dumpAllRegisters();



print("---------------- start reading ----------------");

var read_count = 0;
var ref_corrected_hrs = 0;


readHandle = setInterval(function() {
    var hrs = HRS_read24(REG.HRS_DATA_L);
    //var ps = HRS_read24(REG.PS1_DATA_L);
    var als1 = HRS_read24(REG.ALS_DATA1_L);
    // var als2 = HRS_read24(REG.ALS_DATA2_L);
    // print("HRS:", hrs,"ALS1:", als1, "PS:", ps, "ALS2:", als2);
    corrected_hrs = hrs - als1;
    if (read_count == 0) {
        ref_corrected_hrs = corrected_hrs;
        read_count = 50;
    }
    print("HRS:", hrs, "ALS1:", als1, "Corrected HRS:", corrected_hrs, "Diff from ref:", (corrected_hrs - ref_corrected_hrs));
    var diff = corrected_hrs - ref_corrected_hrs;

    var SCALE = 50;
    var HALF_WIDTH = 50;

    var clamped = Math.max(
    -HALF_WIDTH,
    Math.min(HALF_WIDTH, diff / SCALE)
    );

    var left = clamped < 0 ? "#".repeat(-clamped) : "";
    var right = clamped > 0 ? "#".repeat(clamped) : "";

    print(
    left.padStart(HALF_WIDTH, " ") +
    "|" +
    right.padEnd(HALF_WIDTH, " ")
    );

    read_count--;
}, 100);

// var HRS_ref= HRS_read24(REG.HRS_DATA_L);

// var adjust = 60;
// var HRS = 0;
// readHandle = setInterval(function() {
//     print("---------------- adjust ----------------");
//     HRS_write(REG.OFFSET_IDAC_HRS, adjust); // HRS offset
//     adjust = (adjust + 1) & 0xFF;
//     print("Set HRS offset to:", adjust);
//     HRS = HRS_read24(REG.HRS_DATA_L);
//     print("HRS reading:", HRS);
//     var diff = HRS_ref - HRS;
//     print("HRS diff from ref:", diff);

// }, 500);

// var testvalue = 0;

// setInterval(function() {
//     HRS_write(0x04, testvalue); // PS LED on-time
//     print("Wrote LED HRS on-time:", testvalue);
//     var hrs = HRS_read24(REG.HRS_DATA_L);
//     var ps = HRS_read24(REG.PS1_DATA_L);
//     var als1 = HRS_read24(REG.ALS_DATA1_L);
//     var als2 = HRS_read24(REG.ALS_DATA2_L);
//     print("HRS:", hrs,"ALS1:", als1, "PS:", ps, "ALS2:", als2);
//     testvalue = testvalue +1 ;
// }, 100);

setTimeout(function() {
    clearInterval(readHandle);
    print("---------------- disable ----------------");
    //dumpAllRegisters();
    digitalWrite(HRS_ENABLE, 0); // disable HRS
}, 60000);

