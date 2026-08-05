export interface WildAnimalItem {
  name: string;
  weather: string;
  foods: string[];
  spot: string;
  note: string | null;
  emoji: string;
}

export const WILD_ANIMALS: WildAnimalItem[] = [
  { name: "Alpaca", weather: "Zonnig", foods: ["Bosbes","Ananas","Tarwe"], spot: "Zuiden van het Bloemenveld, op de heuvel bij de grote gele eend", note: null, emoji: "🦙" },
  { name: "Konijntje", weather: "Zonnig, Regenboog", foods: ["Wortel","Aardbei","Onkruid"], spot: "Bij plot 2, aan het pad richting het dorp", note: null, emoji: "🐰" },
  { name: "Capybara", weather: "Regen, Regenboog", foods: ["Tomaat","Druif","Framboos"], spot: "Bij de voet van de heuvel, tegenover de eerste Fluoriet-plek", note: null, emoji: "🦫" },
  { name: "Fret", weather: "Regen, Regenboog", foods: ["Ei","Grondel","Zeebaars"], spot: "Noordelijkste windmolen, bij de boomstronk naast de bankjes", note: null, emoji: "🐾" },
  { name: "Vos", weather: "Zonnig, Regenboog", foods: ["Baars","Grootbekbaars","Vlees"], spot: "Midden van het Bloemenveld, bij de zuidelijke windmolen", note: null, emoji: "🦊" },
  { name: "Panda", weather: "Regen", foods: ["Appel","Bamboe","Maïs"], spot: "Bos, bij de trap naar de Springpuzzel (Cassie)", note: null, emoji: "🐼" },
  { name: "Pinguïn", weather: "Sneeuw", foods: ["Gewone Garnaal","Valse Horsmakreel","Sardine"], spot: "Onsen Berg, ten oosten van Frostspore (alleen Winter Frost Season)", note: null, emoji: "🐧" },
  { name: "Zeeotter", weather: "Regen", foods: ["Gewone Garnaal","Mossel","Oosterse Garnaal"], spot: "Op een rots in de haven, bij de blauwe boot-zitjes", note: null, emoji: "🦦" },
  { name: "Sikahert", weather: "Zonnig, Regenboog", foods: ["Tak","Huissalade","Sla"], spot: "Tegenover de meeroever in het junglegebied", note: null, emoji: "🦌" },
  { name: "Dolfijn", weather: "Zonnig", foods: ["Sardine","Zeebaars","Horsmakreel"], spot: "Whalefall Canyon, dolfijnentrog ten zuiden van de Whalefall", note: "Tijdelijk dier van het huidige Call of Whales-event — verdwijnt zodra het event eindigt (22 augustus 2026)", emoji: "🐬" },
  { name: "Maltezer", weather: "Zonnig, Regenboog", foods: ["Vlees","Hondenvoer","Gegrilde Champignon"], spot: "Truffeleiland", note: "Dier van een afgelopen event (Maltese-collab, geëindigd 25 mei 2026). Kan mogelijk je woonplot bezoeken of terugkeren in een volgend event — vriendschap blijft daarom bijhoudbaar", emoji: "🐶" },
];

export const WILD_ANIMAL_MAX_BOND: Record<string, number> = {
  Dolphin: 5,
  Penguin: 5,
  Maltese: 5,
};
