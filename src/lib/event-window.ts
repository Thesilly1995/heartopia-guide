import { useMemo } from 'react';

import { SERVERS, useServer } from '@/hooks/use-server';
import { RemoteWeekForecastDay, useRemoteContent, WeekForecastBlock, WeekForecastKind } from '@/lib/remote-content';
import { serverNow } from '@/lib/reset-schedule';

const BLOCK_START_HOUR: Record<WeekForecastBlock, number> = { '00-06': 0, '06-12': 6, '12-18': 12, '18-00': 18 };

/**
 * Hoogste serveroffset van alle servers (Asia, +9) — die server bereikt een
 * blokstart als eerste in echte tijd. Gebruikt als vaste, server-onafhankelijke
 * ondergrens voor de `updatedAt`-versheidscheck (zie onder), zodat coördinaten
 * die ruim vóór het blok worden ingevuld (de normale werkwijze) niet alsnog als
 * "verouderd" worden afgewezen voor servers met een kleinere/negatieve offset
 * (bv. Global, America) die hun eigen blokstart pas later in echte tijd bereiken.
 */
const EARLIEST_SERVER_OFFSET_HOURS = Math.max(...SERVERS.map((s) => s.offsetHours));

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
 * Het teruggegeven moment is het **echte (UTC) tijdstip** waarop dit blok bij
 * de server met de hoogste offset (Asia) inging — niet de letterlijke
 * datum+blok-uit-de-JSON (die staat vast, ongeacht server) en niet het
 * tijdstip voor de momenteel geselecteerde server. Dit is alleen de
 * **ondergrens voor de `updatedAt`-versheidscheck** in `useMeteorSpots`/
 * `useRainbowSpots`: of het venster voor de geselecteerde speler zelf al
 * actief is, bepaalt de `active`-check hierboven nog steeds per-server (via
 * `server.offsetHours`) — dat deel blijft ongewijzigd correct. Het
 * teruggegeven tijdstip bepaalt alleen of de **data zelf** vers genoeg is,
 * en moet daarom hetzelfde zijn voor elke speler, ongeacht welke server hij
 * toevallig heeft geselecteerd — anders faalt de versheidscheck voor spelers
 * op een server die zijn eigen blok later in echte tijd bereikt (Global,
 * America) zodra de coördinaten (zoals gebruikelijk) ruim vóór dat moment
 * worden ingevuld, terwijl exact dezelfde data voor Asia/Sea/Tw-Hk-Mo wél al
 * als vers gold.
 */
export function useActiveKindBlockStart(kind: WeekForecastKind, windowHours: number): Date | null {
  const { server } = useServer();
  const { payload } = useRemoteContent();

  return useMemo(() => {
    const starts = findBlockStarts(payload?.weekForecast, kind);
    const now = serverNow(server.offsetHours);
    const active = starts.find((start) => now >= start && now.getTime() - start.getTime() < windowHours * 3600000);
    if (!active) return null;
    return new Date(active.getTime() - EARLIEST_SERVER_OFFSET_HOURS * 3600000);
  }, [payload, server.offsetHours, kind, windowHours]);
}
