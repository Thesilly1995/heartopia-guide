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

const SNOW_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Iglo-onderdelen", nameEn: "Igloo Parts", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Onderdelen voor een iglo — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "🏠", sellPriceByStar: null },
  { nameNl: "Sneeuwpop", nameEn: "Snowman", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwpop — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "⛄", sellPriceByStar: null },
  { nameNl: "Sneeuwvlok", nameEn: "Snowflake", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwvlok-ornament — sterrating bepaalt kwaliteit", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 2, rarityColorKey: "skyDark", emoji: "❄️", sellPriceByStar: null },
  { nameNl: "Vanya Beer", nameEn: "Vanya Bear", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Vereist Level 5 én Regen/Regenboog weer tijdens het beeldhouwen", methodEn: "Timing minigame (Snowball, Sculpting Bench)", level: 5, rarityColorKey: "yellow", emoji: "🐻", sellPriceByStar: null },
];

export function useSnowSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SNOW_SCULPTURES_RAW.map((r) => ({
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
