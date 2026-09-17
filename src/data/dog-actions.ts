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

const DOG_ACTIONS_RAW: PetActionRaw[] = [
  { labelNl: "Schat Zoeken", labelEn: "Seek Treasure", labelEs: "Buscar Tesoro", labelPt: "Procurar Tesouro", key: "seek_treasure" },
  { labelNl: "Poot Geven", labelEn: "Give Paw", labelEs: "Dar la Pata", labelPt: "Dar a Pata", key: "give_paw" },
  { labelNl: "Uitrekken", labelEn: "Stretch", labelEs: "Estirarse", labelPt: "Espreguiçar", key: "stretch" },
  { labelNl: "Hoofd Schudden", labelEn: "Shake Head", labelEs: "Sacudir la Cabeza", labelPt: "Sacudir a Cabeça", key: "shake_head" },
  { labelNl: "Lui Hangen", labelEn: "Lounge Lazily", labelEs: "Holgazanear", labelPt: "Vadiar Preguiçosamente", key: "lounge_lazily" },
  { labelNl: "Oor Krabben", labelEn: "Scratch Ear", labelEs: "Rascar Oreja", labelPt: "Coçar a Orelha", key: "scratch_ear" },
  { labelNl: "Baasje Begroeten", labelEn: "Greet Owner", labelEs: "Saludar al Dueño", labelPt: "Cumprimentar o Dono", key: "greet_owner" },
  { labelNl: "Rollen", labelEn: "Roll", labelEs: "Rodar", labelPt: "Rolar", key: "roll" },
  { labelNl: "Ronddraaien", labelEn: "Spin", labelEs: "Girar", labelPt: "Girar", key: "spin" },
  { labelNl: "Springen", labelEn: "Jump", labelEs: "Saltar", labelPt: "Pular", key: "jump" },
  { labelNl: "Opspringen om te Spelen", labelEn: "Jump Up to Play", labelEs: "Saltar para Jugar", labelPt: "Pular para Brincar", key: "jump_up_play" },
  { labelNl: "Heen en Weer Hoppen", labelEn: "Hop Side to Side", labelEs: "Saltar de Lado a Lado", labelPt: "Pular de um Lado para o Outro", key: "hop_side_to_side" },
  { labelNl: "Leeuwendans", labelEn: "Lion Dance", labelEs: "Danza del León", labelPt: "Dança do Leão", key: "lion_dance" },
  { labelNl: "Doen-Alsof Zwemmen", labelEn: "Pretend Paddling", labelEs: "Fingir Nadar", labelPt: "Fingir Nadar", key: "pretend_paddling" },
];

export function useDogActions(): PetAction[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOG_ACTIONS_RAW.map((r) => ({
    label: language === 'es' ? r.labelEs : language === 'pt' ? r.labelPt : language === 'en' ? r.labelEn : r.labelNl,
    key: r.key,
      })),
    [language]
  );
}
