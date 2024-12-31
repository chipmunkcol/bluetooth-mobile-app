import React from 'react';
// import { authService } from './firebase';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useBLEContext } from './BLEContext';
// import { removeStorage } from './AsyncStorage';
import { AntDesign } from '@expo/vector-icons';
import { Color } from '../styles/color';

// import { colorArray } from './Color';

type Props = {
    title: string;
};

const Customheader = ({ title }: Props) => {
    // const { bleState, setBLEState, disconnectFromDevice } = useBLEContext();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            {/* <TouchableOpacity
                onPress={() => {
                    // removeStorage('autoLogin');
                    // removeStorage('userId');
                    // removeStorage('token');
                    // removeStorage('deviceId');
                    // authService.signOut();
                    // setBLEState((prevBLEState) => ({
                    //     ...prevBLEState,
                    //     login: false,
                    //     loginId: null,
                    // }));
                    // disconnectFromDevice();
                }}
                style={styles.logoutButton}
            >
                <Text style={styles.logoutText}>
                    <AntDesign name="logout" style={{ fontWeight: '900' }} size={25} color="#fff" />
                </Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16, // Adjust as needed
        backgroundColor: Color.main,
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
    },
    logoutButton: {
        position: 'absolute',
        right: 25,
    },
    logoutText: {
        fontWeight: '900',
        color: '#fff',
    },
});

export default Customheader;
