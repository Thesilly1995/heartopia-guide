export interface EventSpot {
  num: number;
  x: number;
  y: number;
  description: string;
}

// Wordt gevuld zodra de Meteorenregen actief is en de ertsplekken bekend zijn.
export const METEOR_SPOTS: EventSpot[] = [];
