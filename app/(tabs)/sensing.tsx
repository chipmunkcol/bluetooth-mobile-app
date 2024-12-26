import React, { useEffect, useState, useMemo, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Color } from '@/app/styles/color';
import { useBLEContext } from '../context/bleContext';
// import { Circle, Svg } from 'react-native-svg'; react-native-svg 호환이 안됨
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Sensing = () => {
    const { connectedDevice, BLEData, isBLECharged, toggleCharging } = useBLEContext();

    const [labels, setLabels] = useState([
        { name: 'Status', unit: '0' },
        { name: 'Voltage', unit: '0' },
        { name: 'Current', unit: '0' },
        { name: 'Frequency', unit: '0' },
        { name: 'Power', unit: '0' },
        { name: 'Factor', unit: '0' },
    ]);

    useEffect(() => {
        if (!BLEData.timeStamp) return;
        const { timeStamp, status, voltage, current, frequency, power, factor } = BLEData;
        const newLabels = [
            { name: 'Status', unit: status },
            { name: 'Voltage', unit: voltage },
            { name: 'Current', unit: current },
            { name: 'Frequency', unit: frequency },
            { name: 'Power', unit: power },
            { name: 'Factor', unit: factor },
        ];
        setLabels(newLabels);
    }, [BLEData]);

    const resetLabels = () => {
        setLabels([
            { name: 'Status', unit: '0' },
            { name: 'Voltage', unit: '0' },
            { name: 'Current', unit: '0' },
            { name: 'Frequency', unit: '0' },
            { name: 'Power', unit: '0' },
            { name: 'Factor', unit: '0' },
        ]);
    };
    useEffect(() => {
        if (!connectedDevice) {
            resetLabels();
        }
    }, [connectedDevice]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text>충전 내역 모니터링</Text>
            </View>

            <View style={styles.progressContainer2}>
                <View style={styles.circle}>
                    <View style={styles.innerCircle}>
                        {isBLECharged ? (
                            <TouchableOpacity onPress={() => toggleCharging(connectedDevice)}>
                                <FontAwesome6 name="pause" size={50} color="red" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => toggleCharging(connectedDevice)}>
                                <AntDesign name="caretright" size={50} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={styles.horizontalContainers}>
                    {labels.map((label, index) => (
                        <View key={index} style={styles.flexhor}>
                            <View style={styles.labelwrap}>
                                <Text style={styles.label}>{label.name}</Text>
                            </View>
                            <View style={styles.labelvaluewrap}>
                                <Text style={styles.labelvalue}>{label.unit}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: screenHeight,
        backgroundColor: Color.back,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        width: screenWidth * 0.9,
        borderRadius: 30,
        borderWidth: 5,
        borderColor: Color.border,
        overflow: 'hidden',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 5,
        height: screenHeight * 0.37,
    },

    circle: {
        width: 130,
        height: 130,
        borderRadius: '50%',
        borderColor: '#D3D3D3',
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 107,
        height: 107,
        borderRadius: '50%',
        borderColor: '#D3D3D3',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pabsolute: {
        width: screenWidth * 0.65,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    progressContainer2: {
        flexDirection: 'row',
        width: screenWidth * 0.9,
        borderRadius: 30,
        borderWidth: 5,
        borderColor: Color.border,
        overflow: 'hidden',
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'space-around',
        justifyContent: 'center',
        gap: 20,
        position: 'relative',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: screenHeight * 0.37,
    },
    horizontalContainers: {
        // width: 144,
    },
    flexhor: {
        width: 170,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: Color.main,
        borderRadius: 10,
        height: 38,
    },
    labelwrap: {
        backgroundColor: Color.main,
        // padding: 1,
        height: 40,
        width: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '800',
        // textAlign: 'center',
        color: '#fff',
        // height: 40,
        // lineHeight: 40,
    },
    labelvaluewrap: {
        // padding: 2,
        width: 70,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
    },
    labelvalue: {
        fontSize: 14,
        fontWeight: '900',
        color: '#828282',
        // textAlign: 'center',
        // justifyContent: 'flex-end',
        // width: 30,
        // height: 40,
        // lineHeight: 40,
    },
});

export default Sensing;
