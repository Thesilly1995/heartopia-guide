/**
 * Web-variant: er bestaat geen RevenueCat/Play Billing-implementatie voor web,
 * dus deze functies zijn no-ops. Metro kiest dit bestand automatisch i.p.v.
 * purchases.ts op web, zodat de native-only "react-native-purchases"-package
 * hier nooit gebundeld wordt.
 */
export const PREMIUM_ENTITLEMENT_ID = 'premium';
export const isPurchasesConfigured = false;

export type PremiumPlan = 'monthly' | 'annual';

export interface PremiumPackagePrices {
  monthly: string | null;
  annual: string | null;
}

export function initializePurchasesIfNeeded() {
  // Geen actie op web.
}

export async function getPremiumStatus(): Promise<boolean> {
  return false;
}

export function addPremiumStatusListener(_onChange: (active: boolean) => void): () => void {
  return () => {};
}

export async function getPremiumPackagePrices(): Promise<PremiumPackagePrices> {
  return { monthly: null, annual: null };
}

export async function purchasePremium(_plan: PremiumPlan): Promise<{ error: string | null; cancelled: boolean }> {
  return { error: 'not_configured', cancelled: false };
}

export async function restorePurchases(): Promise<{ error: string | null; active: boolean }> {
  return { error: 'not_configured', active: false };
}
