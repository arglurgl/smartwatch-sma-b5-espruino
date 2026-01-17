# smartwatch-sma-b5-espruino
Smartwatch application for the SMA B5 fitness tracker/smartwatch running espruino.

This is a smartwatch application for an [SMA B5](https://www.smawatch.com/page411) [~$19](https://www.aliexpress.com/item/4000987225908.html) fitness tracker with builtin GPS that has been flashed with espruino firmware using the [espruino port of fanoush](https://github.com/fanoush/ds-d6/blob/master/espruino/DFU/B5).

## Getting started
- Get the watch
- Go [here](https://github.com/fanoush/ds-d6/tree/master/espruino/DFU/B5) for instructions on getting the espruino firmware installed. After flashing, Espruino will handle uploading/flashing via bluetooth and then run the smartwatch javascript application. You only need to do this flashing process once, afterwards, code is uploaded via bluetooth. Summary of flashing (see [here](https://github.com/fanoush/ds-d6/tree/master/espruino/DFU/B5) for details):
  - Get a programmer or setup a Raspbery Pi as an alternative
  - Build an adapter cable from the programmer to the watch USB
  - Erase/unlock the watch as per the instructions
  - Flash the watch with the .hex file via the programmer and cable
  - (Maybe additionally update via DFU (device firmware upgrade) .zip to newer version)
  - If everything worked you should see a "B5 xxxx" device appear when scanning for bluetooth low energy devices
- Open the browser-based [Espruino Web IDE](https://www.espruino.com/ide/) in Chrome and upload the javascript file from this repositiory via bluetooth low energy (BLE)
  - make sure your bluetooth adapter supports BLE
  - click the "connect/disconnect" button and then "status" to see if the IDE can use your bluetooth adapter
    -  on linux you need to enable 'experimental features' in Chrome to use web bluetooth
  - upload the files in the 'storage' folder to the storage of the watch (storage button looks like stacked disks in Web IDE)
  - copy the smartwatch.js to the editor window (or open file) and upload to the watch ("send to Espruino", chip with arrow icon)
  - touch the button and the watch should wake up and do something :)


This code is based on the intial demo code from fanoush: https://gist.github.com/fanoush/505a6f44532e4fdaadef4da5777d7777

Many thanks to fanoush for all the effort and making this possible!
