import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SHOWN_KEY = 'heartopia:premium-promo:lastShownDate';

/**
 * Bepaalt of de Premium-promotiepopup getoond moet worden: hooguit 1x per
 * week, op zondag (lokale toestel-tijd — dit is reclame, geen spelmechaniek,
 * dus bewust niet gekoppeld aan servertijd). Nooit voor bestaande
 * Premium-leden.
 */
export async function shouldShowPremiumPromo(premium: boolean): Promise<boolean> {
  if (premium) return false;
  if (new Date().getDay() !== 0) return false;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const lastShown = await AsyncStorage.getItem(LAST_SHOWN_KEY);
    return lastShown !== today;
  } catch {
    return false;
  }
}

export async function markPremiumPromoShown() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(LAST_SHOWN_KEY, today);
  } catch {
    // opslaan mislukt — in het ergste geval verschijnt de popup nog een keer deze zondag
  }
}
