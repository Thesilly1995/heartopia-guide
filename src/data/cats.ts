import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface CatItem {
  name: string;
  ability: string | null;
  emoji: string;
}

interface CatRaw {
  nameNl: string;
  nameEn: string;
  abilityNl: string | null;
  abilityEn: string | null;
  emoji: string;
}

const CATS_RAW: CatRaw[] = [
  { nameNl: "Siamees", nameEn: "Siamese", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Blauwe Kat", nameEn: "Blue Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Zwarte Kat", nameEn: "Black Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Witte Kat", nameEn: "White Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Wasbeerkat", nameEn: "Raccoon Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Zilveren Cyperse Kat", nameEn: "Silver Tabby", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Oranje Cyperse Kat", nameEn: "Orange Tabby", abilityNl: "Kan Goudzakjes als cadeau geven", abilityEn: "Can gift Gold Pouches", emoji: "🐱" },
  { nameNl: "Bruine Cyperse Kat", nameEn: "Brown Tabby", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Lapjeskat", nameEn: "Calico", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Bonte Kat", nameEn: "Piebald Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Pandakat", nameEn: "Panda Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Gouden Gevlekte Kat", nameEn: "Golden Spotted Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Schildpadkat", nameEn: "Tortoiseshell Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Tuxedokat", nameEn: "Tuxedo Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Gouden Britse Korthaar", nameEn: "Golden British Shorthair", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Zilveren Britse Korthaar", nameEn: "Silver British Shorthair", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Klassiek Zilver Gevlekte Kat", nameEn: "Classic Silver Spotted Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
  { nameNl: "Gouden Luipaardkat", nameEn: "Golden Leopard Cat", abilityNl: null, abilityEn: null, emoji: "🐱" },
];

export function useCats(): CatItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CATS_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    ability: language === 'en' ? r.abilityEn : r.abilityNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
