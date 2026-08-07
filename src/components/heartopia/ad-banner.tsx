import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBannerAdUnitId } from '@/constants/ads';
import { usePremium } from '@/hooks/use-premium';

/**
 * Echte AdMob-banner voor iOS/Android (native module — werkt dus alleen in een
 * dev-client/EAS-build, niet in Expo Go). Zie ad-banner.web.tsx voor de
 * web-variant (mock-placeholder, AdMob heeft geen web-implementatie).
 * Verdwijnt zodra de (test-)premium-status aan staat.
 */
export function AdBanner() {
  const { premium } = usePremium();
  const insets = useSafeAreaInsets();
  if (premium) return null;

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom, alignItems: 'center' }}>
      <BannerAd unitId={getBannerAdUnitId()} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
