import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface BubbleLocation {
  num: number;
  x: number;
  y: number;
  underwater: boolean;
  description: string;
}

interface BubbleLocationRaw {
  descriptionNl: string;
  descriptionEn: string;
  num: number;
  x: number;
  y: number;
  underwater: boolean;
}

const BUBBLE_LOCATIONS_RAW: BubbleLocationRaw[] = [
  { descriptionNl: "Onsen Berg, oostkant van het woestijngebied", descriptionEn: "Onsen Mountain, east side of the desert area", num: 1, x: 58, y: 28, underwater: false },
  { descriptionNl: "Noordwestelijk woestijngebied, bij de grens met Oude Zee", descriptionEn: "Northwestern desert area, near the border with Old Sea", num: 2, x: 34, y: 19, underwater: false },
  { descriptionNl: "Grens woestijn/groen gebied, noordelijke Woonwijk", descriptionEn: "Desert/green area boundary, northern Residential Area", num: 3, x: 34, y: 41, underwater: false },
  { descriptionNl: "Stadsrand, net ten oosten van het dorpscentrum", descriptionEn: "Suburbs, just east of the village center", num: 4, x: 56, y: 49, underwater: false },
  { descriptionNl: "Bos, oostkust", descriptionEn: "Forest, east coast", num: 5, x: 81, y: 52, underwater: false },
  { descriptionNl: "Verste zuidoostpunt, kustlijn bij het Bos", descriptionEn: "Far southeastern tip, coastline by the Forest", num: 6, x: 94, y: 78, underwater: false },
  { descriptionNl: "Zuidkust, oostkant", descriptionEn: "South coast, east side", num: 7, x: 81, y: 79, underwater: false },
  { descriptionNl: "Zuidkust, midden (bij locatie 9)", descriptionEn: "South coast, center (near spot 9)", num: 8, x: 68, y: 80, underwater: false },
  { descriptionNl: "Net boven locatie 8", descriptionEn: "Just above spot 8", num: 9, x: 61, y: 76, underwater: false },
  { descriptionNl: "Zuidkust, net onder locatie 8", descriptionEn: "South coast, just below spot 8", num: 10, x: 61, y: 86, underwater: false },
  { descriptionNl: "Zuidkust, bij Zachte Wind Zee", descriptionEn: "South coast, near Gentle Wind Sea", num: 11, x: 51, y: 90, underwater: false },
  { descriptionNl: "Zuidwestkust", descriptionEn: "Southwest coast", num: 12, x: 31, y: 90, underwater: false },
  { descriptionNl: "Westkust, zuidelijk deel", descriptionEn: "West coast, southern part", num: 13, x: 11, y: 82, underwater: false },
  { descriptionNl: "Westkust, bij het Bloemenveld", descriptionEn: "West coast, near the Flower Field", num: 14, x: 4, y: 54, underwater: false },
  { descriptionNl: "Westkust, noordelijk van locatie 14, Bloemenveld", descriptionEn: "West coast, north of spot 14, Flower Field", num: 15, x: 7, y: 52, underwater: false },
  { descriptionNl: "Whalefall Canyon, oostzijde bij de koraalrichel", descriptionEn: "Whalefall Canyon, east side near the coral ridge", num: 16, x: 65, y: 84, underwater: true },
  { descriptionNl: "Whalefall Canyon, noordkant bij het vissenskelet (de Whale Fall)", descriptionEn: "Whalefall Canyon, north side near the fish skeleton (the Whale Fall)", num: 17, x: 50, y: 26, underwater: true },
  { descriptionNl: "Whalefall Canyon, zuidwestzijde in het rifgebied", descriptionEn: "Whalefall Canyon, southwest side in the reef area", num: 18, x: 25, y: 85, underwater: true },
  { descriptionNl: "Whalefall Canyon, westzijde bij de kwallenpoel", descriptionEn: "Whalefall Canyon, west side near the jellyfish pool", num: 19, x: 34, y: 72, underwater: true },
];

export function useBubbleLocations(): BubbleLocation[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      BUBBLE_LOCATIONS_RAW.map((r) => ({
    description: language === 'en' ? r.descriptionEn : r.descriptionNl,
    num: r.num,
    x: r.x,
    y: r.y,
    underwater: r.underwater,
      })),
    [language]
  );
}
