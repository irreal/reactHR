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
                device.connect()
                    .then((device) => {
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
                            console.log('got some dataaaaaa! ', err, data ? data : data);
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
