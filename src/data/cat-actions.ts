export interface PetAction {
  key: string;
  label: string;
}

export const CAT_ACTIONS: PetAction[] = [
  { key: "seek_treasure", label: "Schat Zoeken" },
  { key: "give_paw", label: "Poot Geven" },
  { key: "sniff_around", label: "Rondsnuffelen" },
  { key: "stretch", label: "Uitrekken" },
  { key: "clean_paw", label: "Poot Schoonmaken" },
  { key: "clean_foot", label: "Voet Schoonmaken" },
  { key: "scratch_ear", label: "Oor Krabben" },
  { key: "catch_insect", label: "Insect Vangen" },
  { key: "roll_over", label: "Omrollen" },
  { key: "wiggle_hip", label: "Heup Wiggelen" },
  { key: "maneki_neko", label: "Maneki Neko" },
  { key: "kick_legs", label: "Benen Schoppen" },
  { key: "catch_flying_insects", label: "Vliegende Insecten Vangen" },
  { key: "play_with_tail", label: "Spelen met Staart" },
];
