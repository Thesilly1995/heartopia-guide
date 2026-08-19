import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

export interface EventSpot {
  num: number;
  x: number;
  y: number;
  description: string;
  /** true = onderwater op de Whalefall Canyon-kaart, false = hoofdeiland-kaart. */
  underwater: boolean;
  /** true = dit is Doris' plek (NPC bij Whalefall Canyon, ook aanwezig tijdens meteorenregen), krijgt een ander icoon dan de gewone ertsplekken. */
  isDoris: boolean;
}

// Bundel-fallback: leeg totdat REMOTE_CONTENT_URL data levert, of totdat een
// sessie de actuele ertsplekken handmatig invult. Zie docs/remote-content.md.
const METEOR_SPOTS_FALLBACK: EventSpot[] = [];

export function useMeteorSpots(): EventSpot[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    if (payload?.meteorSpots && payload.meteorSpots.length > 0) {
      return payload.meteorSpots.map((spot) => ({
        num: spot.num,
        x: spot.x,
        y: spot.y,
        description: language === 'en' ? spot.descriptionEn : spot.descriptionNl,
        underwater: spot.underwater,
        isDoris: spot.isDoris ?? false,
      }));
    }
    return METEOR_SPOTS_FALLBACK;
  }, [payload, language]);
}
