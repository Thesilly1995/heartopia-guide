import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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

interface BirdRaw {
  nameNl: string;
  nameEn: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  spotNl: string;
  spotEn: string;
  watertypeNl: string;
  watertypeEn: string;
  timeNl: string;
  timeEn: string;
  weatherNl: string;
  weatherEn: string;
  xp: number;
  emoji: string;
}

const BIRDS_RAW: BirdRaw[] = [
  { nameNl: "Baardmannetje", nameEn: "Bearded Reedling", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Turkse Tortel", nameEn: "Eurasian Collared Dove", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Thuis", spotEn: "Home", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Winterkoning", nameEn: "Eurasian Wren", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Forest", spotEn: "Forest", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Roodborstje", nameEn: "European Robin", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Centrum", spotEn: "Central Area", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Flamingo", nameEn: "Greater Flamingo", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Waterkant", spotEn: "Waterside", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Staartmees", nameEn: "Long-Tailed Tit", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Op Blancs Hoofd", spotEn: "On Blanc's Head", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Wilde Eend", nameEn: "Mallard", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Meer", spotEn: "Lake", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Bonte Fruitduif", nameEn: "Pied Imperial Pigeon", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Vissersdorp", spotEn: "Fishing Village", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Roodkeel-groenduif", nameEn: "Pink-Necked Green Pigeon", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Bloemenveld", spotEn: "Flower Field", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 1, rarityColorKey: "forestSoft", xp: 10, emoji: "🐦" },
  { nameNl: "Goudvink", nameEn: "Eurasian Bullfinch", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Buitenwijk", spotEn: "Suburbs", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Vink", nameEn: "Eurasian Chaffinch", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Bloemenveld", spotEn: "Flower Field", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Boomklever", nameEn: "Eurasian Nuthatch", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Vissersdorp", spotEn: "Fishing Village", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Smient", nameEn: "Eurasian Wigeon", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Rivier", spotEn: "River", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Koolmees", nameEn: "Great Tit", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Holenduif", nameEn: "Stock Dove", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Centrum", spotEn: "Central Area", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Roodkopklauwier", nameEn: "Woodchat Shrike", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Buitenwijk", spotEn: "Suburbs", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 2, rarityColorKey: "forestSoft", xp: 15, emoji: "🐦" },
  { nameNl: "Audouins Meeuw", nameEn: "Audouin's Gull", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Walviszee (kust & stranden), Amethyststrand", spotEn: "Whale Sea (seaside & beaches), Amethyst Beach", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Dubbelbandvinkje", nameEn: "Double-Barred Finch", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Vissersdorp (Vuurtoren)", spotEn: "Fishing Village (Lighthouse)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Wielewaal", nameEn: "Eurasian Golden Oriole", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Rozerivier, Thuis", spotEn: "Rosy River, Home", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Kuifaalscholver", nameEn: "European Shag", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Oceaan", spotEn: "Ocean", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Koningseidereend", nameEn: "King Eider", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Rivier", spotEn: "River", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Casarca", nameEn: "Ruddy Shelduck", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Buitenwijkmeer", spotEn: "Suburban Lake", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Zilverkeelmees", nameEn: "Silver-Throated Tit", rarityNl: "Gewoon", rarityEn: "Common", spotNl: "Bos (Springpuzzel)", spotEn: "Forest (Jump Puzzle)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 3, rarityColorKey: "forestSoft", xp: 20, emoji: "🐦" },
  { nameNl: "Haakbek", nameEn: "Pine Grosbeak", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Boseiland", spotEn: "Forest Island", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 4, rarityColorKey: "skyDark", xp: 25, emoji: "🐦" },
  { nameNl: "Przevalski's Baardmees", nameEn: "Przevalski's Parrotbill", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Vissersdorp (Dorpsplein)", spotEn: "Fishing Village (Fishing Village Square)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regenboog", weatherEn: "Sunny / Rainbow", level: 4, rarityColorKey: "skyDark", xp: 25, emoji: "🐦" },
  { nameNl: "Regent Prieelvogel", nameEn: "Regent Bowerbird", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Bos (Geesteneik-dennenbos)", spotEn: "Forest (Spirit Oak Pine Forest)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 4, rarityColorKey: "skyDark", xp: 25, emoji: "🐦" },
  { nameNl: "Nonnetje", nameEn: "Smew", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Boslmeer", spotEn: "Forest Lake", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 4, rarityColorKey: "skyDark", xp: 25, emoji: "🐦" },
  { nameNl: "Witte Kwikstaart", nameEn: "White Wagtail", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Amethyststrand", spotEn: "Amethyst Beach", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 4, rarityColorKey: "skyDark", xp: 25, emoji: "🐦" },
  { nameNl: "Afrikaanse Olijfduif", nameEn: "African Olive Pigeon", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Onsen Berg (Onsen)", spotEn: "Onsen Mountain (Onsen)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 5, rarityColorKey: "skyDark", xp: 30, emoji: "🐦" },
  { nameNl: "Bijeneter", nameEn: "European Bee-Eater", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Onsen Berg (Meeroever)", spotEn: "Onsen Mountain (Lake Shore)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Regen / Regenboog", weatherEn: "Rainy / Rainbow", level: 5, rarityColorKey: "skyDark", xp: 30, emoji: "🐦" },
  { nameNl: "Geelbuikvliegenvanger", nameEn: "Yellow Bellied Flycatcher", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Vissersdorp (Kade)", spotEn: "Fishing Village (Wharf)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 5, rarityColorKey: "skyDark", xp: 30, emoji: "🐦" },
  { nameNl: "Kaneelgrondduif", nameEn: "Cinnamon Ground Dove", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Fishing Village (East Pier)", spotEn: "Fishing Village (East Pier)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 6, rarityColorKey: "skyDark", xp: 35, emoji: "🐦" },
  { nameNl: "Appelvink", nameEn: "Hawfinch", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Onsen Berg (Kratermeer)", spotEn: "Onsen Mountain (Crater Lake)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 6, rarityColorKey: "skyDark", xp: 35, emoji: "🐦" },
  { nameNl: "Ransuil", nameEn: "Long Eared Owl", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Onsen Berg (Stenen Klif)", spotEn: "Onsen Mountain (Stone Cliff)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regenboog", weatherEn: "Sunny / Rainbow", level: 6, rarityColorKey: "skyDark", xp: 35, emoji: "🐦" },
  { nameNl: "Roodgezichtaalscholver", nameEn: "Red Faced Cormorant", rarityNl: "Zeldzaam", rarityEn: "Rare", spotNl: "Oude Zee/Walviszee", spotEn: "Old Sea/Whale Sea", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 6, rarityColorKey: "skyDark", xp: 35, emoji: "🐦" },
  { nameNl: "Azuurmees", nameEn: "Azure Tit", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Bloemenveld (Windmolenveld)", spotEn: "Flower Field (Windmill Flower Field)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Torenvalk", nameEn: "Common Kestrel", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Bos (Hertentoren)", spotEn: "Forest (Deer Tower)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regenboog", weatherEn: "Sunny / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Oostelijk Blauwvogeltje", nameEn: "Eastern Bluebird", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Buitenwijk", spotEn: "Suburbs", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Regen / Regenboog", weatherEn: "Rainy / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Jamboevruchtduif", nameEn: "Jambu Fruit Dove", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Buitenwijk", spotEn: "Suburbs", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Slechtvalk", nameEn: "Peregrine Falcon", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Onsen Berg (Onsen)", spotEn: "Onsen Mountain (Onsen)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Regen / Regenboog", weatherEn: "Rainy / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Roze Duif", nameEn: "Pink Pigeon", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Bloemenveld (Walvisberg)", spotEn: "Flower Field (Whale Mountain)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 7, rarityColorKey: "coralDark", xp: 40, emoji: "🐦" },
  { nameNl: "Barmsijs", nameEn: "Redpoll", rarityNl: "Episch", rarityEn: "Epic", spotNl: "Bos (Geesteneik-dennenbos)", spotEn: "Forest (Spirit Oak Pine Forest)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 8, rarityColorKey: "coralDark", xp: 45, emoji: "🐦" },
  { nameNl: "Amerikaanse Flamingo", nameEn: "American Flamingo", rarityNl: "Legendarisch", rarityEn: "Legendary", spotNl: "Bloemenveld (Amethyststrand)", spotEn: "Flower Field (Amethyst Beach)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Regenboog", weatherEn: "Rainbow", level: 9, rarityColorKey: "yellow", xp: 50, emoji: "🐦" },
  { nameNl: "Keizeraalscholver", nameEn: "Imperial Shag", rarityNl: "Legendarisch", rarityEn: "Legendary", spotNl: "Oostzee/Zephyrzee", spotEn: "East Sea/Zephyr Sea", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 9, rarityColorKey: "yellow", xp: 50, emoji: "🐦" },
  { nameNl: "Amoervalk", nameEn: "Amur Falcon", rarityNl: "Legendarisch", rarityEn: "Legendary", spotNl: "Onsen Berg (Ruïnes)", spotEn: "Onsen Mountain (Ruins)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Zonnig / Regen / Regenboog", weatherEn: "Sunny / Rainy / Rainbow", level: 10, rarityColorKey: "yellow", xp: 55, emoji: "🐦" },
  { nameNl: "Oehoe", nameEn: "Eagle-Owl", rarityNl: "Legendarisch", rarityEn: "Legendary", spotNl: "Bos (Hertentoren)", spotEn: "Forest (Deer Tower)", watertypeNl: "Vogel", watertypeEn: "Bird", timeNl: "'s Nachts / Ochtend / Overdag / Avond", timeEn: "Night / Dawn / Day / Dusk", weatherNl: "Regen / Regenboog", weatherEn: "Rainy / Rainbow", level: 10, rarityColorKey: "yellow", xp: 55, emoji: "🐦" },
];

export function useBirds(): BirdItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      BIRDS_RAW.map((r) => ({
    name: r.nameEn,
    rarity: r.rarityEn,
    spot: r.spotEn,
    watertype: r.watertypeEn,
    time: language === 'en' ? r.timeEn : r.timeNl,
    weather: language === 'en' ? r.weatherEn : r.weatherNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    xp: r.xp,
    emoji: r.emoji,
      })),
    [language]
  );
}
