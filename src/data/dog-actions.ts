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

const DOG_ACTIONS_RAW: PetActionRaw[] = [
  { labelNl: "Schat Zoeken", labelEn: "Seek Treasure", key: "seek_treasure" },
  { labelNl: "Poot Geven", labelEn: "Give Paw", key: "give_paw" },
  { labelNl: "Uitrekken", labelEn: "Stretch", key: "stretch" },
  { labelNl: "Hoofd Schudden", labelEn: "Shake Head", key: "shake_head" },
  { labelNl: "Lui Hangen", labelEn: "Lounge Lazily", key: "lounge_lazily" },
  { labelNl: "Oor Krabben", labelEn: "Scratch Ear", key: "scratch_ear" },
  { labelNl: "Baasje Begroeten", labelEn: "Greet Owner", key: "greet_owner" },
  { labelNl: "Rollen", labelEn: "Roll", key: "roll" },
  { labelNl: "Ronddraaien", labelEn: "Spin", key: "spin" },
  { labelNl: "Springen", labelEn: "Jump", key: "jump" },
  { labelNl: "Opspringen om te Spelen", labelEn: "Jump Up to Play", key: "jump_up_play" },
  { labelNl: "Heen en Weer Hoppen", labelEn: "Hop Side to Side", key: "hop_side_to_side" },
  { labelNl: "Leeuwendans", labelEn: "Lion Dance", key: "lion_dance" },
  { labelNl: "Doen-Alsof Zwemmen", labelEn: "Pretend Paddling", key: "pretend_paddling" },
];

export function useDogActions(): PetAction[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOG_ACTIONS_RAW.map((r) => ({
    label: language === 'en' ? r.labelEn : r.labelNl,
    key: r.key,
      })),
    [language]
  );
}
