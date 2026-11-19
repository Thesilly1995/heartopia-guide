import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const OPTED_OUT_KEY = 'heartopia:review-prompt:optedOut';
const LAST_SHOWN_KEY = 'heartopia:review-prompt:lastShown';
const OPEN_COUNT_KEY = 'heartopia:review-prompt:openCount';
const OPENS_BEFORE_FIRST_PROMPT = 5;
const DAYS_BETWEEN_PROMPTS = 30;

/**
 * Eigen pop-up die (na een paar keer gebruik, daarna max. 1x/maand) vraagt of
 * iemand de app leuk vindt, met een "Ja"/"Niet nu"-keuze. Bij "Ja" wordt de
 * native Play Store-beoordelingsdialoog geopend én wordt deze pop-up nooit
 * meer getoond. Google/Apple laten een app nooit weten of er ook écht een
 * review is geplaatst (bewust zo, om misbruik na een lage score te
 * voorkomen) — "opgehouden met vragen na een review" is dus gebaseerd op de
 * eigen "Ja"-keuze van de gebruiker, niet op een geverifieerde review.
 *
 * Vervangt de oude eenmalige, stille `maybeRequestReview()`-aanroep (zie
 * `store-review.ts`) — die wordt niet meer vanuit `_layout.tsx` aangeroepen,
 * om te voorkomen dat gebruikers zowel die stille eenmalige vraag als deze
 * maandelijkse pop-up krijgen.
 */
export async function shouldShowReviewPrompt(): Promise<boolean> {
  if (__DEV__) return false;
  try {
    const optedOut = await AsyncStorage.getItem(OPTED_OUT_KEY);
    if (optedOut === 'true') return false;

    const raw = await AsyncStorage.getItem(OPEN_COUNT_KEY);
    const count = (raw ? parseInt(raw, 10) : 0) + 1;
    await AsyncStorage.setItem(OPEN_COUNT_KEY, String(count));
    if (count < OPENS_BEFORE_FIRST_PROMPT) return false;

    const lastShownRaw = await AsyncStorage.getItem(LAST_SHOWN_KEY);
    if (lastShownRaw) {
      const daysSince = (Date.now() - new Date(lastShownRaw).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < DAYS_BETWEEN_PROMPTS) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function markReviewPromptShown() {
  try {
    await AsyncStorage.setItem(LAST_SHOWN_KEY, new Date().toISOString());
  } catch {
    // opslaan mislukt — in het ergste geval verschijnt de pop-up iets te vroeg weer
  }
}

/** Aanroepen zodra iemand op "Ja" tikt — stopt de maandelijkse pop-up voorgoed. */
export async function markReviewPromptOptedOut() {
  try {
    await AsyncStorage.setItem(OPTED_OUT_KEY, 'true');
  } catch {
    // opslaan mislukt — in het ergste geval wordt er een keer te veel gevraagd
  }
}

export async function requestNativeReview() {
  try {
    const available = await StoreReview.isAvailableAsync();
    if (available) await StoreReview.requestReview();
  } catch {
    // geen internet, of API niet beschikbaar — gewoon stil laten falen
  }
}
