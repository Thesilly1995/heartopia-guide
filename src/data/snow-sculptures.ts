import type { ColorKey } from '@/constants/heartopia-colors';
import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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
  level: number;
  rarityNl: string;
  rarityEn: string;
  rarityColorKey: ColorKey;
  methodNl: string;
  methodEn: string;
  emoji: string;
  sellPriceByStar: number[] | null;
}

const SNOW_SCULPTURES_RAW: SculptureRaw[] = [
  { nameNl: "Poep-sneeuwsculptuur", nameEn: "Poop Snow Sculpture", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "💩", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Geometrische Sneeuwsteen", nameEn: "Geometric Snow Brick", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "🧊", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Iglo-steen", nameEn: "Igloo Brick", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "🧱", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "IJshoorntje-sneeuwsculptuur", nameEn: "Ice Cream Cone Snow Sculpture", rarityNl: "Gewoon", rarityEn: "Common", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 1, rarityColorKey: "forestSoft", emoji: "🍦", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Lachende Ceder", nameEn: "Smiling Cedar", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 2, rarityColorKey: "skyDark", emoji: "🌲", sellPriceByStar: [155,232,310,387,620] },
  { nameNl: "Milu Tata-sneeuwsculptuur", nameEn: "Milu Tata Snow Sculpture", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 2, rarityColorKey: "skyDark", emoji: "🦌", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Bever Bobo-sneeuwsculptuur", nameEn: "Beaver Bobo Snow Sculpture", rarityNl: "Zeldzaam", rarityEn: "Rare", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 2, rarityColorKey: "skyDark", emoji: "🦫", sellPriceByStar: [165,247,330,412,660] },
  { nameNl: "Zwaan Dory-sneeuwsculptuur", nameEn: "Swan Dory Snow Sculpture", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 3, rarityColorKey: "coralDark", emoji: "🦢", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Schaap Jojo-sneeuwsculptuur", nameEn: "Sheep Jojo Snow Sculpture", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 3, rarityColorKey: "coralDark", emoji: "🐑", sellPriceByStar: [190,285,380,475,760] },
  { nameNl: "Chef Moe-sneeuwsculptuur", nameEn: "Chef Moe Snow Sculpture", rarityNl: "Episch", rarityEn: "Epic", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 3, rarityColorKey: "coralDark", emoji: "👨‍🍳", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Konijn Nia-sneeuwsculptuur", nameEn: "Rabbit Nia Snow Sculpture", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 4, rarityColorKey: "yellow", emoji: "🐰", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Bij Naniwa-sneeuwsculptuur", nameEn: "Bee Naniwa Snow Sculpture", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 4, rarityColorKey: "yellow", emoji: "🐝", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Koala Bay-sneeuwsculptuur", nameEn: "Koala Bay Snow Sculpture", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 4, rarityColorKey: "yellow", emoji: "🐨", sellPriceByStar: [225,337,450,562,900] },
  { nameNl: "Tijger Boo-sneeuwsculptuur", nameEn: "Tiger Boo Snow Sculpture", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 5, rarityColorKey: "yellow", emoji: "🐯", sellPriceByStar: [280,420,560,700,1120] },
  { nameNl: "Beer Nya-sneeuwsculptuur", nameEn: "Bear Nya Snow Sculpture", rarityNl: "Legendarisch", rarityEn: "Legendary", methodNl: "Timing-minigame (Sneeuwbal Machine, Beeldhouwbank)", methodEn: "Timing minigame (Snowball Machine, Sculpting Bench)", level: 5, rarityColorKey: "yellow", emoji: "🐻", sellPriceByStar: [280,420,560,700,1120] },
];

export function useSnowSculptures(): SculptureItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SNOW_SCULPTURES_RAW.map((r) => ({
    name: r.nameEn,
    rarity: r.rarityEn,
    method: language === 'en' ? r.methodEn : r.methodNl,
    level: r.level,
    rarityColorKey: r.rarityColorKey,
    emoji: r.emoji,
    sellPriceByStar: r.sellPriceByStar,
      })),
    [language]
  );
}
