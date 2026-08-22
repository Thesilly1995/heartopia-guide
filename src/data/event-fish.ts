import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface EventSightingItem {
  name: string;
  spot: string;
  note: string | null;
  emoji: string;
}

interface EventSightingRaw {
  nameNl: string;
  nameEn: string;
  spotNl: string;
  spotEn: string;
  noteNl: string | null;
  noteEn: string | null;
  emoji: string;
}

const EVENT_FISH_RAW: EventSightingRaw[] = [];

export function useEventFish(): EventSightingItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      EVENT_FISH_RAW.map((r) => ({
    name: r.nameEn,
    spot: r.spotEn,
    note: language === 'en' ? r.noteEn : r.noteNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
