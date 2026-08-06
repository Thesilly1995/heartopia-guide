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

const EVENT_BIRDS_RAW: EventSightingRaw[] = [
  { nameNl: "Witvleugelstern", nameEn: "White Winged Tern", spotNl: "Bloemenveld (Whale Mountain)", spotEn: "Flower Field (Whale Mountain)", noteNl: null, noteEn: null, emoji: "🐦" },
  { nameNl: "Middelste Jager", nameEn: "Pomarine Skua", spotNl: "Bloemenveld", spotEn: "Flower Field", noteNl: null, noteEn: null, emoji: "🐦" },
  { nameNl: "Witte Lepelaar", nameEn: "White Spoonbill", spotNl: "Onsen Berg Meeroever", spotEn: "Onsen Mountain Lake Shore", noteNl: null, noteEn: null, emoji: "🐦" },
  { nameNl: "Grote Albatros", nameEn: "Wandering Albatross", spotNl: "Amethyststrand", spotEn: "Amethyst Beach", noteNl: null, noteEn: null, emoji: "🐦" },
  { nameNl: "Grijsmantel Albatros", nameEn: "Grey Mantled Albatross", spotNl: "Onsen Berg Stenen Klif", spotEn: "Onsen Mountain Stone Cliff", noteNl: null, noteEn: null, emoji: "🐦" },
  { nameNl: "Geheime Vogel", nameEn: "Secret Bird", spotNl: "Onbekend", spotEn: "Unknown", noteNl: "Ontgrendelt in Week 2", noteEn: "Unlocks in Week 2", emoji: "🐦" },
];

export function useEventBirds(): EventSightingItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      EVENT_BIRDS_RAW.map((r) => ({
    name: language === 'en' ? r.nameEn : r.nameNl,
    spot: language === 'en' ? r.spotEn : r.spotNl,
    note: language === 'en' ? r.noteEn : r.noteNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
