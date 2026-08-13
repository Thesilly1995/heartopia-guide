import { useMemo } from 'react';

export interface ForagedItem {
  name: string;
  spot: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

interface ForagedRaw {
  nameNl: string;
  nameEn: string;
  spotNl: string;
  spotEn: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

const WILD_MATERIALS_RAW: ForagedRaw[] = [
  { nameNl: "Bamboe", nameEn: "Bamboo", spotNl: "Bamboegebied", spotEn: "Bamboo", sellPrice: "7 🪙", energy: "—", emoji: "🎋" },
  { nameNl: "Tak", nameEn: "Branch", spotNl: "Struiken", spotEn: "Bushes", sellPrice: "5 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Erts", nameEn: "Ore", spotNl: "Thuis", spotEn: "Home", sellPrice: "14 🪙", energy: "—", emoji: "⛏️" },
  { nameNl: "Steen", nameEn: "Stone", spotNl: "Thuis", spotEn: "Home", sellPrice: "8 🪙", energy: "—", emoji: "🪨" },
  { nameNl: "Hout", nameEn: "Timber", spotNl: "Boom", spotEn: "Tree", sellPrice: "6 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Kwaliteitshout", nameEn: "Quality Timber", spotNl: "Boom", spotEn: "Tree", sellPrice: "12 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Zeldzaam Hout", nameEn: "Rare Timber", spotNl: "Reuzenboom in de Buitenwijk", spotEn: "Gigantic Tree in the Suburb", sellPrice: "50 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Zwervend Eikenhout", nameEn: "Roaming Oak Timber", spotNl: "Zwervende Eik", spotEn: "Roaming Oak-Oak", sellPrice: "150 🪙", energy: "—", emoji: "🪵" },
];

export function useWildMaterials(): ForagedItem[] {
  return useMemo(
    () =>
      WILD_MATERIALS_RAW.map((r) => ({
    name: r.nameEn,
    spot: r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    []
  );
}
