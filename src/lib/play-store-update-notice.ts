import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SHOWN_KEY = 'heartopia:playstore-update-notice:shown';

/**
 * Eenmalige (ooit) popup die Android-gebruikers vraagt te updaten via de Play
 * Store — ingezet na de versie 29-crash (dependency-mismatch), omdat nog niet
 * iedereen is overgestapt naar versie 30. Alleen Android: dit speelde niet op
 * iOS. Puur JS/AsyncStorage, dus veilig als OTA-update ook voor toestellen die
 * nog op de oude (crashende) native build zitten.
 */
export async function shouldShowPlayStoreUpdateNotice(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    const shown = await AsyncStorage.getItem(SHOWN_KEY);
    return shown !== 'true';
  } catch {
    return false;
  }
}

export async function markPlayStoreUpdateNoticeShown() {
  try {
    await AsyncStorage.setItem(SHOWN_KEY, 'true');
  } catch {
    // opslaan mislukt — in het ergste geval verschijnt de melding nog een keer
  }
}
