import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent, WeekForecastKind } from '@/lib/remote-content';

export interface WeekForecastEntry {
  date: string;
  kind: WeekForecastKind;
  label: string;
  emoji: string;
  dayLabel: string;
}

const EMOJI: Record<WeekForecastKind, string> = {
  normal: '⛅',
  rain: '🌧️',
  rainbow: '🌈',
  warm_sun: '☀️',
  meteor: '☄️',
};

const LABELS = {
  nl: {
    normal: 'Niks bijzonders',
    rain: 'Regen',
    rainbow: 'Regenboog',
    warm_sun: 'Warme zon',
    meteor: 'Meteorenregen',
  },
  en: {
    normal: 'Nothing special',
    rain: 'Rain',
    rainbow: 'Rainbow',
    warm_sun: 'Warm sun',
    meteor: 'Meteor shower',
  },
} as const;

const WEEKDAYS = {
  nl: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const;

const TODAY_LABEL = { nl: 'Vandaag', en: 'Today' } as const;

function todayDateStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * De weekvoorspelling (in-game weekvoorspelling-telefoontje): één rij per
 * resterende dag van vandaag tot en met zondag, inclusief dagen zonder
 * bijzonderheden — zo zie je in één oogopslag de hele week, niet alleen de
 * uitschieters. Dagen vóór vandaag worden niet getoond.
 */
export function useWeekForecast(): WeekForecastEntry[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const entries = payload?.weekForecast ?? [];
    const today = todayDateStr();
    return entries
      .filter((entry) => entry.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => {
        const isToday = entry.date === today;
        const weekday = WEEKDAYS[language][new Date(`${entry.date}T00:00:00`).getDay()];
        return {
          date: entry.date,
          kind: entry.kind,
          label: LABELS[language][entry.kind],
          emoji: EMOJI[entry.kind],
          dayLabel: isToday ? TODAY_LABEL[language] : weekday,
        };
      });
  }, [payload, language]);
}
