import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AdBanner } from '@/components/heartopia/ad-banner';
import { UpdateBanner } from '@/components/heartopia/update-banner';
import { initializeAdsIfNeeded } from '@/constants/ads';
import { initializePurchasesIfNeeded } from '@/constants/purchases';
import { AdBannerHeight } from '@/constants/theme';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { usePremium, PremiumProvider } from '@/hooks/use-premium';
import { maybeRequestReview } from '@/lib/store-review';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initializeAdsIfNeeded();
    initializePurchasesIfNeeded();
    maybeRequestReview();
  }, []);
  return (
    <LanguageProvider>
      <PremiumProvider>
        <AuthProvider>
          <NotificationsProvider>
            <AppContent />
          </NotificationsProvider>
        </AuthProvider>
      </PremiumProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { premium } = usePremium();

  // Op alle schermen behalve (tabs) is er geen bottom-tab-balk die al ruimte
  // reserveert voor de los-zwevende AdBanner (zie ad-banner.tsx) — zonder deze
  // padding tekent de banner over het onderste stuk scrollbare inhoud heen.
  const contentPadding = premium ? 0 : insets.bottom + AdBannerHeight;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <UpdateBanner />
      <Stack screenOptions={{ headerShown: false, contentStyle: { paddingBottom: contentPadding } }}>
        <Stack.Screen name="(tabs)" options={{ contentStyle: { paddingBottom: 0 } }} />
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
        <Stack.Screen name="meldingen" />
        <Stack.Screen name="tips" />
      </Stack>
      <AdBanner />
    </ThemeProvider>
  );
}
