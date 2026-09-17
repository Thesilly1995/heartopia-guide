import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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
  nameEs: string;
  namePt: string;
  level: number | null;
  gold: number[] | null;
  tokens: number[] | null;
  time: string | null;
  emoji: string;
}

const SHELLS_RAW: ShellRaw[] = [
  { nameNl: "Beschadigde Schelp", nameEn: "Damaged Seashell", nameEs: "Concha Marina Dañada", namePt: "Concha do Mar Danificada", level: 1, gold: [2,4,6,8,16], tokens: [1,2,3,4,8], time: null, emoji: "🐚" },
  { nameNl: "Goto's Spleetschelp", nameEn: "Goto's Slit Shell", nameEs: "Caracola Hendida de Goto", namePt: "Concha Fenda de Goto", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Tijgerlucine", nameEn: "Tiger Lucine", nameEs: "Lucina Tigre", namePt: "Lucina Tigre", level: 1, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "12:00-18:00", emoji: "🐚" },
  { nameNl: "Mini Spinnenschelp", nameEn: "Mini Spider Conch", nameEs: "Mini Caracola Araña", namePt: "Mini Búzio Aranha", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Esdoornblad Triton", nameEn: "Maple Leaf Triton", nameEs: "Tritón Hoja de Arce", namePt: "Tritão Folha de Bordo", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Chinese Belschelp", nameEn: "Chinese Jingle Shell", nameEs: "Concha Campanilla China", namePt: "Concha Sininho Chinesa", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Orchidee Murex", nameEn: "Orchid Murex", nameEs: "Múrex Orquídea", namePt: "Múrex Orquídea", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Yoka Sterrenturban", nameEn: "Yoka Star Turban", nameEs: "Turbante Estrella Yoka", namePt: "Turbante Estrela Yoka", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "06:00-00:00", emoji: "🐚" },
  { nameNl: "Tellina Prora", nameEn: "Tellina Prora", nameEs: "Tellina Prora", namePt: "Tellina Prora", level: 2, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Gladde Mutsschelp", nameEn: "Smooth Bonnet Shell", nameEs: "Concha Bonete Lisa", namePt: "Concha Touca Lisa", level: 2, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Hartkokkel", nameEn: "Heart Cockle", nameEs: "Berberecho Corazón", namePt: "Berbigão Coração", level: 3, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Venuskam Murex", nameEn: "Venus Comb Murex", nameEs: "Múrex Peine de Venus", namePt: "Múrex Pente de Vênus", level: 3, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Boorschelp", nameEn: "Boring Clam", nameEs: "Almeja Perforadora", namePt: "Amêijoa Perfuradora", level: 3, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Fijngeribde Trapschelp", nameEn: "Fine-Ribbed Staircase Shell", nameEs: "Concha Escalera de Costillas Finas", namePt: "Concha Escada de Costelas Finas", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Reuzenzonnewijzerschelp", nameEn: "Giant Sundial", nameEs: "Reloj de Sol Gigante", namePt: "Relógio de Sol Gigante", level: 4, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Navel-eierschelp", nameEn: "Umbilical Egg Shell", nameEs: "Concha Huevo Umbilical", namePt: "Concha Ovo Umbilical", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Roodgestreepte Bellenslak", nameEn: "Red-Lined Bubble Snail", nameEs: "Caracol Burbuja de Líneas Rojas", namePt: "Caramujo Bolha de Linhas Vermelhas", level: 5, gold: [120,240,360,480,960], tokens: [60,120,180,240,480], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Mawe's Latiaxis", nameEn: "Mawe's Latiaxis", nameEs: "Latiaxis de Mawe", namePt: "Latiaxis de Mawe", level: 5, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Bubbelraap", nameEn: "Bubble Turnip", nameEs: "Nabo Burbuja", namePt: "Nabo Bolha", level: 5, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "12:00-18:00", emoji: "🐚" },
  { nameNl: "Kegelslak", nameEn: "Cone Snail", nameEs: "Caracol Cono", namePt: "Caramujo Cone", level: 6, gold: [165,330,495,825,1320], tokens: [80,160,240,320,400], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Langsnuit Volva", nameEn: "Long-snouted Volva", nameEs: "Volva de Hocico Largo", namePt: "Volva de Focinho Longo", level: 6, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Robijnen Triton", nameEn: "Ruby Triton", nameEs: "Tritón Rubí", namePt: "Tritão Rubi", level: 7, gold: [120,240,360,480,960], tokens: [60,120,180,240,480], time: "12:00-06:00", emoji: "🐚" },
  { nameNl: "Kamerschelp Nautilus", nameEn: "Chambered Nautilus", nameEs: "Nautilo con Cámaras", namePt: "Nautilus com Câmaras", level: 7, gold: [165,330,495,825,1320], tokens: [80,160,240,320,400], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Violette Slak", nameEn: "Violet Snail", nameEs: "Caracol Violeta", namePt: "Caramujo Violeta", level: 7, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "00:00-18:00", emoji: "🐚" },
  { nameNl: "Bisschopsmijter", nameEn: "Episcopal Miter", nameEs: "Mitra Episcopal", namePt: "Mitra Episcopal", level: 8, gold: [120,240,360,480,960], tokens: [60,120,180,240,480], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Koninklijke Papierbel", nameEn: "Royal Paper Bubble", nameEs: "Burbuja de Papel Real", namePt: "Bolha de Papel Real", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { nameNl: "Stierenmondschelp", nameEn: "Bullmouth Shell", nameEs: "Concha Boca de Toro", namePt: "Concha Boca de Touro", level: 9, gold: [165,330,495,660,1320], tokens: [80,160,240,320,400], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Aardbei-tolschelp", nameEn: "Strawberry Top Shell", nameEs: "Concha Trompo Fresa", namePt: "Concha Pião Morango", level: 9, gold: [120,240,360,480,960], tokens: [60,120,180,240,480], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Gouden Kauri", nameEn: "Golden Cowrie", nameEs: "Cauri Dorado", namePt: "Búzio Dourado", level: 10, gold: [165,330,495,660,1320], tokens: [80,160,240,320,400], time: "18:00-00:00", emoji: "🐚" },
  { nameNl: "Koninginneschelp", nameEn: "Queen Conch", nameEs: "Caracola Reina", namePt: "Búzio Rainha", level: 10, gold: [165,330,495,660,1320], tokens: [80,160,240,320,400], time: "00:00-18:00", emoji: "🐚" },
];

export function useShells(): ShellItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      SHELLS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    level: r.level,
    gold: r.gold,
    tokens: r.tokens,
    time: r.time,
    emoji: r.emoji,
      })),
    [language]
  );
}
