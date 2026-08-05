import type { ColorKey } from '@/constants/heartopia-colors';

export interface InsectItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  spot: string;
  watertype: string;
  time: string;
  weather: string;
  xp: number;
  emoji: string;
}

export const INSECTS: InsectItem[] = [
  { name: "Apollovlinder", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Insecten-lokevenement", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Aspergehaantje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🪲" },
  { name: "Koolwitje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Citroenvlinder", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijk", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Vuurwants", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Thuis (Rotsen)", watertype: "Wants", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐛" },
  { name: "Gouden Sprinkhaan", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Onsen Berg", watertype: "Sprinkhaan", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦗" },
  { name: "Grote Roodoogjuffer", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Waterkant", watertype: "Libel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐉" },
  { name: "Koninginnenpage", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Forest", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Oranjetipje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Centrum", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Postbodevlinder", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Insecten-lokevenement", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Sulkowsky's Morphovlinder", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Opblaasbare Insectenlokker", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🦋" },
  { name: "Amethist Bloemkever", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Thuis (Rotsen)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 15, emoji: "🪲" },
  { name: "Hommel", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld", watertype: "Bij", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐝" },
  { name: "Icarusblauwtje", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Centrum", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🦋" },
  { name: "Viervlek", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijkmeeroever", watertype: "Libel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 15, emoji: "🐉" },
  { name: "Groene Zandloopkever", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Onsen Berg", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🪲" },
  { name: "Zevenstippelig Lieveheersbeestje", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijk", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 15, emoji: "🪲" },
  { name: "Siberische Sprinkhaan", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp", watertype: "Sprinkhaan", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🦗" },
  { name: "Wespenbok", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Forest", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🪲" },
  { name: "Mier", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp (Dorpsplein)", watertype: "Wants", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐛" },
  { name: "Vuurkleurkever", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Onsen Berg (Onsen)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🪲" },
  { name: "Sabelsprinkhaan", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld (Amethyststrand)", watertype: "Sprinkhaan", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🦗" },
  { name: "Kleine Maanmot", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijk", watertype: "Vlinder", time: "Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 20, emoji: "🦋" },
  { name: "Roze Sabelsprinkhaan", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Insecten-lokevenement", watertype: "Sprinkhaan", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🦗" },
  { name: "Grote Weerschijnvlinder", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld (Walvisberg)", watertype: "Vlinder", time: "'s Nachts / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 20, emoji: "🦋" },
  { name: "Rajah Brooke's Vogelvlinder", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Thuis", watertype: "Vlinder", time: "'s Nachts / Ochtend / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🦋" },
  { name: "Waroona Koekoeksbij", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bos (Hertentoren)", watertype: "Bij", time: "Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐝" },
  { name: "Luipaardvlinder", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Vissersdorp (Kade)", watertype: "Vlinder", time: "'s Nachts / Ochtend / Avond", weather: "Regen / Regenboog", xp: 25, emoji: "🦋" },
  { name: "Cicade", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bos (Geesteneik-dennenbos)", watertype: "Wants", time: "'s Nachts / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 25, emoji: "🐛" },
  { name: "Gewone Witstaartlibel", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Rivieroever", watertype: "Libel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 25, emoji: "🐉" },
  { name: "Viervlek-lieveheersbeestje", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Kratermeer)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 25, emoji: "🪲" },
  { name: "Grote Gebandeerde Sprinkhaan", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Buitenwijk", watertype: "Sprinkhaan", time: "'s Nachts / Avond", weather: "Zonnig / Regenboog", xp: 25, emoji: "🦗" },
  { name: "Middellandse Zee Bidsprinkhaan", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Stenen Klif)", watertype: "Sprinkhaan", time: "'s Nachts / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 25, emoji: "🦗" },
  { name: "Alpen Boktor", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Boseiland", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regenboog", xp: 30, emoji: "🪲" },
  { name: "Aziatisch Lieveheersbeestje", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bos (Hertentoren)", watertype: "Kever", time: "'s Nachts / Overdag / Avond", weather: "Regen / Regenboog", xp: 30, emoji: "🪲" },
  { name: "Reuze Aziatische Bidsprinkhaan", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Ruïnes)", watertype: "Sprinkhaan", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 30, emoji: "🦗" },
  { name: "Rouwmantel", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Onsen)", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag", weather: "Zonnig / Regenboog", xp: 30, emoji: "🦋" },
  { name: "Dagpauwoog", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bloemenveld (Windmolenveld)", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 30, emoji: "🦋" },
  { name: "Spreidpoot-houtbij", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bloemenveld (Walvisberg)", watertype: "Bij", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 30, emoji: "🐝" },
  { name: "Witte Heks (Nachtvlinder)", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Insecten-lokevenement", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 30, emoji: "🦋" },
  { name: "Bosbeekjuffer", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Boslmeeroever", watertype: "Libel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 35, emoji: "🐉" },
  { name: "Blauwe Schildwants", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Vissersdorp (Vuurtoren)", watertype: "Wants", time: "Ochtend / Overdag", weather: "Zonnig / Regen / Regenboog", xp: 35, emoji: "🐛" },
  { name: "Groene Vogelvlinder", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Buitenwijk", watertype: "Vlinder", time: "'s Nachts / Avond", weather: "Zonnig / Regen / Regenboog", xp: 35, emoji: "🦋" },
  { name: "Zilveren Juweelkever", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Stenen Klif (Bomenrand)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag", weather: "Zonnig / Regenboog", xp: 35, emoji: "🪲" },
  { name: "Vliegend Hert", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bos (Springpuzzel)", watertype: "Kever", time: "Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 35, emoji: "🪲" },
  { name: "Blauwe Morphovlinder", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bos (Geesteneik-dennenbos)", watertype: "Vlinder", time: "Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 40, emoji: "🦋" },
  { name: "Kastanjetijgervlinder", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Insecten-lokevenement", watertype: "Vlinder", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 40, emoji: "🦋" },
  { name: "Karmozijnrode Glijlibel", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Onsen Berg", watertype: "Libel", time: "'s Nachts / Overdag / Avond", weather: "Regenboog", xp: 40, emoji: "🐉" },
  { name: "Elegante Bloemkever", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bloemenveld (Walvisberg)", watertype: "Kever", time: "Ochtend / Overdag", weather: "Regen / Regenboog", xp: 40, emoji: "🪲" },
  { name: "Gouden Juweelkever", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bos (Springpuzzel)", watertype: "Kever", time: "Overdag / Avond", weather: "Zonnig / Regenboog", xp: 40, emoji: "🪲" },
  { name: "Minotauruskever", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Onsen Berg (Ruïnes)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag", weather: "Zonnig / Regen / Regenboog", xp: 40, emoji: "🪲" },
  { name: "Komeetmot", level: 8, rarity: "Episch", rarityColorKey: "coralDark", spot: "Buitenwijk", watertype: "Vlinder", time: "'s Nachts / Avond", weather: "Zonnig / Regenboog", xp: 45, emoji: "🦋" },
  { name: "Hoornkever", level: 8, rarity: "Episch", rarityColorKey: "coralDark", spot: "Fishing Village (East Pier)", watertype: "Kever", time: "'s Nachts / Avond", weather: "Zonnig / Regenboog", xp: 45, emoji: "🪲" },
  { name: "Picassowants", level: 8, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bloemenveld (Amethyststrand)", watertype: "Wants", time: "'s Nachts / Avond", weather: "Zonnig / Regenboog", xp: 45, emoji: "🐛" },
  { name: "Spaanse Maanmot", level: 8, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bos (Geesteneik-dennenbos)", watertype: "Vlinder", time: "Overdag / Avond", weather: "Zonnig / Regenboog", xp: 45, emoji: "🦋" },
  { name: "Hemelsblauwe Houtbij", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Vissersdorp (Dorpsplein)", watertype: "Bij", time: "'s Nachts / Avond", weather: "Regenboog", xp: 50, emoji: "🐝" },
  { name: "Kegelkopbidsprinkhaan", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Onsen Berg (Ruïnes)", watertype: "Sprinkhaan", time: "Overdag / Avond", weather: "Regen / Regenboog", xp: 50, emoji: "🦗" },
  { name: "Gouden Vliegend Hert", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bos (Geesteneik-dennenbos)", watertype: "Kever", time: "'s Nachts / Avond", weather: "Regen / Regenboog", xp: 50, emoji: "🪲" },
  { name: "Parelmoervlinder", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bloemenveld (Windmolenveld)", watertype: "Vlinder", time: "'s Nachts / Ochtend", weather: "Regen / Regenboog", xp: 50, emoji: "🦋" },
  { name: "Regenboog Vliegend Hert", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Insecten-lokevenement (Ruïnes)", watertype: "Kever", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 50, emoji: "🪲" },
  { name: "Zakjesmot", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bos (Hertentoren)", watertype: "Vlinder", time: "'s Nachts / Avond", weather: "Zonnig / Regenboog", xp: 55, emoji: "🦋" },
  { name: "Herculeskever", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Onsen Berg (Kratermeer)", watertype: "Kever", time: "Overdag / Avond", weather: "Zonnig / Regenboog", xp: 55, emoji: "🪲" },
  { name: "Morpho Helena", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bloemenveld (Amethyststrand)", watertype: "Vlinder", time: "Ochtend / Overdag", weather: "Regenboog", xp: 55, emoji: "🦋" },
  { name: "Zonsondergang Morphovlinder", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bos (Hertentoren)", watertype: "Vlinder", time: "Ochtend / Overdag", weather: "Regenboog", xp: 55, emoji: "🦋" },
];
