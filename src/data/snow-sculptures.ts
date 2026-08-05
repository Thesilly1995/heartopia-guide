import type { ColorKey } from '@/constants/heartopia-colors';

export interface SculptureItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  method: string;
  sellPrice: string;
  emoji: string;
}

export const SNOW_SCULPTURES: SculptureItem[] = [
  { name: "Iglo-onderdelen", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Onderdelen voor een iglo — sterrating bepaalt kwaliteit", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "🏠" },
  { name: "Sneeuwpop", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwpop — sterrating bepaalt kwaliteit", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "⛄" },
  { name: "Sneeuwvlok", level: 2, rarity: "Zeldzaam", rarityColorKey: "skyDark", method: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Sneeuwvlok-ornament — sterrating bepaalt kwaliteit", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "❄️" },
  { name: "Vanya Beer", level: 5, rarity: "Legendarisch", rarityColorKey: "yellow", method: "Timing-minigame (Sneeuwbal, Beeldhouwbank) — Vereist Level 5 én Regen/Regenboog weer tijdens het beeldhouwen", sellPrice: "Sterafhankelijk (1-5★) 🪙", emoji: "🐻" },
];
