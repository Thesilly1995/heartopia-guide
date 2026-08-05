export interface EventSpot {
  num: number;
  x: number;
  y: number;
  description: string;
}

// Wordt gevuld zodra de Rainbow-gebeurtenis actief is en de locaties bekend zijn.
export const RAINBOW_SPOTS: EventSpot[] = [];
