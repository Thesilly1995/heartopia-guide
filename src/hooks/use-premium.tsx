import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'heartopia:premium:test';

interface PremiumContextValue {
  premium: boolean;
  setPremium: (premium: boolean) => void;
  togglePremium: () => void;
}

const PremiumContext = createContext<PremiumContextValue>({
  premium: false,
  setPremium: () => {},
  togglePremium: () => {},
});

/**
 * Simuleert premium-status zolang er nog geen echte IAP/betaalflow is. Puur
 * lokaal en persistent (AsyncStorage), geen server/account bij betrokken —
 * bedoeld om te testen hoe de app aanvoelt met/zonder premium, niet als
 * echte toegangscontrole.
 */
export function PremiumProvider({ children }: { children: ReactNode }) {
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setPremiumState(stored === 'true');
      } catch {
        // opslag niet beschikbaar, blijft op standaard (geen premium)
      }
    })();
  }, []);

  const setPremium = (next: boolean) => {
    setPremiumState(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? 'true' : 'false').catch(() => {});
  };

  const togglePremium = () => setPremium(!premium);

  return <PremiumContext.Provider value={{ premium, setPremium, togglePremium }}>{children}</PremiumContext.Provider>;
}

export function usePremium(): PremiumContextValue {
  return useContext(PremiumContext);
}
