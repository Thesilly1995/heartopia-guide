import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import {
  addPremiumStatusListener,
  getPremiumStatus,
  purchasePremium as purchasePremiumImpl,
  restorePurchases as restorePurchasesImpl,
} from '@/constants/purchases';

const STORAGE_KEY = 'heartopia:premium:test';

interface PremiumContextValue {
  premium: boolean;
  /** __DEV__-only lokale test-schakelaar, los van echte aankopen. */
  setPremium: (premium: boolean) => void;
  togglePremium: () => void;
  purchasing: boolean;
  purchaseError: string | null;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextValue>({
  premium: false,
  setPremium: () => {},
  togglePremium: () => {},
  purchasing: false,
  purchaseError: null,
  purchasePremium: async () => {},
  restorePurchases: async () => {},
});

/**
 * Premium-status = echte RevenueCat-aankoop (`purchasedPremium`) OF, alleen in
 * __DEV__, de lokale test-schakelaar. In gebouwde preview/production-builds
 * (dus ook wat testers gebruiken) is de test-schakelaar altijd uit — daar telt
 * alleen een echte aankoop.
 */
export function PremiumProvider({ children }: { children: ReactNode }) {
  const [purchasedPremium, setPurchasedPremium] = useState(false);
  const [testOverride, setTestOverride] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    getPremiumStatus().then(setPurchasedPremium);
    return addPremiumStatusListener(setPurchasedPremium);
  }, []);

  useEffect(() => {
    if (!__DEV__) return;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setTestOverride(stored === 'true');
      } catch {
        // opslag niet beschikbaar, blijft op standaard (geen premium)
      }
    })();
  }, []);

  const premium = purchasedPremium || (__DEV__ && testOverride);

  const setPremium = (next: boolean) => {
    if (!__DEV__) return;
    setTestOverride(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? 'true' : 'false').catch(() => {});
  };

  const togglePremium = () => setPremium(!testOverride);

  const purchase = async () => {
    setPurchasing(true);
    setPurchaseError(null);
    const { error } = await purchasePremiumImpl();
    setPurchasing(false);
    if (error) setPurchaseError(error);
  };

  const restore = async () => {
    setPurchasing(true);
    setPurchaseError(null);
    const { error, active } = await restorePurchasesImpl();
    setPurchasing(false);
    if (error) setPurchaseError(error);
    if (active) setPurchasedPremium(true);
  };

  return (
    <PremiumContext.Provider
      value={{ premium, setPremium, togglePremium, purchasing, purchaseError, purchasePremium: purchase, restorePurchases: restore }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  return useContext(PremiumContext);
}
