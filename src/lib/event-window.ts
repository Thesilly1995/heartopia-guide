import { useMemo } from 'react';

import { useServer } from '@/hooks/use-server';
import { RemoteWeekForecastDay, useRemoteContent, WeekForecastBlock, WeekForecastKind } from '@/lib/remote-content';
import { serverNow } from '@/lib/reset-schedule';

const BLOCK_START_HOUR: Record<WeekForecastBlock, number> = { '00-06': 0, '06-12': 6, '12-18': 12, '18-00': 18 };

function blockStartDate(dateStr: string, block: WeekForecastBlock): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, BLOCK_START_HOUR[block], 0, 0));
}

function findBlockStarts(weekForecast: RemoteWeekForecastDay[] | undefined, kind: WeekForecastKind): Date[] {
  return (weekForecast ?? [])
    .flatMap((day) =>
      day.kinds.map((slot) => (typeof slot === 'string' ? { kind: slot } : slot)).map((slot) => ({ ...slot, date: day.date }))
    )
    .filter((slot): slot is { kind: WeekForecastKind; block: WeekForecastBlock; date: string } => slot.kind === kind && !!slot.block)
    .map((slot) => blockStartDate(slot.date, slot.block));
}

/**
 * Is "nu" (op de geselecteerde server) binnen `windowHours` na de start van
 * het meest recente `kind`-blok in `weekForecast`? Gebruikt door
 * `useMeteorSpots`/`useRainbowSpots` om een event-lijst automatisch te
 * verbergen zodra het venster voorbij is, i.p.v. te vertrouwen op handmatig
 * legen achteraf. Geen matchend blok gevonden → altijd `false` (fail-safe).
 */
export function useKindWindowActive(kind: WeekForecastKind, windowHours: number): boolean {
  return useActiveKindBlockStart(kind, windowHours) !== null;
}

/**
 * Startmoment van het meest recente actieve `kind`-blok (zie
 * `useKindWindowActive`), of `null` als er nu geen actief blok is. Gebruikt
 * door `useRainbowSpots`/`useMeteorSpots` om te bepalen of de ingevulde
 * locaties daadwerkelijk bij déze periode horen (i.p.v. per ongeluk nog de
 * vorige, verouderde locaties te tonen omdat ze zijn vergeten bij te werken).
 *
 * Het teruggegeven moment is het **echte (UTC) tijdstip** waarop dit blok
 * voor déze server inging — niet de letterlijke datum+blok-uit-de-JSON (die
 * staat vast, ongeacht server, en is dus voor de ene server te vroeg en voor
 * de andere te laat als drempel). Zonder deze correctie kon een server met
 * een offset groter dan `windowHours` (Sea +7, Tw/Hk/Mo +8, Asia +9 t.o.v.
 * het 6-uursvenster) nooit een geldige `rainbowSpotsUpdatedAt`/
 * `meteorSpotsUpdatedAt` krijgen: hun venster was altijd al voorbij vóórdat
 * dat letterlijke tijdstip bereikt werd.
 */
export function useActiveKindBlockStart(kind: WeekForecastKind, windowHours: number): Date | null {
  const { server } = useServer();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const starts = findBlockStarts(payload?.weekForecast, kind);
    const now = serverNow(server.offsetHours);
    const active = starts.find((start) => now >= start && now.getTime() - start.getTime() < windowHours * 3600000);
    if (!active) return null;
    return new Date(active.getTime() - server.offsetHours * 3600000);
  }, [payload, server.offsetHours, kind, windowHours]);
}
