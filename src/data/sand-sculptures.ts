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

export const SAND_SCULPTURES: SculptureItem[] = [
  { name: "Auto", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "140 🪙", emoji: "🚗" },
  { name: "Kikker", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "140 🪙", emoji: "🐸" },
  { name: "Heremietkreeft", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "150 🪙", emoji: "🦀" },
  { name: "Eend", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "150 🪙", emoji: "🦆" },
  { name: "Konijntje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "165 🪙", emoji: "🐰" },
  { name: "Vuurtoren", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "165 🪙", emoji: "🗼" },
  { name: "Schip", level: 2, rarity: "Zeldzaam", rarityColorKey: "skyDark", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "190 🪙", emoji: "🚢" },
  { name: "Beer", level: 2, rarity: "Zeldzaam", rarityColorKey: "skyDark", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "190 🪙", emoji: "🐻" },
  { name: "Meeuw", level: 3, rarity: "Episch", rarityColorKey: "coralDark", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "225 🪙", emoji: "🐦" },
  { name: "Walvis", level: 3, rarity: "Episch", rarityColorKey: "coralDark", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "225 🪙", emoji: "🐋" },
  { name: "IJsbeer", level: 4, rarity: "Legendarisch", rarityColorKey: "yellow", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "225 🪙", emoji: "🐻‍❄️" },
  { name: "Mozaïek Standbeeld", level: 4, rarity: "Legendarisch", rarityColorKey: "yellow", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "225 🪙", emoji: "🗿" },
  { name: "Cactus", level: 5, rarity: "Legendarisch", rarityColorKey: "yellow", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "280 🪙", emoji: "🌵" },
  { name: "Gespierde Kat", level: 5, rarity: "Legendarisch", rarityColorKey: "yellow", method: "Timing-minigame (Zandsculptuur Basis)", sellPrice: "280 🪙", emoji: "🐈" },
];
