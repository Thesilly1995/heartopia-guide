/**
 * Web-variant: er bestaat geen AdMob-implementatie voor web, dus deze functies
 * zijn no-ops. Metro kiest dit bestand automatisch i.p.v. ads.ts op web, zodat
 * de native-only "react-native-google-mobile-ads"-package hier nooit gebundeld
 * wordt (zie ad-banner.web.tsx voor de bijbehorende mock-banner).
 */
export function getBannerAdUnitId(): string {
  return '';
}

export function initializeAdsIfNeeded() {
  // Geen actie op web.
}
