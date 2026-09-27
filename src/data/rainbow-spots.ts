import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useKindWindowActive } from '@/lib/event-window';
import { useRemoteContent } from '@/lib/remote-content';

export interface EventSpot {
  num: number;
  x: number;
  y: number;
  description: string;
  /** true = onderwater op de Whalefall Canyon-kaart, false = hoofdeiland-kaart. */
  underwater: boolean;
  /** true = dit is Doris' plek (NPC, aanwezig tijdens Rainbow-momenten), krijgt een ander icoon dan de boeketplekken. */
  isDoris: boolean;
}

// Bundel-fallback: leeg totdat REMOTE_CONTENT_URL data levert, of totdat een
// sessie de actuele locaties handmatig invult. Zie docs/remote-content.md.
const RAINBOW_SPOTS_FALLBACK: EventSpot[] = [];

/**
 * Alle Rainbow-locaties (hoofdeiland + Whalefall Canyon + Doris) horen bij
 * hetzelfde 6-uursblok — automatisch verborgen zodra dat blok voorbij is
 * o.b.v. `weekForecast` (zie `useKindWindowActive`), zodat ze niet langer
 * handmatig geleegd hoeven te worden. Anders dan bij meteorenregen is er
 * geen langer "hakvenster" erna.
 */
export function useRainbowSpots(): EventSpot[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const active = useKindWindowActive('rainbow', 6);

  return useMemo(() => {
    if (active && payload?.rainbowSpots && payload.rainbowSpots.length > 0) {
      return payload.rainbowSpots.map((spot) => ({
        num: spot.num,
        x: spot.x,
        y: spot.y,
        description:
          language === 'es' ? spot.descriptionEs ?? spot.descriptionEn
          : language === 'pt' ? spot.descriptionPt ?? spot.descriptionEn
          : language === 'fr' ? spot.descriptionFr ?? spot.descriptionEn
          : language === 'de' ? spot.descriptionDe ?? spot.descriptionEn
          : language === 'en' ? spot.descriptionEn
          : spot.descriptionNl,
        underwater: spot.underwater,
        isDoris: spot.isDoris ?? false,
      }));
    }
    return RAINBOW_SPOTS_FALLBACK;
  }, [payload, language, active]);
}
