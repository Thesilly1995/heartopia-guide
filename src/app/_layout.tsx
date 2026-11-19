import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AdBanner } from '@/components/heartopia/ad-banner';
import { PlayStoreUpdateModal } from '@/components/heartopia/play-store-update-modal';
import { PremiumLifetimeModal } from '@/components/heartopia/premium-lifetime-modal';
import { PremiumPromoModal } from '@/components/heartopia/premium-promo-modal';
import { ReviewPromptModal } from '@/components/heartopia/review-prompt-modal';
import { UpdateBanner } from '@/components/heartopia/update-banner';
import { initializeAdsIfNeeded } from '@/constants/ads';
import { initializePurchasesIfNeeded } from '@/constants/purchases';
import { AdBannerHeight } from '@/constants/theme';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { usePremium, PremiumProvider } from '@/hooks/use-premium';
import { ServerProvider } from '@/hooks/use-server';
import { markPlayStoreUpdateNoticeShown, shouldShowPlayStoreUpdateNotice } from '@/lib/play-store-update-notice';
import { markPremiumLifetimeNoticeShown, shouldShowPremiumLifetimeNotice } from '@/lib/premium-lifetime-notice';
import { markPremiumPromoShown, shouldShowPremiumPromo } from '@/lib/premium-promo';
import { markReviewPromptShown, shouldShowReviewPrompt } from '@/lib/review-prompt';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    initializeAdsIfNeeded();
    initializePurchasesIfNeeded();
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
  const { premium, isLifetimePremium } = usePremium();
  const [showPremiumPromo, setShowPremiumPromo] = useState(false);
  const promoShownRef = useRef(false);
  const [showLifetimeNotice, setShowLifetimeNotice] = useState(false);
  const lifetimeNoticeShownRef = useRef(false);
  const [showPlayStoreNotice, setShowPlayStoreNotice] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  // Gedeeld tussen alle opstart-popups hieronder, zodat er nooit twee
  // tegelijk verschijnen — wie als eerste "ja" krijgt, wint.
  const anyModalShownRef = useRef(false);

  // Op alle schermen behalve (tabs) is er geen bottom-tab-balk die al ruimte
  // reserveert — zonder insets.bottom hier zou de onderkant van scrollbare
  // inhoud onder de systeem-navigatiebalk (home indicator/gebaren) vallen.
  // Niet-Premium gebruikers krijgen er ook nog AdBannerHeight bij voor de
  // los-zwevende AdBanner (zie ad-banner.tsx), anders tekent die banner over
  // het onderste stuk inhoud heen. Op web is er geen AdBanner (zie
  // ad-banner.web.tsx) en geen systeem-navigatiebalk, dus geen padding nodig.
  const contentPadding = Platform.OS === 'web' ? 0 : insets.bottom + (premium ? 0 : AdBannerHeight);

  // Kleine vertraging zodat de echte (RevenueCat-)premiumstatus tijd heeft om op
  // te halen voordat we beslissen of de promo getoond wordt — anders zou een
  // bestaand Premium-lid 'm nog heel even kunnen zien tijdens het opstarten.
  useEffect(() => {
    if (promoShownRef.current) return;
    const timer = setTimeout(async () => {
      if (anyModalShownRef.current) return;
      const show = await shouldShowPremiumPromo(premium);
      if (show && !anyModalShownRef.current) {
        promoShownRef.current = true;
        anyModalShownRef.current = true;
        setShowPremiumPromo(true);
        markPremiumPromoShown();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [premium]);

  // Zelfde vertraging als bij de promo hierboven, en bewust pas ná die check
  // (via dezelfde 2s-timer) zodat de twee popups elkaar nooit overlappen —
  // een bestaand (vast) Premium-lid komt sowieso nooit in de promo-tak terecht.
  useEffect(() => {
    if (lifetimeNoticeShownRef.current) return;
    const timer = setTimeout(async () => {
      if (anyModalShownRef.current) return;
      const show = await shouldShowPremiumLifetimeNotice(isLifetimePremium);
      if (show && !anyModalShownRef.current) {
        lifetimeNoticeShownRef.current = true;
        anyModalShownRef.current = true;
        setShowLifetimeNotice(true);
        markPremiumLifetimeNoticeShown();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLifetimePremium]);

  // Losstaande, eenmalige meldingen (bv. "update via de Play Store") krijgen
  // voorrang boven de Premium-popups hierboven — vandaar de kortere
  // vertraging en dezelfde `anyModalShownRef`-bescherming.
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (anyModalShownRef.current) return;
      const show = await shouldShowPlayStoreUpdateNotice();
      if (show && !anyModalShownRef.current) {
        anyModalShownRef.current = true;
        setShowPlayStoreNotice(true);
        markPlayStoreUpdateNoticeShown();
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Eigen "vind je de app leuk?"-pop-up, na de andere (belangrijkere,
  // eenmalige) meldingen — zie `src/lib/review-prompt.ts` voor de precieze
  // voorwaarden (pas na een paar keer openen, daarna max. 1x/maand, nooit
  // meer na "Ja").
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (anyModalShownRef.current) return;
      const show = await shouldShowReviewPrompt();
      if (show && !anyModalShownRef.current) {
        anyModalShownRef.current = true;
        setShowReviewPrompt(true);
        markReviewPromptShown();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.webContentWrapper}>
        <AnimatedSplashOverlay />
        <UpdateBanner />
        <PlayStoreUpdateModal visible={showPlayStoreNotice} onClose={() => setShowPlayStoreNotice(false)} />
        <PremiumPromoModal visible={showPremiumPromo} onClose={() => setShowPremiumPromo(false)} />
        <PremiumLifetimeModal visible={showLifetimeNotice} onClose={() => setShowLifetimeNotice(false)} />
        <ReviewPromptModal visible={showReviewPrompt} onClose={() => setShowReviewPrompt(false)} />
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
          <Stack.Screen name="discord" />
        </Stack>
        <AdBanner />
      </View>
    </ThemeProvider>
  );
}

/**
 * Op web rekt de app anders uit over het volle, brede browservenster — dat
 * breekt de mobiel-ontworpen layout (bv. kaart-/kalenderafbeeldingen met
 * `aspectRatio` worden dan lelijk uitgesneden/uitgerekt). Native blijft
 * gewoon de volle (telefoon)breedte gebruiken.
 */
const styles = StyleSheet.create({
  webContentWrapper:
    Platform.OS === 'web' ? { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' } : { flex: 1 },
});
