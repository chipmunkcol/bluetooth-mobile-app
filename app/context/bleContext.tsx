import React, { createContext, useContext } from 'react';
/* eslint-disable no-bitwise */
import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import * as ExpoDevice from 'expo-device';

import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { TypeBLEData } from '../types/type';
import { changeUnix } from '../hooks/util';

// const DATA_SERVICE_UUID = "0000FFB1-0000-1000-8000-00805F9B34FB";
const DATA_SERVICE_UUID = '0000FFB0-0000-1000-8000-00805F9B34FB';
const READ_CHARACTERISTIC_UUID = '0000FFB1-0000-1000-8000-00805F9B34FB';
const WRITE_CHARACTERISTIC_UUID = '0000FFB2-0000-1000-8000-00805F9B34FB';

const bleManager = new BleManager();

export type BLEDataType = {
    timestamp: string;
    sensorDatas: {
        key: string;
        value: string;
    }[];
};

export const BLEContext = createContext({});

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const [BLEData, setBLEData] = useState<BLEDataType | null>(null);
    const [isBLECharged, setIsBLECharged] = useState(false);
    const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
    const [currentTime, setCurrentTime] = useState<number>(Date.now());

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            }
        );

        return (
            bluetoothScanPermission === 'granted' &&
            bluetoothConnectPermission === 'granted' &&
            fineLocationPermission === 'granted'
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: 'Location Permission',
                    message: 'Bluetooth Low Energy requires Location',
                    buttonPositive: 'OK',
                });
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted = await requestAndroid31Permissions();

                return isAndroid31PermissionsGranted;
            }
        } else {
            return true;
        }
    };

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();

            startStreamingData(deviceConnection);
        } catch (e) {
            console.log('FAILED TO CONNECT', e);
        }
    };

    const cancelConnectionToDevice = async (device: Device) => {
        try {
            await bleManager.cancelDeviceConnection(device.id);
            setConnectedDevice(null);
        } catch (e) {
            console.log('연결 해제 실패');
        }
    };

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }

            if (
                device &&
                (device.localName || device.name)
                //         && (device.localName === "Arduino" || device.name === "Arduino")
            ) {
                setAllDevices((prevState: Device[]) => {
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    // 기기 연결 후 date 업데이트
    // 기기 연결 후 date 업데이트
    // 기기 연결 후 date 업데이트

    const parseSensorData = (hexString: string) => {
        if (!hexString) return null;

        const timeStamp = hexString.substring(0, 8);
        const sensor1 = hexString.substring(8, 10);
        const sensor2 = hexString.substring(10, 12);
        const sensor3 = hexString.substring(12, 14);
        const sensor4 = hexString.substring(14, 16);
        const sensor5 = hexString.substring(16, 18);
        const sensor6 = hexString.substring(18, 20);
        const sensor7 = hexString.substring(20, 22);
        const sensor8 = hexString.substring(22, 24);
        const sensor9 = hexString.substring(24, 26);
        const sensor10 = hexString.substring(26, 28);
        const sensor11 = hexString.substring(28, 30);
        const sensor12 = hexString.substring(30, 32);
        const sensor13 = hexString.substring(32, 34);
        const sensor14 = hexString.substring(34, 36);
        const sensor15 = hexString.substring(36, 38);
        const sensor16 = hexString.substring(38, 40);

        const temp = {
            //           timedata: changeUnix(timeData),
            sensor1: parseInt(sensor1, 16).toString(),
            sensor2: parseInt(sensor2, 16).toString(),
            sensor3: parseInt(sensor3, 16).toString(),
            sensor4: parseInt(sensor4, 16).toString(),
            sensor5: parseInt(sensor5, 16).toString(),
            sensor6: parseInt(sensor6, 16).toString(),
            sensor7: parseInt(sensor7, 16).toString(),
            sensor8: parseInt(sensor8, 16).toString(),
            sensor9: parseInt(sensor9, 16).toString(),
            sensor10: parseInt(sensor10, 16).toString(),
            sensor11: parseInt(sensor11, 16).toString(),
            sensor12: parseInt(sensor12, 16).toString(),
            sensor13: parseInt(sensor13, 16).toString(),
            sensor14: parseInt(sensor14, 16).toString(),
            sensor15: parseInt(sensor15, 16).toString(),
            sensor16: parseInt(sensor16, 16).toString(),
        };
        const sensorArray = Object.entries(temp).map(([key, value]) => {
            return { key, value };
        });

        const BLEData = {
            timestamp: changeUnix(timeStamp),
            sensorDatas: sensorArray,
        };
        return BLEData;
    };

    const onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
        if (error) {
            console.log('Error in onBleUpdate:', error);
            return -1;
        } else if (!characteristic?.value) {
            console.log('No Data was received');
            return -1;
        }

        const dataString = characteristic.value;
        const hexString =
            dataString &&
            Array.from(Uint8Array.from(atob(dataString), (c) => c.charCodeAt(0)))
                .map((byte) => byte.toString(16).padStart(2, '0'))
                .join('');

        const parsedData = parseSensorData(hexString);
        setBLEData(parsedData);
        setLastUpdateTime(Date.now());
    };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(DATA_SERVICE_UUID, READ_CHARACTERISTIC_UUID, onDataUpdate);
        } else {
            console.log('No Device Connected');
        }
    };

    // device write
    // device write
    // device write

    const getUploadingString = () => {
        const lastValue = isBLECharged ? '00' : '10';
        const newString =
            Math.floor(Date.now() / 1000)
                .toString(16)
                .toUpperCase() +
            '00' +
            lastValue;
        return btoa(newString);
    };

    const toggleCharging = async (device: Device) => {
        try {
            if (device) {
                const str = getUploadingString();
                await device.writeCharacteristicWithResponseForService(
                    DATA_SERVICE_UUID,
                    WRITE_CHARACTERISTIC_UUID,
                    str
                );
                setIsBLECharged(!isBLECharged);
            } else {
                alert('No Device Connected');
            }
        } catch (error) {
            console.error('toggleCharging 함수에서 오류 발생:', error);
        }
    };

    const contextValue = useMemo(
        () => ({
            allDevices,
            connectedDevice,
            connectToDevice,
            cancelConnectionToDevice,
            BLEData,
            requestPermissions,
            scanForPeripherals,
            isBLECharged,
            setIsBLECharged,
            toggleCharging,
        }),
        [
            allDevices,
            connectedDevice,
            connectToDevice,
            cancelConnectionToDevice,
            BLEData,
            requestPermissions,
            scanForPeripherals,
            isBLECharged,
            setIsBLECharged,
        ]
    );

    return <BLEContext.Provider value={contextValue}>{children}</BLEContext.Provider>;
};

export const useBLEContext = (): any => {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error('useBLEContext must be used within a BLEProvider');
    }
    return context;
};
