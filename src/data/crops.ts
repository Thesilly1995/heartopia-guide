import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface CropItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (AthenaMM e.a.). */
  sellPriceByStar: number[] | null;
}

interface CropRaw {
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
  sellPriceByStar: number[] | null;
}

const CROPS_RAW: CropRaw[] = [
  { nameNl: "Aardappelen", nameEn: "Potatoes", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "60 min", growTimeEn: "60 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🥔", sellPriceByStar: [90,120,150,180,210] },
  { nameNl: "Tomaat", nameEn: "Tomato", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "15 min", growTimeEn: "15 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 10, emoji: "🍅", sellPriceByStar: [30,40,50,60,90] },
  { nameNl: "Tarwe", nameEn: "Wheat", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "4 uur", growTimeEn: "4 hours", level: 2, rarityColorKey: "forestSoft", seedPrice: 95, emoji: "🌾", sellPriceByStar: [285,381,475,570,855] },
  { nameNl: "Sla", nameEn: "Lettuce", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "8 uur", growTimeEn: "8 hours", level: 3, rarityColorKey: "forestSoft", seedPrice: 145, emoji: "🥬", sellPriceByStar: [435,582,726,870,1305] },
  { nameNl: "Ananas", nameEn: "Pineapple", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "30 min", growTimeEn: "30 min", level: 4, rarityColorKey: "skyDark", seedPrice: 15, emoji: "🍍", sellPriceByStar: [52,69,86,104,118] },
  { nameNl: "Wortel", nameEn: "Carrot", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "2 uur", growTimeEn: "2 hours", level: 5, rarityColorKey: "skyDark", seedPrice: 50, emoji: "🥕", sellPriceByStar: [155,207,258,310,350] },
  { nameNl: "Maïs", nameEn: "Corn", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "12 uur", growTimeEn: "12 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 170, emoji: "🌽", sellPriceByStar: [515,690,860,1030,1545] },
  { nameNl: "Aardbei", nameEn: "Strawberry", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "6 uur", growTimeEn: "6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 125, emoji: "🍓", sellPriceByStar: [375,502,626,750,1125] },
  { nameNl: "Druif", nameEn: "Grape", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "10 uur", growTimeEn: "10 hours", level: 7, rarityColorKey: "coralDark", seedPrice: 160, emoji: "🍇", sellPriceByStar: [480,643,801,960,1440] },
  { nameNl: "Aubergine", nameEn: "Eggplant", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "7 uur", growTimeEn: "7 hours", level: 8, rarityColorKey: "coralDark", seedPrice: 135, emoji: "🍆", sellPriceByStar: [406,544,678,812,1218] },
  { nameNl: "Theeboom", nameEn: "Tea Tree", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "45 min", growTimeEn: "45 min", level: 11, rarityColorKey: "yellow", seedPrice: 25, emoji: "🍵", sellPriceByStar: [75,100,125,150,225] },
  { nameNl: "Cacao", nameEn: "Cacao", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "5 uur", growTimeEn: "5 hours", level: 12, rarityColorKey: "yellow", seedPrice: 110, emoji: "🍫", sellPriceByStar: [330,442,551,660,990] },
  { nameNl: "Avocado", nameEn: "Avocado", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "13 uur", growTimeEn: "13 hours", level: 13, rarityColorKey: "yellow", seedPrice: 180, emoji: "🥑", sellPriceByStar: [540,735,916,1098,1647] },
];

export function useCrops(): CropItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CROPS_RAW.map((r) => ({
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
