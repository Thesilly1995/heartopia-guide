import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

const NO_EVENT = {
  nameNl: 'Geen actief event',
  nameEn: 'No active event',
  datesNl: 'We laten het weten zodra het volgende event begint',
  datesEn: "We'll let you know once the next event starts",
  datesEs: 'Te avisaremos en cuanto empiece el próximo evento',
  datesPt: 'Avisaremos assim que o próximo evento começar',
  datesFr: 'Nous vous préviendrons dès que le prochain événement commencera',
  emoji: '🗓️',
} as const;

export interface CurrentEventMeta {
  name: string;
  dates: string;
  emoji: string;
}

/**
 * Naam/data van het huidige event — remote override indien aanwezig, anders "geen actief event".
 * `datesEs`/`datesPt` zijn optioneel in de JSON — ontbreken ze (nog), dan valt de app terug op Engels.
 */
export function useCurrentEventMeta(): CurrentEventMeta {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const remote = payload?.event;

  if (remote) {
    const dates =
      language === 'es' ? remote.datesEs ?? remote.datesEn
      : language === 'pt' ? remote.datesPt ?? remote.datesEn
      : language === 'fr' ? remote.datesFr ?? remote.datesEn
      : language === 'en' ? remote.datesEn
      : remote.datesNl;
    return {
      name: remote.nameEn,
      dates,
      emoji: '🎉',
    };
  }
  return {
    name: NO_EVENT.nameEn,
    dates:
      language === 'es' ? NO_EVENT.datesEs
      : language === 'pt' ? NO_EVENT.datesPt
      : language === 'fr' ? NO_EVENT.datesFr
      : language === 'en' ? NO_EVENT.datesEn
      : NO_EVENT.datesNl,
    emoji: NO_EVENT.emoji,
  };
}
