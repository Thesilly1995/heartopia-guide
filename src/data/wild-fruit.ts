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

const WILD_FRUIT_RAW: ForagedRaw[] = [
  { nameNl: "Appel", nameEn: "Apple", nameEs: "Manzana", namePt: "Maçã", nameFr: "Pomme", spotNl: "Thuisfront: Noord & Oost", spotEn: "Home front: North & East", spotEs: "Frente del hogar: Norte y Este", spotPt: "Frente da casa: Norte e Leste", sellPrice: "28 🪙", energy: "+8", emoji: "🍎" },
  { nameNl: "Mandarijn", nameEn: "Mandarin", nameEs: "Mandarina", namePt: "Tangerina", nameFr: "Mandarine", spotNl: "Thuisfront: West & Noord", spotEn: "Home front: West & North", spotEs: "Frente del hogar: Oeste y Norte", spotPt: "Frente da casa: Oeste e Norte", sellPrice: "28 🪙", energy: "+8", emoji: "🍊" },
  { nameNl: "Bosbes", nameEn: "Blueberry", nameEs: "Arándano", namePt: "Mirtilo", nameFr: "Myrtille", spotNl: "Thuisfront: West, Noord & Oost", spotEn: "Home front: West, North & East", spotEs: "Frente del hogar: Oeste, Norte y Este", spotPt: "Frente da casa: Oeste, Norte e Leste", sellPrice: "16 🪙", energy: "+5", emoji: "🫐" },
  { nameNl: "Framboos", nameEn: "Raspberry", nameEs: "Frambuesa", namePt: "Framboesa", nameFr: "Framboise", spotNl: "Thuisfront: West", spotEn: "Home front: West", spotEs: "Frente del hogar: Oeste", spotPt: "Frente da casa: Oeste", sellPrice: "26 🪙", energy: "+7", emoji: "🍓" },
];

export function useWildFruit(): ForagedItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_FRUIT_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : r.nameEn,
    spot: language === 'es' ? r.spotEs : language === 'pt' ? r.spotPt : r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    [language]
  );
}
