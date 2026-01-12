# Notes for compiling/building
A full build is only provided here for convenience.
The firmware for the SMA B5 has been moved to its own repository:

https://github.com/arglurgl/Espruino-SMA-B5/tree/Espruino-SMA-B5

Use that repo to build a new firmware: Git checkout the Espruino-SMA-B5 branch, then run the "build and flash" or "build OTA DFU package" script.

# OTA Update
Flash the resulting zip with the Nordic android tools (nRF connect, nRf toolbox, nRF device Firmware Update). To enter update mode on the SMA B5:
* Option A: Press and hold touch button while not connected via bluetooth until device reboots. Immediately when the boot screen is seen release the button.
* Option B: Connect to the watch with Espruino IDE and send E.reboot() via the REPL terminal while holding the touch button. Alternatibely use nRF Toolbox, hold touch button, and simultaneously send ```E.reboot()[ENTER/LF]``` to the device e.g. with nRF Toolbox. Immediately when the boot screen is seen release the button.

Screen will show DFU STARTED, device should appear as "B5 ABCD"/"DfuTarg" with a Nordic DFU Service via BLE in Nordic nRF connect scan. Then  connect to it with nRF device Firmware Update and flash the zip file.

# Programmer Update
```nrfutil device program --options reset=RESET_DEFAULT,chip_erase_mode=ERASE_ALL --firmware espruino_*_SMAB5.hex```