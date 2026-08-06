import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useBubbleLocations } from '@/data/bubble-locations';

const STORAGE_KEY = 'heartopia:bubbels:vinkjes';

export interface BubblesProgress {
  done: number;
  total: number;
}

/** Voortgang van de wekelijkse Bubbels-vinkjes, voor het statuskaartje op het homescreen. */
export function useBubblesProgress(): BubblesProgress {
  const total = useBubbleLocations().length;
  const [done, setDone] = useState(0);

  const refresh = useCallback(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const checked = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
        setDone(Object.values(checked).filter(Boolean).length);
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

  return { done, total };
}
