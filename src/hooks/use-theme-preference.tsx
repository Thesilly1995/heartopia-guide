import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'heartopia:theme-override';

interface ThemePreferenceContextValue {
  /** Handmatige override indien gezet door de gebruiker, anders het systeemschema. */
  scheme: ColorScheme;
  setDarkMode: (dark: boolean) => void;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  scheme: 'light',
  setDarkMode: () => {},
});

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverrideState] = useState<ColorScheme | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') setOverrideState(stored);
      } catch {
        // opslag niet beschikbaar, blijft op systeemschema
      }
    })();
  }, []);

  const setDarkMode = (dark: boolean) => {
    const next: ColorScheme = dark ? 'dark' : 'light';
    setOverrideState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const scheme: ColorScheme = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  return <ThemePreferenceContext.Provider value={{ scheme, setDarkMode }}>{children}</ThemePreferenceContext.Provider>;
}

export function useThemePreference(): ThemePreferenceContextValue {
  return useContext(ThemePreferenceContext);
}
