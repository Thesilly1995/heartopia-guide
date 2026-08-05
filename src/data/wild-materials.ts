export interface ForagedItem {
  name: string;
  spot: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

export const WILD_MATERIALS: ForagedItem[] = [
  { name: "Bamboe", spot: "Bamboegebied", sellPrice: "7 🪙", energy: "—", emoji: "🎋" },
  { name: "Tak", spot: "Struiken", sellPrice: "5 🪙", energy: "—", emoji: "🪵" },
  { name: "Erts", spot: "Thuis", sellPrice: "14 🪙", energy: "—", emoji: "⛏️" },
  { name: "Steen", spot: "Thuis", sellPrice: "8 🪙", energy: "—", emoji: "🪨" },
  { name: "Hout", spot: "Boom", sellPrice: "6 🪙", energy: "—", emoji: "🪵" },
  { name: "Kwaliteitshout", spot: "Boom", sellPrice: "12 🪙", energy: "—", emoji: "🪵" },
  { name: "Zeldzaam Hout", spot: "Reuzenboom in de Buitenwijk", sellPrice: "50 🪙", energy: "—", emoji: "🪵" },
  { name: "Zwervend Eikenhout", spot: "Zwervende Eik", sellPrice: "150 🪙", energy: "—", emoji: "🪵" },
];
