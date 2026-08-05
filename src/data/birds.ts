import type { ColorKey } from '@/constants/heartopia-colors';

export interface BirdItem {
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

export const BIRDS: BirdItem[] = [
  { name: "Baardmannetje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Onsen Berg", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Turkse Tortel", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Thuis", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Winterkoning", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Forest", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Roodborstje", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Centrum", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Flamingo", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Waterkant", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Staartmees", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Op Blancs Hoofd", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Wilde Eend", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Meer", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Bonte Fruitduif", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Roodkeel-groenduif", level: 1, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 10, emoji: "🐦" },
  { name: "Goudvink", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijk", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Vink", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bloemenveld", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Boomklever", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Smient", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Rivier", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Koolmees", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Onsen Berg", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Holenduif", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Centrum", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Roodkopklauwier", level: 2, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijk", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 15, emoji: "🐦" },
  { name: "Audouins Meeuw", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Walviszee (kust & stranden), Amethyststrand", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Dubbelbandvinkje", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Vissersdorp (Vuurtoren)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Wielewaal", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Rozerivier, Thuis", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Kuifaalscholver", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Oceaan", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Koningseidereend", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Rivier", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Casarca", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Buitenwijkmeer", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Zilverkeelmees", level: 3, rarity: "Gewoon", rarityColorKey: "forestSoft", spot: "Bos (Springpuzzel)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 20, emoji: "🐦" },
  { name: "Haakbek", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Boseiland", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 25, emoji: "🐦" },
  { name: "Przevalski's Baardmees", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Vissersdorp (Dorpsplein)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 25, emoji: "🐦" },
  { name: "Regent Prieelvogel", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Bos (Geesteneik-dennenbos)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 25, emoji: "🐦" },
  { name: "Nonnetje", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Boslmeer", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 25, emoji: "🐦" },
  { name: "Witte Kwikstaart", level: 4, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Amethyststrand", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 25, emoji: "🐦" },
  { name: "Afrikaanse Olijfduif", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Onsen)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 30, emoji: "🐦" },
  { name: "Bijeneter", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Meeroever)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 30, emoji: "🐦" },
  { name: "Geelbuikvliegenvanger", level: 5, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Vissersdorp (Kade)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 30, emoji: "🐦" },
  { name: "Kaneelgrondduif", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Fishing Village (East Pier)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 35, emoji: "🐦" },
  { name: "Appelvink", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Kratermeer)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 35, emoji: "🐦" },
  { name: "Ransuil", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Onsen Berg (Stenen Klif)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 35, emoji: "🐦" },
  { name: "Roodgezichtaalscholver", level: 6, rarity: "Zeldzaam", rarityColorKey: "skyDark", spot: "Oude Zee/Walviszee", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 35, emoji: "🐦" },
  { name: "Azuurmees", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bloemenveld (Windmolenveld)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Torenvalk", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bos (Hertentoren)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Oostelijk Blauwvogeltje", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Buitenwijk", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Jamboevruchtduif", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Buitenwijk", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Slechtvalk", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Onsen Berg (Onsen)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Roze Duif", level: 7, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bloemenveld (Walvisberg)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 40, emoji: "🐦" },
  { name: "Barmsijs", level: 8, rarity: "Episch", rarityColorKey: "coralDark", spot: "Bos (Geesteneik-dennenbos)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 45, emoji: "🐦" },
  { name: "Amerikaanse Flamingo", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bloemenveld (Amethyststrand)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regenboog", xp: 50, emoji: "🐦" },
  { name: "Keizeraalscholver", level: 9, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Oostzee/Zephyrzee", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 50, emoji: "🐦" },
  { name: "Amoervalk", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Onsen Berg (Ruïnes)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Zonnig / Regen / Regenboog", xp: 55, emoji: "🐦" },
  { name: "Oehoe", level: 10, rarity: "Legendarisch", rarityColorKey: "yellow", spot: "Bos (Hertentoren)", watertype: "Vogel", time: "'s Nachts / Ochtend / Overdag / Avond", weather: "Regen / Regenboog", xp: 55, emoji: "🐦" },
];
