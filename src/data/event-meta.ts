import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

const NO_EVENT = {
  nameNl: 'Geen actief event',
  nameEn: 'No active event',
  datesNl: 'We laten het weten zodra het volgende event begint',
  datesEn: "We'll let you know once the next event starts",
  datesEs: 'Te avisaremos en cuanto empiece el próximo evento',
  datesPt: 'Avisaremos assim que o próximo evento começar',
  emoji: '🗓️',
} as const;

export interface CurrentEventMeta {
  name: string;
  dates: string;
  emoji: string;
}

/**
 * Naam/data van het huidige event — remote override indien aanwezig, anders "geen actief event".
 * De remote content (remote-content.json) heeft alleen nl/en datums; es/pt vallen daarom terug op
 * het Engels tot de JSON-content ook in die talen wordt aangeleverd.
 */
export function useCurrentEventMeta(): CurrentEventMeta {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const remote = payload?.event;

  if (remote) {
    return {
      name: remote.nameEn,
      dates: language === 'en' || language === 'es' || language === 'pt' ? remote.datesEn : remote.datesNl,
      emoji: '🎉',
    };
  }
  return {
    name: NO_EVENT.nameEn,
    dates: language === 'es' ? NO_EVENT.datesEs : language === 'pt' ? NO_EVENT.datesPt : language === 'en' ? NO_EVENT.datesEn : NO_EVENT.datesNl,
    emoji: NO_EVENT.emoji,
  };
}
