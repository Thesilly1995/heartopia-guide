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
  /** true = dit is Doris' vaste plek (NPC, permanent), krijgt een ander icoon dan de boeketplekken. */
  isDoris: boolean;
}

// Bundel-fallback: leeg totdat REMOTE_CONTENT_URL data levert, of totdat een
// sessie de actuele locaties handmatig invult. Zie docs/remote-content.md.
const RAINBOW_SPOTS_FALLBACK: EventSpot[] = [];

export function useRainbowSpots(): EventSpot[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    if (payload?.rainbowSpots && payload.rainbowSpots.length > 0) {
      return payload.rainbowSpots.map((spot) => ({
        num: spot.num,
        x: spot.x,
        y: spot.y,
        description: language === 'en' ? spot.descriptionEn : spot.descriptionNl,
        underwater: spot.underwater,
        isDoris: spot.isDoris ?? false,
      }));
    }
    return RAINBOW_SPOTS_FALLBACK;
  }, [payload, language]);
}
