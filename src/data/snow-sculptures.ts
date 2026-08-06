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

const SNOW_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Iglo-onderdelen", nameEn: "Igloo Parts", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Onderdelen voor een iglo — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "🏠" },
  { nameNl: "Sneeuwpop", nameEn: "Snowman", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwpop — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "⛄" },
  { nameNl: "Sneeuwvlok", nameEn: "Snowflake", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwvlok-ornament — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 2, rarityColorKey: "skyDark", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "❄️" },
  { nameNl: "Vanya Beer", nameEn: "Vanya Bear", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Vereist Level 5 én Regen/Regenboog weer tijdens het beeldhouwen", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 5, rarityColorKey: "yellow", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "🐻" },
];

export function useSnowSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SNOW_SCULPTURES_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    rarity: language === 'en' ? r.rarityEn : r.rarityNl,
    method: language === 'en' ? r.methodEn : r.methodNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    sellPrice: r.sellPrice,
    emoji: r.emoji,
      })),
    [language]
  );
}
