import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
// import 'expo-dev-client';

import { useNavigation } from '@react-navigation/native';
import { Dimensions, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Color } from '@/app/styles/color';

// import useBLE from '../hooks/useBLE';
import DeviceModal from '../components/DeviceConnectionModal';
import { useBLEContext } from '../context/bleContext';
// import DeviceModal from './DeviceConnectionModal';

const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get('window').width;

export default function Index() {
    const {
        allDevices,
        connectedDevice,
        connectToDevice,
        cancelConnectionToDevice,
        requestPermissions,
        scanForPeripherals,
    } = useBLEContext();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            scanForPeripherals();
        }
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const openModal = async () => {
        scanForDevices();
        setIsModalVisible(true);
    };

    const navigation = useNavigation();
    const navigateToScreen = (title: string) => {
        navigation.navigate(title);
    };

    const handlePress = () => {
        const phoneNumber = '114';
        Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar barStyle="dark-content" backgroundColor="#f2f2f2" /> */}
            <View style={styles.rowContainer}>
                <TouchableOpacity
                    onPress={() => {
                        connectedDevice ? cancelConnectionToDevice(connectedDevice) : openModal();
                    }}
                    style={styles.ctaButton}
                >
                    <Text style={styles.ctaButtonText}>{connectedDevice ? 'SENSOMEDI 해제' : 'SENSOMEDI 연결'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => navigateToScreen('sensing')} style={styles.menuItem}>
                    <MaterialCommunityIcons name="heart-pulse" size={32} color="white" />
                    <Text style={styles.menuText}>센서현황</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('이 페이지는 현재 비활성화 상태입니다')} style={styles.menuItem}>
                    <MaterialIcons name="touch-app" size={32} color="white" />
                    <Text style={styles.menuText}>센서설정</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => alert('이 페이지는 현재 비활성화 상태입니다')} style={styles.menuItem}>
                    <MaterialCommunityIcons name="account-edit" size={32} color="white" />
                    <Text style={styles.menuText}>정보관리</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePress} style={styles.menuItem}>
                    <MaterialCommunityIcons name="hospital-building" size={32} color="white" />
                    <Text style={styles.menuText}>비상호출</Text>
                </TouchableOpacity>
            </View>

            <DeviceModal
                closeModal={hideModal}
                visible={isModalVisible}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: screenWidth,
        backgroundColor: Color.back,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    menuItem: {
        width: screenWidth * 0.34,
        height: 160,
        backgroundColor: Color.main,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    menuText: {
        color: 'white',
        fontSize: 24,
        marginTop: 10,
        fontWeight: '700',
    },
    ctaButton: {
        width: screenWidth * 0.7,
        backgroundColor: Color.main,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        borderRadius: 8,
    },
    ctaButtonText: {
        fontSize: 22,
        fontWeight: 600,
        color: 'white',
    },
    disconnectedStyle: {
        display: 'none',
    },
});
