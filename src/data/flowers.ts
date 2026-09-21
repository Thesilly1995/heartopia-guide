import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

export interface FlowerItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  growTime: string;
  seedPrice: number;
  emoji: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud) — null als nog niet bevestigd. Bron: community-tracker "Heartopia Price List" (hiimaa_44 op X, via AthenaMM-tracker). */
  sellPriceByStar: (number | null)[] | null;
}

interface FlowerRaw {
  nameNl: string;
  nameEn: string;
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
  sellPriceByStar: (number | null)[] | null;
}

const FLOWERS_RAW: FlowerRaw[] = [
  { nameNl: "Madeliefje", nameEn: "Daisy", nameEs: "Margarita", namePt: "Margarida", nameFr: "Pâquerette", nameDe: "Gänseblümchen", rarityNl: "Gewoon", rarityEn: "Common", growTimeNl: "18 uur", growTimeEn: "18 hours", growTimeEs: "18 horas", growTimePt: "18 horas", level: 3, rarityColorKey: "forestSoft", seedPrice: 30, emoji: "🌼", sellPriceByStar: [100,150,200,250,400] },
  { nameNl: "Viooltje", nameEn: "Pansy", nameEs: "Pensamiento", namePt: "Amor-perfeito", nameFr: "Violette", nameDe: "Veilchen", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "18 uur", growTimeEn: "18 hours", growTimeEs: "18 horas", growTimePt: "18 horas", level: 4, rarityColorKey: "skyDark", seedPrice: 30, emoji: "🌸", sellPriceByStar: [100,150,200,250,400] },
  { nameNl: "Anthurium", nameEn: "Anthurium", nameEs: "Anturio", namePt: "Antúrio", nameFr: "Anthurium", nameDe: "Anthurium", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "Onbekend", growTimeEn: "Unknown", growTimeEs: "Desconocido", growTimePt: "Desconhecido", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺", sellPriceByStar: null },
  { nameNl: "Klaproos", nameEn: "Corn Poppy", nameEs: "Amapola", namePt: "Papoula", nameFr: "Coquelicot", nameDe: "Mohnblume", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", growTimeEs: "1 día", growTimePt: "1 dia", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌺", sellPriceByStar: [185,280,370,465,740] },
  { nameNl: "Kanterol", nameEn: "Laceleaf", nameEs: "Hoja de Encaje", namePt: "Folha de Renda", nameFr: "Kanterol", nameDe: "Kanterol", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag", growTimeEn: "1 day", growTimeEs: "1 día", growTimePt: "1 dia", level: 5, rarityColorKey: "skyDark", seedPrice: 60, emoji: "🌸", sellPriceByStar: [185,280,370,465,740] },
  { nameNl: "Calla Lelie", nameEn: "Calla Lily", nameEs: "Cala", namePt: "Copo-de-leite", nameFr: "Calla", nameDe: "Calla-Lilie", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", growTimeEs: "1 día 6 horas", growTimePt: "1 dia 6 horas", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌷", sellPriceByStar: [250,375,500,625,1000] },
  { nameNl: "Ochtendglorie", nameEn: "Morning Glory", nameEs: "Campanilla", namePt: "Corriola", nameFr: "Ipomea", nameDe: "Winde", rarityNl: "Zeldzaam", rarityEn: "Rare", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", growTimeEs: "1 día 6 horas", growTimePt: "1 dia 6 horas", level: 6, rarityColorKey: "skyDark", seedPrice: 90, emoji: "🌼", sellPriceByStar: [250,375,500,625,1000] },
  { nameNl: "Anjer", nameEn: "Carnation", nameEs: "Clavel", namePt: "Cravo", nameFr: "Oeillet", nameDe: "Nelke", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "1 dag 6 uur", growTimeEn: "1 day 6 hours", growTimeEs: "1 día 6 horas", growTimePt: "1 dia 6 horas", level: 7, rarityColorKey: "coralDark", seedPrice: 120, emoji: "🌸", sellPriceByStar: [305,460,610,765,1220] },
  { nameNl: "Tulp", nameEn: "Tulip", nameEs: "Tulipán", namePt: "Tulipa", nameFr: "Tulipe", nameDe: "Tulpe", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", growTimeEs: "2 días", growTimePt: "2 dias", level: 8, rarityColorKey: "coralDark", seedPrice: 150, emoji: "🌷", sellPriceByStar: [415,625,830,1040,1660] },
  { nameNl: "Lelie", nameEn: "Lily", nameEs: "Lirio", namePt: "Lírio", nameFr: "Lys", nameDe: "Lilie", rarityNl: "Episch", rarityEn: "Epic", growTimeNl: "2 dagen", growTimeEn: "2 days", growTimeEs: "2 días", growTimePt: "2 dias", level: 9, rarityColorKey: "coralDark", seedPrice: 200, emoji: "🌷", sellPriceByStar: [485,730,970,1215,1940] },
  { nameNl: "Roos", nameEn: "Rose", nameEs: "Rosa", namePt: "Rosa", nameFr: "Rose", nameDe: "Rose", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", growTimeEs: "3 días", growTimePt: "3 dias", level: 10, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌹", sellPriceByStar: [765,1150,1530,1915,3060] },
  { nameNl: "Hyacint", nameEn: "Hyacinth", nameEs: "Jacinto", namePt: "Jacinto", nameFr: "Jacinthe", nameDe: "Hyazinthe", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", growTimeEs: "3 días", growTimePt: "3 dias", level: 11, rarityColorKey: "yellow", seedPrice: 300, emoji: "🪻", sellPriceByStar: [785,1180,1570,1965,3140] },
  { nameNl: "Vlinderorchidee", nameEn: "Moth Orchid", nameEs: "Orquídea Mariposa", namePt: "Orquídea Mariposa", nameFr: "Orchidée papillon", nameDe: "Schmetterlingsorchidee", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", growTimeEs: "3 días", growTimePt: "3 dias", level: 12, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌺", sellPriceByStar: [805,1210,1610,2015,3220] },
  { nameNl: "Ooievaarsbek", nameEn: "Cranesbill", nameEs: "Geranio Silvestre", namePt: "Gerânio Silvestre", nameFr: "Géranium", nameDe: "Storchschnabel", rarityNl: "Legendarisch", rarityEn: "Legendary", growTimeNl: "3 dagen", growTimeEn: "3 days", growTimeEs: "3 días", growTimePt: "3 dias", level: 13, rarityColorKey: "yellow", seedPrice: 300, emoji: "🌸", sellPriceByStar: [825,1240,null,null,null] },
];

const FLOWER_GROW_TIME_BY_LANG = (r: FlowerRaw, language: Language) =>
  language === 'es' ? r.growTimeEs : language === 'pt' ? r.growTimePt : language === 'fr' ? r.growTimeEn : language === 'de' ? r.growTimeEn : language === 'en' ? r.growTimeEn : r.growTimeNl;

export function useFlowers(): FlowerItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      FLOWERS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    rarity: r.rarityEn,
    growTime: FLOWER_GROW_TIME_BY_LANG(r, language),
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    seedPrice: r.seedPrice,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
