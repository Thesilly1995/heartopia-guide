export interface EventSightingItem {
  name: string;
  spot: string;
  note: string | null;
  emoji: string;
}

export const EVENT_FISH: EventSightingItem[] = [
  { name: "Sint-Jakobsschelp", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Mandarijnvis", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Japanse Vliegende Inktvis", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Vuurvlieg-inktvis", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Platrugschildpad", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Olijfkleurige Zeeschildpad", spot: "Walviszee", note: null, emoji: "🐟" },
  { name: "Zeenaaktslak", spot: "Walviszee (Neritic Shoal Event, praat met Vanya)", note: "Alleen beschikbaar in Fase 2 van het event", emoji: "🐌" },
];
