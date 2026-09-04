import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface TipItem {
  title: string;
  body: string;
  emoji: string;
}

export interface TipCategory {
  key: string;
  label: string;
  tips: TipItem[];
}

interface TipRaw {
  titleNl: string;
  titleEn: string;
  bodyNl: string;
  bodyEn: string;
  emoji: string;
}

interface TipCategoryRaw {
  key: string;
  labelNl: string;
  labelEn: string;
  tips: TipRaw[];
}

const TIP_CATEGORIES_RAW: TipCategoryRaw[] = [
  {
    key: 'algemeen',
    labelNl: 'Algemene tips',
    labelEn: 'General tips',
    tips: [
      {
        titleNl: 'Vis tijdens Regenboog-weer',
        titleEn: 'Fish during Rainbow weather',
        bodyNl: 'Sommige zeldzame vissen en insecten zijn alleen te vangen tijdens Regenboog-weer — check "Weer deze week" op het homescherm en plan je vangsessies daarop.',
        bodyEn: 'Some rare fish and insects can only be caught during Rainbow weather — check "Weather this week" on the homescreen and plan your catching sessions around it.',
        emoji: '🌈',
      },
      {
        titleNl: 'Wissel elke dag van plot',
        titleEn: 'Check the daily plot rotation',
        bodyNl: 'De Zwervende Eik en de dagelijkse Fluoriet-plek verspringen elke dag naar een andere plot — check de Plotkalender op het homescherm voordat je op pad gaat, anders sta je voor niets bij de verkeerde plot.',
        bodyEn: 'The Roaming Oak and the daily Fluorite spot move to a different plot every day — check the Plot Calendar on the homescreen before heading out, otherwise you might show up at the wrong plot.',
        emoji: '🌳',
      },
      {
        titleNl: 'Meteorenregen blijft even hakbaar',
        titleEn: 'Meteor ore stays mineable for a while',
        bodyNl: 'Na een meteorenregen blijven de ertsstukken nog 24 uur na de start van de regen hakbaar — je hoeft dus niet meteen die avond nog alles te doen.',
        bodyEn: 'After a meteor shower, the ore pieces stay mineable for 24 hours after the shower starts — you don’t have to get everything done that same evening.',
        emoji: '☄️',
      },
      {
        titleNl: 'Sommige wilde dieren zijn tijdelijk',
        titleEn: 'Some wild animals are temporary',
        bodyNl: 'Dieren zoals de Dolfijn en Pinguïn horen bij een event en zijn buiten dat event niet te voeren — hun vriendschapsniveau blijft wel gewoon bijgehouden voor het geval ze terugkeren.',
        bodyEn: 'Animals like the Dolphin and Penguin belong to an event and can’t be fed outside of it — their friendship level stays tracked in case they return.',
        emoji: '🐬',
      },
    ],
  },
];

export function useTips(): TipCategory[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      TIP_CATEGORIES_RAW.map((c) => ({
        key: c.key,
        label: language === 'en' ? c.labelEn : c.labelNl,
        tips: c.tips.map((t) => ({
          title: language === 'en' ? t.titleEn : t.titleNl,
          body: language === 'en' ? t.bodyEn : t.bodyNl,
          emoji: t.emoji,
        })),
      })),
    [language]
  );
}
