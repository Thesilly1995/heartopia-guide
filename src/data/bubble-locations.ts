export interface BubbleLocation {
  num: number;
  x: number;
  y: number;
  underwater: boolean;
  description: string;
}

export const BUBBLE_LOCATIONS: BubbleLocation[] = [
  { num: 1, x: 58, y: 28, underwater: false, description: "Onsen Berg, oostkant van het woestijngebied" },
  { num: 2, x: 34, y: 19, underwater: false, description: "Noordwestelijk woestijngebied, bij de grens met Oude Zee" },
  { num: 3, x: 34, y: 41, underwater: false, description: "Grens woestijn/groen gebied, noordelijke Woonwijk" },
  { num: 4, x: 56, y: 49, underwater: false, description: "Stadsrand, net ten oosten van het dorpscentrum" },
  { num: 5, x: 81, y: 52, underwater: false, description: "Bos, oostkust" },
  { num: 6, x: 94, y: 78, underwater: false, description: "Verste zuidoostpunt, kustlijn bij het Bos" },
  { num: 7, x: 81, y: 79, underwater: false, description: "Zuidkust, oostkant" },
  { num: 8, x: 68, y: 80, underwater: false, description: "Zuidkust, midden (bij locatie 9)" },
  { num: 9, x: 61, y: 76, underwater: false, description: "Net boven locatie 8" },
  { num: 10, x: 61, y: 86, underwater: false, description: "Zuidkust, net onder locatie 8" },
  { num: 11, x: 51, y: 90, underwater: false, description: "Zuidkust, bij Zachte Wind Zee" },
  { num: 12, x: 31, y: 90, underwater: false, description: "Zuidwestkust" },
  { num: 13, x: 11, y: 82, underwater: false, description: "Westkust, zuidelijk deel" },
  { num: 14, x: 4, y: 54, underwater: false, description: "Westkust, bij het Bloemenveld" },
  { num: 15, x: 7, y: 52, underwater: false, description: "Westkust, noordelijk van locatie 14, Bloemenveld" },
  { num: 16, x: 65, y: 84, underwater: true, description: "Whalefall Canyon, oostzijde bij de koraalrichel" },
  { num: 17, x: 50, y: 26, underwater: true, description: "Whalefall Canyon, noordkant bij het vissenskelet (de Whale Fall)" },
  { num: 18, x: 25, y: 85, underwater: true, description: "Whalefall Canyon, zuidwestzijde in het rifgebied" },
  { num: 19, x: 34, y: 72, underwater: true, description: "Whalefall Canyon, westzijde bij de kwallenpoel" },
];
