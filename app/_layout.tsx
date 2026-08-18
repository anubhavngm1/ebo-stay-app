import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="package/[id]" />
          <Stack.Screen name="hotel/[id]" />
          <Stack.Screen name="hotels" />
          <Stack.Screen name="booking/dates" />
          <Stack.Screen name="booking/details" />
          <Stack.Screen name="booking/payment" />
          <Stack.Screen name="booking/confirmed" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
