import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const OPEN_COUNT_KEY = 'heartopia:review:openCount';
const REQUESTED_KEY = 'heartopia:review:requested';
const OPENS_BEFORE_REQUEST = 5;

/**
 * Vraagt één keer om een app-store-beoordeling, na een paar keer gebruik
 * (niet meteen bij de eerste keer openen). Gebruikt Google's native In-App
 * Review-dialoog — die werkt al zodra de app via een Play Store-track is
 * geïnstalleerd (ook Gesloten test), niet pas na productie-lancering. Google
 * beperkt zelf hoe vaak de dialoog écht getoond wordt, maar wij vragen het
 * hoe dan ook maar één keer aan.
 */
export async function maybeRequestReview() {
  if (__DEV__) return;
  try {
    const requested = await AsyncStorage.getItem(REQUESTED_KEY);
    if (requested === 'true') return;

    const raw = await AsyncStorage.getItem(OPEN_COUNT_KEY);
    const count = (raw ? parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(OPEN_COUNT_KEY, String(count));
    if (count < OPENS_BEFORE_REQUEST) return;

    const available = await StoreReview.isAvailableAsync();
    if (!available) return;

    await AsyncStorage.setItem(REQUESTED_KEY, 'true');
    await StoreReview.requestReview();
  } catch {
    // geen internet, of API niet beschikbaar — gewoon stil laten falen
  }
}
