import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

const BUNDLED_EVENT = {
  nameNl: 'Call of Whales',
  nameEn: 'Call of Whales',
  datesNl: '11 juli – 22 augustus 2026',
  datesEn: 'Jul 11 – Aug 22, 2026',
  emoji: '🐋',
} as const;

export interface CurrentEventMeta {
  name: string;
  dates: string;
  emoji: string;
}

/** Naam/data van het huidige event — remote override indien aanwezig, anders de gebundelde standaard. */
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
    name: BUNDLED_EVENT.nameEn,
    dates: language === 'en' ? BUNDLED_EVENT.datesEn : BUNDLED_EVENT.datesNl,
    emoji: BUNDLED_EVENT.emoji,
  };
}
