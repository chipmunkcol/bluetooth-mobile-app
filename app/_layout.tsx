import { Stack } from 'expo-router/stack';
import { BLEProvider } from './context/bleContext';

export default function Layout() {
    return (
        <BLEProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </BLEProvider>
    );
}
