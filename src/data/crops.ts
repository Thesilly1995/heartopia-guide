import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

export interface CropItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (AthenaMM e.a.). */
  sellPriceByStar: number[] | null;
}

interface CropRaw {
  nameNl: string;
  nameEn: string;
  /** Bron: heartodex.com/cultivos (community-wiki, ES/PT-vertaling). */
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  growTimeNl: string;
  growTimeEn: string;
  growTimeEs: string;
  growTimePt: string;
  seedPrice: number;
  emoji: string;
  sellPriceByStar: number[] | null;
}

const CROPS_RAW: CropRaw[] = [
  { nameNl: "Aardappel", nameEn: "Potato", nameEs: "Patata", namePt: "Batata", nameFr: "Pomme de terre", nameDe: "Kartoffel", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "60 min", growTimeEn: "60 min", growTimeEs: "60 min", growTimePt: "60 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🥔", sellPriceByStar: [90,120,150,180,210] },
  { nameNl: "Tomaat", nameEn: "Tomato", nameEs: "Tomate", namePt: "Tomate", nameFr: "Tomate", nameDe: "Tomate", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "15 min", growTimeEn: "15 min", growTimeEs: "15 min", growTimePt: "15 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 10, emoji: "🍅", sellPriceByStar: [30,40,50,60,90] },
  { nameNl: "Rijst", nameEn: "Paddy Rice", nameEs: "Arroz", namePt: "Arroz", nameFr: "Riz", nameDe: "Reis", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "20 min", growTimeEn: "20 min", growTimeEs: "20 min", growTimePt: "20 min", level: 1, rarityColorKey: "forestSoft", seedPrice: 12, emoji: "🌾", sellPriceByStar: [37,49,61,74,111] },
  { nameNl: "Tarwe", nameEn: "Wheat", nameEs: "Trigo", namePt: "Trigo", nameFr: "Blé", nameDe: "Weizen", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "4 uur", growTimeEn: "4 hours", growTimeEs: "4 horas", growTimePt: "4 horas", level: 2, rarityColorKey: "forestSoft", seedPrice: 95, emoji: "🌾", sellPriceByStar: [285,381,475,570,855] },
  { nameNl: "Sla", nameEn: "Lettuce", nameEs: "Lechuga", namePt: "Alface Americana", nameFr: "Laitue", nameDe: "Salat", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "8 uur", growTimeEn: "8 hours", growTimeEs: "8 horas", growTimePt: "8 horas", level: 3, rarityColorKey: "forestSoft", seedPrice: 145, emoji: "🥬", sellPriceByStar: [435,582,726,870,1305] },
  { nameNl: "Ananas", nameEn: "Pineapple", nameEs: "Piña", namePt: "Abacaxi", nameFr: "Ananas", nameDe: "Ananas", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "30 min", growTimeEn: "30 min", growTimeEs: "30 min", growTimePt: "30 min", level: 4, rarityColorKey: "skyDark", seedPrice: 15, emoji: "🍍", sellPriceByStar: [52,69,86,104,118] },
  { nameNl: "Wortel", nameEn: "Carrot", nameEs: "Zanahoria", namePt: "Cenoura", nameFr: "Carotte", nameDe: "Möhre", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "2 uur", growTimeEn: "2 hours", growTimeEs: "2 horas", growTimePt: "2 horas", level: 5, rarityColorKey: "skyDark", seedPrice: 50, emoji: "🥕", sellPriceByStar: [155,207,258,310,350] },
  { nameNl: "Maïs", nameEn: "Corn", nameEs: "Maíz", namePt: "Milho", nameFr: "Maïs", nameDe: "Mais", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "12 uur", growTimeEn: "12 hours", growTimeEs: "12 horas", growTimePt: "12 horas", level: 6, rarityColorKey: "skyDark", seedPrice: 170, emoji: "🌽", sellPriceByStar: [515,690,860,1030,1545] },
  { nameNl: "Aardbei", nameEn: "Strawberry", nameEs: "Fresa", namePt: "Morango", nameFr: "Fraise", nameDe: "Erdbeere", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "6 uur", growTimeEn: "6 hours", growTimeEs: "6 horas", growTimePt: "6 horas", level: 6, rarityColorKey: "skyDark", seedPrice: 125, emoji: "🍓", sellPriceByStar: [375,502,626,750,1125] },
  { nameNl: "Druif", nameEn: "Grape", nameEs: "Uva", namePt: "Uva", nameFr: "Raisin", nameDe: "Traube", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "10 uur", growTimeEn: "10 hours", growTimeEs: "10 horas", growTimePt: "10 horas", level: 7, rarityColorKey: "coralDark", seedPrice: 160, emoji: "🍇", sellPriceByStar: [480,643,801,960,1440] },
  { nameNl: "Aubergine", nameEn: "Eggplant", nameEs: "Berenjena", namePt: "Berinjela", nameFr: "Aubergine", nameDe: "Aubergine", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "7 uur", growTimeEn: "7 hours", growTimeEs: "7 horas", growTimePt: "7 horas", level: 8, rarityColorKey: "coralDark", seedPrice: 135, emoji: "🍆", sellPriceByStar: [406,544,678,812,1218] },
  { nameNl: "Theeboom", nameEn: "Tea Tree", nameEs: "Hoja de té", namePt: "Folhas de Chá", nameFr: "Théier", nameDe: "Teestrauch", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "45 min", growTimeEn: "45 min", growTimeEs: "45 min", growTimePt: "45 min", level: 11, rarityColorKey: "yellow", seedPrice: 25, emoji: "🍵", sellPriceByStar: [75,100,125,150,225] },
  { nameNl: "Cacao", nameEn: "Cocoa", nameEs: "Granos de cacao", namePt: "Grãos de Cacau", nameFr: "Cacao", nameDe: "Kakao", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "5 uur", growTimeEn: "5 hours", growTimeEs: "5 horas", growTimePt: "5 horas", level: 12, rarityColorKey: "yellow", seedPrice: 110, emoji: "🍫", sellPriceByStar: [330,442,551,660,990] },
  { nameNl: "Avocado", nameEn: "Avocado", nameEs: "Aguacate", namePt: "Abacate", nameFr: "Avocat", nameDe: "Avocado", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "13 uur", growTimeEn: "13 hours", growTimeEs: "13 horas", growTimePt: "13 horas", level: 13, rarityColorKey: "yellow", seedPrice: 180, emoji: "🥑", sellPriceByStar: [540,735,916,1098,1647] },
];

const GROW_TIME_BY_LANG = (r: CropRaw, language: Language) =>
  language === 'es' ? r.growTimeEs : language === 'pt' ? r.growTimePt : language === 'fr' ? r.growTimeEn : language === 'de' ? r.growTimeEn : language === 'en' ? r.growTimeEn : r.growTimeNl;

export function useCrops(): CropItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CROPS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    rarity: r.rarityEn,
    growTime: GROW_TIME_BY_LANG(r, language),
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    seedPrice: r.seedPrice,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
