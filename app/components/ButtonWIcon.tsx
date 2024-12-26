import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Color } from '../styles/color';

type Props = {
    label: string;
    onPress?: () => void;
};

export default function ButtonWIcon({ label, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <View>
                    <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
                </View>
                <View>
                    <Text style={styles.buttonLabel}>{label}</Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '50%',
        height: 150,
        // width: 280,
        // height: 68,
        // marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        backgroundColor: Color.main,
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
