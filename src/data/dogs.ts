import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface DogItem {
  name: string;
  size: string;
  ability: string | null;
  emoji: string;
}

interface DogRaw {
  nameNl: string;
  nameEn: string;
  sizeNl: string;
  sizeEn: string;
  abilityNl: string | null;
  abilityEn: string | null;
  emoji: string;
}

const DOGS_RAW: DogRaw[] = [
  { nameNl: "Poedel", nameEn: "Poodle", sizeNl: "Klein", sizeEn: "Small", abilityNl: null, abilityEn: null, emoji: "🐶" },
  { nameNl: "Corgi", nameEn: "Corgi", sizeNl: "Klein", sizeEn: "Small", abilityNl: null, abilityEn: null, emoji: "🐶" },
  { nameNl: "Husky", nameEn: "Husky", sizeNl: "Middel", sizeEn: "Medium", abilityNl: null, abilityEn: null, emoji: "🐶" },
  { nameNl: "Shiba Inu", nameEn: "Shiba Inu", sizeNl: "Middel", sizeEn: "Medium", abilityNl: null, abilityEn: null, emoji: "🐶" },
  { nameNl: "Golden Retriever", nameEn: "Golden Retriever", sizeNl: "Groot", sizeEn: "Large", abilityNl: "Kan Goudzakjes als cadeau geven", abilityEn: "Can gift Gold Pouches", emoji: "🐶" },
];

export function useDogs(): DogItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOGS_RAW.map((r) => ({
    name: r.nameEn,
    size: language === 'en' ? r.sizeEn : r.sizeNl,
    ability: language === 'en' ? r.abilityEn : r.abilityNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
