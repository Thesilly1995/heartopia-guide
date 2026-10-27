import { Slot } from 'expo-router';

/**
 * Heartopedia heeft overal al eigen navigatie (terug-knoppen, eigen header
 * per scherm) — de originele Expo-sjabloon-tabbalk ("Expo Starter"/Home/Docs)
 * hoort daar niet bij en wordt hier dus niet getoond. `Slot` rendert gewoon
 * de actieve route zonder extra tab-UI eromheen.
 */
export default function AppTabs() {
  return <Slot />;
}
