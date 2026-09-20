import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

export interface EventSightingItem {
  name: string;
  spot: string;
  note: string | null;
  emoji: string;
}

interface EventSightingRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  spotNl: string;
  spotEn: string;
  spotEs: string;
  spotPt: string;
  noteNl: string | null;
  noteEn: string | null;
  noteEs: string | null;
  notePt: string | null;
  emoji: string;
}

const EVENT_BIRDS_RAW: EventSightingRaw[] = [];

export function useEventBirds(): EventSightingItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      EVENT_BIRDS_RAW.map((r) => ({
    name: r.nameEn,
    spot: r.spotEn,
    note: language === 'es' ? r.noteEs : language === 'pt' ? r.notePt : language === 'fr' ? r.noteEn : language === 'en' ? r.noteEn : r.noteNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
