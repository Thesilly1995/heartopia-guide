import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface CatItem {
  name: string;
  emoji: string;
}

interface CatRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  emoji: string;
}

const CATS_RAW: CatRaw[] = [
  { nameNl: "Siamees", nameEn: "Siamese", nameEs: "Siamés", namePt: "Siamês", nameFr: "Chat siamois", nameDe: "Siamkatze", emoji: "🐱" },
  { nameNl: "Blauwe Kat", nameEn: "Blue Cat", nameEs: "Gato Azul", namePt: "Gato Azul", nameFr: "Chat bleu", nameDe: "Blaue Katze", emoji: "🐱" },
  { nameNl: "Zwarte Kat", nameEn: "Black Cat", nameEs: "Gato Negro", namePt: "Gato Preto", nameFr: "Chat noir", nameDe: "Schwarze Katze", emoji: "🐱" },
  { nameNl: "Witte Kat", nameEn: "White Cat", nameEs: "Gato Blanco", namePt: "Gato Branco", nameFr: "Chat blanc", nameDe: "Weiße Katze", emoji: "🐱" },
  { nameNl: "Wasbeerkat", nameEn: "Raccoon Cat", nameEs: "Gato Mapache", namePt: "Gato Guaxinim", nameFr: "Chat raton laveur", nameDe: "Waschbärenkatze", emoji: "🐱" },
  { nameNl: "Zilveren Cyperse Kat", nameEn: "Silver Tabby", nameEs: "Atigrado Plateado", namePt: "Malhado Prateado", nameFr: "Chat cyprien argenté", nameDe: "Silberne Zypernkatze", emoji: "🐱" },
  { nameNl: "Oranje Cyperse Kat", nameEn: "Orange Tabby", nameEs: "Atigrado Naranja", namePt: "Malhado Laranja", nameFr: "Chat cyprien orange", nameDe: "Orangefarbene Zypernkatze", emoji: "🐱" },
  { nameNl: "Bruine Cyperse Kat", nameEn: "Brown Tabby", nameEs: "Atigrado Marrón", namePt: "Malhado Marrom", nameFr: "Chat cyprien brun", nameDe: "Braune Zypernkatze", emoji: "🐱" },
  { nameNl: "Lapjeskat", nameEn: "Calico", nameEs: "Gato Calicó", namePt: "Gato Calicó", nameFr: "Chat tacheté", nameDe: "Tüpfelkatze", emoji: "🐱" },
  { nameNl: "Bonte Kat", nameEn: "Piebald Cat", nameEs: "Gato Pío", namePt: "Gato Malhado", nameFr: "Chat panaché", nameDe: "Bunte Katze", emoji: "🐱" },
  { nameNl: "Pandakat", nameEn: "Panda Cat", nameEs: "Gato Panda", namePt: "Gato Panda", nameFr: "Chat pandas", nameDe: "Pandakatze", emoji: "🐱" },
  { nameNl: "Gouden Gevlekte Kat", nameEn: "Golden Spotted Cat", nameEs: "Gato Moteado Dorado", namePt: "Gato Manchado Dourado", nameFr: "Chat tacheté doré", nameDe: "Goldgefleckte Katze", emoji: "🐱" },
  { nameNl: "Schildpadkat", nameEn: "Tortoiseshell Cat", nameEs: "Gato Carey", namePt: "Gato Tartaruga", nameFr: "Chat écaille de tortue", nameDe: "Schildpattkatze", emoji: "🐱" },
  { nameNl: "Tuxedokat", nameEn: "Tuxedo Cat", nameEs: "Gato Esmoquin", namePt: "Gato Smoking", nameFr: "Chat en smoking", nameDe: "Tuxedo-Katze", emoji: "🐱" },
  { nameNl: "Gouden Britse Korthaar", nameEn: "Golden British Shorthair", nameEs: "Británico de Pelo Corto Dorado", namePt: "British Shorthair Dourado", nameFr: "British Shorthair doré", nameDe: "Goldene Britisch Kurzhaar", emoji: "🐱" },
  { nameNl: "Zilveren Britse Korthaar", nameEn: "Silver British Shorthair", nameEs: "Británico de Pelo Corto Plateado", namePt: "British Shorthair Prateado", nameFr: "British Shorthair argenté", nameDe: "Silberne Britisch Kurzhaar", emoji: "🐱" },
  { nameNl: "Klassiek Zilver Gevlekte Kat", nameEn: "Classic Silver Spotted Cat", nameEs: "Gato Plateado Moteado Clásico", namePt: "Gato Prateado Manchado Clássico", nameFr: "Chat tacheté argenté classique", nameDe: "Klassisch silbergefleckte Katze", emoji: "🐱" },
  { nameNl: "Gouden Luipaardkat", nameEn: "Golden Leopard Cat", nameEs: "Gato Leopardo Dorado", namePt: "Gato Leopardo Dourado", nameFr: "Chat léopard doré", nameDe: "Goldene Leopardenkatze", emoji: "🐱" },
  { nameNl: "Koeienkat", nameEn: "Cow Cat", nameEs: "Gato Vaca", namePt: "Gato Vaca", nameFr: "Chat vache", nameDe: "Kuh-Katze", emoji: "🐱" },
];

export function useCats(): CatItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CATS_RAW.map((r) => ({
        name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
        emoji: r.emoji,
      })),
    [language]
  );
}
