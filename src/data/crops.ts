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
}

const CROPS_RAW: CropRaw[] = [
  { nameNl: "Aardappelen", nameEn: "Potatoes", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "60 min", growTimeEn: "60 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🥔" },
  { nameNl: "Tomaat", nameEn: "Tomato", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "15 min", growTimeEn: "15 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 10, emoji: "🍅" },
  { nameNl: "Tarwe", nameEn: "Wheat", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "4 uur", growTimeEn: "4 hours", level: 2, rarityColorKey: "forestSoft", seedPrice: 95, emoji: "🌾" },
  { nameNl: "Sla", nameEn: "Lettuce", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "8 uur", growTimeEn: "8 hours", level: 3, rarityColorKey: "forestSoft", seedPrice: 145, emoji: "🥬" },
  { nameNl: "Ananas", nameEn: "Pineapple", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "30 min", growTimeEn: "30 min", level: 4, rarityColorKey: "skyDark", seedPrice: 15, emoji: "🍍" },
  { nameNl: "Wortel", nameEn: "Carrot", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "2 uur", growTimeEn: "2 hours", level: 5, rarityColorKey: "skyDark", seedPrice: 50, emoji: "🥕" },
  { nameNl: "Maïs", nameEn: "Corn", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "12 uur", growTimeEn: "12 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 170, emoji: "🌽" },
  { nameNl: "Aardbei", nameEn: "Strawberry", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "6 uur", growTimeEn: "6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 125, emoji: "🍓" },
  { nameNl: "Druif", nameEn: "Grape", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "10 uur", growTimeEn: "10 hours", level: 7, rarityColorKey: "coralDark", seedPrice: 160, emoji: "🍇" },
  { nameNl: "Aubergine", nameEn: "Eggplant", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "7 uur", growTimeEn: "7 hours", level: 8, rarityColorKey: "coralDark", seedPrice: 135, emoji: "🍆" },
  { nameNl: "Theeboom", nameEn: "Tea Tree", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "45 min", growTimeEn: "45 min", level: 11, rarityColorKey: "yellow", seedPrice: 25, emoji: "🍵" },
  { nameNl: "Cacao", nameEn: "Cacao", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "5 uur", growTimeEn: "5 hours", level: 12, rarityColorKey: "yellow", seedPrice: 110, emoji: "🍫" },
  { nameNl: "Avocado", nameEn: "Avocado", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "13 uur", growTimeEn: "13 hours", level: 13, rarityColorKey: "yellow", seedPrice: 180, emoji: "🥑" },
];

export function useCrops(): CropItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CROPS_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    rarity: language === 'en' ? r.rarityEn : r.rarityNl,
    growTime: language === 'en' ? r.growTimeEn : r.growTimeNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    seedPrice: r.seedPrice,
    emoji: r.emoji,
      })),
    [language]
  );
}
