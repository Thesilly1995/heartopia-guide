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

const SNOW_METHOD_EN = "Timing minigame (Snowball Machine, Sculpting Bench)";
const SNOW_METHOD_NL = "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)";
const SNOW_METHOD_ES = "Minijuego de tiempo (Máquina de Bolas de Nieve, Banco de Esculpir)";
const SNOW_METHOD_PT = "Minijogo de tempo (Máquina de Bolas de Neve, Bancada de Escultura)";

const SNOW_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Poep-sneeuwsculptuur", nameEn: "Poop Snow Sculpture", nameEs: "Escultura de Nieve de Caca", namePt: "Escultura de Neve de Cocô", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "💩", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Geometrische Sneeuwsteen", nameEn: "Geometric Snow Brick", nameEs: "Ladrillo de Nieve Geométrico", namePt: "Tijolo de Neve Geométrico", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🧊", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Iglo-steen", nameEn: "Igloo Brick", nameEs: "Ladrillo de Iglú", namePt: "Tijolo de Iglu", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🧱", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "IJshoorntje-sneeuwsculptuur", nameEn: "Ice Cream Cone Snow Sculpture", nameEs: "Escultura de Nieve de Cono de Helado", namePt: "Escultura de Neve de Casquinha de Sorvete", rarityNl: "Gewoon", rarityEn: "Common", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 1, rarityColorKey: "forestSoft", emoji: "🍦", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Lachende Ceder", nameEn: "Smiling Cedar", nameEs: "Cedro Sonriente", namePt: "Cedro Sorridente", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 2, rarityColorKey: "skyDark", emoji: "🌲", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Milu Tata-sneeuwsculptuur", nameEn: "Milu Tata Snow Sculpture", nameEs: "Escultura de Nieve de Milu Tata", namePt: "Escultura de Neve do Milu Tata", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 2, rarityColorKey: "skyDark", emoji: "🦌", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Bever Bobo-sneeuwsculptuur", nameEn: "Beaver Bobo Snow Sculpture", nameEs: "Escultura de Nieve de Castor Bobo", namePt: "Escultura de Neve do Castor Bobo", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 2, rarityColorKey: "skyDark", emoji: "🦫", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Zwaan Dory-sneeuwsculptuur", nameEn: "Swan Dory Snow Sculpture", nameEs: "Escultura de Nieve de Cisne Dory", namePt: "Escultura de Neve do Cisne Dory", rarityNl: "Episch", rarityEn: "Epic", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 3, rarityColorKey: "coralDark", emoji: "🦢", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Schaap Jojo-sneeuwsculptuur", nameEn: "Sheep Jojo Snow Sculpture", nameEs: "Escultura de Nieve de Oveja Jojo", namePt: "Escultura de Neve da Ovelha Jojo", rarityNl: "Episch", rarityEn: "Epic", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 3, rarityColorKey: "coralDark", emoji: "🐑", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Chef Moe-sneeuwsculptuur", nameEn: "Chef Moe Snow Sculpture", nameEs: "Escultura de Nieve de Chef Moe", namePt: "Escultura de Neve do Chef Moe", rarityNl: "Episch", rarityEn: "Epic", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 3, rarityColorKey: "coralDark", emoji: "👨‍🍳", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Konijn Nia-sneeuwsculptuur", nameEn: "Rabbit Nia Snow Sculpture", nameEs: "Escultura de Nieve de Conejo Nia", namePt: "Escultura de Neve do Coelho Nia", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 4, rarityColorKey: "yellow", emoji: "🐰", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Bij Naniwa-sneeuwsculptuur", nameEn: "Bee Naniwa Snow Sculpture", nameEs: "Escultura de Nieve de Abeja Naniwa", namePt: "Escultura de Neve da Abelha Naniwa", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 4, rarityColorKey: "yellow", emoji: "🐝", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Koala Bay-sneeuwsculptuur", nameEn: "Koala Bay Snow Sculpture", nameEs: "Escultura de Nieve de Koala Bay", namePt: "Escultura de Neve do Koala Bay", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 4, rarityColorKey: "yellow", emoji: "🐨", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Tijger Boo-sneeuwsculptuur", nameEn: "Tiger Boo Snow Sculpture", nameEs: "Escultura de Nieve de Tigre Boo", namePt: "Escultura de Neve do Tigre Boo", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 5, rarityColorKey: "yellow", emoji: "🐯", sellPriceByStar: [280,420,560,700,1120] },
  { nameNl: "Beer Nya-sneeuwsculptuur", nameEn: "Bear Nya Snow Sculpture", nameEs: "Escultura de Nieve de Oso Nya", namePt: "Escultura de Neve do Urso Nya", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: SNOW_METHOD_NL, methodEn: SNOW_METHOD_EN, methodEs: SNOW_METHOD_ES, methodPt: SNOW_METHOD_PT, level: 5, rarityColorKey: "yellow", emoji: "🐻", sellPriceByStar: [280,420,560,700,1120] },
];

const SNOW_METHOD_BY_LANG = (r: SculptureRaw, language: Language) =>
  language === 'es' ? r.methodEs : language === 'pt' ? r.methodPt : language === 'en' ? r.methodEn : r.methodNl;

export function useSnowSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SNOW_SCULPTURES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    rarity: r.rarityEn,
    method: SNOW_METHOD_BY_LANG(r, language),
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
