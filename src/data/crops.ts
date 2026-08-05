import type { ColorKey } from '@/constants/heartopia-colors';

export interface CropItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
}

export const CROPS: CropItem[] = [
  { name: "Aardappelen", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", growTime: "60 min", seedPrice: 30, emoji: "🥔" },
  { name: "Tomaat", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", growTime: "15 min", seedPrice: 10, emoji: "🍅" },
  { name: "Tarwe", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", growTime: "4 uur", seedPrice: 95, emoji: "🌾" },
  { name: "Sla", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", growTime: "8 uur", seedPrice: 145, emoji: "🥬" },
  { name: "Ananas", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "30 min", seedPrice: 15, emoji: "🍍" },
  { name: "Wortel", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "2 uur", seedPrice: 50, emoji: "🥕" },
  { name: "Maïs", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "12 uur", seedPrice: 170, emoji: "🌽" },
  { name: "Aardbei", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "6 uur", seedPrice: 125, emoji: "🍓" },
  { name: "Druif", level: 7, rarity: "Episch", rarityColorKey: "coralDark", growTime: "10 uur", seedPrice: 160, emoji: "🍇" },
  { name: "Aubergine", level: 8, rarity: "Episch", rarityColorKey: "coralDark", growTime: "7 uur", seedPrice: 135, emoji: "🍆" },
  { name: "Theeboom", level: 11, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "45 min", seedPrice: 25, emoji: "🍵" },
  { name: "Cacao", level: 12, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "5 uur", seedPrice: 110, emoji: "🍫" },
  { name: "Avocado", level: 13, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "13 uur", seedPrice: 180, emoji: "🥑" },
];
