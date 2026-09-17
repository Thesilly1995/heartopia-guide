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
  nameEs: string;
  namePt: string;
  sizeNl: string;
  sizeEn: string;
  sizeEs: string;
  sizePt: string;
  abilityNl: string | null;
  abilityEn: string | null;
  abilityEs: string | null;
  abilityPt: string | null;
  emoji: string;
}

const DOGS_RAW: DogRaw[] = [
  { nameNl: "Poedel", nameEn: "Poodle", nameEs: "Caniche", namePt: "Poodle", sizeNl: "Klein", sizeEn: "Small", sizeEs: "Pequeño", sizePt: "Pequeno", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐶" },
  { nameNl: "Corgi", nameEn: "Corgi", nameEs: "Corgi", namePt: "Corgi", sizeNl: "Klein", sizeEn: "Small", sizeEs: "Pequeño", sizePt: "Pequeno", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐶" },
  { nameNl: "Husky", nameEn: "Husky", nameEs: "Husky", namePt: "Husky", sizeNl: "Middel", sizeEn: "Medium", sizeEs: "Mediano", sizePt: "Médio", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐶" },
  { nameNl: "Shiba Inu", nameEn: "Shiba Inu", nameEs: "Shiba Inu", namePt: "Shiba Inu", sizeNl: "Middel", sizeEn: "Medium", sizeEs: "Mediano", sizePt: "Médio", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐶" },
  { nameNl: "Golden Retriever", nameEn: "Golden Retriever", nameEs: "Golden Retriever", namePt: "Golden Retriever", sizeNl: "Groot", sizeEn: "Large", sizeEs: "Grande", sizePt: "Grande", abilityNl: "Kan Goudzakjes als cadeau geven", abilityEn: "Can gift Gold Pouches", abilityEs: "Puede regalar Bolsas de Oro", abilityPt: "Pode presentear Bolsas de Ouro", emoji: "🐶" },
];

export function useDogs(): DogItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOGS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    size: language === 'es' ? r.sizeEs : language === 'pt' ? r.sizePt : language === 'en' ? r.sizeEn : r.sizeNl,
    ability: language === 'es' ? r.abilityEs : language === 'pt' ? r.abilityPt : language === 'en' ? r.abilityEn : r.abilityNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
