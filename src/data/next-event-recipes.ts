import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';
import { RemoteEventRecipe, useRemoteContent } from '@/lib/remote-content';

export interface NextEventRecipeItem {
  name: string;
  ingredients: string[];
  emoji: string;
}

function localizeRecipe(item: RemoteEventRecipe, language: Language): NextEventRecipeItem {
  const name =
    language === 'es' ? item.nameEs ?? item.nameEn
    : language === 'pt' ? item.namePt ?? item.nameEn
    : language === 'fr' ? item.nameFr ?? item.nameEn
    : language === 'de' ? item.nameDe ?? item.nameEn
    : language === 'en' ? item.nameEn
    : item.nameNl;
  const ingredients =
    language === 'es' ? item.ingredientsEs ?? item.ingredientsEn
    : language === 'pt' ? item.ingredientsPt ?? item.ingredientsEn
    : language === 'fr' ? item.ingredientsFr ?? item.ingredientsEn
    : language === 'de' ? item.ingredientsDe ?? item.ingredientsEn
    : language === 'en' ? item.ingredientsEn
    : item.ingredientsNl;
  return { name, ingredients, emoji: item.emoji };
}

/**
 * Receptenpreview van het volgende (nog niet gestarte) event — puur
 * `remote-content.json`, geen gebundelde fallback, want dit is per
 * definitie tijdelijke vooraankondiging-content.
 */
export function useNextEventRecipes(): NextEventRecipeItem[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const raw = payload?.nextEventRecipes ?? [];
    return raw.map((item) => localizeRecipe(item, language));
  }, [payload, language]);
}
