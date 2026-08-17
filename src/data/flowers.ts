import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface FlowerItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (hiimaa_44 op X, via AthenaMM-tracker). */
  sellPriceByStar: (number | null)[] | null;
}

interface FlowerRaw {
  nameNl: string;
  nameEn: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  growTimeNl: string;
  growTimeEn: string;
  seedPrice: number;
  emoji: string;
  sellPriceByStar: (number | null)[] | null;
}

const FLOWERS_RAW: FlowerRaw[] = [
  { nameNl: "Madeliefje", nameEn: "Daisy", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "18 uur", growTimeEn: "18 hours", level: 3, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🌼", sellPriceByStar: [100,150,200,250,400] },
  { nameNl: "Viooltje", nameEn: "Pansy", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "18 uur", growTimeEn: "18 hours", level: 4, rarityColorKey: "skyDark", seedPrice: 30, emoji: "🌸", sellPriceByStar: [100,150,200,250,400] },
  { nameNl: "Anthurium", nameEn: "Anthurium", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "Onbekend", growTimeEn: "Unknown", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺", sellPriceByStar: null },
  { nameNl: "Klaproos", nameEn: "Corn Poppy", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺", sellPriceByStar: [185,280,370,465,740] },
  { nameNl: "Kanterol", nameEn: "Laceleaf", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌸", sellPriceByStar: [185,280,370,465,740] },
  { nameNl: "Calla Lelie", nameEn: "Calla Lily", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌷", sellPriceByStar: [250,375,500,625,1000] },
  { nameNl: "Ochtendglorie", nameEn: "Morning Glory", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌼", sellPriceByStar: [250,375,500,625,1000] },
  { nameNl: "Anjer", nameEn: "Carnation", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 7, rarityColorKey: "coralDark", seedPrice: 120, emoji: "🌸", sellPriceByStar: [305,460,610,765,1220] },
  { nameNl: "Tulp", nameEn: "Tulip", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", level: 8, rarityColorKey: "coralDark", seedPrice: 150, emoji: "🌷", sellPriceByStar: [415,625,830,1040,1660] },
  { nameNl: "Lelie", nameEn: "Lily", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", level: 9, rarityColorKey: "coralDark", seedPrice: 200, emoji: "🌷", sellPriceByStar: [485,730,970,1215,1940] },
  { nameNl: "Roos", nameEn: "Rose", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 10, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌹", sellPriceByStar: [765,1150,1530,1915,3060] },
  { nameNl: "Hyacint", nameEn: "Hyacinth", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 11, rarityColorKey: "yellow", seedPrice: 300, emoji: "🪻", sellPriceByStar: [785,1180,1570,1965,3140] },
  { nameNl: "Vlinderorchidee", nameEn: "Moth Orchid", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 12, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌺", sellPriceByStar: [805,1210,1610,2015,3220] },
  { nameNl: "Ooievaarsbek", nameEn: "Cranesbill", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 13, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌸", sellPriceByStar: [825,1240,null,null,null] },
];

export function useFlowers(): FlowerItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      FLOWERS_RAW.map((r) => ({
    name: r.nameEn,
    rarity: r.rarityEn,
    growTime: language === 'en' ? r.growTimeEn : r.growTimeNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    seedPrice: r.seedPrice,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
