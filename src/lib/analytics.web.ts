/**
 * Web-variant: Firebase Analytics via `@react-native-firebase/analytics` is
 * native-only, dus hier een no-op. Metro kiest dit bestand automatisch i.p.v.
 * analytics.ts op web, zodat de native-only package hier nooit gebundeld wordt.
 */
export const isAnalyticsConfigured = false;

export async function initializeAnalyticsIfNeeded() {
  // Geen actie op web.
}
