/** "Nu", verschoven naar de vaste UTC-offset van de geselecteerde server (los van het toestel-tijdzone). */
function serverNow(offsetHours: number): Date {
  return new Date(Date.now() + offsetHours * 3600000);
}

function dateKeyUTC(d: Date): string {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Speeldag-grens ligt op 06:00 (servertijd) — vóór dat tijdstip hoort een moment nog bij de vorige speeldag. */
export function currentDailyResetKey(offsetHours: number): string {
  const now = serverNow(offsetHours);
  const boundary = new Date(now);
  boundary.setUTCHours(6, 0, 0, 0);
  if (now < boundary) boundary.setUTCDate(boundary.getUTCDate() - 1);
  return dateKeyUTC(boundary);
}

/** Speelweek-grens ligt op zaterdag 06:00 (servertijd) — zelfde moment als de Roze Bubbels-wissel. */
export function currentWeeklyResetKey(offsetHours: number): string {
  const now = serverNow(offsetHours);
  const boundary = new Date(now);
  boundary.setUTCHours(6, 0, 0, 0);
  if (now < boundary) boundary.setUTCDate(boundary.getUTCDate() - 1);
  const daysSinceSaturday = (boundary.getUTCDay() - 6 + 7) % 7;
  boundary.setUTCDate(boundary.getUTCDate() - daysSinceSaturday);
  return dateKeyUTC(boundary);
}

/** bv. "GMT+1" of "GMT-5" — vaste offset, geen zomer-/wintertijd (game-servers wisselen niet mee met DST). */
export function formatGmtOffset(offsetHours: number): string {
  const sign = offsetHours >= 0 ? '+' : '-';
  return `GMT${sign}${Math.abs(offsetHours)}`;
}
