import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent, WeekForecastKind } from '@/lib/remote-content';

export interface WeekForecastEntry {
  date: string;
  kinds: WeekForecastKind[];
  label: string;
  /** Eén emoji per kind, apart te renderen in eigen <Text>-elementen — samen in
   *  één tekst-string zetten liet op sommige Android-toestellen de tweede emoji
   *  onzichtbaar worden (glyph-shaping-eigenaardigheid bij aaneengesloten emoji). */
  emoji: string[];
  /** "Vandaag" voor de dag van vandaag, anders de weekdagnaam. */
  dayLabel: string;
  /** Altijd de weekdagnaam, ook voor vandaag (bv. "Dinsdag") — voor plekken waar "Vandaag" niet duidelijk genoeg is. */
  weekdayLabel: string;
}

const EMOJI: Record<WeekForecastKind, string> = {
  normal: '⛅',
  rain: '🌧️',
  rainbow: '🌈',
  warm_sun: '☀️',
  meteor: '☄️',
  heatwave: '😎',
};

const LABELS = {
  nl: {
    normal: 'Niks bijzonders',
    rain: 'Regen',
    rainbow: 'Regenboog',
    warm_sun: 'Warme zon',
    meteor: 'Meteorenregen',
    heatwave: 'Hittegolf',
  },
  en: {
    normal: 'Nothing special',
    rain: 'Rain',
    rainbow: 'Rainbow',
    warm_sun: 'Warm sun',
    meteor: 'Meteor shower',
    heatwave: 'Heatwave',
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
        const kinds = entry.kinds.length > 0 ? entry.kinds : (['normal'] as WeekForecastKind[]);
        return {
          date: entry.date,
          kinds,
          label: kinds.map((k) => LABELS[language][k]).join(' + '),
          emoji: kinds.map((k) => EMOJI[k]),
          dayLabel: isToday ? TODAY_LABEL[language] : weekday,
          weekdayLabel: weekday,
        };
      });
  }, [payload, language]);
}
