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
  nameFr: string;
  nameDe: string;
  abilityNl: string | null;
  abilityEn: string | null;
  abilityEs: string | null;
  abilityPt: string | null;
  emoji: string;
}

const CATS_RAW: CatRaw[] = [
  { nameNl: "Siamees", nameEn: "Siamese", nameEs: "Siamés", namePt: "Siamês", nameFr: "Chat siamois", nameDe: "Siamkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Blauwe Kat", nameEn: "Blue Cat", nameEs: "Gato Azul", namePt: "Gato Azul", nameFr: "Chat bleu", nameDe: "Blaue Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zwarte Kat", nameEn: "Black Cat", nameEs: "Gato Negro", namePt: "Gato Preto", nameFr: "Chat noir", nameDe: "Schwarze Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Witte Kat", nameEn: "White Cat", nameEs: "Gato Blanco", namePt: "Gato Branco", nameFr: "Chat blanc", nameDe: "Weiße Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Wasbeerkat", nameEn: "Raccoon Cat", nameEs: "Gato Mapache", namePt: "Gato Guaxinim", nameFr: "Chat raton laveur", nameDe: "Waschbärenkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zilveren Cyperse Kat", nameEn: "Silver Tabby", nameEs: "Atigrado Plateado", namePt: "Malhado Prateado", nameFr: "Chat cyprien argenté", nameDe: "Silberne Zypernkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Oranje Cyperse Kat", nameEn: "Orange Tabby", nameEs: "Atigrado Naranja", namePt: "Malhado Laranja", nameFr: "Chat cyprien orange", nameDe: "Orangefarbene Zypernkatze", abilityNl: "Kan Goudzakjes als cadeau geven", abilityEn: "Can gift Gold Pouches", abilityEs: "Puede regalar Bolsas de Oro", abilityPt: "Pode presentear Bolsas de Ouro", emoji: "🐱" },
  { nameNl: "Bruine Cyperse Kat", nameEn: "Brown Tabby", nameEs: "Atigrado Marrón", namePt: "Malhado Marrom", nameFr: "Chat cyprien brun", nameDe: "Braune Zypernkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Lapjeskat", nameEn: "Calico", nameEs: "Gato Calicó", namePt: "Gato Calicó", nameFr: "Chat tacheté", nameDe: "Tüpfelkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Bonte Kat", nameEn: "Piebald Cat", nameEs: "Gato Pío", namePt: "Gato Malhado", nameFr: "Chat panaché", nameDe: "Bunte Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Pandakat", nameEn: "Panda Cat", nameEs: "Gato Panda", namePt: "Gato Panda", nameFr: "Chat pandas", nameDe: "Pandakatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Gevlekte Kat", nameEn: "Golden Spotted Cat", nameEs: "Gato Moteado Dorado", namePt: "Gato Manchado Dourado", nameFr: "Chat tacheté doré", nameDe: "Goldgefleckte Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Schildpadkat", nameEn: "Tortoiseshell Cat", nameEs: "Gato Carey", namePt: "Gato Tartaruga", nameFr: "Chat écaille de tortue", nameDe: "Schildpattkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Tuxedokat", nameEn: "Tuxedo Cat", nameEs: "Gato Esmoquin", namePt: "Gato Smoking", nameFr: "Chat en smoking", nameDe: "Tuxedo-Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Britse Korthaar", nameEn: "Golden British Shorthair", nameEs: "Británico de Pelo Corto Dorado", namePt: "British Shorthair Dourado", nameFr: "British Shorthair doré", nameDe: "Goldene Britisch Kurzhaar", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Zilveren Britse Korthaar", nameEn: "Silver British Shorthair", nameEs: "Británico de Pelo Corto Plateado", namePt: "British Shorthair Prateado", nameFr: "British Shorthair argenté", nameDe: "Silberne Britisch Kurzhaar", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Klassiek Zilver Gevlekte Kat", nameEn: "Classic Silver Spotted Cat", nameEs: "Gato Plateado Moteado Clásico", namePt: "Gato Prateado Manchado Clássico", nameFr: "Chat tacheté argenté classique", nameDe: "Klassisch silbergefleckte Katze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
  { nameNl: "Gouden Luipaardkat", nameEn: "Golden Leopard Cat", nameEs: "Gato Leopardo Dorado", namePt: "Gato Leopardo Dourado", nameFr: "Chat léopard doré", nameDe: "Goldene Leopardenkatze", abilityNl: null, abilityEn: null, abilityEs: null, abilityPt: null, emoji: "🐱" },
];

export function useCats(): CatItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CATS_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    ability: language === 'es' ? r.abilityEs : language === 'pt' ? r.abilityPt : language === 'fr' ? r.abilityEn : language === 'de' ? r.abilityEn : language === 'en' ? r.abilityEn : r.abilityNl,
    emoji: r.emoji,
      })),
    [language]
  );
}
