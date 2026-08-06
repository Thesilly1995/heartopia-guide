import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { useBirds } from '@/data/birds';
import { useCrops } from '@/data/crops';
import { useFish } from '@/data/fish';
import { useFlowers } from '@/data/flowers';
import { useInsects } from '@/data/insects';
import { useRecipes } from '@/data/recipes';
import { useSandSculptures } from '@/data/sand-sculptures';
import { useShells } from '@/data/shells';
import { useSnowSculptures } from '@/data/snow-sculptures';
import { useLanguage } from '@/hooks/use-language';

export interface CatalogProgressEntry {
  key: string;
  href: string;
  icon: string;
  title: string;
  mastered: number;
  total: number;
}

interface CatalogDef {
  key: string;
  href: string;
  icon: string;
  title: { nl: string; en: string };
  total: number;
  masteryKeys: string[];
}

async function countMastered(keys: string[]): Promise<number> {
  const rawValues = await Promise.all(keys.map((key) => AsyncStorage.getItem(key)));
  return rawValues.reduce((sum, raw) => {
    if (!raw) return sum;
    try {
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      return sum + Object.values(parsed).filter(Boolean).length;
    } catch {
      return sum;
    }
  }, 0);
}

/**
 * Voortgang (mastery-vinkjes) per catalogus, voor het premium voortgangsdashboard.
 * Leest dezelfde AsyncStorage-sleutels als de losse hobby-schermen zelf gebruiken
 * (`heartopia:<storageKey>:mastery`), dus er is geen aparte opslag nodig — dit
 * telt alleen bij elkaar op wat al lokaal staat. Ververst bij elke focus van het
 * dashboardscherm, zodat net gezette vinkjes op andere schermen meteen kloppen.
 */
export function useCatalogProgress(): CatalogProgressEntry[] {
  const { language } = useLanguage();
  const fish = useFish();
  const recipes = useRecipes();
  const crops = useCrops();
  const flowers = useFlowers();
  const insects = useInsects();
  const birds = useBirds();
  const sand = useSandSculptures();
  const snow = useSnowSculptures();
  const shells = useShells();

  const defs: CatalogDef[] = useMemo(
    () => [
      { key: 'vissen', href: '/vissen', icon: '🎣', title: { nl: 'Vissen', en: 'Fishing' }, total: fish.length, masteryKeys: ['heartopia:vissen:mastery'] },
      { key: 'koken', href: '/koken', icon: '🍳', title: { nl: 'Koken', en: 'Cooking' }, total: recipes.length, masteryKeys: ['heartopia:koken:mastery'] },
      {
        key: 'tuinieren',
        href: '/tuinieren',
        icon: '🌱',
        title: { nl: 'Tuinieren', en: 'Gardening' },
        total: crops.length + flowers.length,
        masteryKeys: ['heartopia:tuinieren:gewassen:mastery', 'heartopia:tuinieren:bloemen:mastery'],
      },
      { key: 'insecten', href: '/insecten', icon: '🦋', title: { nl: 'Insecten', en: 'Insects' }, total: insects.length, masteryKeys: ['heartopia:insecten:mastery'] },
      { key: 'vogels', href: '/vogels', icon: '🐦', title: { nl: 'Vogels', en: 'Birds' }, total: birds.length, masteryKeys: ['heartopia:vogels:mastery'] },
      {
        key: 'beeldhouwen',
        href: '/beeldhouwen',
        icon: '🏖️',
        title: { nl: 'Beeldhouwen', en: 'Sculpting' },
        total: sand.length + snow.length,
        masteryKeys: ['heartopia:beeldhouwen:zand:mastery', 'heartopia:beeldhouwen:sneeuw:mastery'],
      },
      {
        key: 'ocean-cleanup',
        href: '/ocean-cleanup',
        icon: '🌊',
        title: { nl: 'Ocean Cleanup', en: 'Ocean Cleanup' },
        total: shells.length,
        masteryKeys: ['heartopia:schelpen:sterren:mastery'],
      },
    ],
    [fish.length, recipes.length, crops.length, flowers.length, insects.length, birds.length, sand.length, snow.length, shells.length]
  );

  const [masteredCounts, setMasteredCounts] = useState<Record<string, number>>({});

  const refresh = useCallback(() => {
    (async () => {
      const results = await Promise.all(defs.map(async (def) => [def.key, await countMastered(def.masteryKeys)] as const));
      setMasteredCounts(Object.fromEntries(results));
    })();
  }, [defs]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return useMemo(
    () =>
      defs.map((def) => ({
        key: def.key,
        href: def.href,
        icon: def.icon,
        title: def.title[language],
        mastered: masteredCounts[def.key] ?? 0,
        total: def.total,
      })),
    [defs, masteredCounts, language]
  );
}
