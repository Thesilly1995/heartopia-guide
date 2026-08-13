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

const EVENT_FISH_RAW: EventSightingRaw[] = [
  { nameNl: "Sint-Jakobsschelp", nameEn: "Scallop", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Mandarijnvis", nameEn: "Mandarin Fish", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Japanse Vliegende Inktvis", nameEn: "Japanese Flying Squid", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Vuurvlieg-inktvis", nameEn: "Firefly Squid", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Platrugschildpad", nameEn: "Flatback Turtle", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Olijfkleurige Zeeschildpad", nameEn: "Olive Ridley Turtle", spotNl: "Walviszee", spotEn: "Whale Sea", noteNl: null, noteEn: null, emoji: "🐟" },
  { nameNl: "Zeenaaktslak", nameEn: "Sea Slug", spotNl: "Walviszee (Neritic Shoal Event, praat met Vanya)", spotEn: "Whale Sea (Neritic Shoal Event, talk to Vanya)", noteNl: "Alleen beschikbaar in Fase 2 van het event", noteEn: "Only available in Phase 2 of the event", emoji: "🐌" },
];

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
