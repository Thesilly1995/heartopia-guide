import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface PetFoodItem {
  key: string;
  name: string;
}

interface PetFoodRaw {
  key: string;
  nameNl: string;
  nameEn: string;
}

/**
 * Katten eten "Universal Animal Food" — in de praktijk elke vis die je vangt.
 * Bron: community-tracker "Pet Food"-tabblad, namen 1-op-1 overgenomen uit
 * src/data/fish.ts zodat de Nederlandse namen overal consistent blijven.
 */
const CAT_FOOD_RAW: PetFoodRaw[] = [
  { key: 'cf1', nameNl: 'Barbeel', nameEn: 'Barbel' },
  { key: 'cf2', nameNl: 'Riemvis', nameEn: 'Beltfish' },
  { key: 'cf3', nameNl: 'Alver', nameEn: 'Common Bleak' },
  { key: 'cf4', nameNl: 'Kopvoorn', nameEn: 'Common Chub' },
  { key: 'cf5', nameNl: 'Gewone Garnaal', nameEn: 'Common Prawn' },
  { key: 'cf6', nameNl: 'Gewone Marene', nameEn: 'Common Whitefish' },
  { key: 'cf7', nameNl: 'Baars', nameEn: 'European Perch' },
  { key: 'cf8', nameNl: 'Elrits', nameEn: 'Minnow' },
  { key: 'cf9', nameNl: 'Oosterse Garnaal', nameEn: 'Oriental Shrimp' },
  { key: 'cf10', nameNl: 'Sardine', nameEn: 'Sardine' },
  { key: 'cf11', nameNl: 'Horsmakreel', nameEn: 'Scad' },
  { key: 'cf12', nameNl: 'Schneider (Alandblei)', nameEn: 'Schneider' },
  { key: 'cf13', nameNl: 'Zeebaars', nameEn: 'Sea Bass' },
  { key: 'cf14', nameNl: 'Zeedoornbaars', nameEn: 'Sea Stickleback' },
  { key: 'cf15', nameNl: 'Boniter (Tonijn)', nameEn: 'Skipjack Tuna' },
  { key: 'cf16', nameNl: 'Kroeskarper-modderkruiper', nameEn: 'Spined Loach' },
  { key: 'cf17', nameNl: 'Streber', nameEn: 'Streber' },
  { key: 'cf18', nameNl: 'Gestreepte Mul', nameEn: 'Striped Red Mullet' },
  { key: 'cf19', nameNl: 'Zeelt', nameEn: 'Tench' },
  { key: 'cf20', nameNl: 'Zeeduivel', nameEn: 'Anglerfish' },
  { key: 'cf21', nameNl: 'Spiering', nameEn: 'European Smelt' },
  { key: 'cf22', nameNl: 'Valse Horsmakreel', nameEn: 'False Scad' },
  { key: 'cf23', nameNl: 'Modderzonnebaars', nameEn: 'Mud Sunfish' },
  { key: 'cf24', nameNl: 'Pos', nameEn: 'Ruffe' },
  { key: 'cf25', nameNl: 'Steengrondel', nameEn: 'Stone Loach' },
  { key: 'cf26', nameNl: 'Atlantische Dwerginktvis', nameEn: 'Atlantic Pygmy Octopus' },
  { key: 'cf27', nameNl: 'Atlantische Zalm', nameEn: 'Atlantic Salmon' },
  { key: 'cf28', nameNl: 'Clownvis', nameEn: 'Clownfish' },
  { key: 'cf29', nameNl: 'Europese Rivierkreeft', nameEn: 'European Crayfish' },
  { key: 'cf30', nameNl: 'Heremietkreeft', nameEn: 'Hermit Crab' },
  { key: 'cf31', nameNl: 'Mossel', nameEn: 'Mussel' },
  { key: 'cf32', nameNl: 'Kikkervisje', nameEn: 'Tadpole' },
  { key: 'cf33', nameNl: 'Tarbot', nameEn: 'Turbot' },
  { key: 'cf34', nameNl: 'Snoekbaars', nameEn: 'Zander' },
  { key: 'cf35', nameNl: 'Kwabaal', nameEn: 'Burbot' },
  { key: 'cf36', nameNl: 'Vlinderkoi', nameEn: 'Butterfly Koi' },
  { key: 'cf37', nameNl: 'Karper', nameEn: 'Common Carp' },
  { key: 'cf38', nameNl: 'Gewone Inktvis', nameEn: 'Common Octopus' },
  { key: 'cf39', nameNl: 'Kroeskarper', nameEn: 'Crucian Carp' },
  { key: 'cf40', nameNl: 'Schol', nameEn: 'European Plaice' },
  { key: 'cf41', nameNl: 'Grondel', nameEn: 'Goby' },
  { key: 'cf42', nameNl: 'Grootbekbaars', nameEn: 'Largemouth Bass' },
  { key: 'cf43', nameNl: 'Konijnvis', nameEn: 'Rabbit Fish' },
  { key: 'cf44', nameNl: 'Roodbuikpiranha', nameEn: 'Red-Bellied Piranha' },
  { key: 'cf45', nameNl: 'Rivierkrab', nameEn: 'River Crab' },
  { key: 'cf46', nameNl: 'Tilapia', nameEn: 'Tilapia' },
  { key: 'cf47', nameNl: 'Atlantische Makreel', nameEn: 'Atlantic Mackerel' },
  { key: 'cf48', nameNl: 'Ruisvoorn', nameEn: 'Common Rudd' },
  { key: 'cf49', nameNl: 'Europese Vliegende Inktvis', nameEn: 'European Flying Squid' },
  { key: 'cf50', nameNl: 'Europese Kreeft', nameEn: 'European Lobster' },
  { key: 'cf51', nameNl: 'Zoetwaterslijmvis', nameEn: 'Freshwater Blenny' },
  { key: 'cf52', nameNl: 'Forel', nameEn: 'Trout' },
  { key: 'cf53', nameNl: 'Hondszalm', nameEn: 'Chum Salmon' },
  { key: 'cf54', nameNl: 'Vlagzalm', nameEn: 'Grayling' },
  { key: 'cf55', nameNl: 'Kogelvis', nameEn: 'Pufferfish' },
  { key: 'cf56', nameNl: 'Rode Poon', nameEn: 'Tub Gurnard' },
  { key: 'cf57', nameNl: 'Zwartvlekbrasem', nameEn: 'Blackspot Seabream' },
  { key: 'cf58', nameNl: 'Paling', nameEn: 'European Eel' },
  { key: 'cf59', nameNl: 'Reuzenriemvis', nameEn: 'Giant Oarfish' },
  { key: 'cf60', nameNl: 'Middellandse Zee Eierlegger', nameEn: 'Mediterranean Killifish' },
  { key: 'cf61', nameNl: 'Gevlekte Rivierdonderpad', nameEn: 'Mottled Sculpin' },
  { key: 'cf62', nameNl: 'Driedoornige Stekelbaars', nameEn: 'Three-Spined Stickleback' },
  { key: 'cf63', nameNl: 'Blauwe Europese Rivierkreeft', nameEn: 'Blue European Crayfish' },
  { key: 'cf64', nameNl: 'Europese Hondsvis', nameEn: 'European Mudminnow' },
  { key: 'cf65', nameNl: 'Gouden Koningskrab', nameEn: 'Golden King Crab' },
  { key: 'cf66', nameNl: 'Goudvis', nameEn: 'Goldfish' },
  { key: 'cf67', nameNl: 'Schelvis', nameEn: 'Haddock' },
  { key: 'cf68', nameNl: 'Koningskrab', nameEn: 'King Crab' },
  { key: 'cf69', nameNl: 'Blauwvintonijn', nameEn: 'Bluefin Tuna' },
  { key: 'cf70', nameNl: 'Huchen', nameEn: 'Huchen' },
  { key: 'cf71', nameNl: 'Snoek', nameEn: 'Northern Pike' },
  { key: 'cf72', nameNl: 'Maanvis (Oceaan)', nameEn: 'Ocean Sunfish' },
  { key: 'cf73', nameNl: 'Zonnebaars', nameEn: 'Pumpkinseed' },
  { key: 'cf74', nameNl: 'Zwaardvis', nameEn: 'Swordfish' },
  { key: 'cf75', nameNl: 'Poolzalm', nameEn: 'Arctic Char' },
  { key: 'cf76', nameNl: 'Blauwkieuwbaars', nameEn: 'Bluegill' },
  { key: 'cf77', nameNl: 'Maanvis', nameEn: 'Moonfish' },
  { key: 'cf78', nameNl: 'Meerval', nameEn: 'Wels Catfish' },
  { key: 'cf79', nameNl: 'Zwartvlek-sergeantvis', nameEn: 'Blackspot Sergeant' },
  { key: 'cf80', nameNl: 'Goudmakreel', nameEn: 'Mahi Mahi' },
  { key: 'cf81', nameNl: 'Vuurvis', nameEn: 'Lionfish' },
  { key: 'cf82', nameNl: 'Witgezicht-doktersvis', nameEn: 'White-Faced Surgeonfish' },
  { key: 'cf83', nameNl: 'Azuurblauwe Rifvis', nameEn: 'Azure Demoiselle' },
  { key: 'cf84', nameNl: 'Blauw-gele Lipvis', nameEn: 'Blue-and-Yellow Wrasse' },
];

/**
 * Honden eten specifieke bereide gerechten (geen vis).
 * Bron: community-tracker "Pet Food"-tabblad.
 */
const DOG_FOOD_RAW: PetFoodRaw[] = [
  { key: 'df1', nameNl: 'Appel', nameEn: 'Apple' },
  { key: 'df2', nameNl: 'Appeljam', nameEn: 'Apple Jam' },
  { key: 'df3', nameNl: 'Bosbessenjam', nameEn: 'Blueberry Jam' },
  { key: 'df4', nameNl: 'Champignonpastei', nameEn: 'Button Mushroom Pie' },
  { key: 'df5', nameNl: 'Champignon', nameEn: 'Button Mushroom' },
  { key: 'df6', nameNl: 'Gegrilde Champignon', nameEn: 'Grilled Button Mushroom' },
  { key: 'df7', nameNl: 'Gegrilde Paddenstoel', nameEn: 'Grilled Mushroom' },
  { key: 'df8', nameNl: 'Gegrilde Oesterzwam', nameEn: 'Grilled Oyster Mushroom' },
  { key: 'df9', nameNl: 'Gegrilde Shiitake', nameEn: 'Grilled Shiitake Mushroom' },
  { key: 'df10', nameNl: 'Huissalade', nameEn: 'House Salad' },
  { key: 'df11', nameNl: 'Gemengde Jam', nameEn: 'Mixed Jam' },
  { key: 'df12', nameNl: 'Paddenstoelenpastei', nameEn: 'Mushroom Pie' },
  { key: 'df13', nameNl: 'Oester', nameEn: 'Oyster' },
  { key: 'df14', nameNl: 'Oesterzwampastei', nameEn: 'Oyster Mushroom Pie' },
  { key: 'df15', nameNl: 'Frambozenjam', nameEn: 'Raspberry Jam' },
  { key: 'df16', nameNl: 'Shiitake', nameEn: 'Shiitake' },
  { key: 'df17', nameNl: 'Shiitakepastei', nameEn: 'Shiitake Pie' },
  { key: 'df18', nameNl: 'Tomatensaus', nameEn: 'Tomato Sauce' },
  { key: 'df19', nameNl: 'Rustieke Ratatouille', nameEn: 'Rustic Ratatouille' },
  { key: 'df20', nameNl: 'Zeevruchtenrisotto', nameEn: 'Seafood Risotto' },
  { key: 'df21', nameNl: 'Pasta met Vleessaus', nameEn: 'Meat Sauce Pasta' },
  { key: 'df22', nameNl: 'Maissoep', nameEn: 'Corn Soup' },
  { key: 'df23', nameNl: 'Deluxe Zeevruchtenschotel', nameEn: 'Deluxe Seafood Platter' },
  { key: 'df24', nameNl: 'Aardbeienjam', nameEn: 'Strawberry Jam' },
  { key: 'df25', nameNl: 'Vleesburger', nameEn: 'Meat Burger' },
  { key: 'df26', nameNl: 'Gebakken Aubergine met Vleessaus', nameEn: 'Baked Eggplant w/ Meat Sauce' },
  { key: 'df27', nameNl: 'Gestoomde Gouden Koningskrab', nameEn: 'Steamed Golden King Crab' },
  { key: 'df28', nameNl: 'Gestoomde Koningskrab', nameEn: 'Steamed King Crab' },
];

function useFoodList(raw: PetFoodRaw[]): PetFoodItem[] {
  const { language } = useLanguage();
  return useMemo(() => raw.map((r) => ({ key: r.key, name: language === 'en' ? r.nameEn : r.nameNl })), [language, raw]);
}

export function useCatFoods(): PetFoodItem[] {
  return useFoodList(CAT_FOOD_RAW);
}

export function useDogFoods(): PetFoodItem[] {
  return useFoodList(DOG_FOOD_RAW);
}
