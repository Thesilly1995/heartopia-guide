import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

const NO_EVENT = {
  nameNl: 'Geen actief event',
  nameEn: 'No active event',
  datesNl: 'We laten het weten zodra het volgende event begint',
  datesEn: "We'll let you know once the next event starts",
  emoji: '🗓️',
} as const;

export interface CurrentEventMeta {
  name: string;
  dates: string;
  emoji: string;
}

/** Naam/data van het huidige event — remote override indien aanwezig, anders "geen actief event". */
export function useCurrentEventMeta(): CurrentEventMeta {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const remote = payload?.event;

  if (remote) {
    return {
      name: remote.nameEn,
      dates: language === 'en' ? remote.datesEn : remote.datesNl,
      emoji: '🎉',
    };
  }
  return {
    name: language === 'en' ? NO_EVENT.nameEn : NO_EVENT.nameNl,
    dates: language === 'en' ? NO_EVENT.datesEn : NO_EVENT.datesNl,
    emoji: NO_EVENT.emoji,
  };
}
