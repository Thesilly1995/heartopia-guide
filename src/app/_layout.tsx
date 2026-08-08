import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-url-polyfill/auto';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AdBanner } from '@/components/heartopia/ad-banner';
import { initializeAdsIfNeeded } from '@/constants/ads';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { PremiumProvider } from '@/hooks/use-premium';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    initializeAdsIfNeeded();
  }, []);
  return (
    <LanguageProvider>
      <PremiumProvider>
        <AuthProvider>
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
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="cloud-save" />
            </Stack>
            <AdBanner />
          </ThemeProvider>
        </AuthProvider>
      </PremiumProvider>
    </LanguageProvider>
  );
}
