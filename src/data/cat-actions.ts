import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface PetAction {
  key: string;
  label: string;
}

interface PetActionRaw {
  labelNl: string;
  labelEn: string;
  key: string;
}

const CAT_ACTIONS_RAW: PetActionRaw[] = [
  { labelNl: "Schat Zoeken", labelEn: "Seek Treasure", key: "seek_treasure" },
  { labelNl: "Poot Geven", labelEn: "Give Paw", key: "give_paw" },
  { labelNl: "Rondsnuffelen", labelEn: "Sniff Around", key: "sniff_around" },
  { labelNl: "Uitrekken", labelEn: "Stretch", key: "stretch" },
  { labelNl: "Poot Schoonmaken", labelEn: "Clean Paw", key: "clean_paw" },
  { labelNl: "Voet Schoonmaken", labelEn: "Clean Foot", key: "clean_foot" },
  { labelNl: "Oor Krabben", labelEn: "Scratch Ear", key: "scratch_ear" },
  { labelNl: "Insect Vangen", labelEn: "Catch Insect", key: "catch_insect" },
  { labelNl: "Omrollen", labelEn: "Roll Over", key: "roll_over" },
  { labelNl: "Heup Wiggelen", labelEn: "Wiggle Hip", key: "wiggle_hip" },
  { labelNl: "Maneki Neko", labelEn: "Maneki Neko", key: "maneki_neko" },
  { labelNl: "Benen Schoppen", labelEn: "Kick Legs", key: "kick_legs" },
  { labelNl: "Vliegende Insecten Vangen", labelEn: "Catch Flying Insects", key: "catch_flying_insects" },
  { labelNl: "Spelen met Staart", labelEn: "Play with Tail", key: "play_with_tail" },
];

export function useCatActions(): PetAction[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CAT_ACTIONS_RAW.map((r) => ({
    label: language === 'en' ? r.labelEn : r.labelNl,
    key: r.key,
      })),
    [language]
  );
}
