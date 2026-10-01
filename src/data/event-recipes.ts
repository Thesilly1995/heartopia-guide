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
  nameEs: string;
  namePt: string;
  ingredientsNl: string[];
  ingredientsEn: string[];
  ingredientsEs: string[];
  ingredientsPt: string[];
  emoji: string;
}

const EVENT_RECIPES_RAW: EventRecipeRaw[] = [];

export function useEventRecipes(): EventRecipeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      EVENT_RECIPES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameEn : language === 'de' ? r.nameEn : language === 'en' ? r.nameEn : r.nameNl,
    ingredients: r.ingredientsEn,
    emoji: r.emoji,
      })),
    [language]
  );
}
