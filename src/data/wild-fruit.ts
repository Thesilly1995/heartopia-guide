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

const WILD_FRUIT_RAW: ForagedRaw[] = [
  { nameNl: "Appel", nameEn: "Apple", spotNl: "Thuisfront: Noord & Oost", spotEn: "Home front: North & East", sellPrice: "28 🪙", energy: "+8", emoji: "🍎" },
  { nameNl: "Mandarijn", nameEn: "Mandarin", spotNl: "Thuisfront: West & Noord", spotEn: "Home front: West & North", sellPrice: "28 🪙", energy: "+8", emoji: "🍊" },
  { nameNl: "Bosbes", nameEn: "Blueberry", spotNl: "Thuisfront: West, Noord & Oost", spotEn: "Home front: West, North & East", sellPrice: "16 🪙", energy: "+5", emoji: "🫐" },
  { nameNl: "Framboos", nameEn: "Raspberry", spotNl: "Thuisfront: West", spotEn: "Home front: West", sellPrice: "26 🪙", energy: "+7", emoji: "🍓" },
];

export function useWildFruit(): ForagedItem[] {
  return useMemo(
    () =>
      WILD_FRUIT_RAW.map((r) => ({
    name: r.nameEn,
    spot: r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    []
  );
}
