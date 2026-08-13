import { useMemo } from 'react';

export interface ForagedItem {
  name: string;
  spot: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

interface ForagedRaw {
  nameNl: string;
  nameEn: string;
  spotNl: string;
  spotEn: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

const WILD_MUSHROOMS_RAW: ForagedRaw[] = [
  { nameNl: "Champignon", nameEn: "Button Mushroom", spotNl: "Bloemenveld", spotEn: "Flower Field", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Oesterzwam", nameEn: "Oyster Mushroom", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Eekhoorntjesbrood", nameEn: "Penny Bun", spotNl: "Bos", spotEn: "Forest", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Shiitake", nameEn: "Shiitake", spotNl: "Vissersdorp", spotEn: "Fishing Village", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Matsutake", nameEn: "Matsutake", spotNl: "Bos (Geesteneik-dennenbos)", spotEn: "Forest (Spirit Oak Pine)", sellPrice: "Onbekend", energy: "+5", emoji: "🍄" },
  { nameNl: "Zwarte Truffel", nameEn: "Black Truffle", spotNl: "Bos (Boseiland)", spotEn: "Forest (Forest Island)", sellPrice: "99 🪙", energy: "+25", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Groen)", nameEn: "Bizarre Button Mushroom (Green)", spotNl: "Bloemenveld", spotEn: "Flower Field", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Roze)", nameEn: "Bizarre Button Mushroom (Pink)", spotNl: "Bloemenveld", spotEn: "Flower Field", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Blauw)", nameEn: "Bizzare Button Mushroom (Blue)", spotNl: "Bloemenveld", spotEn: "Flower Field", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Oranje)", nameEn: "Bizarre Oyster Mushroom (Orange)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Roze)", nameEn: "Bizarre Oyster Mushroom (Pink)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Paars)", nameEn: "Bizarre Oyster Mushroom (Purple)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Blauw)", nameEn: "Bizarre Shiitake (Blue)", spotNl: "Vissersdorp", spotEn: "Fishing Village", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Rood)", nameEn: "Bizarre Shiitake (Red)", spotNl: "Vissersdorp", spotEn: "Fishing Village", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Zwart)", nameEn: "Bizzare Shiitake (Black)", spotNl: "Vissersdorp", spotEn: "Fishing Village", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Roze)", nameEn: "Bizzare Penny Bun (Pink)", spotNl: "Bos", spotEn: "Forest", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Paars)", nameEn: "Bizzare Penny Bun (Purple)", spotNl: "Bos", spotEn: "Forest", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Rood)", nameEn: "Bizzare Penny Bun (Red)", spotNl: "Bos", spotEn: "Forest", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
];

export function useWildMushrooms(): ForagedItem[] {
  return useMemo(
    () =>
      WILD_MUSHROOMS_RAW.map((r) => ({
    name: r.nameEn,
    spot: r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    []
  );
}
