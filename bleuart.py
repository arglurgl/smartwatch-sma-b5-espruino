from bluepy import btle

UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
UART_RX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
UART_TX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

class MyDelegate(btle.DefaultDelegate):
    def __init__(self):
        btle.DefaultDelegate.__init__(self)

    def handleNotification(self, cHandle, data):
        print("%s" %data.decode("utf-8"), end="")


p = btle.Peripheral("F1:68:E6:3C:24:7C",btle.ADDR_TYPE_RANDOM)
p.setDelegate( MyDelegate() )

# Setup to turn notifications on, e.g.
svc = p.getServiceByUUID(UART_SERVICE_UUID)
txch = svc.getCharacteristics(forUUID=UART_TX_CHAR_UUID)[0]

p.writeCharacteristic(txch.valHandle+1, b"\x01\x00")

rxch = svc.getCharacteristics(forUUID=UART_RX_CHAR_UUID)[0]

#data = input("Enter data:")
data = "printPage()\n"
p.writeCharacteristic(rxch.valHandle,data.encode("utf-8")+b"\n")

while True:
    if p.waitForNotifications(0.1):
        # handleNotification() was called
        continue
    # Perhaps do something else here
