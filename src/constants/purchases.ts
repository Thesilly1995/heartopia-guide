import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';

/**
 * Vul hier de echte RevenueCat public API-key in zodra je die uit het
 * RevenueCat-dashboard hebt (Project settings → API keys → Google Play).
 * Zonder deze key blijft premium/aankopen uitgeschakeld — de app werkt dan
 * gewoon door, alleen zonder echte aankoopfunctionaliteit.
 */
const REVENUECAT_API_KEY_ANDROID = 'goog_EUKxUeYsehsTVrungKGTngsqfyw';
const REVENUECAT_API_KEY_IOS = '';

/** Entitlement-identifier zoals aangemaakt in het RevenueCat-dashboard. */
export const PREMIUM_ENTITLEMENT_ID = 'premium';

/**
 * Welk abonnement-package in de RevenueCat-offering gekozen wordt. Moet in de
 * offering als "Monthly" resp. "Annual" package-type geconfigureerd zijn (zie
 * docs/revenuecat-subscriptions-setup.md) — beide wijzen naar dezelfde
 * `PREMIUM_ENTITLEMENT_ID`, dus bestaande (eenmalige) kopers blijven via hun
 * oude aankoop gewoon premium, ongeacht welk plan hier gekozen wordt.
 */
export type PremiumPlan = 'monthly' | 'annual';

export interface PremiumPackagePrices {
  monthly: string | null;
  annual: string | null;
}

export interface PremiumStatus {
  active: boolean;
  /** True bij een niet-verlopende (eenmalige) aankoop — `expirationDate` is dan `null`. */
  isLifetime: boolean;
}

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

function computePremiumStatus(info: CustomerInfo): PremiumStatus {
  const entitlement = info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  return {
    active: Boolean(entitlement),
    isLifetime: Boolean(entitlement) && entitlement.expirationDate === null,
  };
}

export async function getPremiumStatus(): Promise<PremiumStatus> {
  if (!isPurchasesConfigured) return { active: false, isLifetime: false };
  try {
    const info = await Purchases.getCustomerInfo();
    return computePremiumStatus(info);
  } catch {
    return { active: false, isLifetime: false };
  }
}

/** Roept `onChange` aan telkens als de aankoopstatus wijzigt. Geeft een unsubscribe-functie terug. */
export function addPremiumStatusListener(onChange: (status: PremiumStatus) => void): () => void {
  if (!isPurchasesConfigured) return () => {};
  const listener = (info: CustomerInfo) => onChange(computePremiumStatus(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}

/** Haalt de echte, gelokaliseerde prijzen op van de Play Store zelf (bv. "€3,00" / "€30,00"). */
export async function getPremiumPackagePrices(): Promise<PremiumPackagePrices> {
  if (!isPurchasesConfigured) return { monthly: null, annual: null };
  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;
    return {
      monthly: offering?.monthly?.product.priceString ?? null,
      annual: offering?.annual?.product.priceString ?? null,
    };
  } catch {
    return { monthly: null, annual: null };
  }
}

export async function purchasePremium(plan: PremiumPlan): Promise<{ error: string | null; cancelled: boolean }> {
  if (!isPurchasesConfigured) return { error: 'not_configured', cancelled: false };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = plan === 'annual' ? offerings.current?.annual : offerings.current?.monthly;
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
