import { usePathname } from 'expo-router';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBannerAdUnitId } from '@/constants/ads';
import { BottomTabInset } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';

const TAB_SCREEN_PATHS = new Set(['/']);

/**
 * Echte AdMob-banner voor iOS/Android (native module — werkt dus alleen in een
 * dev-client/EAS-build, niet in Expo Go). Zie ad-banner.web.tsx voor de
 * web-variant (mock-placeholder, AdMob heeft geen web-implementatie).
 * Verdwijnt zodra de (test-)premium-status aan staat.
 *
 * Op Home zit onderin ook de native tab-balk (`NativeTabs`, zie
 * app-tabs.tsx) — die reserveert geen ruimte voor deze los-zwevende banner,
 * dus zonder extra offset zou de banner er overheen tekenen en de tab-balk
 * onbereikbaar maken. `BottomTabInset` (constants/theme.ts) is de bestaande,
 * al elders in de app gebruikte schatting van die tab-balk-hoogte.
 */
export function AdBanner() {
  const { premium } = usePremium();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  if (premium) return null;

  const bottom = insets.bottom + (TAB_SCREEN_PATHS.has(pathname) ? BottomTabInset : 0);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom, alignItems: 'center' }}>
      <BannerAd unitId={getBannerAdUnitId()} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
