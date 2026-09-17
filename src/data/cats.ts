import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface CatItem {
  name: string;
  ability: string | null;
  emoji: string;
}

interface CatRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  abilityNl: string | null;
  abilityEn: string | null;
  abilityEs: string | null;
  abilityPt: string | null;
  emoji: string;
}

const CATS_RAW: CatRaw[] = [
  { nameNl: "Siamees", nameEn: "Siamese", nameEs: "Siamés", namePt: "Siamês", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Blauwe Kat", nameEn: "Blue Cat", nameEs: "Gato Azul", namePt: "Gato Azul", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zwarte Kat", nameEn: "Black Cat", nameEs: "Gato Negro", namePt: "Gato Preto", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Witte Kat", nameEn: "White Cat", nameEs: "Gato Blanco", namePt: "Gato Branco", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Wasbeerkat", nameEn: "Raccoon Cat", nameEs: "Gato Mapache", namePt: "Gato Guaxinim", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zilveren Cyperse Kat", nameEn: "Silver Tabby", nameEs: "Atigrado Plateado", namePt: "Malhado Prateado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Oranje Cyperse Kat", nameEn: "Orange Tabby", nameEs: "Atigrado Naranja", namePt: "Malhado Laranja", abilityNl: "Kan Goudzakjes als cadeau geven", abilityEn: "Can gift Gold Pouches", abilityEs: "Puede regalar Bolsas de Oro", abilityPt: "Pode presentear Bolsas de Ouro", emoji: "🐱" },
  { nameNl: "Bruine Cyperse Kat", nameEn: "Brown Tabby", nameEs: "Atigrado Marrón", namePt: "Malhado Marrom", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Lapjeskat", nameEn: "Calico", nameEs: "Gato Calicó", namePt: "Gato Calicó", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Bonte Kat", nameEn: "Piebald Cat", nameEs: "Gato Pío", namePt: "Gato Malhado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Pandakat", nameEn: "Panda Cat", nameEs: "Gato Panda", namePt: "Gato Panda", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Gevlekte Kat", nameEn: "Golden Spotted Cat", nameEs: "Gato Moteado Dorado", namePt: "Gato Manchado Dourado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Schildpadkat", nameEn: "Tortoiseshell Cat", nameEs: "Gato Carey", namePt: "Gato Tartaruga", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Tuxedokat", nameEn: "Tuxedo Cat", nameEs: "Gato Esmoquin", namePt: "Gato Smoking", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Britse Korthaar", nameEn: "Golden British Shorthair", nameEs: "Británico de Pelo Corto Dorado", namePt: "British Shorthair Dourado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zilveren Britse Korthaar", nameEn: "Silver British Shorthair", nameEs: "Británico de Pelo Corto Plateado", namePt: "British Shorthair Prateado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Klassiek Zilver Gevlekte Kat", nameEn: "Classic Silver Spotted Cat", nameEs: "Gato Plateado Moteado Clásico", namePt: "Gato Prateado Manchado Clássico", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Luipaardkat", nameEn: "Golden Leopard Cat", nameEs: "Gato Leopardo Dorado", namePt: "Gato Leopardo Dourado", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
];

export function useCats(): CatItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CATS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    ability: language === 'es' ? r.abilityEs : language === 'pt' ? r.abilityPt : language === 'en' ? r.abilityEn : r.abilityNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
