// import { Circle, Svg } from 'react-native-svg'; react-native-svg 호환이 안됨
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated, FlatList } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Color } from '@/app/styles/color';
import { useBLEContext } from '../context/bleContext';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Props = {
    value: string;
};

const Item = ({ value }: Props) => {
    return (
        <View
            style={{
                width: screenWidth / 4 - 30,
                height: 140,
                backgroundColor: value === '0' ? '#A4D8E1' : '#005F8C',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 4,
                marginHorizontal: 4,
                borderRadius: 25,
                boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
            }}
        >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>{value}</Text>
        </View>
    );
};

const Sensing = () => {
    const { connectedDevice, BLEData, isBLECharged, toggleCharging } = useBLEContext();
    const dummy = [
        { key: 'sensor1', value: '0' },
        { key: 'sensor2', value: '0' },
        { key: 'sensor3', value: '0' },
        { key: 'sensor4', value: '0' },
        { key: 'sensor5', value: '0' },
        { key: 'sensor6', value: '0' },
        { key: 'sensor7', value: '0' },
        { key: 'sensor8', value: '0' },
        { key: 'sensor9', value: '0' },
        { key: 'sensor10', value: '0' },
        { key: 'sensor11', value: '0' },
        { key: 'sensor12', value: '0' },
        { key: 'sensor13', value: '0' },
        { key: 'sensor14', value: '0' },
        { key: 'sensor15', value: '0' },
        { key: 'sensor16', value: '0' },
    ];

    const [timestamp, setTimestamp] = useState(Date.now());
    const [dummyArray, setDummyArray] = useState(dummy);

    useEffect(() => {
        console.log('BLEData:', BLEData);
        if (BLEData && BLEData?.sensorDatas.length > 0) {
            setDummyArray(BLEData?.sensorDatas);
            setTimestamp(BLEData?.timestamp);
        }
    }, [BLEData]);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.timestamp}>
                {/* <Text>{timestamp}</Text> */}
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 24 }}>
                    <MaterialCommunityIcons name="clock-time-four-outline" size={20} color="#93B5C6" />
                </View>
                <Text style={styles.timestampText}>{timestamp}</Text>
            </View>
            <FlatList
                data={dummyArray}
                numColumns={4}
                keyExtractor={(item) => `센서현황-${item.key}`}
                renderItem={({ item }) => <Item value={item.value} />}
                contentContainerStyle={styles.flatListContent}
            ></FlatList>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: Color.back,
        position: 'relative',
    },
    flatListContent: {
        width: '100%',
        // height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timestamp: {
        display: 'flex',
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 80,
        // paddingTop: 50,
        // paddingBottom: 10,
        paddingRight: 52,
        // paddingLeft: 10,
        backgroundColor: Color.back,
    },
    timestampText: {
        fontSize: 14,
        fontWeight: 600,
        color: '#93B5C6',
    },
    // item: {},
});

export default Sensing;

// borderRadius: 5,
// boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
// boxShadow: '0 1px 2px rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.23)',
// boxShadow: '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)',

// progressContainer: {
//     display: 'flex',
//     width: screenWidth * 0.92,
//     height: screenHeight * 0.55,
//     borderRadius: 25,
//     borderWidth: 5,
//     borderColor: Color.border,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
// },
