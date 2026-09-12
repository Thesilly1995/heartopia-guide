function dateKey(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Speeldag-grens ligt op 06:00 (servertijd) — vóór dat tijdstip hoort een moment nog bij de vorige speeldag. */
export function currentDailyResetKey(): string {
  const now = new Date();
  const boundary = new Date(now);
  boundary.setHours(6, 0, 0, 0);
  if (now < boundary) boundary.setDate(boundary.getDate() - 1);
  return dateKey(boundary);
}

/** Speelweek-grens ligt op zaterdag 06:00 (servertijd) — zelfde moment als de Roze Bubbels-wissel. */
export function currentWeeklyResetKey(): string {
  const now = new Date();
  const boundary = new Date(now);
  boundary.setHours(6, 0, 0, 0);
  if (now < boundary) boundary.setDate(boundary.getDate() - 1);
  const daysSinceSaturday = (boundary.getDay() - 6 + 7) % 7;
  boundary.setDate(boundary.getDate() - daysSinceSaturday);
  return dateKey(boundary);
}

/**
 * Huidige GMT-offset van Nederlandse (Europe/Amsterdam) tijd, bv. "GMT+2" in de zomer
 * (laatste zondag van maart t/m laatste zondag van oktober) en "GMT+1" in de winter.
 * Gebruikt Intl i.p.v. handmatige DST-berekening, dus altijd correct — ook in
 * toekomstige jaren.
 */
export function currentAmsterdamGmtOffset(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Amsterdam',
    timeZoneName: 'shortOffset',
  }).formatToParts(new Date());
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+1';
}
