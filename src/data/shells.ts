import { useMemo } from 'react';

export interface ShellItem {
  name: string;
  level: number | null;
  gold: number[] | null;
  tokens: number[] | null;
  time: string | null;
  emoji: string;
}

interface ShellRaw {
  nameNl: string;
  nameEn: string;
  level: number | null;
  gold: number[] | null;
  tokens: number[] | null;
  time: string | null;
  emoji: string;
}

const SHELLS_RAW: ShellRaw[] = [
  { nameNl: "Beschadigde Schelp", nameEn: "Damaged Seashell", level: 1, gold: [2,4,6,8,16], tokens: [1,2,3,4,8], time: null, emoji: "🐚" },
  { nameNl: "Goto's Spleetschelp", nameEn: "Goto's Slit Shell", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Tijgerlucine", nameEn: "Tiger Lucine", level: 1, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "12:00-18:00", emoji: "🐚" },
  { nameNl: "Mini Spinnenschelp", nameEn: "Mini Spider Conch", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Esdoornblad Triton", nameEn: "Maple Leaf Triton", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Chinese Belschelp", nameEn: "Chinese Jingle Shell", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Orchidee Murex", nameEn: "Orchid Murex", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Yoka Sterrenturban", nameEn: "Yoka Star Turban", level: 1, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Tellina Prora", nameEn: "Tellina Prora", level: 2, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Gladde Mutsschelp", nameEn: "Smooth Bonnet Shell", level: 2, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Hartkokkel", nameEn: "Heart Cockle", level: 3, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Venuskam Murex", nameEn: "Venus Comb Murex", level: 3, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Boorschelp", nameEn: "Boring Clam", level: 3, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Fijngeribde Trapschelp", nameEn: "Fine-Ribbed Staircase Shell", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Reuzenzonnewijzerschelp", nameEn: "Giant Sundial", level: 4, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Navel-eierschelp", nameEn: "Umbilical Egg Shell", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Roodgestreepte Bellenslak", nameEn: "Red-Lined Bubble Snail", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Mawe's Latiaxis", nameEn: "Mawe's Latiaxis", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Bubbelraap", nameEn: "Bubble Turnip", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Kegelslak", nameEn: "Cone Snail", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Langsnuit Volva", nameEn: "Long-snouted Volva", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Robijnen Triton", nameEn: "Ruby Triton", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Kamerschelp Nautilus", nameEn: "Chambered Nautilus", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Violette Slak", nameEn: "Violet Snail", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Bisschopsmijter", nameEn: "Episcopal Miter", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Koninklijke Papierbel", nameEn: "Royal Paper Bubble", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
];

export function useShells(): ShellItem[] {
  return useMemo(
    () =>
      SHELLS_RAW.map((r) => ({
    name: r.nameEn,
    level: r.level,
    gold: r.gold,
    tokens: r.tokens,
    time: r.time,
    emoji: r.emoji,
      })),
    []
  );
}
