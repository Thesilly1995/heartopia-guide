import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface SculptureItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  method: string;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (AthenaMM e.a.). */
  sellPriceByStar: number[] | null;
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
  emoji: string;
  sellPriceByStar: number[] | null;
}

const SAND_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Auto", nameEn: "Car", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🚗", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Kikker", nameEn: "Frog", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🐸", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Heremietkreeft", nameEn: "Hermit Crab", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🦀", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Eend", nameEn: "Duck", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🦆", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Konijntje", nameEn: "Bunny", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🐰", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Vuurtoren", nameEn: "Lighthouse", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 1, rarityColorKey: "forestSoft", emoji: "🗼", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Schip", nameEn: "Ship", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 2, rarityColorKey: "skyDark", emoji: "🚢", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Beer", nameEn: "Bear", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 2, rarityColorKey: "skyDark", emoji: "🐻", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Meeuw", nameEn: "Seagull", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 3, rarityColorKey: "coralDark", emoji: "🐦", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Walvis", nameEn: "Whale", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 3, rarityColorKey: "coralDark", emoji: "🐋", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "IJsbeer", nameEn: "Polar Bear", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 4, rarityColorKey: "yellow", emoji: "🐻‍❄️", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Mozaïek Standbeeld", nameEn: "Mosai Statue", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 4, rarityColorKey: "yellow", emoji: "🗿", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Cactus", nameEn: "Cactus", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 5, rarityColorKey: "yellow", emoji: "🌵", sellPriceByStar: [280,420,560,700,1120] },
  { nameNl: "Gespierde Kat", nameEn: "Muscle Cat", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Zandsculptuur Basis)", methodEn: "Timing minigame (Sand Sculpture Base)", level: 5, rarityColorKey: "yellow", emoji: "🐈", sellPriceByStar: [280,420,560,700,1120] },
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
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
