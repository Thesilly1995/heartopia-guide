import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';

/**
 * Vul hier de echte RevenueCat public API-key in zodra je die uit het
 * RevenueCat-dashboard hebt (Project settings → API keys → Google Play).
 * Zonder deze key blijft premium/aankopen uitgeschakeld — de app werkt dan
 * gewoon door, alleen zonder echte aankoopfunctionaliteit.
 */
const REVENUECAT_API_KEY_ANDROID = '';
const REVENUECAT_API_KEY_IOS = '';

/** Entitlement-identifier zoals aangemaakt in het RevenueCat-dashboard. */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

export const isPurchasesConfigured = Boolean(Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID);

/** Eenmalig aanroepen bij app-start (native only, zie _layout.tsx + purchases.web.ts). */
export function initializePurchasesIfNeeded() {
  if (!isPurchasesConfigured) return;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  Purchases.configure({ apiKey });
}

function isPremiumActive(info: CustomerInfo): boolean {
  return typeof info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== 'undefined';
}

export async function getPremiumStatus(): Promise<boolean> {
  if (!isPurchasesConfigured) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return isPremiumActive(info);
  } catch {
    return false;
  }
}

/** Roept `onChange` aan telkens als de aankoopstatus wijzigt. Geeft een unsubscribe-functie terug. */
export function addPremiumStatusListener(onChange: (active: boolean) => void): () => void {
  if (!isPurchasesConfigured) return () => {};
  const listener = (info: CustomerInfo) => onChange(isPremiumActive(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}

/** Haalt de echte, gelokaliseerde prijs op van de Play Store zelf (bv. "€4,99"). */
export async function getPremiumPrice(): Promise<string | null> {
  if (!isPurchasesConfigured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    return pkg?.product.priceString ?? null;
  } catch {
    return null;
  }
}

export async function purchasePremium(): Promise<{ error: string | null; cancelled: boolean }> {
  if (!isPurchasesConfigured) return { error: 'not_configured', cancelled: false };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) return { error: 'no_package', cancelled: false };
    await Purchases.purchasePackage(pkg);
    return { error: null, cancelled: false };
  } catch (err) {
    const cancelled = Boolean((err as { userCancelled?: boolean })?.userCancelled);
    return { error: cancelled ? null : String((err as Error)?.message ?? err), cancelled };
  }
}

export async function restorePurchases(): Promise<{ error: string | null; active: boolean }> {
  if (!isPurchasesConfigured) return { error: 'not_configured', active: false };
  try {
    const info = await Purchases.restorePurchases();
    return { error: null, active: isPremiumActive(info) };
  } catch (err) {
    return { error: String((err as Error)?.message ?? err), active: false };
  }
}
