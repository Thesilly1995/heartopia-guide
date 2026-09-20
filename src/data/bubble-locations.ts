import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

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
  descriptionEs: string;
  descriptionPt: string;
  descriptionFr: string;
  num: number;
  x: number;
  y: number;
  underwater: boolean;
}

const BUBBLE_LOCATIONS_RAW: BubbleLocationRaw[] = [
  { descriptionNl: "Onsen Berg, oostkant van het woestijngebied", descriptionEn: "Onsen Mountain, east side of the desert area", descriptionEs: "Montaña Onsen, lado este de la zona desértica", descriptionPt: "Montanha Onsen, lado leste da área do deserto", descriptionFr: "Montagne Onsen, côté est de la zone désertique", num: 1, x: 58, y: 28, underwater: false },
  { descriptionNl: "Noordwestelijk woestijngebied, bij de grens met Oude Zee", descriptionEn: "Northwestern desert area, near the border with Old Sea", descriptionEs: "Zona desértica noroeste, cerca del límite con el Mar Antiguo", descriptionPt: "Área do deserto noroeste, perto da fronteira com o Mar Antigo", descriptionFr: "Zone désertique nord-ouest, près de la frontière avec la Vieille Mer", num: 2, x: 34, y: 19, underwater: false },
  { descriptionNl: "Grens woestijn/groen gebied, noordelijke Woonwijk", descriptionEn: "Desert/green area boundary, northern Residential Area", descriptionEs: "Límite desierto/zona verde, Área Residencial norte", descriptionPt: "Fronteira deserto/área verde, Área Residencial norte", descriptionFr: "Frontière désert/zone verte, Quartier Résidentiel nord", num: 3, x: 34, y: 41, underwater: false },
  { descriptionNl: "Stadsrand, net ten oosten van het dorpscentrum", descriptionEn: "Suburbs, just east of the village center", descriptionEs: "Afueras, justo al este del centro del pueblo", descriptionPt: "Subúrbios, logo a leste do centro da vila", descriptionFr: "Banlieue, juste à l'est du centre du village", num: 4, x: 56, y: 49, underwater: false },
  { descriptionNl: "Bos, oostkust", descriptionEn: "Forest, east coast", descriptionEs: "Bosque, costa este", descriptionPt: "Floresta, costa leste", descriptionFr: "Forêt, côte est", num: 5, x: 81, y: 52, underwater: false },
  { descriptionNl: "Verste zuidoostpunt, kustlijn bij het Bos", descriptionEn: "Far southeastern tip, coastline by the Forest", descriptionEs: "Punta extrema sureste, costa junto al Bosque", descriptionPt: "Ponta extrema sudeste, litoral junto à Floresta", descriptionFr: "Pointe extrême sud-est, littoral près de la Forêt", num: 6, x: 94, y: 78, underwater: false },
  { descriptionNl: "Zuidkust, oostkant", descriptionEn: "South coast, east side", descriptionEs: "Costa sur, lado este", descriptionPt: "Costa sul, lado leste", descriptionFr: "Côte sud, côté est", num: 7, x: 81, y: 79, underwater: false },
  { descriptionNl: "Zuidkust, midden (bij locatie 9)", descriptionEn: "South coast, center (near spot 9)", descriptionEs: "Costa sur, centro (cerca del punto 9)", descriptionPt: "Costa sul, centro (perto do ponto 9)", descriptionFr: "Côte sud, centre (près du point 9)", num: 8, x: 68, y: 80, underwater: false },
  { descriptionNl: "Net boven locatie 8", descriptionEn: "Just above spot 8", descriptionEs: "Justo encima del punto 8", descriptionPt: "Logo acima do ponto 8", descriptionFr: "Juste au-dessus du point 8", num: 9, x: 61, y: 76, underwater: false },
  { descriptionNl: "Zuidkust, net onder locatie 8", descriptionEn: "South coast, just below spot 8", descriptionEs: "Costa sur, justo debajo del punto 8", descriptionPt: "Costa sul, logo abaixo do ponto 8", descriptionFr: "Côte sud, juste en dessous du point 8", num: 10, x: 61, y: 86, underwater: false },
  { descriptionNl: "Zuidkust, bij Zachte Wind Zee", descriptionEn: "South coast, near Gentle Wind Sea", descriptionEs: "Costa sur, cerca del Mar del Viento Suave", descriptionPt: "Costa sul, perto do Mar da Brisa Suave", descriptionFr: "Côte sud, près de la Mer du Vent Doux", num: 11, x: 51, y: 90, underwater: false },
  { descriptionNl: "Zuidwestkust", descriptionEn: "Southwest coast", descriptionEs: "Costa suroeste", descriptionPt: "Costa sudoeste", descriptionFr: "Côte sud-ouest", num: 12, x: 31, y: 90, underwater: false },
  { descriptionNl: "Westkust, zuidelijk deel", descriptionEn: "West coast, southern part", descriptionEs: "Costa oeste, parte sur", descriptionPt: "Costa oeste, parte sul", descriptionFr: "Côte ouest, partie sud", num: 13, x: 11, y: 82, underwater: false },
  { descriptionNl: "Westkust, bij het Bloemenveld", descriptionEn: "West coast, near the Flower Field", descriptionEs: "Costa oeste, cerca del Campo de Flores", descriptionPt: "Costa oeste, perto do Campo de Flores", descriptionFr: "Côte ouest, près du Champ de Fleurs", num: 14, x: 4, y: 54, underwater: false },
  { descriptionNl: "Westkust, noordelijk van locatie 14, Bloemenveld", descriptionEn: "West coast, north of spot 14, Flower Field", descriptionEs: "Costa oeste, al norte del punto 14, Campo de Flores", descriptionPt: "Costa oeste, ao norte do ponto 14, Campo de Flores", descriptionFr: "Côte ouest, au nord du point 14, Champ de Fleurs", num: 15, x: 7, y: 52, underwater: false },
  { descriptionNl: "Whalefall Canyon, oostzijde bij de koraalrichel", descriptionEn: "Whalefall Canyon, east side near the coral ridge", descriptionEs: "Whalefall Canyon, lado este cerca del arrecife de coral", descriptionPt: "Whalefall Canyon, lado leste perto do recife de coral", descriptionFr: "Whalefall Canyon, côté est près de la crête de corail", num: 16, x: 65, y: 84, underwater: true },
  { descriptionNl: "Whalefall Canyon, noordkant bij het vissenskelet (de Whale Fall)", descriptionEn: "Whalefall Canyon, north side near the fish skeleton (the Whale Fall)", descriptionEs: "Whalefall Canyon, lado norte cerca del esqueleto de pez (el Whale Fall)", descriptionPt: "Whalefall Canyon, lado norte perto do esqueleto de peixe (o Whale Fall)", descriptionFr: "Whalefall Canyon, côté nord près du squelette de poisson (le Whale Fall)", num: 17, x: 50, y: 26, underwater: true },
  { descriptionNl: "Whalefall Canyon, zuidwestzijde in het rifgebied", descriptionEn: "Whalefall Canyon, southwest side in the reef area", descriptionEs: "Whalefall Canyon, lado suroeste en la zona del arrecife", descriptionPt: "Whalefall Canyon, lado sudoeste na área do recife", descriptionFr: "Whalefall Canyon, côté sud-ouest dans la zone du récif", num: 18, x: 25, y: 85, underwater: true },
  { descriptionNl: "Whalefall Canyon, westzijde bij de kwallenpoel", descriptionEn: "Whalefall Canyon, west side near the jellyfish pool", descriptionEs: "Whalefall Canyon, lado oeste cerca de la poza de medusas", descriptionPt: "Whalefall Canyon, lado oeste perto da poça de águas-vivas", descriptionFr: "Whalefall Canyon, côté ouest près du bassin de méduses", num: 19, x: 34, y: 72, underwater: true },
];

const FALLBACK_WEEK_LABEL = {
  nl: 'Deze week (verouderde voorbeelddata)',
  en: 'This week (outdated sample data)',
  es: 'Esta semana (datos de ejemplo desactualizados)',
  pt: 'Esta semana (dados de exemplo desatualizados)',
  fr: 'Cette semaine (données d\'exemple obsolètes)',
};

function localizedDescription(r: { descriptionNl: string; descriptionEn: string; descriptionEs?: string; descriptionPt?: string; descriptionFr?: string }, language: Language): string {
  if (language === 'es') return r.descriptionEs ?? r.descriptionEn;
  if (language === 'pt') return r.descriptionPt ?? r.descriptionEn;
  if (language === 'fr') return r.descriptionFr ?? r.descriptionEn;
  return language === 'en' ? r.descriptionEn : r.descriptionNl;
}

/**
 * Roze-bubbels-locaties verspringen elke zaterdag 6:00 naar nieuwe plekken.
 * Komt er uit `remote-content.json` (`bubbleWeek`), dan is dat de actuele lijst
 * voor deze week; zonder remote content valt de app terug op een gebundelde
 * (per definitie verouderde) standaardlijst, puur om het scherm nooit leeg te
 * laten zijn. De remote content heeft alleen nl/en, dus es/pt vallen daar
 * terug op het Engels tot de JSON-content ook in die talen komt.
 */
export function useBubbleLocations(): BubbleLocation[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const remoteSpots = payload?.bubbleWeek?.spots;
    if (remoteSpots && remoteSpots.length > 0) {
      return remoteSpots.map((r) => ({
        description: localizedDescription(r, language),
        num: r.num,
        x: r.x,
        y: r.y,
        underwater: r.underwater,
      }));
    }
    return BUBBLE_LOCATIONS_RAW.map((r) => ({
      description: localizedDescription(r, language),
      num: r.num,
      x: r.x,
      y: r.y,
      underwater: r.underwater,
    }));
  }, [payload, language]);
}

export function useBubbleWeekLabel(): string {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();
  const week = payload?.bubbleWeek;
  if (!week) return FALLBACK_WEEK_LABEL[language];
  if (language === 'es') return week.weekLabelEs ?? week.weekLabelEn;
  if (language === 'pt') return week.weekLabelPt ?? week.weekLabelEn;
  if (language === 'fr') return week.weekLabelFr ?? week.weekLabelEn;
  return language === 'en' ? week.weekLabelEn : week.weekLabelNl;
}
