import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

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
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  spotNl: string;
  spotEn: string;
  spotEs: string;
  spotPt: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

const WILD_MUSHROOMS_RAW: ForagedRaw[] = [
  { nameNl: "Champignon", nameEn: "Button Mushroom", nameEs: "Champiñón", namePt: "Cogumelo Champignon", nameFr: "Champignon", nameDe: "Champignon", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Oesterzwam", nameEn: "Oyster Mushroom", nameEs: "Seta Ostra", namePt: "Cogumelo Ostra", nameFr: "Pleurote", nameDe: "Austernpilz", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Eekhoorntjesbrood", nameEn: "Penny Bun", nameEs: "Boleto", namePt: "Cogumelo Porcini", nameFr: "Cèpe", nameDe: "Steinpilz", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Shiitake", nameEn: "Shiitake", nameEs: "Shiitake", namePt: "Shiitake", nameFr: "Shiitake", nameDe: "Shiitake", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Matsutake", nameEn: "Matsutake", nameEs: "Matsutake", namePt: "Matsutake", nameFr: "Matsutake", nameDe: "Matsutake", spotNl: "Bos (Geesteneik-dennenbos)", spotEn: "Forest (Spirit Oak Pine)", spotEs: "Bosque (Pino Roble Espíritu)", spotPt: "Floresta (Pinheiro Carvalho Espírito)", sellPrice: "Onbekend", energy: "+5", emoji: "🍄" },
  { nameNl: "Zwarte Truffel", nameEn: "Black Truffle", nameEs: "Trufa Negra", namePt: "Trufa Negra", nameFr: "Truffe noire", nameDe: "Schwarzer Trüffel", spotNl: "Bos (Boseiland)", spotEn: "Forest (Forest Island)", spotEs: "Bosque (Isla del Bosque)", spotPt: "Floresta (Ilha da Floresta)", sellPrice: "99 🪙", energy: "+25", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Groen)", nameEn: "Bizarre Button Mushroom (Green)", nameEs: "Champiñón Extraño (Verde)", namePt: "Cogumelo Bizarro (Verde)", nameFr: "Champignon bizarre (vert)", nameDe: "Bizarre Champignon (grün)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Roze)", nameEn: "Bizarre Button Mushroom (Pink)", nameEs: "Champiñón Extraño (Rosa)", namePt: "Cogumelo Bizarro (Rosa)", nameFr: "Champignon bizarre (rose)", nameDe: "Bizarre Champignon (rosa)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Blauw)", nameEn: "Bizzare Button Mushroom (Blue)", nameEs: "Champiñón Extraño (Azul)", namePt: "Cogumelo Bizarro (Azul)", nameFr: "Champignon bizarre (bleu)", nameDe: "Bizarre Champignon (blau)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Oranje)", nameEn: "Bizarre Oyster Mushroom (Orange)", nameEs: "Seta Ostra Extraña (Naranja)", namePt: "Cogumelo Ostra Bizarro (Laranja)", nameFr: "Pleurote bizarre (orange)", nameDe: "Bizarre Austernpilz (orange)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Roze)", nameEn: "Bizarre Oyster Mushroom (Pink)", nameEs: "Seta Ostra Extraña (Rosa)", namePt: "Cogumelo Ostra Bizarro (Rosa)", nameFr: "Pleurote bizarre (rose)", nameDe: "Seltsamer Austernpilz (rosa)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Paars)", nameEn: "Bizarre Oyster Mushroom (Purple)", nameEs: "Seta Ostra Extraña (Morada)", namePt: "Cogumelo Ostra Bizarro (Roxo)", nameFr: "Pleurote bizarre (violet)", nameDe: "Seltsamer Austernpilz (lila)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Blauw)", nameEn: "Bizarre Shiitake (Blue)", nameEs: "Shiitake Extraño (Azul)", namePt: "Shiitake Bizarro (Azul)", nameFr: "Shiitake bizarre (bleu)", nameDe: "Seltsamer Shiitake (blau)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Rood)", nameEn: "Bizarre Shiitake (Red)", nameEs: "Shiitake Extraño (Rojo)", namePt: "Shiitake Bizarro (Vermelho)", nameFr: "Shiitake bizarre (rouge)", nameDe: "Seltsamer Shiitake (rot)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Zwart)", nameEn: "Bizzare Shiitake (Black)", nameEs: "Shiitake Extraño (Negro)", namePt: "Shiitake Bizarro (Preto)", nameFr: "Shiitake bizarre (noir)", nameDe: "Seltsamer Shiitake (schwarz)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Roze)", nameEn: "Bizzare Penny Bun (Pink)", nameEs: "Boleto Extraño (Rosa)", namePt: "Cogumelo Porcini Bizarro (Rosa)", nameFr: "Cèpe bizarre (rose)", nameDe: "Seltsamer Steinpilz (rosa)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Paars)", nameEn: "Bizzare Penny Bun (Purple)", nameEs: "Boleto Extraño (Morado)", namePt: "Cogumelo Porcini Bizarro (Roxo)", nameFr: "Cèpe bizarre (violet)", nameDe: "Seltsamer Steinpilz (lila)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Rood)", nameEn: "Bizzare Penny Bun (Red)", nameEs: "Boleto Extraño (Rojo)", namePt: "Cogumelo Porcini Bizarro (Vermelho)", nameFr: "Cèpe bizarre (rouge)", nameDe: "Bizarre Steinpilze (rot)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
];

export function useWildMushrooms(): ForagedItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_MUSHROOMS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    spot: language === 'es' ? r.spotEs : language === 'pt' ? r.spotPt : r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    [language]
  );
}
