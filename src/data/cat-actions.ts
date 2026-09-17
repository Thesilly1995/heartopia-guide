import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface PetAction {
  key: string;
  label: string;
}

interface PetActionRaw {
  labelNl: string;
  labelEn: string;
  labelEs: string;
  labelPt: string;
  key: string;
}

const CAT_ACTIONS_RAW: PetActionRaw[] = [
  { labelNl: "Schat Zoeken", labelEn: "Seek Treasure", labelEs: "Buscar Tesoro", labelPt: "Procurar Tesouro", key: "seek_treasure" },
  { labelNl: "Poot Geven", labelEn: "Give Paw", labelEs: "Dar la Pata", labelPt: "Dar a Pata", key: "give_paw" },
  { labelNl: "Rondsnuffelen", labelEn: "Sniff Around", labelEs: "Olfatear Alrededor", labelPt: "Farejar ao Redor", key: "sniff_around" },
  { labelNl: "Uitrekken", labelEn: "Stretch", labelEs: "Estirarse", labelPt: "Espreguiçar", key: "stretch" },
  { labelNl: "Poot Schoonmaken", labelEn: "Clean Paw", labelEs: "Limpiar Pata", labelPt: "Limpar a Pata", key: "clean_paw" },
  { labelNl: "Voet Schoonmaken", labelEn: "Clean Foot", labelEs: "Limpiar Pie", labelPt: "Limpar o Pé", key: "clean_foot" },
  { labelNl: "Oor Krabben", labelEn: "Scratch Ear", labelEs: "Rascar Oreja", labelPt: "Coçar a Orelha", key: "scratch_ear" },
  { labelNl: "Insect Vangen", labelEn: "Catch Insect", labelEs: "Atrapar Insecto", labelPt: "Pegar Inseto", key: "catch_insect" },
  { labelNl: "Omrollen", labelEn: "Roll Over", labelEs: "Dar Vueltas", labelPt: "Rolar", key: "roll_over" },
  { labelNl: "Heup Wiggelen", labelEn: "Wiggle Hip", labelEs: "Menear la Cadera", labelPt: "Balançar o Quadril", key: "wiggle_hip" },
  { labelNl: "Maneki Neko", labelEn: "Maneki Neko", labelEs: "Maneki Neko", labelPt: "Maneki Neko", key: "maneki_neko" },
  { labelNl: "Benen Schoppen", labelEn: "Kick Legs", labelEs: "Patalear", labelPt: "Chutar as Pernas", key: "kick_legs" },
  { labelNl: "Vliegende Insecten Vangen", labelEn: "Catch Flying Insects", labelEs: "Atrapar Insectos Voladores", labelPt: "Pegar Insetos Voadores", key: "catch_flying_insects" },
  { labelNl: "Spelen met Staart", labelEn: "Play with Tail", labelEs: "Jugar con la Cola", labelPt: "Brincar com o Rabo", key: "play_with_tail" },
];

export function useCatActions(): PetAction[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CAT_ACTIONS_RAW.map((r) => ({
    label: language === 'es' ? r.labelEs : language === 'pt' ? r.labelPt : language === 'en' ? r.labelEn : r.labelNl,
    key: r.key,
      })),
    [language]
  );
}
