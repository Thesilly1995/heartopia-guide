/**
 * Vissen/insecten/vogels delen dezelfde vaste set tijd-van-de-dag- en
 * weerwoorden (bv. "Night / Dawn / Day / Dusk") in elke rij van hun raw-data.
 * In plaats van elk item apart van een nameEs/namePt-achtig veld te voorzien,
 * vertalen we de al bestaande Engelse waarde woord-voor-woord — de set
 * bronwoorden is klein en vast.
 */
const TIME_WORDS: Record<string, { es: string; pt: string }> = {
  Night: { es: 'Noche', pt: 'Noite' },
  Dawn: { es: 'Amanecer', pt: 'Amanhecer' },
  Day: { es: 'Día', pt: 'Dia' },
  Dusk: { es: 'Anochecer', pt: 'Anoitecer' },
};

const WEATHER_WORDS: Record<string, { es: string; pt: string }> = {
  Sunny: { es: 'Soleado', pt: 'Ensolarado' },
  Rainy: { es: 'Lluvioso', pt: 'Chuvoso' },
  Rainbow: { es: 'Arcoíris', pt: 'Arco-íris' },
};

function translateSlashList(enValue: string, dict: Record<string, { es: string; pt: string }>, language: 'es' | 'pt'): string {
  return enValue
    .split(' / ')
    .map((word) => dict[word]?.[language] ?? word)
    .join(' / ');
}

export function localizeTime(timeEn: string, language: 'es' | 'pt'): string {
  return translateSlashList(timeEn, TIME_WORDS, language);
}

export function localizeWeather(weatherEn: string, language: 'es' | 'pt'): string {
  return translateSlashList(weatherEn, WEATHER_WORDS, language);
}
