import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface TipItem {
  title: string;
  body: string;
  emoji: string;
}

export interface TipCategory {
  key: string;
  label: string;
  tips: TipItem[];
}

interface TipRaw {
  titleNl: string;
  titleEn: string;
  bodyNl: string;
  bodyEn: string;
  emoji: string;
}

interface TipCategoryRaw {
  key: string;
  labelNl: string;
  labelEn: string;
  tips: TipRaw[];
}

const TIP_CATEGORIES_RAW: TipCategoryRaw[] = [
  {
    key: 'algemeen',
    labelNl: 'Algemene tips',
    labelEn: 'General tips',
    tips: [
      {
        titleNl: 'Vis tijdens Regenboog-weer',
        titleEn: 'Fish during Rainbow weather',
        bodyNl: 'Sommige zeldzame vissen en insecten zijn alleen te vangen tijdens Regenboog-weer — check "Weer deze week" op het homescherm en plan je vangsessies daarop.',
        bodyEn: 'Some rare fish and insects can only be caught during Rainbow weather — check "Weather this week" on the homescreen and plan your catching sessions around it.',
        emoji: '🌈',
      },
      {
        titleNl: 'Wissel elke dag van plot',
        titleEn: 'Check the daily plot rotation',
        bodyNl: 'De Zwervende Eik en de dagelijkse Fluoriet-plek verspringen elke dag naar een andere plot — check de Plotkalender op het homescherm voordat je op pad gaat, anders sta je voor niets bij de verkeerde plot.',
        bodyEn: 'The Roaming Oak and the daily Fluorite spot move to a different plot every day — check the Plot Calendar on the homescreen before heading out, otherwise you might show up at the wrong plot.',
        emoji: '🌳',
      },
      {
        titleNl: 'Meteorenregen blijft even hakbaar',
        titleEn: 'Meteor ore stays mineable for a while',
        bodyNl: 'Na een meteorenregen blijven de ertsstukken nog 24 uur na de start van de regen hakbaar — je hoeft dus niet meteen die avond nog alles te doen.',
        bodyEn: 'After a meteor shower, the ore pieces stay mineable for 24 hours after the shower starts — you don’t have to get everything done that same evening.',
        emoji: '☄️',
      },
      {
        titleNl: 'Sommige wilde dieren zijn tijdelijk',
        titleEn: 'Some wild animals are temporary',
        bodyNl: 'Dieren zoals de Dolfijn en Pinguïn horen bij een event en zijn buiten dat event niet te voeren — hun vriendschapsniveau blijft wel gewoon bijgehouden voor het geval ze terugkeren.',
        bodyEn: 'Animals like the Dolphin and Penguin belong to an event and can’t be fed outside of it — their friendship level stays tracked in case they return.',
        emoji: '🐬',
      },
    ],
  },
  {
    key: 'bouwen',
    labelNl: 'Bouwen & inrichten',
    labelEn: 'Building & decorating',
    tips: [
      {
        titleNl: 'Eerst de indeling, dan pas decoratie',
        titleEn: 'Layout first, decoration second',
        bodyNl: 'Zet eerst je bed, opslag en werkbanken op hun plek voordat je gaat decoreren — zo voorkom je dat je alles steeds opnieuw moet verschuiven als de indeling toch niet klopt.',
        bodyEn: "Place your bed, storage and workstations first before decorating — this way you won't have to keep shifting everything around once the layout turns out not to work.",
        emoji: '🧱',
      },
      {
        titleNl: 'Let op het type oppervlak',
        titleEn: 'Watch the surface type',
        bodyNl: 'Meubels moeten op de vloer staan, wandobjecten aan een muur, en kleine spulletjes (lampen, vazen) op ander meubilair — een groene gloed betekent een geldige plek, rood betekent dat je moet schuiven of draaien.',
        bodyEn: 'Furniture needs a floor, wall items need a wall, and small objects (lamps, vases) need to go on other furniture — a green glow means a valid spot, red means you need to move or rotate it.',
        emoji: '🟩',
      },
      {
        titleNl: 'Stapelen kan',
        titleEn: 'You can layer items',
        bodyNl: 'Sommige items kun je op elkaar stapelen: eerst een vloerkleed, dan een tafel erop, en dan weer spulletjes op de tafel — zo krijg je een gelaagde, minder kale look.',
        bodyEn: 'Some items can be layered: a rug first, then a table on top, then small objects on the table — this gives a layered look instead of a bare room.',
        emoji: '📚',
      },
      {
        titleNl: 'Sla je indeling op zodra je blueprints hebt',
        titleEn: 'Save a blueprint as soon as you unlock it',
        bodyNl: 'Wacht niet tot je helemaal klaar bent — sla je huidige indeling meteen op als blueprint zodra die functie beschikbaar is, dan kun je altijd terug als een nieuw ontwerp toch niet bevalt.',
        bodyEn: "Don't wait until you're fully done — save your current layout as a blueprint as soon as that feature unlocks, so you can always go back if a new design doesn't work out.",
        emoji: '📐',
      },
      {
        titleNl: 'Setbonussen blijven ook na een kleurtje',
        titleEn: 'Set bonuses survive a repaint',
        bodyNl: 'Een compleet meubelset geeft bonussen zoals minder energieverbruik, snellere crafting, betere NPC-relaties en hobby-boosts — en de kleur van setmeubels aanpassen breekt die bonus niet, dus personaliseer gerust.',
        bodyEn: "A complete furniture set gives bonuses like lower energy use, faster crafting, better NPC relationships and hobby boosts — and changing the color of set furniture doesn't break that bonus, so feel free to personalize it.",
        emoji: '🎁',
      },
      {
        titleNl: 'Bewaar meubels liever dan verkopen',
        titleEn: 'Store furniture instead of selling it',
        bodyNl: 'Gebruik je een setstuk even niet in je huidige indeling, bewaar het dan in plaats van te verkopen — zo hou je de kans om later alsnog de hele set (en de bijbehorende bonus) compleet te maken.',
        bodyEn: "If you're not using a set piece in your current layout, store it instead of selling it — this way you keep the option to complete the full set (and its bonus) later.",
        emoji: '📦',
      },
      {
        titleNl: 'Zeldzame blueprints zijn schaars',
        titleEn: 'Rare blueprints are scarce',
        bodyNl: 'Blueprints uit Prize Bubbles-spawnpunten zijn beperkt beschikbaar en andere spelers kunnen ze ook pakken — wees er snel bij als je een zeldzame ziet liggen, want die is zo weg.',
        bodyEn: "Blueprints from Prize Bubble spawn points are limited and other players can grab them too — move fast when you spot a rare one, it won't stay there long.",
        emoji: '💎',
      },
    ],
  },
  {
    key: 'tekenen',
    labelNl: 'Tekenen op de schildersezel',
    labelEn: 'Drawing on the easel',
    tips: [
      {
        titleNl: 'Ontgrendelen en neerzetten',
        titleEn: 'Unlocking and placing the easel',
        bodyNl: "De schildersezel ontgrendelt op D.G. Level 14 — koop hem daarna bij Ka Ching's winkel (inclusief een korte uitleg van de tools) en zet hem neer in je huis of ergens in de stad om te beginnen met tekenen.",
        bodyEn: "The drawing board unlocks at D.G. Level 14 — buy it afterwards from Ka Ching's shop (comes with a short tools tutorial) and place it inside your home or anywhere in town to start drawing.",
        emoji: '🔓',
      },
      {
        titleNl: 'Oefen eerst op een gewoon canvas',
        titleEn: 'Practice on a standard canvas first',
        bodyNl: 'Test je ontwerp en kleuren op een goedkoop, standaard canvas voordat je een duurder kleding- of meubelsjabloon gebruikt — zo verspil je geen materialen aan een mislukte poging.',
        bodyEn: "Test your design and colors on a cheap, standard canvas before using a more expensive clothing or furniture template — this way you don't waste materials on a failed attempt.",
        emoji: '🖼️',
      },
      {
        titleNl: 'Geen tekentalent? Begin met een sjabloon',
        titleEn: 'Not confident freehand? Start from a template',
        bodyNl: 'Kun je niet goed freehand tekenen, gebruik dan een inkleursjabloon als basis in plaats van vanaf een leeg canvas te beginnen — dat geeft meteen een nette, herkenbare vorm.',
        bodyEn: "If freehand drawing isn't your strong point, use a coloring-page template as a base instead of starting from a blank canvas — this immediately gives you a neat, recognizable shape.",
        emoji: '🎨',
      },
      {
        titleNl: 'Gebruik het raster en de spiegelfunctie',
        titleEn: 'Use the grid and the mirror tool',
        bodyNl: 'Zet het raster aan voor meer precisie, en gebruik vooral de spiegel-/symmetriefunctie voor symmetrische ontwerpen — je tekent dan maar de helft, de andere kant vult zich automatisch aan.',
        bodyEn: "Turn on the grid for more precision, and especially use the mirror/symmetry tool for symmetric designs — you only draw one half, the other side fills in automatically.",
        emoji: '🪞',
      },
      {
        titleNl: 'Stempels voor de basis, penseel voor details',
        titleEn: 'Stamps for the base, brush for details',
        bodyNl: 'Gebruik kant-en-klare stempels/decals voor de basisvorm, en werk daarna met een kleine penseelgrootte de details bij — dat oogt netter dan alles in één keer freehand proberen.',
        bodyEn: 'Use ready-made stamps/decals for the base shape, then switch to a small brush size to add details on top — this looks neater than trying to freehand everything in one go.',
        emoji: '🖌️',
      },
      {
        titleNl: 'Zoom in, en gebruik de verf-emmer voor vlakken',
        titleEn: 'Zoom in, and use the fill bucket for large areas',
        bodyNl: 'Zoom in voor precies werk bij randen en details, en gebruik de vul-/emmerfunctie om grote vlakken in één keer te kleuren voordat je met een klein penseel de fijne details toevoegt.',
        bodyEn: 'Zoom in for precise edges and details, and use the fill/bucket tool to color large areas in one go before adding fine details with a small brush.',
        emoji: '🔍',
      },
    ],
  },
];

export function useTips(): TipCategory[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      TIP_CATEGORIES_RAW.map((c) => ({
        key: c.key,
        label: language === 'en' ? c.labelEn : c.labelNl,
        tips: c.tips.map((t) => ({
          title: language === 'en' ? t.titleEn : t.titleNl,
          body: language === 'en' ? t.bodyEn : t.bodyNl,
          emoji: t.emoji,
        })),
      })),
    [language]
  );
}
