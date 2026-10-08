import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOWN_KEY = 'heartopia:premium-lifetime-notice:shown';

/**
 * Eenmalige (ooit, niet per week/zondag) melding voor bestaande kopers van de
 * oude eenmalige Premium-aankoop: legt uit dat Premium nu een abonnement is
 * voor nieuwe leden, maar dat hun eigen aankoop voor altijd blijft werken.
 */
export async function shouldShowPremiumLifetimeNotice(isLifetimePremium: boolean): Promise<boolean> {
  if (!isLifetimePremium) return false;
  try {
    const shown = await AsyncStorage.getItem(SHOWN_KEY);
    return shown !== 'true';
  } catch {
    return false;
  }
}

export async function markPremiumLifetimeNoticeShown() {
  try {
    await AsyncStorage.setItem(SHOWN_KEY, 'true');
  } catch {
    // opslaan mislukt — in het ergste geval verschijnt de melding nog een keer
  }
}
