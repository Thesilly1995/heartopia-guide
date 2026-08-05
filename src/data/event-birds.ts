export interface EventSightingItem {
  name: string;
  spot: string;
  note: string | null;
  emoji: string;
}

export const EVENT_BIRDS: EventSightingItem[] = [
  { name: "Witvleugelstern", spot: "Bloemenveld (Whale Mountain)", note: null, emoji: "🐦" },
  { name: "Middelste Jager", spot: "Bloemenveld", note: null, emoji: "🐦" },
  { name: "Witte Lepelaar", spot: "Onsen Berg Meeroever", note: null, emoji: "🐦" },
  { name: "Grote Albatros", spot: "Amethyststrand", note: null, emoji: "🐦" },
  { name: "Grijsmantel Albatros", spot: "Onsen Berg Stenen Klif", note: null, emoji: "🐦" },
  { name: "Geheime Vogel", spot: "Onbekend", note: "Ontgrendelt in Week 2", emoji: "🐦" },
];
