import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';


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

            if (device.name === 'XingZhe_HRM' ||
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

                            shitty2.readCharacteristicForService("0000180d-0000-1000-8000-00805f9b34fb", "00002a37-0000-1000-8000-00805f9b34fb").then((v, v2) => {

                                console.log('ovaj drugi vraća', v, v2);
                            }).catch(e => console.log);

                            function hex2bin(hex) {
                                return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
                            }
                            var bits = hex2bin(data.value);
                            const fromHexString = hexString =>
                                new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                            var value = fromHexString(data.value);
                            console.log('duzina je', value.length, value.byteLength);

                            console.log('bitovi: ' + bits);

                            // const flags = value[0];
                            // const valueFormat = (flags >> 0) & 0b01
                            // const sensorContactStatus = (flags >> 1) & 0b11
                            // const energyExpendedStatus = (flags >> 3) & 0b01
                            // const rrIntervalStatus = (flags >> 4) & 0b01
                            // console.log('valueformat', valueFormat);
                            // console.log('sensor contact', sensorContactStatus);

                            // const bpm = readNext(valueFormat === 0 ? 1 : 2)
                            // const sensor = (sensorContactStatus === 2) ? 'no contact' : ((sensorContactStatus === 3) ? 'contact' : 'N/A')
                            // const energyExpended = readNext(energyExpendedStatus === 1 ? 2 : 0)
                            // const rrSample = readNext(rrIntervalStatus === 1 ? 2 : 0)
                            // // RR-Interval is provided with "Resolution of 1/1024 second"
                            // const rr = rrSample && (rrSample * sampleCorrection) | 0


                            // console.log('got some dataaaaaa! ', data.value);
                            // console.log('prvi', value[0]);
                            // console.log('drugi', value[1]);
                            // console.log('treci', value[2]);
                            // console.log('cetrvrti', value[3]);
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
