import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

export interface SculptureItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  method: string;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (AthenaMM e.a.). */
  sellPriceByStar: number[] | null;
}

interface SculptureRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  nameFr: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  methodNl: string;
  methodEn: string;
  methodEs: string;
  methodPt: string;
  emoji: string;
  sellPriceByStar: number[] | null;
}

const SAND_METHOD_EN = "Timing minigame (Sand Sculpture Base)";
const SAND_METHOD_NL = "Timing-minigame (Zandsculptuur Basis)";
const SAND_METHOD_ES = "Minijuego de tiempo (Base de Escultura de Arena)";
const SAND_METHOD_PT = "Minijogo de tempo (Base de Escultura de Areia)";

const SAND_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Auto", nameEn: "Car", nameEs: "Auto", namePt: "Carro", nameFr: "Voiture", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🚗", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Kikker", nameEn: "Frog", nameEs: "Rana", namePt: "Sapo", nameFr: "Grenouille", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🐸", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Heremietkreeft", nameEn: "Hermit Crab", nameEs: "Cangrejo Ermitaño", namePt: "Caranguejo Eremita", nameFr: "Crabe ermite", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🦀", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Eend", nameEn: "Duck", nameEs: "Pato", namePt: "Pato", nameFr: "Canard", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🦆", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Konijntje", nameEn: "Bunny", nameEs: "Conejito", namePt: "Coelhinho", nameFr: "Petit lapin", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🐰", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Vuurtoren", nameEn: "Lighthouse", nameEs: "Faro", namePt: "Farol", nameFr: "Phare", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🗼", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Schip", nameEn: "Ship", nameEs: "Barco", namePt: "Navio", nameFr: "Bateau", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 2, rarityColorKey: "skyDark", emoji: "🚢", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Beer", nameEn: "Bear", nameEs: "Oso", namePt: "Urso", nameFr: "Ours", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 2, rarityColorKey: "skyDark", emoji: "🐻", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Meeuw", nameEn: "Seagull", nameEs: "Gaviota", namePt: "Gaivota", nameFr: "Mouette", rarityNl: "Episch", rarityEn: "Epic", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 3, rarityColorKey: "coralDark", emoji: "🐦", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Walvis", nameEn: "Whale", nameEs: "Ballena", namePt: "Baleia", nameFr: "Baleine", rarityNl: "Episch", rarityEn: "Epic", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 3, rarityColorKey: "coralDark", emoji: "🐋", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "IJsbeer", nameEn: "Polar Bear", nameEs: "Oso Polar", namePt: "Urso Polar", nameFr: "Ours polaire", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 4, rarityColorKey: "yellow", emoji: "🐻‍❄️", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Mozaïek Standbeeld", nameEn: "Mosai Statue", nameEs: "Estatua de Mosaico", namePt: "Estátua de Mosaico", nameFr: "Statue en mosaïque", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 4, rarityColorKey: "yellow", emoji: "🗿", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Cactus", nameEn: "Cactus", nameEs: "Cactus", namePt: "Cacto", nameFr: "Cactus", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 5, rarityColorKey: "yellow", emoji: "🌵", sellPriceByStar: [280,420,560,700,1120] },
  { nameNl: "Gespierde Kat", nameEn: "Muscle Cat", nameEs: "Gato Musculoso", namePt: "Gato Musculoso", nameFr: "Chat musclé", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SAND_METHOD_NL, methodEn: SAND_METHOD_EN, methodEs: SAND_METHOD_ES, methodPt: SAND_METHOD_PT, level: 5, rarityColorKey: "yellow", emoji: "🐈", sellPriceByStar: [280,420,560,700,1120] },
];

const SAND_METHOD_BY_LANG = (r: SculptureRaw, language: Language) =>
  language === 'es' ? r.methodEs : language === 'pt' ? r.methodPt : language === 'fr' ? r.methodEn : language === 'en' ? r.methodEn : r.methodNl;

export function useSandSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SAND_SCULPTURES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : r.nameEn,
    rarity: r.rarityEn,
    method: SAND_METHOD_BY_LANG(r, language),
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
