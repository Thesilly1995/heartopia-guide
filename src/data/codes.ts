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
  rewardDe: string;
  expiresNl: string;
  expiresEn: string;
  expiresEs: string;
  expiresPt: string;
  expiresFr: string;
  expiresDe: string;
  code: string;
}

// Bundel-fallback voor als er nog geen (of geen bereikbare) remote content is —
// per definitie verouderd, wordt overschreven zodra `payload.codes` beschikbaar is.
const CODES_RAW: CodeRaw[] = [
  { rewardNl: "3x Wensterren, 3x Meermin Vislokmiddel, 10x Mest", rewardEn: "3x Wishing Stars, 3x Mermaid Fish Attractor, 10x Fertilizer", rewardEs: "3x Estrellas de los Deseos, 3x Atrayente de Peces Sirena, 10x Fertilizante", rewardPt: "3x Estrelas dos Desejos, 3x Atrativo de Peixes Sereia, 10x Fertilizante", rewardFr: "3x Étoiles des Vœux, 3x Attractif à Poissons Sirène, 10x Engrais", rewardDe: "3x Wunschsterne, 3x Meerjungfrau-Fischlockmittel, 10x Dünger", expiresNl: "3 dec 2026", expiresEn: "Dec 3, 2026", expiresEs: "3 dic 2026", expiresPt: "3 de dez de 2026", expiresFr: "3 déc. 2026", expiresDe: "3. Dez. 2026", code: "r2q7a4m9k3n6" },
];

// Remote codes (uit `remote-content.json`) hebben vooralsnog alleen nl/en, dus
// es/pt/fr vallen daar terug op het Engels tot de JSON-content ook in die talen komt.
function localizedReward(r: { rewardNl: string; rewardEn: string; rewardEs?: string; rewardPt?: string; rewardFr?: string; rewardDe?: string }, language: Language): string {
  if (language === 'es') return r.rewardEs ?? r.rewardEn;
  if (language === 'pt') return r.rewardPt ?? r.rewardEn;
  if (language === 'fr') return r.rewardFr ?? r.rewardEn;
  if (language === 'de') return r.rewardDe ?? r.rewardEn;
  return language === 'en' ? r.rewardEn : r.rewardNl;
}

function localizedExpires(r: { expiresNl: string; expiresEn: string; expiresEs?: string; expiresPt?: string; expiresFr?: string; expiresDe?: string }, language: Language): string {
  if (language === 'es') return r.expiresEs ?? r.expiresEn;
  if (language === 'pt') return r.expiresPt ?? r.expiresEn;
  if (language === 'fr') return r.expiresFr ?? r.expiresEn;
  if (language === 'de') return r.expiresDe ?? r.expiresEn;
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
