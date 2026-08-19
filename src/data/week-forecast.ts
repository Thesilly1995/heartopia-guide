import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { RemoteWeekForecastSlot, useRemoteContent, WeekForecastBlock, WeekForecastKind } from '@/lib/remote-content';

export interface WeekForecastSlot {
  kind: WeekForecastKind;
  emoji: string;
  label: string;
  /** bv. "00:00–06:00", null als het tijdstip nog niet bekend is. */
  blockLabel: string | null;
}

export interface WeekForecastEntry {
  date: string;
  slots: WeekForecastSlot[];
  /** Alle bijzonderheden van de dag als tekst achter elkaar, met tijd erbij zodra bekend. */
  label: string;
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

const BLOCK_LABELS: Record<WeekForecastBlock, string> = {
  '00-06': '00:00–06:00',
  '06-12': '06:00–12:00',
  '12-18': '12:00–18:00',
  '18-00': '18:00–00:00',
};

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
 * uitschieters. Dagen vóór vandaag worden niet getoond. Elke bijzonderheid
 * kan een tijdsblok (servertijd, een van de vier vaste 6-uursblokken)
 * hebben zodra dat bekend is, zodat spelers niet zelf het spel hoeven te
 * openen om te zien wanneer precies iets begint.
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
        const rawKinds: (WeekForecastKind | RemoteWeekForecastSlot)[] =
          entry.kinds.length > 0 ? entry.kinds : [{ kind: 'normal' }];
        const slots: WeekForecastSlot[] = rawKinds.map((raw) => {
          const kind = typeof raw === 'string' ? raw : raw.kind;
          const block = typeof raw === 'string' ? undefined : raw.block;
          return {
            kind,
            emoji: EMOJI[kind],
            label: LABELS[language][kind],
            blockLabel: block ? BLOCK_LABELS[block] : null,
          };
        });
        return {
          date: entry.date,
          slots,
          label: slots.map((slot) => (slot.blockLabel ? `${slot.label} (${slot.blockLabel})` : slot.label)).join(' + '),
          dayLabel: isToday ? TODAY_LABEL[language] : weekday,
          weekdayLabel: weekday,
        };
      });
  }, [payload, language]);
}
