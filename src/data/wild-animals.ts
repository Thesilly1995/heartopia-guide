import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface WildAnimalItem {
  name: string;
  weather: string;
  foods: string[];
  spot: string;
  note: string | null;
  emoji: string;
  isEvent: boolean;
}

interface WildAnimalRaw {
  nameNl: string;
  nameEn: string;
  weatherNl: string;
  weatherEn: string;
  foodsNl: string[];
  foodsEn: string[];
  spotNl: string;
  spotEn: string;
  noteNl: string | null;
  noteEn: string | null;
  emoji: string;
}

const WILD_ANIMALS_RAW: WildAnimalRaw[] = [
  { nameNl: "Capybara", nameEn: "Capybara", weatherNl: "Regen, Regenboog", weatherEn: "Rainy, Rainbow", foodsNl: ["Tomaat","Druif","Framboos"], foodsEn: ["Tomato","Grape","Raspberry"], spotNl: "Bij de voet van de heuvel, tegenover de eerste Fluoriet-plek", spotEn: "At the foot of the hill, across from the first Fluorite spot", noteNl: null, noteEn: null, emoji: "🦫" },
  { nameNl: "Fret", nameEn: "Ferret", weatherNl: "Regen, Regenboog", weatherEn: "Rainy, Rainbow", foodsNl: ["Ei","Grondel","Zeebaars"], foodsEn: ["Egg","Goby","Sea Bass"], spotNl: "Noordelijkste windmolen, bij de boomstronk naast de bankjes", spotEn: "Northernmost windmill, by the tree stump next to the benches", noteNl: null, noteEn: null, emoji: "🐾" },
  { nameNl: "Konijntje", nameEn: "Bunny", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", foodsNl: ["Wortel","Aardbei","Onkruid"], foodsEn: ["Carrot","Strawberry","Weeds"], spotNl: "Bij plot 2, aan het pad richting het dorp", spotEn: "Near plot 2, on the path toward the village", noteNl: null, noteEn: null, emoji: "🐰" },
  { nameNl: "Vos", nameEn: "Fox", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", foodsNl: ["Baars","Grootbekbaars","Vlees"], foodsEn: ["European Perch","Largemouth Bass","Meat"], spotNl: "Midden van het Bloemenveld, bij de zuidelijke windmolen", spotEn: "Middle of the Flower Field, by the southern windmill", noteNl: null, noteEn: null, emoji: "🦊" },
  { nameNl: "Alpaca", nameEn: "Alpaca", weatherNl: "Zonnig", weatherEn: "Sunny", foodsNl: ["Bosbes","Ananas","Tarwe"], foodsEn: ["Blueberry","Pineapple","Wheat"], spotNl: "Zuiden van het Bloemenveld, op de heuvel bij de grote gele eend", spotEn: "South of the Flower Field, on the hill by the big yellow duck", noteNl: null, noteEn: null, emoji: "🦙" },
  { nameNl: "Zeeotter", nameEn: "Sea Otter", weatherNl: "Regen", weatherEn: "Rainy", foodsNl: ["Gewone Garnaal","Mossel","Oosterse Garnaal"], foodsEn: ["Common Shrimp","Mussel","Oriental Shrimp"], spotNl: "Op een rots in de haven, bij de blauwe boot-zitjes", spotEn: "On a rock in the harbor, by the blue boat seats", noteNl: null, noteEn: null, emoji: "🦦" },
  { nameNl: "Panda", nameEn: "Panda", weatherNl: "Regen", weatherEn: "Rainy", foodsNl: ["Appel","Bamboe","Maïs"], foodsEn: ["Apple","Bamboo","Corn"], spotNl: "Bos, bij de trap naar de Springpuzzel (Cassie)", spotEn: "Forest, by the stairs to the Jump Puzzle (Cassie)", noteNl: null, noteEn: null, emoji: "🐼" },
  { nameNl: "Sikahert", nameEn: "Sika Deer", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", foodsNl: ["Tak","Huissalade","Sla"], foodsEn: ["Branch","House Salad","Lettuce"], spotNl: "Tegenover de meeroever in het junglegebied", spotEn: "Across from the lake shore in the jungle area", noteNl: null, noteEn: null, emoji: "🦌" },
  { nameNl: "Dolfijn", nameEn: "Dolphin", weatherNl: "Zonnig", weatherEn: "Sunny", foodsNl: ["Sardine","Zeebaars","Horsmakreel"], foodsEn: ["Sardine","Sea Bass","Scad"], spotNl: "Whalefall Canyon, dolfijnentrog ten zuiden van de Whalefall", spotEn: "Whalefall Canyon, dolphin trough south of the Whalefall", noteNl: "Tijdelijk dier van het huidige Call of Whales-event — verdwijnt zodra het event eindigt (22 augustus 2026)", noteEn: "Temporary animal from the current Call of Whales event — leaves when the event ends (Aug 22, 2026)", emoji: "🐬" },
  { nameNl: "Pinguïn", nameEn: "Penguin", weatherNl: "Sneeuw", weatherEn: "Snowy", foodsNl: ["Gewone Garnaal","Valse Horsmakreel","Sardine"], foodsEn: ["Common Prawn","False Scad","Sardine"], spotNl: "Onsen Berg, ten oosten van Frostspore (alleen Winter Frost Season)", spotEn: "Onsen Mountain, east of Frostspore (Winter Frost Season only)", noteNl: "Tijdelijk dier van een afgelopen event (Winter Frost Season) — kan momenteel niet meer gevoerd worden. Kan mogelijk terugkeren in een volgend winterevent — vriendschap blijft daarom bijhoudbaar", noteEn: "Temporary animal from a past event (Winter Frost Season) — can no longer be fed right now. May return in a future winter event — friendship stays trackable for that reason", emoji: "🐧" },
  { nameNl: "Maltezer", nameEn: "Maltese", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", foodsNl: ["Vlees","Hondenvoer","Gegrilde Champignon"], foodsEn: ["Meat","Dog Food","Grilled Mushroom"], spotNl: "Truffeleiland", spotEn: "Truffle Island", noteNl: "Dier van een afgelopen event (Maltese-collab, geëindigd 25 mei 2026). Kan mogelijk je woonplot bezoeken of terugkeren in een volgend event — vriendschap blijft daarom bijhoudbaar", noteEn: "Animal from a past event (Maltese collab, ended May 25, 2026). May still visit your home plot or return in a future event — friendship stays trackable for that reason", emoji: "🐶" },
];

export function useWildAnimals(): WildAnimalItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_ANIMALS_RAW.map((r) => ({
    name: r.nameEn,
    weather: language === 'en' ? r.weatherEn : r.weatherNl,
    foods: r.foodsEn,
    spot: language === 'en' ? r.spotEn : r.spotNl,
    note: language === 'en' ? r.noteEn : r.noteNl,
    emoji: r.emoji,
    isEvent: r.noteNl !== null,
      })),
    [language]
  );
}

export const WILD_ANIMAL_MAX_BOND: Record<string, number> = {
  Dolphin: 5,
  Penguin: 5,
  Maltese: 5,
};
