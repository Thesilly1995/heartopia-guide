import type { ColorKey } from '@/constants/heartopia-colors';

export interface RecipeItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  tool: string;
  ingredients: string[];
  xp: number;
  emoji: string;
}

export const RECIPES: RecipeItem[] = [
  { name: "Appeljam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Appel ×4"], xp: 15, emoji: "🍰" },
  { name: "Zwarte Truffeltaart", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Paddenstoel (willekeurig) ×2", "Tarwe", "Ei"], xp: 15, emoji: "🥗" },
  { name: "Blauwe Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Blauwe Suiker ×2"], xp: 15, emoji: "🍳" },
  { name: "Bosbessenjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Bosbes ×4"], xp: 15, emoji: "🥘" },
  { name: "Champignontaart", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Paddenstoel (willekeurig) ×2", "Tarwe", "Ei"], xp: 15, emoji: "🍛" },
  { name: "Chocoladesaus", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Cacao ×4"], xp: 15, emoji: "🧁" },
  { name: "Koffie", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Koffiebonen ×4"], xp: 15, emoji: "☕" },
  { name: "Koffie Latte", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Koffiebonen ×2", "Melk ×2"], xp: 15, emoji: "🍫" },
  { name: "Fish & Chips", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Vis (willekeurig) ×2", "Aardappel ×2"], xp: 15, emoji: "🥧" },
  { name: "Druivenjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Druif ×4"], xp: 15, emoji: "🍲" },
  { name: "Groene Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Groene Suiker ×2"], xp: 15, emoji: "🍜" },
  { name: "Gegrilde Champignon", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Paddenstoel (willekeurig) ×4"], xp: 15, emoji: "🥗" },
  { name: "Huissalade", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Groente (willekeurig) ×2"], xp: 15, emoji: "🍞" },
  { name: "Indigo Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk"], xp: 15, emoji: "🍳" },
  { name: "Mandarijnjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Mandarijn ×4"], xp: 15, emoji: "🥘" },
  { name: "Paddenstoeltaart", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Paddenstoel (willekeurig) ×2", "Tarwe", "Ei"], xp: 15, emoji: "🍮" },
  { name: "Originele Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Suiker ×2"], xp: 15, emoji: "🧁" },
  { name: "Ananasjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ananas ×4"], xp: 15, emoji: "☕" },
  { name: "Frambozenjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Framboos ×4"], xp: 15, emoji: "🍫" },
  { name: "Rode Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Rode Suiker ×2"], xp: 15, emoji: "🥛" },
  { name: "Aardbeienjam", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Aardbei ×4"], xp: 15, emoji: "🍳" },
  { name: "Tomatensaus", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Tomaat ×4"], xp: 15, emoji: "🍛" },
  { name: "Paarse Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Paarse Suiker ×2"], xp: 15, emoji: "🦀" },
  { name: "Gele Rolcake", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Ei", "Melk", "Gele Suiker ×2"], xp: 15, emoji: "🍤" },
  { name: "Kaastaart", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Kaas", "Tarwe", "Melk"], xp: 20, emoji: "🍤" },
  { name: "Gerookte Visbagel", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Vis (willekeurig)", "Kaas", "Groente (willekeurig)", "Tarwe"], xp: 20, emoji: "🍜" },
  { name: "Zwarte Truffel Roomtaart", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Truffel", "Tarwe ×2", "Melk"], xp: 25, emoji: "🍜" },
  { name: "Rustieke Ratatouille", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Tomaat", "Aardappel", "Sla"], xp: 25, emoji: "🍯" },
  { name: "Zeevruchtenrisotto", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", tool: "Fornuis", ingredients: ["Schelpdier ×2", "Tarwe", "Tomaat"], xp: 25, emoji: "🥧" },
  { name: "Pasta met Vleessaus", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Vlees", "Tarwe", "Tomaat", "Kaas"], xp: 30, emoji: "🦀" },
  { name: "Zeevruchtenpizza", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Kaas", "Jam", "Tarwe", "Vis (willekeurig)"], xp: 30, emoji: "🍰" },
  { name: "Appeltaart", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Appel", "Tarwe", "Ei", "Boter"], xp: 35, emoji: "🥧" },
  { name: "Wortelcake", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Wortel ×2", "Tarwe", "Ei"], xp: 35, emoji: "🦀" },
  { name: "Maissoep", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Melk", "Boter", "Maïs ×2"], xp: 35, emoji: "🥛" },
  { name: "Luxe Zeevruchtenplateau", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Schelpdier ×2", "Vis (willekeurig) ×2"], xp: 40, emoji: "🍰" },
  { name: "Tiramisu", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", tool: "Fornuis", ingredients: ["Koffiebonen", "Ei", "Melk", "Kaas"], xp: 40, emoji: "🥘" },
  { name: "Blauwe Rivierkreeft Sashimi", level: 8, rarity: "Episch", rarityColorKey: "coralDark", tool: "Fornuis", ingredients: ["Schelpdier ×3", "Sla"], xp: 50, emoji: "🍞" },
  { name: "Rivierkreeft Sashimi", level: 8, rarity: "Episch", rarityColorKey: "coralDark", tool: "Fornuis", ingredients: ["Schelpdier ×3", "Sla"], xp: 50, emoji: "🍯" },
  { name: "Vleesburger", level: 8, rarity: "Episch", rarityColorKey: "coralDark", tool: "Fornuis", ingredients: ["Tarwe", "Sla", "Vlees", "Jam"], xp: 50, emoji: "🍛" },
  { name: "Gebakken Aubergine met Vlees", level: 9, rarity: "Episch", rarityColorKey: "coralDark", tool: "Fornuis", ingredients: ["Aubergine", "Vlees", "Bakolie", "Jam"], xp: 55, emoji: "🍲" },
  { name: "Gestoomde Gouden Krab", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", tool: "Fornuis", ingredients: ["Boter"], xp: 60, emoji: "🥗" },
  { name: "Gestoomde Koningskrab", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", tool: "Fornuis", ingredients: ["Schelpdier ×3", "Boter"], xp: 60, emoji: "🍞" },
  { name: "Milkshake", level: 11, rarity: "Legendarisch", rarityColorKey: "yellow", tool: "Fornuis", ingredients: ["Druif ×2", "Melk ×2"], xp: 65, emoji: "🍤" },
  { name: "Gevulde Krab met Kaasgarnalen", level: 13, rarity: "Legendarisch", rarityColorKey: "yellow", tool: "Fornuis", ingredients: ["Schelpdier ×2"], xp: 75, emoji: "🍮" },
  { name: "Garnaal-Avocadobekertje", level: 13, rarity: "Legendarisch", rarityColorKey: "yellow", tool: "Fornuis", ingredients: ["Garnaal", "Avocado"], xp: 75, emoji: "🍲" },
];
