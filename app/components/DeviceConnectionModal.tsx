import React, { FC, useCallback } from 'react';
import {
    FlatList,
    ListRenderItemInfo,
    Modal,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { Color } from '../styles/color';
import { AntDesign } from '@expo/vector-icons';

type DeviceModalListItemProps = {
    item: ListRenderItemInfo<Device>;
    connectToPeripheral: (device: Device) => void;
    closeModal: () => void;
};

type DeviceModalProps = {
    devices: Device[];
    visible: boolean;
    connectToPeripheral: (device: Device) => void;
    closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
    const { item, connectToPeripheral, closeModal } = props;

    const connectAndCloseModal = useCallback(() => {
        connectToPeripheral(item.item);
        closeModal();
    }, [closeModal, connectToPeripheral, item.item]);

    return (
        <TouchableOpacity onPress={connectAndCloseModal} style={modalStyle.ctaButton}>
            <Text style={modalStyle.ctaButtonText}>{item.item.name ?? item.item.localName}</Text>
        </TouchableOpacity>
    );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
    const { devices, visible, connectToPeripheral, closeModal } = props;

    const renderDeviceModalListItem = useCallback(
        (item: ListRenderItemInfo<Device>) => {
            return (
                <DeviceModalListItem item={item} connectToPeripheral={connectToPeripheral} closeModal={closeModal} />
            );
        },
        [closeModal, connectToPeripheral]
    );

    return (
        <Modal style={modalStyle.modalContainer} animationType="slide" transparent={false} visible={visible}>
            <SafeAreaView style={modalStyle.modalTitle}>
                <View
                    style={{
                        // flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 60,
                        backgroundColor: Color.main,
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '900' }}>장비를 선택해주세요</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        closeModal();
                    }}
                    style={modalStyle.logoutButton}
                >
                    <Text style={modalStyle.logoutText}>
                        <AntDesign name="back" style={{ fontWeight: '900' }} size={25} color="#fff" />
                    </Text>
                </TouchableOpacity>
                <FlatList
                    contentContainerStyle={modalStyle.modalFlatlistContiner}
                    data={devices}
                    renderItem={renderDeviceModalListItem}
                />
            </SafeAreaView>
        </Modal>
    );
};

const modalStyle = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Color.back,
    },
    modalFlatlistContiner: {
        flex: 1,
        justifyContent: 'center',
    },
    modalCellOutline: {
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
    },
    modalTitle: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
    },
    ctaButton: {
        backgroundColor: Color.button,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },

    logoutButton: {
        position: 'absolute',
        right: 25,
        top: 13,
    },
    logoutText: {
        fontWeight: '900',
        color: '#fff',
    },
});

export default DeviceModal;
