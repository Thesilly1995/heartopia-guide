import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface CodeItem {
  code: string;
  reward: string;
  expires: string;
}

interface CodeRaw {
  rewardNl: string;
  rewardEn: string;
  expiresNl: string;
  expiresEn: string;
  code: string;
}

const CODES_RAW: CodeRaw[] = [
  { rewardNl: "5x Kleurrijke Skyrocket Blauw, 5x Kleurrijke Sparkler Roze", rewardEn: "5x Colorful Skyrocket Blue, 5x Colorful Sparkler Pink", expiresNl: "Onbekend, recent toegevoegd", expiresEn: "Unknown, recently added", code: "2026summerlights" },
  { rewardNl: "3x Wensterren, 1x Zwervende Eik Hout, 3x Koffiebonen", rewardEn: "3x Wishing Stars, 1x Roaming Oak Timber, 3x Coffee Beans", expiresNl: "Onbekend, recent toegevoegd", expiresEn: "Unknown, recently added", code: "p3m7r5q9k2" },
  { rewardNl: "3x Wensterren, 2x kleurstoffen, 1x Vlekkeloze fluoriet", rewardEn: "3x Wishing Stars, 2x Dyes, 1x Flawless Fluorite", expiresNl: "30 sep 2026, 17:59", expiresEn: "Sep 30, 2026, 17:59", code: "m9a3q7k2r5n4" },
  { rewardNl: "3x Wensterren, 2x kleurstoffen, 1x Vlekkeloze fluoriet", rewardEn: "3x Wishing Stars, 2x Dyes, 1x Flawless Fluorite", expiresNl: "30 sep 2026, 17:59", expiresEn: "Sep 30, 2026, 17:59", code: "p2k8n5r7q1a6" },
  { rewardNl: "50x Maanlicht Kristal, 5x Kleurrijk Fontein Vuurwerk (Roze), 3x Regenboog Fokpoeder", rewardEn: "50x Moonlight Crystal, 5x Colorful Fountain Firework (Pink), 3x Rainbow Breeding Powder", expiresNl: "31 aug 2026", expiresEn: "Aug 31, 2026", code: "aughatogift" },
];

export function useCodes(): CodeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      CODES_RAW.map((r) => ({
    reward: language === 'en' ? r.rewardEn : r.rewardNl,
    expires: language === 'en' ? r.expiresEn : r.expiresNl,
    code: r.code,
      })),
    [language]
  );
}
