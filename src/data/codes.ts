import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

export interface CodeItem {
  code: string;
  reward: string;
  expires: string;
}

interface CodeRaw {
  rewardNl: string;
  rewardEn: string;
  rewardEs: string;
  rewardPt: string;
  rewardFr: string;
  expiresNl: string;
  expiresEn: string;
  expiresEs: string;
  expiresPt: string;
  expiresFr: string;
  code: string;
}

// Bundel-fallback voor als er nog geen (of geen bereikbare) remote content is —
// per definitie verouderd, wordt overschreven zodra `payload.codes` beschikbaar is.
const CODES_RAW: CodeRaw[] = [
  { rewardNl: "3x Wensterren, 2x kleurstoffen, 1x Vlekkeloze fluoriet", rewardEn: "3x Wishing Stars, 2x Dyes, 1x Flawless Fluorite", rewardEs: "3x Estrellas de los Deseos, 2x Tintes, 1x Fluorita Impecable", rewardPt: "3x Estrelas dos Desejos, 2x Corantes, 1x Fluorita Impecável", rewardFr: "3x Étoiles des Vœux, 2x Teintures, 1x Fluorite Impeccable", expiresNl: "30 sep 2026, 17:59", expiresEn: "Sep 30, 2026, 17:59", expiresEs: "30 sep 2026, 17:59", expiresPt: "30 de set de 2026, 17:59", expiresFr: "30 sept. 2026, 17:59", code: "m9a3q7k2r5n4" },
  { rewardNl: "3x Wensterren, 2x kleurstoffen, 1x Vlekkeloze fluoriet", rewardEn: "3x Wishing Stars, 2x Dyes, 1x Flawless Fluorite", rewardEs: "3x Estrellas de los Deseos, 2x Tintes, 1x Fluorita Impecable", rewardPt: "3x Estrelas dos Desejos, 2x Corantes, 1x Fluorita Impecável", rewardFr: "3x Étoiles des Vœux, 2x Teintures, 1x Fluorite Impeccable", expiresNl: "30 sep 2026, 17:59", expiresEn: "Sep 30, 2026, 17:59", expiresEs: "30 sep 2026, 17:59", expiresPt: "30 de set de 2026, 17:59", expiresFr: "30 sept. 2026, 17:59", code: "p2k8n5r7q1a6" },
  { rewardNl: "50x Maanlicht Kristal, 5x Kleurrijk Fontein Vuurwerk (Roze), 3x Regenboog Fokpoeder", rewardEn: "50x Moonlight Crystal, 5x Colorful Fountain Firework (Pink), 3x Rainbow Breeding Powder", rewardEs: "50x Cristal de Luz de Luna, 5x Fuegos Artificiales de Fuente Colorida (Rosa), 3x Polvo de Cría Arcoíris", rewardPt: "50x Cristal do Luar, 5x Fogos de Artifício de Fonte Colorida (Rosa), 3x Pó de Reprodução Arco-Íris", rewardFr: "50x Cristal de Lune, 5x Feu d'Artifice de Fontaine Coloré (Rose), 3x Poudre d'Élevage Arc-en-ciel", expiresNl: "31 aug 2026", expiresEn: "Aug 31, 2026", expiresEs: "31 ago 2026", expiresPt: "31 de ago de 2026", expiresFr: "31 août 2026", code: "aughatogift" },
  { rewardNl: "3x Wensterren, 2x kleurstoffen, 1x Vlekkeloze fluoriet", rewardEn: "3x Wishing Stars, 2x Dyes, 1x Flawless Fluorite", rewardEs: "3x Estrellas de los Deseos, 2x Tintes, 1x Fluorita Impecable", rewardPt: "3x Estrelas dos Desejos, 2x Corantes, 1x Fluorita Impecável", rewardFr: "3x Étoiles des Vœux, 2x Teintures, 1x Fluorite Impeccable", expiresNl: "30 sep 2026, 17:59", expiresEn: "Sep 30, 2026, 17:59", expiresEs: "30 sep 2026, 17:59", expiresPt: "30 de set de 2026, 17:59", expiresFr: "30 sept. 2026, 17:59", code: "a7m4q9r3k6n2" },
];

// Remote codes (uit `remote-content.json`) hebben vooralsnog alleen nl/en, dus
// es/pt/fr vallen daar terug op het Engels tot de JSON-content ook in die talen komt.
function localizedReward(r: { rewardNl: string; rewardEn: string; rewardEs?: string; rewardPt?: string; rewardFr?: string }, language: Language): string {
  if (language === 'es') return r.rewardEs ?? r.rewardEn;
  if (language === 'pt') return r.rewardPt ?? r.rewardEn;
  if (language === 'fr') return r.rewardFr ?? r.rewardEn;
  return language === 'en' ? r.rewardEn : r.rewardNl;
}

function localizedExpires(r: { expiresNl: string; expiresEn: string; expiresEs?: string; expiresPt?: string; expiresFr?: string }, language: Language): string {
  if (language === 'es') return r.expiresEs ?? r.expiresEn;
  if (language === 'pt') return r.expiresPt ?? r.expiresEn;
  if (language === 'fr') return r.expiresFr ?? r.expiresEn;
  return language === 'en' ? r.expiresEn : r.expiresNl;
}

export function useCodes(): CodeItem[] {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const source = payload?.codes && payload.codes.length > 0 ? payload.codes : CODES_RAW;
    return source.map((r) => ({
      reward: localizedReward(r, language),
      expires: localizedExpires(r, language),
      code: r.code,
    }));
  }, [payload, language]);
}
