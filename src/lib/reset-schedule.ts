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
