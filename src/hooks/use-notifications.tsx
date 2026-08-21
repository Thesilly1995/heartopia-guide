import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import {
  ALL_CATEGORIES,
  deletePushToken,
  NotificationCategory,
  registerForPushNotificationsAsync,
  savePushToken,
} from '@/lib/push-notifications';

const STORAGE_KEY = 'heartopia:meldingen:categorieen';

interface NotificationsContextValue {
  /** null = nog niet geregistreerd (permissie nog niet gevraagd of geweigerd). */
  token: string | null;
  enabled: Record<NotificationCategory, boolean>;
  loading: boolean;
  /** Vraagt permissie (indien nodig) en zet de gegeven categorie aan. */
  enableCategory: (category: NotificationCategory) => Promise<void>;
  disableCategory: (category: NotificationCategory) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  token: null,
  enabled: { rainbow_meteor: false, event: false, codes: false },
  loading: false,
  enableCategory: async () => {},
  disableCategory: async () => {},
});

async function loadEnabled(): Promise<Record<NotificationCategory, boolean>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Record<NotificationCategory, boolean>>) : {};
    return {
      rainbow_meteor: parsed.rainbow_meteor ?? false,
      event: parsed.event ?? false,
      codes: parsed.codes ?? false,
    };
  } catch {
    return { rainbow_meteor: false, event: false, codes: false };
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<NotificationCategory, boolean>>({
    rainbow_meteor: false,
    event: false,
    codes: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadEnabled();
      setEnabled(loaded);
      // Als er al eerder een categorie aanstond, permissie is dan al eerder gegeven,
      // dus dit vraagt niks opnieuw uit — wel handig om het token vers te houden
      // (kan wijzigen na een herinstallatie/nieuw toestel).
      const active = ALL_CATEGORIES.filter((category) => loaded[category]);
      if (active.length > 0) {
        const activeToken = await registerForPushNotificationsAsync();
        if (activeToken) {
          setToken(activeToken);
          await savePushToken(activeToken, active);
        }
      }
    })();
  }, []);

  const syncToSupabase = useCallback(async (nextToken: string | null, nextEnabled: Record<NotificationCategory, boolean>) => {
    if (!nextToken) return;
    const active = ALL_CATEGORIES.filter((category) => nextEnabled[category]);
    if (active.length === 0) {
      await deletePushToken(nextToken);
    } else {
      await savePushToken(nextToken, active);
    }
  }, []);

  const enableCategory = useCallback(
    async (category: NotificationCategory) => {
      setLoading(true);
      try {
        let activeToken = token;
        if (!activeToken) {
          activeToken = await registerForPushNotificationsAsync();
          setToken(activeToken);
        }
        const nextEnabled = { ...enabled, [category]: true };
        setEnabled(nextEnabled);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextEnabled));
        await syncToSupabase(activeToken, nextEnabled);
      } finally {
        setLoading(false);
      }
    },
    [token, enabled, syncToSupabase]
  );

  const disableCategory = useCallback(
    async (category: NotificationCategory) => {
      setLoading(true);
      try {
        const nextEnabled = { ...enabled, [category]: false };
        setEnabled(nextEnabled);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextEnabled));
        await syncToSupabase(token, nextEnabled);
      } finally {
        setLoading(false);
      }
    },
    [token, enabled, syncToSupabase]
  );

  return (
    <NotificationsContext.Provider value={{ token, enabled, loading, enableCategory, disableCategory }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  return useContext(NotificationsContext);
}
