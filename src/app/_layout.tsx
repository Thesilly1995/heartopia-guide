import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AdBanner } from '@/components/heartopia/ad-banner';
import { PremiumPromoModal } from '@/components/heartopia/premium-promo-modal';
import { UpdateBanner } from '@/components/heartopia/update-banner';
import { initializeAdsIfNeeded } from '@/constants/ads';
import { initializePurchasesIfNeeded } from '@/constants/purchases';
import { AdBannerHeight } from '@/constants/theme';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { usePremium, PremiumProvider } from '@/hooks/use-premium';
import { ServerProvider } from '@/hooks/use-server';
import { markPremiumPromoShown, shouldShowPremiumPromo } from '@/lib/premium-promo';
import { maybeRequestReview } from '@/lib/store-review';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initializeAdsIfNeeded();
    initializePurchasesIfNeeded();
    maybeRequestReview();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ServerProvider>
          <PremiumProvider>
            <AuthProvider>
              <NotificationsProvider>
                <AppContent />
              </NotificationsProvider>
            </AuthProvider>
          </PremiumProvider>
        </ServerProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { premium } = usePremium();
  const [showPremiumPromo, setShowPremiumPromo] = useState(false);
  const promoShownRef = useRef(false);

  // Op alle schermen behalve (tabs) is er geen bottom-tab-balk die al ruimte
  // reserveert voor de los-zwevende AdBanner (zie ad-banner.tsx) — zonder deze
  // padding tekent de banner over het onderste stuk scrollbare inhoud heen.
  const contentPadding = premium ? 0 : insets.bottom + AdBannerHeight;

  // Kleine vertraging zodat de echte (RevenueCat-)premiumstatus tijd heeft om op
  // te halen voordat we beslissen of de promo getoond wordt — anders zou een
  // bestaand Premium-lid 'm nog heel even kunnen zien tijdens het opstarten.
  useEffect(() => {
    if (promoShownRef.current) return;
    const timer = setTimeout(async () => {
      const show = await shouldShowPremiumPromo(premium);
      if (show) {
        promoShownRef.current = true;
        setShowPremiumPromo(true);
        markPremiumPromoShown();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [premium]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <UpdateBanner />
      <PremiumPromoModal visible={showPremiumPromo} onClose={() => setShowPremiumPromo(false)} />
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
