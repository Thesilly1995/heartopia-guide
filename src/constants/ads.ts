import { Platform } from 'react-native';
import mobileAds, { TestIds } from 'react-native-google-mobile-ads';

/**
 * Vul hier de echte banner-ad-unit-ID's in zodra ze in de AdMob-console zijn
 * aangemaakt (los per platform, AdMob geeft aparte ID's voor Android/iOS).
 * Tot die tijd blijft dit `null` en valt de app terug op Google's officiële
 * test-ID's (__DEV__) — nooit eigen echte ID's tonen tijdens ontwikkelen/testen,
 * dat kan een AdMob-account door "invalid traffic" laten blokkeren.
 */
const PRODUCTION_BANNER_AD_UNIT_ID: { android: string; ios: string } | null = null;

export function getBannerAdUnitId(): string {
  if (__DEV__ || !PRODUCTION_BANNER_AD_UNIT_ID) return TestIds.BANNER;
  return Platform.OS === 'ios' ? PRODUCTION_BANNER_AD_UNIT_ID.ios : PRODUCTION_BANNER_AD_UNIT_ID.android;
}

/** Eenmalig aanroepen bij app-start (native only, zie _layout.tsx + ads.web.ts). */
export function initializeAdsIfNeeded() {
  mobileAds().initialize();
}
