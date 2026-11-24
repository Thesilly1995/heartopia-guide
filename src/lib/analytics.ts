import { getAnalytics, logAppOpen } from '@react-native-firebase/analytics';

/**
 * Firebase Analytics — gekoppeld aan hetzelfde Firebase-project als de
 * bestaande FCM-push-notificaties (`heartopedia-cadb3`, zie `google-services.json`).
 * Doel: installs/opens van Android én iOS samen in één gratis dashboard zien
 * (Firebase Console → Analytics), i.p.v. los in Play Console en App Store
 * Connect. Zie `docs/firebase-analytics-setup.md` voor de resterende
 * eenmalige setup-stappen (iOS-app toevoegen aan het Firebase-project).
 *
 * Firebase Analytics logt `first_open`/`session_start`/schermweergaves al
 * automatisch, zonder dat de app daar zelf iets voor hoeft te doen — deze
 * module voegt alleen een expliciete `logAppOpen()` toe (voor een duidelijk
 * "app geopend"-event per sessie) en een plek om later eigen events aan toe
 * te voegen (bv. premium-aankoop), mocht dat ooit gewenst zijn.
 *
 * Gebruikt geen advertentie-ID (IDFA/GAID) en valt dus niet onder de
 * bestaande ATT-toestemmingsvraag (`expo-tracking-transparency`, zie
 * `src/constants/ads.ts`) — dat blijft alleen voor AdMob-personalisatie.
 */
export const isAnalyticsConfigured = true;

/** Eenmalig aanroepen bij app-start (native only, zie _layout.tsx + analytics.web.ts). */
export async function initializeAnalyticsIfNeeded() {
  try {
    await logAppOpen(getAnalytics());
  } catch {
    // Geen Firebase-config aanwezig (bv. nog geen GoogleService-Info.plist) — stil laten falen.
  }
}
