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
  /** Verkoopprijs op 1★ t/m 5★ (goud) bij een geslaagde carve op dat niveau. Bron: community-infographics (Xiaohongshu @HeartbeatPuff). */
  sellPriceByStar: number[] | null;
}

interface SculptureRaw {
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
  methodNl: string;
  methodEn: string;
  methodEs: string;
  methodPt: string;
  emoji: string;
  sellPriceByStar: number[] | null;
}

const PUMPKIN_METHOD_EN = 'Timing minigame (Pumpkin Carving, Halloween event)';
const PUMPKIN_METHOD_NL = 'Timing-minigame (Pompoen Snijden, Halloween-event)';
const PUMPKIN_METHOD_ES = 'Minijuego de tiempo (Talla de Calabazas, evento de Halloween)';
const PUMPKIN_METHOD_PT = 'Minijogo de tempo (Talha de Abóboras, evento de Halloween)';

const LEVEL1_PRICE = [75, 93, 150, 300, 600];
const LEVEL2_PRICE = [90, 112, 180, 360, 720];
const LEVEL3_PRICE = [120, 150, 240, 480, 960];
const LEVEL4_PRICE = [170, 212, 340, 680, 1360];
const LEVEL5_PRICE = [230, 287, 460, 920, 1840];

const COMMON = { rarityNl: 'Gewoon', rarityEn: 'Common', rarityColorKey: 'forestSoft' as ColorKey };
const RARE = { rarityNl: 'Zeldzaam', rarityEn: 'Rare', rarityColorKey: 'skyDark' as ColorKey };
const EPIC = { rarityNl: 'Episch', rarityEn: 'Epic', rarityColorKey: 'coralDark' as ColorKey };
const LEGENDARY = { rarityNl: 'Legendarisch', rarityEn: 'Legendary', rarityColorKey: 'yellow' as ColorKey };

const PUMPKIN_SCULPTURES_RAW: SculptureRaw[] = [
  // Niveau 1
  { nameNl: 'Duizelige Pompoenkop', nameEn: 'Dazed Pumpkin Head', nameEs: 'Cabeza de Calabaza Aturdida', namePt: 'Cabeça de Abóbora Atordoada', nameFr: 'Tête de Citrouille Étourdie', nameDe: 'Benommener Kürbiskopf', level: 1, ...COMMON, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL1_PRICE },
  { nameNl: 'Boze Pompoenkop', nameEn: 'Angry Pumpkin Head', nameEs: 'Cabeza de Calabaza Enojada', namePt: 'Cabeça de Abóbora Zangada', nameFr: 'Tête de Citrouille en Colère', nameDe: 'Wütender Kürbiskopf', level: 1, ...COMMON, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL1_PRICE },
  { nameNl: 'Pompoenlijf met Vest', nameEn: 'Vest Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Chaleco', namePt: 'Corpo de Abóbora com Colete', nameFr: 'Corps de Citrouille à Gilet', nameDe: 'Kürbiskörper mit Weste', level: 1, ...COMMON, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL1_PRICE },
  { nameNl: 'Eerlijke Pompoenpootjes', nameEn: 'Honest Pumpkin Legs', nameEs: 'Piernas de Calabaza Honestas', namePt: 'Pernas de Abóbora Honestas', nameFr: 'Jambes de Citrouille Honnêtes', nameDe: 'Ehrliche Kürbisbeine', level: 1, ...COMMON, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '👢', sellPriceByStar: LEVEL1_PRICE },

  // Niveau 2 — ontgrendelt "Giant" varianten
  { nameNl: 'Schattige Pompoenkop', nameEn: 'Cute Pumpkin Head', nameEs: 'Cabeza de Calabaza Tierna', namePt: 'Cabeça de Abóbora Fofa', nameFr: 'Tête de Citrouille Mignonne', nameDe: 'Niedlicher Kürbiskopf', level: 2, ...RARE, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL2_PRICE },
  { nameNl: 'Pompoenlijf met Jurk', nameEn: 'Dress Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Vestido', namePt: 'Corpo de Abóbora com Vestido', nameFr: 'Corps de Citrouille à Robe', nameDe: 'Kürbiskörper mit Kleid', level: 2, ...RARE, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL2_PRICE },
  { nameNl: 'Katten-Pompoenkop', nameEn: 'Cat Pumpkin Head', nameEs: 'Cabeza de Calabaza Gato', namePt: 'Cabeça de Abóbora Gato', nameFr: 'Tête de Citrouille Chat', nameDe: 'Katzen-Kürbiskopf', level: 2, ...RARE, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL2_PRICE },
  { nameNl: 'Gigantische Katten-Pompoenkop', nameEn: 'Giant Cat Pumpkin Head', nameEs: 'Cabeza de Calabaza Gato Gigante', namePt: 'Cabeça de Abóbora Gato Gigante', nameFr: 'Tête de Citrouille Chat Géante', nameDe: 'Riesiger Katzen-Kürbiskopf', level: 2, ...RARE, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL2_PRICE },

  // Niveau 3 — ontgrendelt groene kleurvariant
  { nameNl: 'Konijnen-Pompoenkop', nameEn: 'Rabbit Pumpkin Head', nameEs: 'Cabeza de Calabaza Conejo', namePt: 'Cabeça de Abóbora Coelho', nameFr: 'Tête de Citrouille Lapin', nameDe: 'Hasen-Kürbiskopf', level: 3, ...EPIC, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL3_PRICE },
  { nameNl: 'Pompoenlijf met Cape', nameEn: 'Cape Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Capa', namePt: 'Corpo de Abóbora com Capa', nameFr: 'Corps de Citrouille à Cape', nameDe: 'Kürbiskörper mit Umhang', level: 3, ...EPIC, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL3_PRICE },
  { nameNl: 'Gigantisch Pompoenlijf met Mantel', nameEn: 'Giant Cloak Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Manto Gigante', namePt: 'Corpo de Abóbora com Manto Gigante', nameFr: 'Corps de Citrouille à Cape Géant', nameDe: 'Riesiger Kürbiskörper mit Umhang', level: 3, ...EPIC, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL3_PRICE },
  { nameNl: 'Ontspannen Pompoenpootjes', nameEn: 'Relaxing Pumpkin Legs', nameEs: 'Piernas de Calabaza Relajadas', namePt: 'Pernas de Abóbora Relaxadas', nameFr: 'Jambes de Citrouille Détendues', nameDe: 'Entspannte Kürbisbeine', level: 3, ...EPIC, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '👢', sellPriceByStar: LEVEL3_PRICE },
  { nameNl: 'Gigantische Ontspannen Pompoenpootjes', nameEn: 'Giant Relaxing Pumpkin Legs', nameEs: 'Piernas de Calabaza Relajadas Gigantes', namePt: 'Pernas de Abóbora Relaxadas Gigantes', nameFr: 'Jambes de Citrouille Détendues Géantes', nameDe: 'Riesige Entspannte Kürbisbeine', level: 3, ...EPIC, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '👢', sellPriceByStar: LEVEL3_PRICE },

  // Niveau 4
  { nameNl: 'Beertjes-Pompoenkop', nameEn: 'Little Bear Pumpkin Head', nameEs: 'Cabeza de Calabaza Osito', namePt: 'Cabeça de Abóbora Ursinho', nameFr: 'Tête de Citrouille Petit Ours', nameDe: 'Bärchen-Kürbiskopf', level: 4, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL4_PRICE },
  { nameNl: 'Pompoenlijf met Tuinbroek', nameEn: 'Overalls Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Overol', namePt: 'Corpo de Abóbora com Macacão', nameFr: 'Corps de Citrouille à Salopette', nameDe: 'Kürbiskörper mit Latzhose', level: 4, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL4_PRICE },
  { nameNl: 'Gigantisch Pompoenlijf met Tuinbroek', nameEn: 'Giant Overalls Pumpkin Body', nameEs: 'Cuerpo de Calabaza con Overol Gigante', namePt: 'Corpo de Abóbora com Macacão Gigante', nameFr: 'Corps de Citrouille à Salopette Géant', nameDe: 'Riesiger Kürbiskörper mit Latzhose', level: 4, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🧥', sellPriceByStar: LEVEL4_PRICE },

  // Niveau 5 — ontgrendelt witte kleurvariant
  { nameNl: 'Bunck', nameEn: 'Bunck', nameEs: 'Bunck', namePt: 'Bunck', nameFr: 'Bunck', nameDe: 'Bunck', level: 5, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL5_PRICE },
  { nameNl: 'Gigantische Bunck', nameEn: 'Giant Bunck', nameEs: 'Bunck Gigante', namePt: 'Bunck Gigante', nameFr: 'Bunck Géant', nameDe: 'Riesiger Bunck', level: 5, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '🎃', sellPriceByStar: LEVEL5_PRICE },
  { nameNl: 'Fijne Pompoenpootjes', nameEn: 'Exquisite Pumpkin Legs', nameEs: 'Piernas de Calabaza Exquisitas', namePt: 'Pernas de Abóbora Requintadas', nameFr: 'Jambes de Citrouille Exquises', nameDe: 'Exquisite Kürbisbeine', level: 5, ...LEGENDARY, methodNl: PUMPKIN_METHOD_NL, methodEn: PUMPKIN_METHOD_EN, methodEs: PUMPKIN_METHOD_ES, methodPt: PUMPKIN_METHOD_PT, emoji: '👢', sellPriceByStar: LEVEL5_PRICE },
];

const PUMPKIN_METHOD_BY_LANG = (r: SculptureRaw, language: Language) =>
  language === 'es' ? r.methodEs : language === 'pt' ? r.methodPt : language === 'fr' ? r.methodEn : language === 'de' ? r.methodEn : language === 'en' ? r.methodEn : r.methodNl;

export function usePumpkinSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      PUMPKIN_SCULPTURES_RAW.map((r) => ({
        name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : language === 'en' ? r.nameEn : r.nameNl,
        rarity: r.rarityEn,
        method: PUMPKIN_METHOD_BY_LANG(r, language),
        level: r.level,
        rarityColorKey: r.rarityColorKey,
        emoji: r.emoji,
        sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
