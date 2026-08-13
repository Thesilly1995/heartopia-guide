/**
 * Vertaalt tekst naar het Engels via Google's onofficiële, gratis vertaal-endpoint
 * (geen API-key nodig — hetzelfde endpoint dat de "Google Translate"-widget op
 * websites gebruikt). Geen SLA/garantie, dus altijd met een fallback gebruiken.
 */
export async function translateToEnglish(text: string): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const data = await response.json();
    const segments = data?.[0];
    if (!Array.isArray(segments)) return null;
    const translated = segments.map((segment: unknown[]) => segment?.[0] ?? '').join('');
    return translated.trim() || null;
  } catch {
    return null;
  }
}
