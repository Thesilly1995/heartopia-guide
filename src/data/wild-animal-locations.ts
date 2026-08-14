export interface WildAnimalMapSpot {
  num: number;
  name: string;
  x: number;
  y: number;
  emoji: string;
}

/**
 * Coördinaten gemeten met de kaart-tool tegen het exacte bestand
 * assets/images/maps/island-map.jpg (zelfde kaart als bubbels/rainbow/meteor).
 * Dieren die niet op dit eiland-gebied voorkomen (Dolfijn op Whalefall Canyon,
 * en event-dieren met een onbekende/andere locatie) staan hier bewust niet in.
 */
const WILD_ANIMAL_LOCATIONS: WildAnimalMapSpot[] = [
  { num: 1, name: 'Capybara', x: 24.6, y: 22.6, emoji: '🦫' },
  { num: 2, name: 'Ferret', x: 23.6, y: 43.1, emoji: '🐾' },
  { num: 3, name: 'Fox', x: 14, y: 65.8, emoji: '🦊' },
  { num: 4, name: 'Alpaca', x: 22.7, y: 82.7, emoji: '🦙' },
  { num: 5, name: 'Sea Otter', x: 48, y: 86, emoji: '🦦' },
  { num: 6, name: 'Panda', x: 74, y: 76.7, emoji: '🐼' },
  { num: 7, name: 'Sika Deer', x: 79.2, y: 55.3, emoji: '🦌' },
  { num: 8, name: 'Bunny', x: 30.8, y: 63.2, emoji: '🐰' },
];

export function useWildAnimalLocations(): WildAnimalMapSpot[] {
  return WILD_ANIMAL_LOCATIONS;
}
