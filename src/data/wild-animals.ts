import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

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
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  weatherNl: string;
  weatherEn: string;
  weatherEs: string;
  weatherPt: string;
  foodsNl: string[];
  foodsEn: string[];
  foodsEs: string[];
  foodsPt: string[];
  spotNl: string;
  spotEn: string;
  spotEs: string;
  spotPt: string;
  noteNl: string | null;
  noteEn: string | null;
  noteEs: string | null;
  notePt: string | null;
  emoji: string;
}

const WILD_ANIMALS_RAW: WildAnimalRaw[] = [
  { nameNl: "Capybara", nameEn: "Capybara", nameEs: "Capibara", namePt: "Capivara", nameFr: "Capybara", nameDe: "Capybara", weatherNl: "Regen, Regenboog", weatherEn: "Rainy, Rainbow", weatherEs: "Lluvioso, Arcoíris", weatherPt: "Chuvoso, Arco-íris", foodsNl: ["Tomaat","Druif","Framboos"], foodsEn: ["Tomato","Grape","Raspberry"], foodsEs: ["Tomate","Uva","Frambuesa"], foodsPt: ["Tomate","Uva","Framboesa"], spotNl: "Bij de voet van de heuvel, tegenover de eerste Fluoriet-plek", spotEn: "At the foot of the hill, across from the first Fluorite spot", spotEs: "Al pie de la colina, frente al primer punto de Fluorita", spotPt: "Ao pé da colina, em frente ao primeiro ponto de Fluorita", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🦫" },
  { nameNl: "Fret", nameEn: "Ferret", nameEs: "Hurón", namePt: "Furão", nameFr: "Furet", nameDe: "Frettchen", weatherNl: "Regen, Regenboog", weatherEn: "Rainy, Rainbow", weatherEs: "Lluvioso, Arcoíris", weatherPt: "Chuvoso, Arco-íris", foodsNl: ["Ei","Grondel","Zeebaars"], foodsEn: ["Egg","Goby","Sea Bass"], foodsEs: ["Huevo","Gobio","Lubina"], foodsPt: ["Ovo","Góbio","Robalo"], spotNl: "Noordelijkste windmolen, bij de boomstronk naast de bankjes", spotEn: "Northernmost windmill, by the tree stump next to the benches", spotEs: "Molino más al norte, junto al tocón cerca de las bancas", spotPt: "Moinho mais ao norte, perto do toco de árvore ao lado dos bancos", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🐾" },
  { nameNl: "Konijntje", nameEn: "Bunny", nameEs: "Conejito", namePt: "Coelhinho", nameFr: "Lapin", nameDe: "Kaninchen", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", weatherEs: "Soleado, Arcoíris", weatherPt: "Ensolarado, Arco-íris", foodsNl: ["Wortel","Aardbei","Onkruid"], foodsEn: ["Carrot","Strawberry","Weeds"], foodsEs: ["Zanahoria","Fresa","Malezas"], foodsPt: ["Cenoura","Morango","Ervas Daninhas"], spotNl: "Bij plot 2, aan het pad richting het dorp", spotEn: "Near plot 2, on the path toward the village", spotEs: "Cerca de la parcela 2, en el camino hacia el pueblo", spotPt: "Perto do lote 2, no caminho em direção à vila", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🐰" },
  { nameNl: "Vos", nameEn: "Fox", nameEs: "Zorro", namePt: "Raposa", nameFr: "Renard", nameDe: "Fuchs", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", weatherEs: "Soleado, Arcoíris", weatherPt: "Ensolarado, Arco-íris", foodsNl: ["Baars","Grootbekbaars","Vlees"], foodsEn: ["European Perch","Largemouth Bass","Meat"], foodsEs: ["Perca Europea","Lobina Negra","Carne"], foodsPt: ["Perca Europeia","Black Bass","Carne"], spotNl: "Midden van het Bloemenveld, bij de zuidelijke windmolen", spotEn: "Middle of the Flower Field, by the southern windmill", spotEs: "En medio del Campo de Flores, junto al molino sur", spotPt: "No meio do Campo de Flores, perto do moinho sul", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🦊" },
  { nameNl: "Alpaca", nameEn: "Alpaca", nameEs: "Alpaca", namePt: "Alpaca", nameFr: "Alpaga", nameDe: "Alpaka", weatherNl: "Zonnig", weatherEn: "Sunny", weatherEs: "Soleado", weatherPt: "Ensolarado", foodsNl: ["Bosbes","Ananas","Tarwe"], foodsEn: ["Blueberry","Pineapple","Wheat"], foodsEs: ["Arándano","Piña","Trigo"], foodsPt: ["Mirtilo","Abacaxi","Trigo"], spotNl: "Zuiden van het Bloemenveld, op de heuvel bij de grote gele eend", spotEn: "South of the Flower Field, on the hill by the big yellow duck", spotEs: "Al sur del Campo de Flores, en la colina junto al gran pato amarillo", spotPt: "Ao sul do Campo de Flores, na colina perto do grande pato amarelo", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🦙" },
  { nameNl: "Zeeotter", nameEn: "Sea Otter", nameEs: "Nutria Marina", namePt: "Lontra Marinha", nameFr: "Loutre de mer", nameDe: "Seeotter", weatherNl: "Regen", weatherEn: "Rainy", weatherEs: "Lluvioso", weatherPt: "Chuvoso", foodsNl: ["Gewone Garnaal","Mossel","Oosterse Garnaal"], foodsEn: ["Common Shrimp","Mussel","Oriental Shrimp"], foodsEs: ["Camarón Común","Mejillón","Camarón Oriental"], foodsPt: ["Camarão Comum","Mexilhão","Camarão Oriental"], spotNl: "Op een rots in de haven, bij de blauwe boot-zitjes", spotEn: "On a rock in the harbor, by the blue boat seats", spotEs: "Sobre una roca en el puerto, junto a los asientos del bote azul", spotPt: "Em uma pedra no porto, perto dos assentos do barco azul", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🦦" },
  { nameNl: "Panda", nameEn: "Panda", nameEs: "Panda", namePt: "Panda", nameFr: "Panda", nameDe: "Panda", weatherNl: "Regen", weatherEn: "Rainy", weatherEs: "Lluvioso", weatherPt: "Chuvoso", foodsNl: ["Appel","Bamboe","Maïs"], foodsEn: ["Apple","Bamboo","Corn"], foodsEs: ["Manzana","Bambú","Maíz"], foodsPt: ["Maçã","Bambu","Milho"], spotNl: "Bos, bij de trap naar de Springpuzzel (Cassie)", spotEn: "Forest, by the stairs to the Jump Puzzle (Cassie)", spotEs: "Bosque, junto a las escaleras hacia el Rompecabezas de Saltos (Cassie)", spotPt: "Floresta, perto da escada para o Quebra-cabeça de Pulos (Cassie)", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🐼" },
  { nameNl: "Sikahert", nameEn: "Sika Deer", nameEs: "Ciervo Sika", namePt: "Cervo Sika", nameFr: "Cerf sika", nameDe: "Sika-Hirsch", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", weatherEs: "Soleado, Arcoíris", weatherPt: "Ensolarado, Arco-íris", foodsNl: ["Tak","Huissalade","Sla"], foodsEn: ["Branch","House Salad","Lettuce"], foodsEs: ["Rama","Ensalada de la Casa","Lechuga"], foodsPt: ["Galho","Salada da Casa","Alface"], spotNl: "Tegenover de meeroever in het junglegebied", spotEn: "Across from the lake shore in the jungle area", spotEs: "Frente a la orilla del lago en la zona de la jungla", spotPt: "Em frente à margem do lago na área da selva", noteNl: null, noteEn: null, noteEs: null, notePt: null, emoji: "🦌" },
  { nameNl: "Dolfijn", nameEn: "Dolphin", nameEs: "Delfín", namePt: "Golfinho", nameFr: "Dauphin", nameDe: "Delphin", weatherNl: "Zonnig", weatherEn: "Sunny", weatherEs: "Soleado", weatherPt: "Ensolarado", foodsNl: ["Sardine","Zeebaars","Horsmakreel"], foodsEn: ["Sardine","Sea Bass","Scad"], foodsEs: ["Sardina","Lubina","Jurel"], foodsPt: ["Sardinha","Robalo","Carapau"], spotNl: "Whalefall Canyon, dolfijnentrog ten zuiden van de Whalefall", spotEn: "Whalefall Canyon, dolphin trough south of the Whalefall", spotEs: "Cañón Whalefall, abrevadero de delfines al sur del Whalefall", spotPt: "Cânion Whalefall, cocho de golfinhos ao sul do Whalefall", noteNl: "Tijdelijk dier van een afgelopen event (Call of Whales, geëindigd 22 augustus 2026) — kan momenteel niet meer gevoerd worden. Kan mogelijk terugkeren in een volgend event — vriendschap blijft daarom bijhoudbaar", noteEn: "Temporary animal from a past event (Call of Whales, ended Aug 22, 2026) — can no longer be fed right now. May return in a future event — friendship stays trackable for that reason", noteEs: "Animal temporal de un evento pasado (Call of Whales, finalizado el 22 de agosto de 2026) — ya no se puede alimentar por ahora. Puede volver en un futuro evento — por eso la amistad se sigue pudiendo rastrear", notePt: "Animal temporário de um evento passado (Call of Whales, encerrado em 22 de agosto de 2026) — não pode mais ser alimentado no momento. Pode voltar em um evento futuro — por isso a amizade continua rastreável", emoji: "🐬" },
  { nameNl: "Pinguïn", nameEn: "Penguin", nameEs: "Pingüino", namePt: "Pinguim", nameFr: "Pingouin", nameDe: "Pinguin", weatherNl: "Sneeuw", weatherEn: "Snowy", weatherEs: "Nevado", weatherPt: "Nevando", foodsNl: ["Gewone Garnaal","Valse Horsmakreel","Sardine"], foodsEn: ["Common Prawn","False Scad","Sardine"], foodsEs: ["Langostino Común","Jurel Falso","Sardina"], foodsPt: ["Camarão Comum","Carapau Falso","Sardinha"], spotNl: "Onsen Berg, ten oosten van Frostspore (alleen Winter Frost Season)", spotEn: "Onsen Mountain, east of Frostspore (Winter Frost Season only)", spotEs: "Montaña Onsen, al este de Frostspore (solo en Winter Frost Season)", spotPt: "Montanha Onsen, a leste de Frostspore (somente na Winter Frost Season)", noteNl: "Tijdelijk dier van een afgelopen event (Winter Frost Season) — kan momenteel niet meer gevoerd worden. Kan mogelijk terugkeren in een volgend winterevent — vriendschap blijft daarom bijhoudbaar", noteEn: "Temporary animal from a past event (Winter Frost Season) — can no longer be fed right now. May return in a future winter event — friendship stays trackable for that reason", noteEs: "Animal temporal de un evento pasado (Winter Frost Season) — ya no se puede alimentar por ahora. Puede volver en un futuro evento de invierno — por eso la amistad se sigue pudiendo rastrear", notePt: "Animal temporário de um evento passado (Winter Frost Season) — não pode mais ser alimentado no momento. Pode voltar em um futuro evento de inverno — por isso a amizade continua rastreável", emoji: "🐧" },
  { nameNl: "Maltezer", nameEn: "Maltese", nameEs: "Maltés", namePt: "Maltês", nameFr: "Maltais", nameDe: "Malteser", weatherNl: "Zonnig, Regenboog", weatherEn: "Sunny, Rainbow", weatherEs: "Soleado, Arcoíris", weatherPt: "Ensolarado, Arco-íris", foodsNl: ["Vlees","Hondenvoer","Gegrilde Champignon"], foodsEn: ["Meat","Dog Food","Grilled Mushroom"], foodsEs: ["Carne","Comida para Perros","Champiñón a la Parrilla"], foodsPt: ["Carne","Ração para Cachorro","Cogumelo Grelhado"], spotNl: "Truffeleiland", spotEn: "Truffle Island", spotEs: "Isla de las Trufas", spotPt: "Ilha das Trufas", noteNl: "Dier van een afgelopen event (Maltese-collab, geëindigd 25 mei 2026). Kan mogelijk je woonplot bezoeken of terugkeren in een volgend event — vriendschap blijft daarom bijhoudbaar", noteEn: "Animal from a past event (Maltese collab, ended May 25, 2026). May still visit your home plot or return in a future event — friendship stays trackable for that reason", noteEs: "Animal de un evento pasado (colaboración Maltés, finalizada el 25 de mayo de 2026). Puede que aún visite tu parcela o vuelva en un futuro evento — por eso la amistad se sigue pudiendo rastrear", notePt: "Animal de um evento passado (colaboração Maltês, encerrada em 25 de maio de 2026). Ainda pode visitar seu lote ou voltar em um evento futuro — por isso a amizade continua rastreável", emoji: "🐶" },
];

const WEATHER_BY_LANG = (r: WildAnimalRaw, language: Language) =>
  language === 'es' ? r.weatherEs : language === 'pt' ? r.weatherPt : language === 'fr' ? r.weatherEn : language === 'de' ? r.weatherEn : language === 'en' ? r.weatherEn : r.weatherNl;

const FOODS_BY_LANG = (r: WildAnimalRaw, language: Language) =>
  language === 'es' ? r.foodsEs : language === 'pt' ? r.foodsPt : r.foodsEn;

const SPOT_BY_LANG = (r: WildAnimalRaw, language: Language) =>
  language === 'es' ? r.spotEs : language === 'pt' ? r.spotPt : language === 'fr' ? r.spotEn : language === 'de' ? r.spotEn : language === 'en' ? r.spotEn : r.spotNl;

const NOTE_BY_LANG = (r: WildAnimalRaw, language: Language) =>
  language === 'es' ? r.noteEs : language === 'pt' ? r.notePt : language === 'fr' ? r.noteEn : language === 'de' ? r.noteEn : language === 'en' ? r.noteEn : r.noteNl;

export function useWildAnimals(): WildAnimalItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_ANIMALS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    weather: WEATHER_BY_LANG(r, language),
    foods: FOODS_BY_LANG(r, language),
    spot: SPOT_BY_LANG(r, language),
    note: NOTE_BY_LANG(r, language),
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
