import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import b64 from './Base64';

export default class Heartrate extends Component {
    constructor() {
        super();
        this.manager = new BleManager();
        console.log('jej');

    }
    componentWillMount() {
        const subscription = this.manager.onStateChange((state) => {
            console.log('uuu, state', state);
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                console.log('scanning error :(');
                return
            }

            // Check if it is a device you are looking for based on advertisement data
            // or other criteria.

            if (device.name === 'Geonaute Dual HR' ||
                device.name === 'SensorTag') {

                console.log('found device! ', device.name);
                // Stop scanning as it's not necessary if you are scanning for one device.
                this.manager.stopDeviceScan();
                var shitty = device;
                var shitty2;
                device.connect()
                    .then((device) => {
                        shitty2 = device;
                        console.log('uuu, konektovao se');
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        var uuids = shitty.serviceUUIDs;
                        return device.characteristicsForService(uuids[0]);
                    })

                    .then((chars) => {
                        console.log('characteristics: ', chars);
                        chars[0].monitor(((err, data) => {
                            console.log(data.value)
                            var dataB = b64.atob(data.value);
                            var rawLength = dataB.length;
                            var array = new Uint8Array(new ArrayBuffer(rawLength));
                            for (i = 0; i < rawLength; i++) {
                                array[i] = dataB.charCodeAt(i);
                            }
                            valueFormat = (array[0] >> 0) & 0b01;
                            var bpm;
                            if (valueFormat == 0) {
                                bpm = array[1].toString(10);
                            }
                            else {
                                var array16 = new Uint16Array(array.subarray(1, 3));
                                bpm = array16[0].toString(10);
                            }
                            console.log('jupi jej format', valueFormat);
                            console.log('jupi jej dec', bpm);

                        }));
                    })
                    .catch((error) => {
                        console.log('error u nizu :(', error);
                        // Handle errors
                    });
                // Proceed with connection.
            }
        });
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Zdravo</Text>
            </View>
        );
    }
}
