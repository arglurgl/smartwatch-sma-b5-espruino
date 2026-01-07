# Notes for compiling/building
Pull the version tag of the Espruino release you want from github (https://github.com/espruino/Espruino), then add (or link) the B5SDK12.py file
in the 'boards' folder, then execute from Espruino root folder: 
* source scripts/provision.sh B5SDK12
    * (only need to do the above command once)
* make clean && DFU_UPDATE_BUILD=1 BOARD=B5SDK12 RELEASE=1 make

(See also https://github.com/espruino/Espruino/blob/master/README_Building.md)

Flash the resulting zip with the Nordic android tools (nRF connect, nRf toolbox, nRF device Firmware Update). To enter update mode on the SMA B5:
* Option A: Press and hold touch button until device reboots. Immediately when the screen goes blank start mashing the touch button quickly. If the LCD screen turns on try again.
* Option B: Connect to the watch with nRF Toolbox, hold touch button, and simultaneously send ```E.reboot()[ENTER/LF]``` to the device e.g. with nRF Toolbox. Release button after 1-2 seconds.

Screen will be blank and should stay so when pressing the touch button, but device should appear as "B5 ABCD"/"DfuTarg" with a Nordic DFU Service via BLE in Nordic nRF connect scan. Then quickly connect to it with nRF device Firmware Update to stay in update mode und flash the zip file.