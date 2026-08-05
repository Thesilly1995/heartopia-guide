export interface ForagedItem {
  name: string;
  spot: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

export const WILD_FRUIT: ForagedItem[] = [
  { name: "Appel", spot: "Thuisfront: Noord & Oost", sellPrice: "28 🪙", energy: "+8", emoji: "🍎" },
  { name: "Mandarijn", spot: "Thuisfront: West & Noord", sellPrice: "28 🪙", energy: "+8", emoji: "🍊" },
  { name: "Bosbes", spot: "Thuisfront: West, Noord & Oost", sellPrice: "16 🪙", energy: "+5", emoji: "🫐" },
  { name: "Framboos", spot: "Thuisfront: West", sellPrice: "26 🪙", energy: "+7", emoji: "🍓" },
];
