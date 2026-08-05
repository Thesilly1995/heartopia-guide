export interface PetAction {
  key: string;
  label: string;
}

export const DOG_ACTIONS: PetAction[] = [
  { key: "seek_treasure", label: "Schat Zoeken" },
  { key: "give_paw", label: "Poot Geven" },
  { key: "stretch", label: "Uitrekken" },
  { key: "shake_head", label: "Hoofd Schudden" },
  { key: "lounge_lazily", label: "Lui Hangen" },
  { key: "scratch_ear", label: "Oor Krabben" },
  { key: "greet_owner", label: "Baasje Begroeten" },
  { key: "roll", label: "Rollen" },
  { key: "spin", label: "Ronddraaien" },
  { key: "jump", label: "Springen" },
  { key: "jump_up_play", label: "Opspringen om te Spelen" },
  { key: "hop_side_to_side", label: "Heen en Weer Hoppen" },
  { key: "lion_dance", label: "Leeuwendans" },
  { key: "pretend_paddling", label: "Doen-Alsof Zwemmen" },
];
