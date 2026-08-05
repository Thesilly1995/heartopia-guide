export interface DogItem {
  name: string;
  size: string;
  ability: string | null;
  emoji: string;
}

export const DOGS: DogItem[] = [
  { name: "Poedel", size: "Klein", ability: null, emoji: "🐶" },
  { name: "Corgi", size: "Klein", ability: null, emoji: "🐶" },
  { name: "Husky", size: "Middel", ability: null, emoji: "🐶" },
  { name: "Shiba Inu", size: "Middel", ability: null, emoji: "🐶" },
  { name: "Golden Retriever", size: "Groot", ability: "Kan Goudzakjes als cadeau geven", emoji: "🐶" },
];
