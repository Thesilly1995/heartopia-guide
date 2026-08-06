import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const STORAGE_KEY = 'heartopia:missies:vinkjes';

// Zelfde sleutels als de dagelijkse missielijst in src/app/missies.tsx (DAILY).
const DAILY_KEYS = ['d0', 'd1', 'd3', 'd4', 'd6', 'd7', 'd10', 'd11', 'd12', 'd13', 'd14'];

export interface MissionsProgress {
  done: number;
  total: number;
}

/** Voortgang van de dagelijkse missies, voor het statuskaartje op het homescreen. */
export function useMissionsProgress(): MissionsProgress {
  const [done, setDone] = useState(0);

  const refresh = useCallback(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const checked = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        setDone(DAILY_KEYS.filter((key) => checked[key]).length);
      } catch {
        setDone(0);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return { done, total: DAILY_KEYS.length };
}
