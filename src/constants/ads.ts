import { Platform } from 'react-native';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds, { TestIds } from 'react-native-google-mobile-ads';

/**
 * Vul hier de echte banner-ad-unit-ID's in zodra ze in de AdMob-console zijn
 * aangemaakt (los per platform, AdMob geeft aparte ID's voor Android/iOS).
 * `ios` mag leeg blijven zolang er geen Apple Developer-account is (zie
 * docs/admob-setup.md) — die kant valt dan vanzelf terug op de test-ID.
 * Nooit eigen echte ID's tonen tijdens ontwikkelen/testen (__DEV__), dat kan
 * een AdMob-account door "invalid traffic" laten blokkeren.
 */
const PRODUCTION_BANNER_AD_UNIT_ID: { android: string | null; ios: string | null } = {
  android: 'ca-app-pub-4511788652457861/5234614952',
  ios: 'ca-app-pub-4511788652457861/9419769918',
};

export function getBannerAdUnitId(): string {
  if (__DEV__) return TestIds.BANNER;
  const id = Platform.OS === 'ios' ? PRODUCTION_BANNER_AD_UNIT_ID.ios : PRODUCTION_BANNER_AD_UNIT_ID.android;
  return id ?? TestIds.BANNER;
}

/**
 * Eenmalig aanroepen bij app-start (native only, zie _layout.tsx + ads.web.ts).
 * Op iOS eerst (indien nog niet gevraagd) om ATT-toestemming vragen — AdMob
 * valt vanzelf terug op niet-gepersonaliseerde advertenties als dit geweigerd
 * of nog niet beantwoord is.
 */
export async function initializeAdsIfNeeded() {
  if (Platform.OS === 'ios') {
    const { status } = await getTrackingPermissionsAsync();
    if (status === 'undetermined') await requestTrackingPermissionsAsync();
  }
  mobileAds().initialize();
}
