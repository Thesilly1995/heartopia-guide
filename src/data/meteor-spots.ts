import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useServer } from '@/hooks/use-server';
import { serverNow } from '@/lib/reset-schedule';
import { useRemoteContent, WeekForecastBlock } from '@/lib/remote-content';

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

const BLOCK_START_HOUR: Record<WeekForecastBlock, number> = { '00-06': 0, '06-12': 6, '12-18': 12, '18-00': 18 };
const BLOCK_SPAN_HOURS = 6;
/** Het hakvenster van de ertsplekken loopt 24u vanaf de start van het meteorenregen-blok, los van het 6-uursblok zelf. */
const ORE_WINDOW_HOURS = 24;

function blockStartDate(dateStr: string, block: WeekForecastBlock): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, BLOCK_START_HOUR[block], 0, 0));
}

/**
 * Automatisch bepalen of het meteorenregen-venster (nog) actief is, o.b.v.
 * `weekForecast` — voorkomt dat de ertsplekken/Doris "actief" blijven staan
 * als vergeten wordt `meteorSpots` handmatig te legen na afloop. Doris'
 * eigen venster is alleen het 6-uursblok zelf; het hakvenster van de
 * ertsplekken loopt 24u vanaf diezelfde startdatum/-tijd.
 */
function useMeteorWindows(): { oreActive: boolean; dorisActive: boolean } {
  const { server } = useServer();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const starts = (payload?.weekForecast ?? [])
      .flatMap((day) =>
        day.kinds.map((slot) => (typeof slot === 'string' ? { kind: slot } : slot)).map((slot) => ({ ...slot, date: day.date }))
      )
      .filter((slot): slot is { kind: 'meteor'; block: WeekForecastBlock; date: string } => slot.kind === 'meteor' && !!slot.block)
      .map((slot) => blockStartDate(slot.date, slot.block));

    const now = serverNow(server.offsetHours);
    return {
      oreActive: starts.some((start) => now >= start && now.getTime() - start.getTime() < ORE_WINDOW_HOURS * 3600000),
      dorisActive: starts.some((start) => now >= start && now.getTime() - start.getTime() < BLOCK_SPAN_HOURS * 3600000),
    };
  }, [payload, server.offsetHours]);
}

export function useMeteorSpots(): EventSpot[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const { oreActive, dorisActive } = useMeteorWindows();

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
