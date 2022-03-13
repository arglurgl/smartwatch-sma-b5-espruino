# Notes for compiling/building
Pull the version tag of the Espruino release you want from github (https://github.com/espruino/Espruino), then add (or link) the B5SDK12.py file
in the 'boards' folder, then execute from Espruino root folder: 
* source scripts/provision.sh B5SDK12
    * (only need to do the above command once)
* make clean && DFU_UPDATE_BUILD=1 BOARD=B5SDK12 RELEASE=1 make

(See also https://github.com/espruino/Espruino/blob/master/README_Building.md)

Flash the resulting zip with the Nordic android tools (nRF connect). To enter update mode on the SMA B5, press touch button until device reboots, then release. Screen will be blank, but device should appear as 'DFUTARG' via BLE in
Nordic nRF connect scan. Then quickly connect to it to stay in update mode und flash the zip file.