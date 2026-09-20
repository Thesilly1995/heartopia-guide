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
  labelFr: string;
  labelDe: string;
  key: string;
}

const DOG_ACTIONS_RAW: PetActionRaw[] = [
  { labelNl: "Schat Zoeken", labelEn: "Seek Treasure", labelEs: "Buscar Tesoro", labelPt: "Procurar Tesouro", labelFr: "Chercher un trésor", labelDe: "Schatzsuche", key: "seek_treasure" },
  { labelNl: "Poot Geven", labelEn: "Give Paw", labelEs: "Dar la Pata", labelPt: "Dar a Pata", labelFr: "Donner la patte", labelDe: "Pfötchen geben", key: "give_paw" },
  { labelNl: "Uitrekken", labelEn: "Stretch", labelEs: "Estirarse", labelPt: "Espreguiçar", labelFr: "S'étirer", labelDe: "Sich strecken", key: "stretch" },
  { labelNl: "Hoofd Schudden", labelEn: "Shake Head", labelEs: "Sacudir la Cabeza", labelPt: "Sacudir a Cabeça", labelFr: "Secouer la tête", labelDe: "Kopf schütteln", key: "shake_head" },
  { labelNl: "Lui Hangen", labelEn: "Lounge Lazily", labelEs: "Holgazanear", labelPt: "Vadiar Preguiçosamente", labelFr: "Se prélasser", labelDe: "Faul herumliegen", key: "lounge_lazily" },
  { labelNl: "Oor Krabben", labelEn: "Scratch Ear", labelEs: "Rascar Oreja", labelPt: "Coçar a Orelha", labelFr: "Se gratter l'oreille", labelDe: "Am Ohr kratzen", key: "scratch_ear" },
  { labelNl: "Baasje Begroeten", labelEn: "Greet Owner", labelEs: "Saludar al Dueño", labelPt: "Cumprimentar o Dono", labelFr: "Accueillir son maître", labelDe: "Den Besitzer begrüßen", key: "greet_owner" },
  { labelNl: "Rollen", labelEn: "Roll", labelEs: "Rodar", labelPt: "Rolar", labelFr: "Se rouler par terre", labelDe: "Sich wälzen", key: "roll" },
  { labelNl: "Ronddraaien", labelEn: "Spin", labelEs: "Girar", labelPt: "Girar", labelFr: "Tourner sur soi-même", labelDe: "Sich drehen", key: "spin" },
  { labelNl: "Springen", labelEn: "Jump", labelEs: "Saltar", labelPt: "Pular", labelFr: "Sauter", labelDe: "Springen", key: "jump" },
  { labelNl: "Opspringen om te Spelen", labelEn: "Jump Up to Play", labelEs: "Saltar para Jugar", labelPt: "Pular para Brincar", labelFr: "Sauter pour jouer", labelDe: "Zum Spielen hochspringen", key: "jump_up_play" },
  { labelNl: "Heen en Weer Hoppen", labelEn: "Hop Side to Side", labelEs: "Saltar de Lado a Lado", labelPt: "Pular de um Lado para o Outro", labelFr: "Sautiller d'avant en arrière", labelDe: "Hin und her hüpfen", key: "hop_side_to_side" },
  { labelNl: "Leeuwendans", labelEn: "Lion Dance", labelEs: "Danza del León", labelPt: "Dança do Leão", labelFr: "Danse du lion", labelDe: "Löwentanz", key: "lion_dance" },
  { labelNl: "Doen-Alsof Zwemmen", labelEn: "Pretend Paddling", labelEs: "Fingir Nadar", labelPt: "Fingir Nadar", labelFr: "Faire semblant de nager", labelDe: "So tun, als ob man schwimmt", key: "pretend_paddling" },
];

export function useDogActions(): PetAction[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      DOG_ACTIONS_RAW.map((r) => ({
    label: language === 'es' ? r.labelEs : language === 'pt' ? r.labelPt : language === 'fr' ? r.labelFr : language === 'de' ? r.labelDe : language === 'en' ? r.labelEn : r.labelNl,
    key: r.key,
      })),
    [language]
  );
}
