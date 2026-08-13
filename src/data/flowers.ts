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
}

const FLOWERS_RAW: FlowerRaw[] = [
  { nameNl: "Madeliefje", nameEn: "Daisy", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "18 uur", growTimeEn: "18 hours", level: 3, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🌼" },
  { nameNl: "Viooltje", nameEn: "Pansy", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "18 uur", growTimeEn: "18 hours", level: 4, rarityColorKey: "skyDark", seedPrice: 30, emoji: "🌸" },
  { nameNl: "Anthurium", nameEn: "Anthurium", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "Onbekend", growTimeEn: "Unknown", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺" },
  { nameNl: "Klaproos", nameEn: "Corn Poppy", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺" },
  { nameNl: "Kanterol", nameEn: "Laceleaf", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌸" },
  { nameNl: "Calla Lelie", nameEn: "Calla Lily", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌷" },
  { nameNl: "Ochtendglorie", nameEn: "Morning Glory", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌼" },
  { nameNl: "Anjer", nameEn: "Carnation", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", level: 7, rarityColorKey: "coralDark", seedPrice: 120, emoji: "🌸" },
  { nameNl: "Tulp", nameEn: "Tulip", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", level: 8, rarityColorKey: "coralDark", seedPrice: 150, emoji: "🌷" },
  { nameNl: "Lelie", nameEn: "Lily", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", level: 9, rarityColorKey: "coralDark", seedPrice: 200, emoji: "🌷" },
  { nameNl: "Roos", nameEn: "Rose", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 10, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌹" },
  { nameNl: "Hyacint", nameEn: "Hyacinth", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 11, rarityColorKey: "yellow", seedPrice: 300, emoji: "🪻" },
  { nameNl: "Vlinderorchidee", nameEn: "Moth Orchid", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 12, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌺" },
  { nameNl: "Ooievaarsbek", nameEn: "Cranesbill", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", level: 13, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌸" },
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
      })),
    [language]
  );
}
