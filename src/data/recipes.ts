import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

export interface RecipeItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  tool: string;
  ingredients: string[];
  xp: number;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (AthenaMM e.a.). */
  sellPriceByStar: (number | null)[] | null;
}

interface RecipeRaw {
  nameNl: string;
  nameEn: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  toolNl: string;
  toolEn: string;
  ingredientsNl: string[];
  ingredientsEn: string[];
  xp: number;
  emoji: string;
  sellPriceByStar: (number | null)[] | null;
}

const RECIPES_RAW: RecipeRaw[] = [
  { nameNl: "Appeljam", nameEn: "Apple Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Appel ×4"], ingredientsEn: ["Apple x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍰", sellPriceByStar: [270,405,540,1080,2160] },
  { nameNl: "Zwarte Truffeltaart", nameEn: "Black Truffle Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥗", sellPriceByStar: [830,1245,1660,3320,6640] },
  { nameNl: "Blauwe Rolcake", nameEn: "Blue Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Blauwe Suiker ×2"], ingredientsEn: ["Egg","Milk","Blue Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳", sellPriceByStar: [570,855,1140,2280,4560] },
  { nameNl: "Bosbessenjam", nameEn: "Blueberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Bosbes ×4"], ingredientsEn: ["Blueberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥘", sellPriceByStar: [170,255,340,680,1360] },
  { nameNl: "Champignontaart", nameEn: "Button Mushroom Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍛", sellPriceByStar: [500,750,1000,2000,4000] },
  { nameNl: "Chocoladesaus", nameEn: "Chocolate Sauce", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Cacao ×4"], ingredientsEn: ["Cocoa x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🧁", sellPriceByStar: [1400,2100,2800,5600,11200] },
  { nameNl: "Koffie", nameEn: "Coffee", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen ×4"], ingredientsEn: ["Coffee Beans x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "☕", sellPriceByStar: [290,435,580,1160,2320] },
  { nameNl: "Koffie Latte", nameEn: "Coffee Latte", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen ×2","Melk ×2"], ingredientsEn: ["Coffee Beans x2","Milk x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍫", sellPriceByStar: [300,450,600,1200,2400] },
  { nameNl: "Fish & Chips", nameEn: "Fish N Chips", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vis (willekeurig) ×2","Aardappel ×2"], ingredientsEn: ["Any Fish x2","Potato x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥧", sellPriceByStar: [310,465,620,1240,2480] },
  { nameNl: "Druivenjam", nameEn: "Grape Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Druif ×4"], ingredientsEn: ["Grape x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍲", sellPriceByStar: [2020,3030,4040,8080,16160] },
  { nameNl: "Groene Rolcake", nameEn: "Green Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Groene Suiker ×2"], ingredientsEn: ["Egg","Milk","Green Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍜", sellPriceByStar: [670,1005,1340,2680,5360] },
  { nameNl: "Gegrilde Champignon", nameEn: "Grilled Mushroom", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×4"], ingredientsEn: ["Any Mushroom x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥗", sellPriceByStar: [180,270,360,720,1440] },
  { nameNl: "Huissalade", nameEn: "House Salad", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Groente (willekeurig) ×2"], ingredientsEn: ["Any Vegetable x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍞", sellPriceByStar: [90,135,180,360,720] },
  { nameNl: "Indigo Rolcake", nameEn: "Indigo Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk"], ingredientsEn: ["Egg","Milk"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳", sellPriceByStar: [570,855,1140,2280,4560] },
  { nameNl: "Mandarijnjam", nameEn: "Mandarin Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Mandarijn ×4"], ingredientsEn: ["Mandarin x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥘", sellPriceByStar: [270,405,540,1080,2160] },
  { nameNl: "Paddenstoeltaart", nameEn: "Mushroom Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍮", sellPriceByStar: [500,750,1000,2000,4000] },
  { nameNl: "Originele Rolcake", nameEn: "Original Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Suiker ×2"], ingredientsEn: ["Egg","Milk","Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🧁", sellPriceByStar: [550,825,1100,2280,4400] },
  { nameNl: "Ananasjam", nameEn: "Pineapple Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ananas ×4"], ingredientsEn: ["Pineapple x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "☕", sellPriceByStar: [280,420,560,1120,2240] },
  { nameNl: "Frambozenjam", nameEn: "Raspberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Framboos ×4"], ingredientsEn: ["Raspberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍫", sellPriceByStar: [250,475,500,1000,2000] },
  { nameNl: "Rode Rolcake", nameEn: "Red Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Rode Suiker ×2"], ingredientsEn: ["Egg","Milk","Red Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥛", sellPriceByStar: [670,1005,1340,2680,5360] },
  { nameNl: "Aardbeienjam", nameEn: "Strawberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Aardbei ×4"], ingredientsEn: ["Strawberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳", sellPriceByStar: [1580,2370,3160,6320,12640] },
  { nameNl: "Tomatensaus", nameEn: "Tomato Sauce", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tomaat ×4"], ingredientsEn: ["Tomato x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍛", sellPriceByStar: [180,270,360,720,1440] },
  { nameNl: "Paarse Rolcake", nameEn: "Violet Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Paarse Suiker ×2"], ingredientsEn: ["Egg","Milk","Violet Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🦀", sellPriceByStar: [570,855,1140,2280,4560] },
  { nameNl: "Gele Rolcake", nameEn: "Yellow Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Gele Suiker ×2"], ingredientsEn: ["Egg","Milk","Yellow Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍤", sellPriceByStar: [670,1005,1340,2680,5360] },
  { nameNl: "Kaastaart", nameEn: "Cheese Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Kaas","Tarwe","Melk"], ingredientsEn: ["Cheese","Wheat","Milk"], level: 2, rarityColorKey: "forestSoft", xp: 20, emoji: "🍤", sellPriceByStar: [480,720,960,1920,3840] },
  { nameNl: "Gerookte Visbagel", nameEn: "Smoked Fish Bagel", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vis (willekeurig)","Kaas","Groente (willekeurig)","Tarwe"], ingredientsEn: ["Any Fish","Cheese","Any Vegetable","Wheat"], level: 2, rarityColorKey: "forestSoft", xp: 20, emoji: "🍜", sellPriceByStar: [520,780,1040,2080,4160] },
  { nameNl: "Zwarte Truffel Roomtaart", nameEn: "Black Truffle Cream Pasta", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Truffel","Tarwe ×2","Melk"], ingredientsEn: ["Truffle","Wheat x2","Milk"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🍜", sellPriceByStar: [900,1350,1980,3600,7200] },
  { nameNl: "Rustieke Ratatouille", nameEn: "Rustic Ratatouille", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tomaat","Aardappel","Sla"], ingredientsEn: ["Tomato","Potato","Lettuce"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🍯", sellPriceByStar: [640,960,1280,2560,5120] },
  { nameNl: "Zeevruchtenrisotto", nameEn: "Seafood Risotto", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2","Tarwe","Tomaat"], ingredientsEn: ["Shellfish x2","Wheat","Tomato"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🥧", sellPriceByStar: [490,735,980,1960,3920] },
  { nameNl: "Pasta met Vleessaus", nameEn: "Meat Sauce Pasta", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vlees","Tarwe","Tomaat","Kaas"], ingredientsEn: ["Meat","Wheat","Tomato","Cheese"], level: 4, rarityColorKey: "skyDark", xp: 30, emoji: "🦀", sellPriceByStar: [670,1005,1340,2680,5360] },
  { nameNl: "Zeevruchtenpizza", nameEn: "Seafood Pizza", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Kaas","Jam","Tarwe","Vis (willekeurig)"], ingredientsEn: ["Cheese","Jam","Wheat","Any Fish"], level: 4, rarityColorKey: "skyDark", xp: 30, emoji: "🍰", sellPriceByStar: [780,1170,1560,3120,6240] },
  { nameNl: "Appeltaart", nameEn: "Apple Pie", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Appel","Tarwe","Ei","Boter"], ingredientsEn: ["Apple","Wheat","Egg","Butter"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🥧", sellPriceByStar: [730,1095,1460,2920,5840] },
  { nameNl: "Wortelcake", nameEn: "Carrot Cake", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Wortel ×2","Tarwe","Ei"], ingredientsEn: ["Carrot x2","Wheat","Egg"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🦀", sellPriceByStar: [840,1260,1680,3360,6720] },
  { nameNl: "Maissoep", nameEn: "Corn Soup", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Melk","Boter","Maïs ×2"], ingredientsEn: ["Milk","Butter","Corn x2"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🥛", sellPriceByStar: [1340,2010,2680,5360,10720] },
  { nameNl: "Luxe Zeevruchtenplateau", nameEn: "Deluxe Seafood Platter", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2","Vis (willekeurig) ×2"], ingredientsEn: ["Shellfish x2","Any Fish x2"], level: 6, rarityColorKey: "skyDark", xp: 40, emoji: "🍰", sellPriceByStar: [410,615,820,1640,3280] },
  { nameNl: "Tiramisu", nameEn: "Tiramisu", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen","Ei","Melk","Kaas"], ingredientsEn: ["Coffee Beans","Egg","Milk","Cheese"], level: 6, rarityColorKey: "skyDark", xp: 40, emoji: "🥘", sellPriceByStar: [530,795,1060,2120,4240] },
  { nameNl: "Blauwe Rivierkreeft Sashimi", nameEn: "Blue European Crayfish Sashimi", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Sla"], ingredientsEn: ["Shellfish x3","Lettuce"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍞", sellPriceByStar: [1310,1965,2620,5240,10480] },
  { nameNl: "Rivierkreeft Sashimi", nameEn: "Crayfish Sashimi", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Sla"], ingredientsEn: ["Shellfish x3","Lettuce"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍯", sellPriceByStar: [850,1275,1700,3400,6800] },
  { nameNl: "Vleesburger", nameEn: "Meat Burger", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tarwe","Sla","Vlees","Jam"], ingredientsEn: ["Wheat","Lettuce","Meat","Jam"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍛", sellPriceByStar: [1350,2025,2700,5400,10800] },
  { nameNl: "Gebakken Aubergine met Vlees", nameEn: "Baked Eggplant w/ Meat", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Aubergine","Vlees","Bakolie","Jam"], ingredientsEn: ["Eggplant","Meat","Cooking Oil","Jam"], level: 9, rarityColorKey: "coralDark", xp: 55, emoji: "🍲", sellPriceByStar: [1230,1845,2460,4920,9840] },
  { nameNl: "Gestoomde Gouden Krab", nameEn: "Steamed Golden Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Boter"], ingredientsEn: ["Butter"], level: 10, rarityColorKey: "yellow", xp: 60, emoji: "🥗", sellPriceByStar: [2980,4470,5960,11920,23840] },
  { nameNl: "Gestoomde Koningskrab", nameEn: "Steamed King Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Boter"], ingredientsEn: ["Shellfish x3","Butter"], level: 10, rarityColorKey: "yellow", xp: 60, emoji: "🍞", sellPriceByStar: [1990,2985,3980,7960,15920] },
  { nameNl: "Milkshake", nameEn: "Milkshake", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Druif ×2","Melk ×2"], ingredientsEn: ["Grape x2","Milk x2"], level: 11, rarityColorKey: "yellow", xp: 65, emoji: "🍤", sellPriceByStar: [400,600,800,1600,3200] },
  { nameNl: "Gevulde Krab met Kaasgarnalen", nameEn: "Cheese Shrimp Stuffed Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2"], ingredientsEn: ["Shellfish x2"], level: 13, rarityColorKey: "yellow", xp: 75, emoji: "🍮", sellPriceByStar: null },
  { nameNl: "Garnaal-Avocadobekertje", nameEn: "Shrimp Avocado Cup", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Garnaal","Avocado"], ingredientsEn: ["Shrimp","Avocado"], level: 13, rarityColorKey: "yellow", xp: 75, emoji: "🍲", sellPriceByStar: null },
];

export function useRecipes(): RecipeItem[] {
  return useMemo(
    () =>
      RECIPES_RAW.map((r) => ({
    name: r.nameEn,
    rarity: r.rarityEn,
    tool: r.toolEn,
    ingredients: r.ingredientsEn,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    xp: r.xp,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    []
  );
}
