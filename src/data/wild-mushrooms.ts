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
  spotNl: string;
  spotEn: string;
  spotEs: string;
  spotPt: string;
  sellPrice: string;
  energy: string;
  emoji: string;
}

const WILD_MUSHROOMS_RAW: ForagedRaw[] = [
  { nameNl: "Champignon", nameEn: "Button Mushroom", nameEs: "Champiñón", namePt: "Cogumelo Champignon", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Oesterzwam", nameEn: "Oyster Mushroom", nameEs: "Seta Ostra", namePt: "Cogumelo Ostra", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Eekhoorntjesbrood", nameEn: "Penny Bun", nameEs: "Boleto", namePt: "Cogumelo Porcini", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Shiitake", nameEn: "Shiitake", nameEs: "Shiitake", namePt: "Shiitake", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "+5", emoji: "🍄" },
  { nameNl: "Matsutake", nameEn: "Matsutake", nameEs: "Matsutake", namePt: "Matsutake", spotNl: "Bos (Geesteneik-dennenbos)", spotEn: "Forest (Spirit Oak Pine)", spotEs: "Bosque (Pino Roble Espíritu)", spotPt: "Floresta (Pinheiro Carvalho Espírito)", sellPrice: "Onbekend", energy: "+5", emoji: "🍄" },
  { nameNl: "Zwarte Truffel", nameEn: "Black Truffle", nameEs: "Trufa Negra", namePt: "Trufa Negra", spotNl: "Bos (Boseiland)", spotEn: "Forest (Forest Island)", spotEs: "Bosque (Isla del Bosque)", spotPt: "Floresta (Ilha da Floresta)", sellPrice: "99 🪙", energy: "+25", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Groen)", nameEn: "Bizarre Button Mushroom (Green)", nameEs: "Champiñón Extraño (Verde)", namePt: "Cogumelo Bizarro (Verde)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Roze)", nameEn: "Bizarre Button Mushroom (Pink)", nameEs: "Champiñón Extraño (Rosa)", namePt: "Cogumelo Bizarro (Rosa)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Champignon (Blauw)", nameEn: "Bizzare Button Mushroom (Blue)", nameEs: "Champiñón Extraño (Azul)", namePt: "Cogumelo Bizarro (Azul)", spotNl: "Bloemenveld", spotEn: "Flower Field", spotEs: "Campo de Flores", spotPt: "Campo de Flores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Oranje)", nameEn: "Bizarre Oyster Mushroom (Orange)", nameEs: "Seta Ostra Extraña (Naranja)", namePt: "Cogumelo Ostra Bizarro (Laranja)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Roze)", nameEn: "Bizarre Oyster Mushroom (Pink)", nameEs: "Seta Ostra Extraña (Rosa)", namePt: "Cogumelo Ostra Bizarro (Rosa)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Oesterzwam (Paars)", nameEn: "Bizarre Oyster Mushroom (Purple)", nameEs: "Seta Ostra Extraña (Morada)", namePt: "Cogumelo Ostra Bizarro (Roxo)", spotNl: "Onsen Berg", spotEn: "Onsen Mountain", spotEs: "Montaña Onsen", spotPt: "Montanha Onsen", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Blauw)", nameEn: "Bizarre Shiitake (Blue)", nameEs: "Shiitake Extraño (Azul)", namePt: "Shiitake Bizarro (Azul)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Rood)", nameEn: "Bizarre Shiitake (Red)", nameEs: "Shiitake Extraño (Rojo)", namePt: "Shiitake Bizarro (Vermelho)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Shiitake (Zwart)", nameEn: "Bizzare Shiitake (Black)", nameEs: "Shiitake Extraño (Negro)", namePt: "Shiitake Bizarro (Preto)", spotNl: "Vissersdorp", spotEn: "Fishing Village", spotEs: "Pueblo Pesquero", spotPt: "Vila de Pescadores", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Roze)", nameEn: "Bizzare Penny Bun (Pink)", nameEs: "Boleto Extraño (Rosa)", namePt: "Cogumelo Porcini Bizarro (Rosa)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Paars)", nameEn: "Bizzare Penny Bun (Purple)", nameEs: "Boleto Extraño (Morado)", namePt: "Cogumelo Porcini Bizarro (Roxo)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
  { nameNl: "Bizarre Eekhoorntjesbrood (Rood)", nameEn: "Bizzare Penny Bun (Red)", nameEs: "Boleto Extraño (Rojo)", namePt: "Cogumelo Porcini Bizarro (Vermelho)", spotNl: "Bos", spotEn: "Forest", spotEs: "Bosque", spotPt: "Floresta", sellPrice: "16 🪙", energy: "—", emoji: "🍄" },
];

export function useWildMushrooms(): ForagedItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      WILD_MUSHROOMS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    spot: language === 'es' ? r.spotEs : language === 'pt' ? r.spotPt : r.spotEn,
    sellPrice: r.sellPrice,
    energy: r.energy,
    emoji: r.emoji,
      })),
    [language]
  );
}
