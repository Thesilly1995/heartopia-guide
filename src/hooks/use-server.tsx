import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

export interface ServerOption {
  id: string;
  label: string;
  /** Vaste UTC-offset in uren van deze server (geen zomer-/wintertijd, game-servers gebruiken een vaste tijdzone). */
  offsetHours: number;
}

export const SERVERS: ServerOption[] = [
  { id: 'global', label: 'Global', offsetHours: 1 },
  { id: 'sea', label: 'Sea', offsetHours: 7 },
  { id: 'twhkmo', label: 'Tw, Hk, Mo', offsetHours: 8 },
  { id: 'america', label: 'America', offsetHours: -5 },
  { id: 'asia', label: 'Asia', offsetHours: 9 },
];

const DEFAULT_SERVER = SERVERS[0];
const STORAGE_KEY = 'heartopia:server';

interface ServerContextValue {
  server: ServerOption;
  setServer: (server: ServerOption) => void;
}

const ServerContext = createContext<ServerContextValue>({
  server: DEFAULT_SERVER,
  setServer: () => {},
});

export function ServerProvider({ children }: { children: ReactNode }) {
  const [server, setServerState] = useState<ServerOption>(DEFAULT_SERVER);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const found = SERVERS.find((s) => s.id === stored);
        if (found) setServerState(found);
      } catch {
        // opslag niet beschikbaar, blijft op standaardserver
      }
    })();
  }, []);

  const setServer = (next: ServerOption) => {
    setServerState(next);
    AsyncStorage.setItem(STORAGE_KEY, next.id).catch(() => {});
  };

  return <ServerContext.Provider value={{ server, setServer }}>{children}</ServerContext.Provider>;
}

export function useServer(): ServerContextValue {
  return useContext(ServerContext);
}
