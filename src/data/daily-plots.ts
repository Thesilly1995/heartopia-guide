import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';
import { useRemoteContent } from '@/lib/remote-content';

export interface DailyPlots {
  oakPlot: string | null;
  fluoritePlot: string | null;
}

function todayDateStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * De Zwervende Eik en de dagelijkse Fluoriet-plek verspringen elke dag naar een
 * andere plot. Zonder remote content weten we niet welke dat vandaag is — de UI
 * moet dan een "onbekend, vraag het na"-tekst tonen i.p.v. verouderde data.
 *
 * `dailyPlotsCalendar` (meerdaagse kalender, bv. weken vooruit) heeft voorrang op
 * het oudere enkelvoudige `dailyPlots`-veld als er een entry voor vandaag in staat.
 */
export function useDailyPlots(): DailyPlots {
  const { language } = useLanguage();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const today = todayDateStr();
    const calendarEntry = payload?.dailyPlotsCalendar?.find((entry) => entry.date === today);
    if (calendarEntry) {
      return {
        oakPlot: language === 'en' ? calendarEntry.oakPlotEn : calendarEntry.oakPlotNl,
        fluoritePlot: language === 'en' ? calendarEntry.fluoritePlotEn : calendarEntry.fluoritePlotNl,
      };
    }
    if (!payload?.dailyPlots) return { oakPlot: null, fluoritePlot: null };
    return {
      oakPlot: language === 'en' ? payload.dailyPlots.oakPlotEn : payload.dailyPlots.oakPlotNl,
      fluoritePlot: language === 'en' ? payload.dailyPlots.fluoritePlotEn : payload.dailyPlots.fluoritePlotNl,
    };
  }, [payload, language]);
}
