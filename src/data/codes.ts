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
  { rewardNl: "30x Maanlichtkristallen, 10x Wensterren, en andere materialen", rewardEn: "30x Moonlight Crystals, 10x Wishing Stars, and other resources", expiresNl: "31 jul 2026 (mogelijk verlengd)", expiresEn: "Jul 31, 2026 (may be extended)", code: "halfyear180" },
  { rewardNl: "40x Maanlichtkristallen, 20x Wensterren, en andere materialen", rewardEn: "40x Moonlight Crystals, 20x Wishing Stars, and other resources", expiresNl: "31 jul 2026 (mogelijk verlengd)", expiresEn: "Jul 31, 2026 (may be extended)", code: "Cherish180" },
  { rewardNl: "100x Maanlichtkristallen", rewardEn: "100x Moonlight Crystals", expiresNl: "31 jul 2026 (mogelijk verlengd)", expiresEn: "Jul 31, 2026 (may be extended)", code: "180daysjoy" },
  { rewardNl: "100x Maanlichtkristallen", rewardEn: "100x Moonlight Crystals", expiresNl: "31 jul 2026 (mogelijk verlengd)", expiresEn: "Jul 31, 2026 (may be extended)", code: "callofwhales0709" },
  { rewardNl: "100x Maanlichtkristallen", rewardEn: "100x Moonlight Crystals", expiresNl: "31 jul 2026 (mogelijk verlengd)", expiresEn: "Jul 31, 2026 (may be extended)", code: "oceanguardians" },
  { rewardNl: "5x Kleurrijke Skyrocket Blauw, 5x Kleurrijke Sparkler Roze", rewardEn: "5x Colorful Skyrocket Blue, 5x Colorful Sparkler Pink", expiresNl: "Onbekend, recent toegevoegd", expiresEn: "Unknown, recently added", code: "2026summerlights" },
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
