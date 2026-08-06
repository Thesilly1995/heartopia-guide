import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent, WeatherKind } from '@/lib/remote-content';

export interface CurrentWeather {
  kind: WeatherKind | null;
  label: string | null;
  emoji: string;
  /** true als er geen data is, of het 6-uursblok waar de data over ging al voorbij is. */
  stale: boolean;
  /** Blokeinde in de lokale tijd van het toestel, bv. "19:00". Null als er geen data is. */
  validUntilLabel: string | null;
}

function formatLocalTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

const WEATHER_EMOJI: Record<WeatherKind, string> = {
  sunny: '☀️',
  rain: '🌧️',
  rainbow: '🌈',
};

/**
 * Het huidige spelweer (Zonnig/Regen/Regenboog) wisselt elke 6 uur op een vast
 * schema, maar WELK weertype dat is per blok is niet uit de klok af te leiden —
 * dat komt uit remote content die elk blok opnieuw wordt bijgewerkt. Zonder die
 * data (of als het blok waar de laatste data over ging al voorbij is) tonen we
 * expliciet "onbekend/verouderd" i.p.v. te gokken.
 */
export function useCurrentWeather(): CurrentWeather {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const weather = payload?.weather;

  return useMemo(() => {
    if (!weather) return { kind: null, label: null, emoji: '❔', stale: true, validUntilLabel: null };
    const expired = new Date(weather.validUntil).getTime() < Date.now();
    return {
      kind: weather.kind,
      label: language === 'en' ? weather.labelEn : weather.labelNl,
      emoji: WEATHER_EMOJI[weather.kind] ?? '❔',
      stale: expired,
      validUntilLabel: formatLocalTime(weather.validUntil),
    };
  }, [weather, language]);
}
