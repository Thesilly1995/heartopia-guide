import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

export interface SpecialWeatherEntry {
  kind: 'rain' | 'rainbow' | 'warm_sun' | 'meteor';
  label: string;
  emoji: string;
  whenLabel: string;
  startsAt: string;
}

const EMOJI: Record<SpecialWeatherEntry['kind'], string> = {
  rain: '🌧️',
  rainbow: '🌈',
  warm_sun: '☀️',
  meteor: '☄️',
};

const WEEKDAYS = {
  nl: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const;

// Blokken duren ~6 uur (zelfde systeem als het huidige-weer-blok) — een entry
// blijft in de lijst staan totdat dat blok voorbij is, niet alleen tot het begin.
const BLOCK_DURATION_MS = 6 * 60 * 60 * 1000;

function formatWhen(iso: string, language: 'nl' | 'en'): string {
  const d = new Date(iso);
  const weekday = WEEKDAYS[language][d.getDay()];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${weekday} ${hh}:${mm}`;
}

/**
 * Vooraf aangekondigde bijzondere weersomstandigheden deze week (regen,
 * regenboog, warme zon, meteorenregen) uit de in-game weekvoorspelling.
 * Toont alleen items waarvan het blok nog niet voorbij is, gesorteerd op tijd.
 * Normaal weer wordt bewust niet doorgegeven/getoond — zie remote-content.md.
 */
export function useSpecialWeatherForecast(): SpecialWeatherEntry[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const entries = payload?.specialWeather ?? [];
    const now = Date.now();
    return entries
      .filter((entry) => new Date(entry.startsAt).getTime() + BLOCK_DURATION_MS > now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .map((entry) => ({
        kind: entry.kind,
        label: language === 'en' ? entry.labelEn : entry.labelNl,
        emoji: EMOJI[entry.kind] ?? '❔',
        whenLabel: formatWhen(entry.startsAt, language),
        startsAt: entry.startsAt,
      }));
  }, [payload, language]);
}
