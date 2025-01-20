import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="favourite" options={{ title: 'Library' }} />
            <Stack.Screen name="playlist" options={{ title: 'Details' }} />
            <Stack.Screen name="downloads" options={{ title: 'Downloads' }} />
        </Stack>
    );
}