export interface ShellItem {
  name: string;
  level: number | null;
  gold: number[] | null;
  tokens: number[] | null;
  time: string | null;
  emoji: string;
}

export const SHELLS: ShellItem[] = [
  { name: "Gebarsten Schelp", level: 1, gold: [2,4,6,8,16], tokens: [1,2,3,4,8], time: null, emoji: "🐚" },
  { name: "Goto's Spleetschelp", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { name: "Tijgerlucine", level: 1, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "12:00-18:00", emoji: "🐚" },
  { name: "Mini Spinnenschelp", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { name: "Esdoornblad Triton", level: 1, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { name: "Zilveren Tweekleppige", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { name: "Orchidee Murex", level: 1, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { name: "Yoka Sterrenturban", level: 1, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Strik Kersenschelp", level: 2, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "00:00-18:00", emoji: "🐚" },
  { name: "Gladde Mutsschelp", level: 2, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Hartkokkel", level: 3, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Venuskam Murex", level: 3, gold: [50,100,150,200,400], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { name: "Saffraan Reuzentweekleppige", level: 3, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "00:00-18:00", emoji: "🐚" },
  { name: "Geribbelde Turritella", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "12:00-06:00", emoji: "🐚" },
  { name: "Reuzenzonnewijzerschelp", level: 4, gold: [85,170,255,340,680], tokens: [40,80,120,160,320], time: "18:00-00:00", emoji: "🐚" },
  { name: "Navel-eierschelp", level: 4, gold: [65,130,195,260,520], tokens: [30,60,90,120,240], time: "18:00-00:00", emoji: "🐚" },
  { name: "Lantaarn Vlamslak", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Mawe's Latiaxis", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Bubbelraap", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Kegelslak", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Langsnuit Volva", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Robijnen Triton", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Kamerschelp Nautilus", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Violette Slak", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Bisschopsmijter", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
  { name: "Koninklijke Papierbel", level: null, gold: null, tokens: null, time: null, emoji: "🐚" },
];
