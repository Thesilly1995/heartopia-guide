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
  const { server } = useServer();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const starts = findBlockStarts(payload?.weekForecast, kind);
    const now = serverNow(server.offsetHours);
    return starts.some((start) => now >= start && now.getTime() - start.getTime() < windowHours * 3600000);
  }, [payload, server.offsetHours, kind, windowHours]);
}
