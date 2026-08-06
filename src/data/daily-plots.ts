import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

export interface DailyPlots {
  oakPlot: string | null;
  fluoritePlot: string | null;
}

/**
 * De Zwervende Eik en de dagelijkse Fluoriet-plek verspringen elke dag naar een
 * andere plot. Zonder remote content weten we niet welke dat vandaag is — de UI
 * moet dan een "onbekend, vraag het na"-tekst tonen i.p.v. verouderde data.
 */
export function useDailyPlots(): DailyPlots {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    if (!payload?.dailyPlots) return { oakPlot: null, fluoritePlot: null };
    return {
      oakPlot: language === 'en' ? payload.dailyPlots.oakPlotEn : payload.dailyPlots.oakPlotNl,
      fluoritePlot: language === 'en' ? payload.dailyPlots.fluoritePlotEn : payload.dailyPlots.fluoritePlotNl,
    };
  }, [payload, language]);
}
