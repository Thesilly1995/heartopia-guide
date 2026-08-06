import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface EventRecipeItem {
  name: string;
  ingredients: string[];
  emoji: string;
}

interface EventRecipeRaw {
  nameNl: string;
  nameEn: string;
  ingredientsNl: string[];
  ingredientsEn: string[];
  emoji: string;
}

const EVENT_RECIPES_RAW: EventRecipeRaw[] = [
  { nameNl: "IJskoud Oceaandrankje", nameEn: "Ocean Iced Drink", ingredientsNl: ["2x Spirulina Poeder","2x Sterfruit"], ingredientsEn: ["2x Spirulina Poeder","2x Sterfruit"], emoji: "🍽️" },
  { nameNl: "Tomaten Zeevruchtensoep", nameEn: "Tomato Seafood Soup", ingredientsNl: ["Garnaal","Tomaat","Zeekraal","Tarwe"], ingredientsEn: ["Garnaal","Tomaat","Zeekraal","Tarwe"], emoji: "🍽️" },
  { nameNl: "Schelpparel Taart", nameEn: "Seashell Pearl Cake", ingredientsNl: ["Sint-Jakobsschelp","Tarwe","Melk","Fruit"], ingredientsEn: ["Sint-Jakobsschelp","Tarwe","Melk","Fruit"], emoji: "🍽️" },
  { nameNl: "Gegrilde Inktvis met Vruchtenjam", nameEn: "Grilled Squid with Fruit Jam", ingredientsNl: ["Japanse Vliegende Inktvis","Zeedruiven","Wakame","Vruchtenjam"], ingredientsEn: ["Japanse Vliegende Inktvis","Zeedruiven","Wakame","Vruchtenjam"], emoji: "🍽️" },
  { nameNl: "Oceaanfeestmaal", nameEn: "Ocean Feast", ingredientsNl: ["IJskoud Oceaandrankje","Tomaten Zeevruchtensoep","Schelpparel Taart","Gegrilde Inktvis met Vruchtenjam"], ingredientsEn: ["IJskoud Oceaandrankje","Tomaten Zeevruchtensoep","Schelpparel Taart","Gegrilde Inktvis met Vruchtenjam"], emoji: "🍽️" },
];

export function useEventRecipes(): EventRecipeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      EVENT_RECIPES_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    ingredients: language === 'en' ? r.ingredientsEn : r.ingredientsNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
