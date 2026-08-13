import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface SculptureItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  method: string;
  sellPrice: string;
  emoji: string;
}

interface SculptureRaw {
  nameNl: string;
  nameEn: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  methodNl: string;
  methodEn: string;
  sellPrice: string;
  emoji: string;
}

const SAND_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Auto", nameEn: "Car", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "140 🪙", emoji: "🚗" },
  { nameNl: "Kikker", nameEn: "Frog", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "140 🪙", emoji: "🐸" },
  { nameNl: "Heremietkreeft", nameEn: "Hermit Crab", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "150 🪙", emoji: "🦀" },
  { nameNl: "Eend", nameEn: "Duck", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "150 🪙", emoji: "🦆" },
  { nameNl: "Konijntje", nameEn: "Bunny", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "165 🪙", emoji: "🐰" },
  { nameNl: "Vuurtoren", nameEn: "Lighthouse", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", sellPrice: "165 🪙", emoji: "🗼" },
  { nameNl: "Schip", nameEn: "Ship", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 2, rarityColorKey: "skyDark", sellPrice: "190 🪙", emoji: "🚢" },
  { nameNl: "Beer", nameEn: "Bear", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 2, rarityColorKey: "skyDark", sellPrice: "190 🪙", emoji: "🐻" },
  { nameNl: "Meeuw", nameEn: "Seagull", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 3, rarityColorKey: "coralDark", sellPrice: "225 🪙", emoji: "🐦" },
  { nameNl: "Walvis", nameEn: "Whale", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 3, rarityColorKey: "coralDark", sellPrice: "225 🪙", emoji: "🐋" },
  { nameNl: "IJsbeer", nameEn: "Polar Bear", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 4, rarityColorKey: "yellow", sellPrice: "225 🪙", emoji: "🐻‍❄️" },
  { nameNl: "Mozaïek Standbeeld", nameEn: "Mosai Statue", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 4, rarityColorKey: "yellow", sellPrice: "225 🪙", emoji: "🗿" },
  { nameNl: "Cactus", nameEn: "Cactus", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 5, rarityColorKey: "yellow", sellPrice: "280 🪙", emoji: "🌵" },
  { nameNl: "Gespierde Kat", nameEn: "Muscle Cat", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 5, rarityColorKey: "yellow", sellPrice: "280 🪙", emoji: "🐈" },
];

export function useSandSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SAND_SCULPTURES_RAW.map((r) => ({
    name: r.nameEn,
    rarity: r.rarityEn,
    method: language === 'en' ? r.methodEn : r.methodNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    sellPrice: r.sellPrice,
    emoji: r.emoji,
      })),
    [language]
  );
}
