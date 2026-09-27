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
  /** true = dit is Doris' plek (NPC bij Whalefall Canyon, ook aanwezig tijdens meteorenregen), krijgt een ander icoon dan de gewone fragment-plekken. */
  isDoris: boolean;
}

// Bundel-fallback: leeg totdat REMOTE_CONTENT_URL data levert, of totdat een
// sessie de actuele fragment-plekken handmatig invult. Zie docs/remote-content.md.
const METEOR_SPOTS_FALLBACK: EventSpot[] = [];

/**
 * Ertsplekken/Doris automatisch verbergen zodra het meteorenregen-venster
 * voorbij is, o.b.v. `weekForecast` (zie `useKindWindowActive`) — voorkomt
 * dat ze "actief" blijven staan als vergeten wordt `meteorSpots` handmatig
 * te legen. Doris' eigen venster is alleen het 6-uursblok zelf; het
 * hakvenster van de ertsplekken loopt 24u vanaf diezelfde blokstart.
 */
export function useMeteorSpots(): EventSpot[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const oreActive = useKindWindowActive('meteor', 24);
  const dorisActive = useKindWindowActive('meteor', 6);

  return useMemo(() => {
    if (!payload?.meteorSpots || payload.meteorSpots.length === 0) return METEOR_SPOTS_FALLBACK;

    return payload.meteorSpots
      .filter((spot) => (spot.isDoris ? dorisActive : oreActive))
      .map((spot) => ({
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
  }, [payload, language, oreActive, dorisActive]);
}
