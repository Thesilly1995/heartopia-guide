import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="vissen" />
        <Stack.Screen name="koken" />
        <Stack.Screen name="insecten" />
        <Stack.Screen name="vogels" />
        <Stack.Screen name="tuinieren" />
        <Stack.Screen name="beeldhouwen" />
        <Stack.Screen name="wilde-dieren" />
        <Stack.Screen name="wilde-ingredienten" />
        <Stack.Screen name="huisdieren" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="codes" />
        <Stack.Screen name="events" />
        <Stack.Screen name="missies" />
        <Stack.Screen name="bubbels" />
        <Stack.Screen name="rainbow-meteor" />
        <Stack.Screen name="feedback" />
        <Stack.Screen name="todo" />
        <Stack.Screen name="ocean-cleanup" />
      </Stack>
    </ThemeProvider>
  );
}
