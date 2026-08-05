import type { ColorKey } from '@/constants/heartopia-colors';

export interface FlowerItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
}

export const FLOWERS: FlowerItem[] = [
  { name: "Madeliefje", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", growTime: "18 uur", seedPrice: 30, emoji: "🌼" },
  { name: "Viooltje", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "18 uur", seedPrice: 30, emoji: "🌸" },
  { name: "Anthurium", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "Onbekend", seedPrice: 60, emoji: "🌺" },
  { name: "Klaproos", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "1 dag", seedPrice: 60, emoji: "🌺" },
  { name: "Kanterol", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "1 dag", seedPrice: 60, emoji: "🌸" },
  { name: "Calla Lelie", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "1 dag 6 uur", seedPrice: 90, emoji: "🌷" },
  { name: "Ochtendglorie", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", growTime: "1 dag 6 uur", seedPrice: 90, emoji: "🌼" },
  { name: "Anjer", level: 7, rarity: "Episch", rarityColorKey: "coralDark", growTime: "1 dag 6 uur", seedPrice: 120, emoji: "🌸" },
  { name: "Tulp", level: 8, rarity: "Episch", rarityColorKey: "coralDark", growTime: "2 dagen", seedPrice: 150, emoji: "🌷" },
  { name: "Lelie", level: 9, rarity: "Episch", rarityColorKey: "coralDark", growTime: "2 dagen", seedPrice: 200, emoji: "🌷" },
  { name: "Roos", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "3 dagen", seedPrice: 300, emoji: "🌹" },
  { name: "Hyacint", level: 11, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "3 dagen", seedPrice: 300, emoji: "🪻" },
  { name: "Vlinderorchidee", level: 12, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "3 dagen", seedPrice: 300, emoji: "🌺" },
  { name: "Ooievaarsbek", level: 13, rarity: "Legendarisch", rarityColorKey: "yellow", growTime: "3 dagen", seedPrice: 300, emoji: "🌸" },
];
