import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface DogItem {
  name: string;
  emoji: string;
}

interface DogRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  emoji: string;
}

const DOGS_RAW: DogRaw[] = [
  { nameNl: "Poedel", nameEn: "Poodle", nameEs: "Caniche", namePt: "Poodle", nameFr: "Caniche", nameDe: "Pudel", emoji: "🐶" },
  { nameNl: "Corgi", nameEn: "Corgi", nameEs: "Corgi", namePt: "Corgi", nameFr: "Corgi", nameDe: "Corgi", emoji: "🐶" },
  { nameNl: "Husky", nameEn: "Husky", nameEs: "Husky", namePt: "Husky", nameFr: "Husky", nameDe: "Husky", emoji: "🐶" },
  { nameNl: "Shiba Inu", nameEn: "Shiba Inu", nameEs: "Shiba Inu", namePt: "Shiba Inu", nameFr: "Shiba Inu", nameDe: "Shiba Inu", emoji: "🐶" },
  { nameNl: "Golden Retriever", nameEn: "Golden Retriever", nameEs: "Golden Retriever", namePt: "Golden Retriever", nameFr: "Golden Retriever", nameDe: "Golden Retriever", emoji: "🐶" },
  { nameNl: "Dalmatiër", nameEn: "Dalmatian", nameEs: "Dálmata", namePt: "Dálmata", nameFr: "Dalmatien", nameDe: "Dalmatiner", emoji: "🐶" },
];

export function useDogs(): DogItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOGS_RAW.map((r) => ({
        name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
        emoji: r.emoji,
      })),
    [language]
  );
}
