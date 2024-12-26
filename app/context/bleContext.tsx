import React, { createContext, useContext } from 'react';
/* eslint-disable no-bitwise */
import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import * as ExpoDevice from 'expo-device';

import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { TypeBLEData } from '../types/type';

// const DATA_SERVICE_UUID = "0000FFB1-0000-1000-8000-00805F9B34FB";
const DATA_SERVICE_UUID = '0000FFB0-0000-1000-8000-00805F9B34FB';
const READ_CHARACTERISTIC_UUID = '0000FFB1-0000-1000-8000-00805F9B34FB';
const WRITE_CHARACTERISTIC_UUID = '0000FFB2-0000-1000-8000-00805F9B34FB';

const bleManager = new BleManager();

export const BLEContext = createContext({});

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const [BLEData, setBLEData] = useState<TypeBLEData | null>({
        timeStamp: '',
        status: '',
        voltage: '',
        current: '',
        frequency: '',
        power: '',
        factor: '',
    });
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

    const currentTimestamp = Math.floor(Date.now() / 1000); // 초 단위로 변환
    const fourByteUnixTime = currentTimestamp.toString(16).toString().toUpperCase();

    const parseSensorData = (hexString: string) => {
        if (!hexString) return null;

        const timeStamp = hexString.substring(0, 8);
        const status = hexString.substring(8, 10);
        const voltage = hexString.substring(10, 12);
        const current = hexString.substring(12, 14);
        const frequency = hexString.substring(14, 16);
        const power = hexString.substring(16, 18);
        const factor = hexString.substring(18, 20);

        return {
            //           timedata: changeUnix(timeData),
            timeStamp: parseInt(timeStamp, 16).toString(),
            status: parseInt(status, 16).toString(),
            voltage: parseInt(voltage, 16).toString(),
            current: parseInt(current, 16).toString(),
            frequency: parseInt(frequency, 16).toString(),
            power: parseInt(power, 16).toString(),
            factor: parseInt(factor, 16).toString(),
        };
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
            fourByteUnixTime,
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
