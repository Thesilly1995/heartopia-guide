export interface BubbleLocation {
  num: number;
  underwater: boolean;
  description: string;
}

export const BUBBLE_LOCATIONS: BubbleLocation[] = [
  { num: 1, underwater: false, description: "Onsen Berg, oostkant van het woestijngebied" },
  { num: 2, underwater: false, description: "Noordwestelijk woestijngebied, bij de grens met Oude Zee" },
  { num: 3, underwater: false, description: "Grens woestijn/groen gebied, noordelijke Woonwijk" },
  { num: 4, underwater: false, description: "Stadsrand, net ten oosten van het dorpscentrum" },
  { num: 5, underwater: false, description: "Bos, oostkust" },
  { num: 6, underwater: false, description: "Verste zuidoostpunt, kustlijn bij het Bos" },
  { num: 7, underwater: false, description: "Zuidkust, oostkant" },
  { num: 8, underwater: false, description: "Zuidkust, midden (bij locatie 9)" },
  { num: 9, underwater: false, description: "Net boven locatie 8" },
  { num: 10, underwater: false, description: "Zuidkust, net onder locatie 8" },
  { num: 11, underwater: false, description: "Zuidkust, bij Zachte Wind Zee" },
  { num: 12, underwater: false, description: "Zuidwestkust" },
  { num: 13, underwater: false, description: "Westkust, zuidelijk deel" },
  { num: 14, underwater: false, description: "Westkust, bij het Bloemenveld" },
  { num: 15, underwater: false, description: "Westkust, noordelijk van locatie 14, Bloemenveld" },
  { num: 16, underwater: true, description: "Whalefall Canyon, oostzijde bij de koraalrichel" },
  { num: 17, underwater: true, description: "Whalefall Canyon, noordkant bij het vissenskelet (de Whale Fall)" },
  { num: 18, underwater: true, description: "Whalefall Canyon, zuidwestzijde in het rifgebied" },
  { num: 19, underwater: true, description: "Whalefall Canyon, westzijde bij de kwallenpoel" },
];
