import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useServer } from '@/hooks/use-server';
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
  /** Laatste onverwachte fout bij registreren/opslaan (niet bij een normale weigering). */
  error: string | null;
  /** Vraagt permissie (indien nodig) en zet de gegeven categorie aan. */
  enableCategory: (category: NotificationCategory) => Promise<void>;
  disableCategory: (category: NotificationCategory) => Promise<void>;
}

const DEFAULT_ENABLED: Record<NotificationCategory, boolean> = {
  rainbow_meteor: false,
  event: false,
  codes: false,
  cloud_backup_reminder: false,
};

const NotificationsContext = createContext<NotificationsContextValue>({
  token: null,
  enabled: DEFAULT_ENABLED,
  loading: false,
  error: null,
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
      cloud_backup_reminder: parsed.cloud_backup_reminder ?? false,
    };
  } catch {
    return DEFAULT_ENABLED;
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { server } = useServer();
  const [token, setToken] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<NotificationCategory, boolean>>(DEFAULT_ENABLED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Altijd de laatst geselecteerde server bij de hand hebben in syncToSupabase/effects
  // zonder die als dependency te hoeven opnemen (zou anders elke server-wissel een
  // nieuwe syncToSupabase-identiteit geven en de mount-only-effect-logica compliceren).
  const serverRef = useRef(server.id);
  serverRef.current = server.id;

  useEffect(() => {
    (async () => {
      const loaded = await loadEnabled();
      setEnabled(loaded);
      // Als er al eerder een categorie aanstond, permissie is dan al eerder gegeven,
      // dus dit vraagt niks opnieuw uit — wel handig om het token vers te houden
      // (kan wijzigen na een herinstallatie/nieuw toestel).
      const active = ALL_CATEGORIES.filter((category) => loaded[category]);
      if (active.length > 0) {
        const registered = await registerForPushNotificationsAsync();
        if (registered.error) setError(registered.error);
        if (registered.token) {
          setToken(registered.token);
          const saved = await savePushToken(registered.token, active, serverRef.current);
          if (saved.error) setError(saved.error);
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
      const saved = await savePushToken(nextToken, active, serverRef.current);
      if (saved.error) setError(saved.error);
    }
  }, []);

  // Server gewisseld terwijl er al een geregistreerd token is? Dan opnieuw opslaan
  // zodat de Rainbow/meteorenregen-melding voortaan op de nieuwe servertijd vuurt.
  useEffect(() => {
    if (!token) return;
    const active = ALL_CATEGORIES.filter((category) => enabled[category]);
    if (active.length === 0) return;
    savePushToken(token, active, server.id).then((saved) => {
      if (saved.error) setError(saved.error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server.id]);

  const enableCategory = useCallback(
    async (category: NotificationCategory) => {
      setLoading(true);
      setError(null);
      try {
        let activeToken = token;
        if (!activeToken) {
          const registered = await registerForPushNotificationsAsync();
          if (registered.error) setError(registered.error);
          activeToken = registered.token;
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
    <NotificationsContext.Provider value={{ token, enabled, loading, error, enableCategory, disableCategory }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  return useContext(NotificationsContext);
}
