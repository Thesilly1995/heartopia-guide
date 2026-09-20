import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';
import { useServer } from '@/hooks/use-server';
import { currentDailyResetKey } from '@/lib/reset-schedule';
import { useRemoteContent } from '@/lib/remote-content';

export interface DailyPlots {
  oakPlot: string | null;
  fluoritePlot: string | null;
}

/** `es`/`pt`/`fr` zijn optioneel in de JSON — ontbreken ze (nog), dan valt de app terug op Engels. */
function localizedPlot(nl: string, en: string, es: string | undefined, pt: string | undefined, fr: string | undefined, language: Language): string {
  if (language === 'es') return es ?? en;
  if (language === 'pt') return pt ?? en;
  if (language === 'fr') return fr ?? en;
  return language === 'en' ? en : nl;
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
  const { server } = useServer();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const today = currentDailyResetKey(server.offsetHours);
    const calendarEntry = payload?.dailyPlotsCalendar?.find((entry) => entry.date === today);
    if (calendarEntry) {
      return {
        oakPlot: localizedPlot(calendarEntry.oakPlotNl, calendarEntry.oakPlotEn, calendarEntry.oakPlotEs, calendarEntry.oakPlotPt, calendarEntry.oakPlotFr, language),
        fluoritePlot: localizedPlot(calendarEntry.fluoritePlotNl, calendarEntry.fluoritePlotEn, calendarEntry.fluoritePlotEs, calendarEntry.fluoritePlotPt, calendarEntry.fluoritePlotFr, language),
      };
    }
    if (!payload?.dailyPlots) return { oakPlot: null, fluoritePlot: null };
    return {
      oakPlot: localizedPlot(payload.dailyPlots.oakPlotNl, payload.dailyPlots.oakPlotEn, payload.dailyPlots.oakPlotEs, payload.dailyPlots.oakPlotPt, payload.dailyPlots.oakPlotFr, language),
      fluoritePlot: localizedPlot(payload.dailyPlots.fluoritePlotNl, payload.dailyPlots.fluoritePlotEn, payload.dailyPlots.fluoritePlotEs, payload.dailyPlots.fluoritePlotPt, payload.dailyPlots.fluoritePlotFr, language),
    };
  }, [payload, language, server.offsetHours]);
}
