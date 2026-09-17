import { useMemo } from 'react';

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
  return useMemo(
    () =>
      EVENT_RECIPES_RAW.map((r) => ({
    name: r.nameEn,
    ingredients: r.ingredientsEn,
    emoji: r.emoji,
      })),
    []
  );
}
