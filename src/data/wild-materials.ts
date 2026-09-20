import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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
  nameEs: string;
  namePt: string;
  nameFr: string;
  spotNl: string;
  spotEn: string;
  spotEs: string;
  spotPt: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

const WILD_MATERIALS_RAW: ForagedRaw[] = [
  { nameNl: "Bamboe", nameEn: "Bamboo", nameEs: "Bambú", namePt: "Bambu", nameFr: "Bambou", spotNl: "Bamboegebied", spotEn: "Bamboo", spotEs: "Bambú", spotPt: "Bambu", sellPrice: "7 🪙", energy: "—", emoji: "🎋" },
  { nameNl: "Tak", nameEn: "Branch", nameEs: "Rama", namePt: "Galho", nameFr: "Branche", spotNl: "Struiken", spotEn: "Bushes", spotEs: "Arbustos", spotPt: "Arbustos", sellPrice: "5 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Erts", nameEn: "Ore", nameEs: "Mineral", namePt: "Minério", nameFr: "Minerai", spotNl: "Thuis", spotEn: "Home", spotEs: "Casa", spotPt: "Casa", sellPrice: "14 🪙", energy: "—", emoji: "⛏️" },
  { nameNl: "Steen", nameEn: "Stone", nameEs: "Piedra", namePt: "Pedra", nameFr: "Pierre", spotNl: "Thuis", spotEn: "Home", spotEs: "Casa", spotPt: "Casa", sellPrice: "8 🪙", energy: "—", emoji: "🪨" },
  { nameNl: "Hout", nameEn: "Timber", nameEs: "Madera", namePt: "Madeira", nameFr: "Bois", spotNl: "Boom", spotEn: "Tree", spotEs: "Árbol", spotPt: "Árvore", sellPrice: "6 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Kwaliteitshout", nameEn: "Quality Timber", nameEs: "Madera de Calidad", namePt: "Madeira de Qualidade", nameFr: "Bois de qualité", spotNl: "Boom", spotEn: "Tree", spotEs: "Árbol", spotPt: "Árvore", sellPrice: "12 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Zeldzaam Hout", nameEn: "Rare Timber", nameEs: "Madera Rara", namePt: "Madeira Rara", nameFr: "Bois rare", spotNl: "Reuzenboom in de Buitenwijk", spotEn: "Gigantic Tree in the Suburb", spotEs: "Árbol Gigante en el Suburbio", spotPt: "Árvore Gigante no Subúrbio", sellPrice: "50 🪙", energy: "—", emoji: "🪵" },
  { nameNl: "Zwervend Eikenhout", nameEn: "Roaming Oak Timber", nameEs: "Madera de Roble Errante", namePt: "Madeira de Carvalho Errante", nameFr: "Chêne errant", spotNl: "Zwervende Eik", spotEn: "Roaming Oak-Oak", spotEs: "Roble Errante", spotPt: "Carvalho Errante", sellPrice: "150 🪙", energy: "—", emoji: "🪵" },
];

export function useWildMaterials(): ForagedItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_MATERIALS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : r.nameEn,
    spot: language === 'es' ? r.spotEs : language === 'pt' ? r.spotPt : r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    [language]
  );
}
