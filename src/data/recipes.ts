import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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
}

const RECIPES_RAW: RecipeRaw[] = [
  { nameNl: "Appeljam", nameEn: "Apple Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Appel ×4"], ingredientsEn: ["Apple x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍰" },
  { nameNl: "Zwarte Truffeltaart", nameEn: "Black Truffle Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥗" },
  { nameNl: "Blauwe Rolcake", nameEn: "Blue Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Blauwe Suiker ×2"], ingredientsEn: ["Egg","Milk","Blue Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳" },
  { nameNl: "Bosbessenjam", nameEn: "Blueberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Bosbes ×4"], ingredientsEn: ["Blueberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥘" },
  { nameNl: "Champignontaart", nameEn: "Button Mushroom Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍛" },
  { nameNl: "Chocoladesaus", nameEn: "Chocolate Sauce", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Cacao ×4"], ingredientsEn: ["Cocoa x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🧁" },
  { nameNl: "Koffie", nameEn: "Coffee", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen ×4"], ingredientsEn: ["Coffee Beans x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "☕" },
  { nameNl: "Koffie Latte", nameEn: "Coffee Latte", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen ×2","Melk ×2"], ingredientsEn: ["Coffee Beans x2","Milk x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍫" },
  { nameNl: "Fish & Chips", nameEn: "Fish N Chips", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vis (willekeurig) ×2","Aardappel ×2"], ingredientsEn: ["Any Fish x2","Potato x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥧" },
  { nameNl: "Druivenjam", nameEn: "Grape Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Druif ×4"], ingredientsEn: ["Grape x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍲" },
  { nameNl: "Groene Rolcake", nameEn: "Green Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Groene Suiker ×2"], ingredientsEn: ["Egg","Milk","Green Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍜" },
  { nameNl: "Gegrilde Champignon", nameEn: "Grilled Mushroom", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×4"], ingredientsEn: ["Any Mushroom x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥗" },
  { nameNl: "Huissalade", nameEn: "House Salad", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Groente (willekeurig) ×2"], ingredientsEn: ["Any Vegetable x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍞" },
  { nameNl: "Indigo Rolcake", nameEn: "Indigo Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk"], ingredientsEn: ["Egg","Milk"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳" },
  { nameNl: "Mandarijnjam", nameEn: "Mandarin Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Mandarijn ×4"], ingredientsEn: ["Mandarin x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥘" },
  { nameNl: "Paddenstoeltaart", nameEn: "Mushroom Pie", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Paddenstoel (willekeurig) ×2","Tarwe","Ei"], ingredientsEn: ["Any Mushroom x2","Wheat","Egg"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍮" },
  { nameNl: "Originele Rolcake", nameEn: "Original Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Suiker ×2"], ingredientsEn: ["Egg","Milk","Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🧁" },
  { nameNl: "Ananasjam", nameEn: "Pineapple Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ananas ×4"], ingredientsEn: ["Pineapple x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "☕" },
  { nameNl: "Frambozenjam", nameEn: "Raspberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Framboos ×4"], ingredientsEn: ["Raspberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍫" },
  { nameNl: "Rode Rolcake", nameEn: "Red Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Rode Suiker ×2"], ingredientsEn: ["Egg","Milk","Red Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🥛" },
  { nameNl: "Aardbeienjam", nameEn: "Strawberry Jam", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Aardbei ×4"], ingredientsEn: ["Strawberry x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍳" },
  { nameNl: "Tomatensaus", nameEn: "Tomato Sauce", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tomaat ×4"], ingredientsEn: ["Tomato x4"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍛" },
  { nameNl: "Paarse Rolcake", nameEn: "Violet Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Paarse Suiker ×2"], ingredientsEn: ["Egg","Milk","Violet Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🦀" },
  { nameNl: "Gele Rolcake", nameEn: "Yellow Roll Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Ei","Melk","Gele Suiker ×2"], ingredientsEn: ["Egg","Milk","Yellow Sugar x2"], level: 1, rarityColorKey: "forestSoft", xp: 15, emoji: "🍤" },
  { nameNl: "Kaastaart", nameEn: "Cheese Cake", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Kaas","Tarwe","Melk"], ingredientsEn: ["Cheese","Wheat","Milk"], level: 2, rarityColorKey: "forestSoft", xp: 20, emoji: "🍤" },
  { nameNl: "Gerookte Visbagel", nameEn: "Smoked Fish Bagel", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vis (willekeurig)","Kaas","Groente (willekeurig)","Tarwe"], ingredientsEn: ["Any Fish","Cheese","Any Vegetable","Wheat"], level: 2, rarityColorKey: "forestSoft", xp: 20, emoji: "🍜" },
  { nameNl: "Zwarte Truffel Roomtaart", nameEn: "Black Truffle Cream Pasta", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Truffel","Tarwe ×2","Melk"], ingredientsEn: ["Truffle","Wheat x2","Milk"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🍜" },
  { nameNl: "Rustieke Ratatouille", nameEn: "Rustic Ratatouille", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tomaat","Aardappel","Sla"], ingredientsEn: ["Tomato","Potato","Lettuce"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🍯" },
  { nameNl: "Zeevruchtenrisotto", nameEn: "Seafood Risotto", rarityNl: "Gewoon", rarityEn: "Common", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2","Tarwe","Tomaat"], ingredientsEn: ["Shellfish x2","Wheat","Tomato"], level: 3, rarityColorKey: "forestSoft", xp: 25, emoji: "🥧" },
  { nameNl: "Pasta met Vleessaus", nameEn: "Meat Sauce Pasta", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Vlees","Tarwe","Tomaat","Kaas"], ingredientsEn: ["Meat","Wheat","Tomato","Cheese"], level: 4, rarityColorKey: "skyDark", xp: 30, emoji: "🦀" },
  { nameNl: "Zeevruchtenpizza", nameEn: "Seafood Pizza", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Kaas","Jam","Tarwe","Vis (willekeurig)"], ingredientsEn: ["Cheese","Jam","Wheat","Any Fish"], level: 4, rarityColorKey: "skyDark", xp: 30, emoji: "🍰" },
  { nameNl: "Appeltaart", nameEn: "Apple Pie", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Appel","Tarwe","Ei","Boter"], ingredientsEn: ["Apple","Wheat","Egg","Butter"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🥧" },
  { nameNl: "Wortelcake", nameEn: "Carrot Cake", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Wortel ×2","Tarwe","Ei"], ingredientsEn: ["Carrot x2","Wheat","Egg"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🦀" },
  { nameNl: "Maissoep", nameEn: "Corn Soup", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Melk","Boter","Maïs ×2"], ingredientsEn: ["Milk","Butter","Corn x2"], level: 5, rarityColorKey: "skyDark", xp: 35, emoji: "🥛" },
  { nameNl: "Luxe Zeevruchtenplateau", nameEn: "Deluxe Seafood Platter", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2","Vis (willekeurig) ×2"], ingredientsEn: ["Shellfish x2","Any Fish x2"], level: 6, rarityColorKey: "skyDark", xp: 40, emoji: "🍰" },
  { nameNl: "Tiramisu", nameEn: "Tiramisu", rarityNl: "Zeldzaam", rarityEn: "Rare", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Koffiebonen","Ei","Melk","Kaas"], ingredientsEn: ["Coffee Beans","Egg","Milk","Cheese"], level: 6, rarityColorKey: "skyDark", xp: 40, emoji: "🥘" },
  { nameNl: "Blauwe Rivierkreeft Sashimi", nameEn: "Blue European Crayfish Sashimi", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Sla"], ingredientsEn: ["Shellfish x3","Lettuce"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍞" },
  { nameNl: "Rivierkreeft Sashimi", nameEn: "Crayfish Sashimi", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Sla"], ingredientsEn: ["Shellfish x3","Lettuce"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍯" },
  { nameNl: "Vleesburger", nameEn: "Meat Burger", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Tarwe","Sla","Vlees","Jam"], ingredientsEn: ["Wheat","Lettuce","Meat","Jam"], level: 8, rarityColorKey: "coralDark", xp: 50, emoji: "🍛" },
  { nameNl: "Gebakken Aubergine met Vlees", nameEn: "Baked Eggplant w/ Meat", rarityNl: "Episch", rarityEn: "Epic", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Aubergine","Vlees","Bakolie","Jam"], ingredientsEn: ["Eggplant","Meat","Cooking Oil","Jam"], level: 9, rarityColorKey: "coralDark", xp: 55, emoji: "🍲" },
  { nameNl: "Gestoomde Gouden Krab", nameEn: "Steamed Golden Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Boter"], ingredientsEn: ["Butter"], level: 10, rarityColorKey: "yellow", xp: 60, emoji: "🥗" },
  { nameNl: "Gestoomde Koningskrab", nameEn: "Steamed King Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×3","Boter"], ingredientsEn: ["Shellfish x3","Butter"], level: 10, rarityColorKey: "yellow", xp: 60, emoji: "🍞" },
  { nameNl: "Milkshake", nameEn: "Milkshake", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Druif ×2","Melk ×2"], ingredientsEn: ["Grape x2","Milk x2"], level: 11, rarityColorKey: "yellow", xp: 65, emoji: "🍤" },
  { nameNl: "Gevulde Krab met Kaasgarnalen", nameEn: "Cheese Shrimp Stuffed Crab", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Schelpdier ×2"], ingredientsEn: ["Shellfish x2"], level: 13, rarityColorKey: "yellow", xp: 75, emoji: "🍮" },
  { nameNl: "Garnaal-Avocadobekertje", nameEn: "Shrimp Avocado Cup", rarityNl: "Legendarisch", rarityEn: "Legendary", toolNl: "Fornuis", toolEn: "Stove", ingredientsNl: ["Garnaal","Avocado"], ingredientsEn: ["Shrimp","Avocado"], level: 13, rarityColorKey: "yellow", xp: 75, emoji: "🍲" },
];

export function useRecipes(): RecipeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      RECIPES_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    rarity: language === 'en' ? r.rarityEn : r.rarityNl,
    tool: language === 'en' ? r.toolEn : r.toolNl,
    ingredients: language === 'en' ? r.ingredientsEn : r.ingredientsNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    xp: r.xp,
    emoji: r.emoji,
      })),
    [language]
  );
}
