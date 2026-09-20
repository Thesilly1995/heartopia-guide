/**
 * Vissen/insecten/vogels delen dezelfde vaste set tijd-van-de-dag- en
 * weerwoorden (bv. "Night / Dawn / Day / Dusk") in elke rij van hun raw-data.
 * In plaats van elk item apart van een nameEs/namePt-achtig veld te voorzien,
 * vertalen we de al bestaande Engelse waarde woord-voor-woord — de set
 * bronwoorden is klein en vast.
 */
const TIME_WORDS: Record<string, { es: string; pt: string; fr: string; de: string }> = {
  Night: { es: 'Noche', pt: 'Noite', fr: 'Nuit', de: 'Nacht' },
  Dawn: { es: 'Amanecer', pt: 'Amanhecer', fr: 'Aube', de: 'Morgendämmerung' },
  Day: { es: 'Día', pt: 'Dia', fr: 'Jour', de: 'Tag' },
  Dusk: { es: 'Anochecer', pt: 'Anoitecer', fr: 'Crépuscule', de: 'Abenddämmerung' },
};

const WEATHER_WORDS: Record<string, { es: string; pt: string; fr: string; de: string }> = {
  Sunny: { es: 'Soleado', pt: 'Ensolarado', fr: 'Ensoleillé', de: 'Sonnig' },
  Rainy: { es: 'Lluvioso', pt: 'Chuvoso', fr: 'Pluvieux', de: 'Regnerisch' },
  Rainbow: { es: 'Arcoíris', pt: 'Arco-íris', fr: 'Arc-en-ciel', de: 'Regenbogen' },
};

function translateSlashList(enValue: string, dict: Record<string, { es: string; pt: string; fr: string; de: string }>, language: 'es' | 'pt' | 'fr' | 'de'): string {
  return enValue
    .split(' / ')
    .map((word) => dict[word]?.[language] ?? word)
    .join(' / ');
}

export function localizeTime(timeEn: string, language: 'es' | 'pt' | 'fr' | 'de'): string {
  return translateSlashList(timeEn, TIME_WORDS, language);
}

export function localizeWeather(weatherEn: string, language: 'es' | 'pt' | 'fr' | 'de'): string {
  return translateSlashList(weatherEn, WEATHER_WORDS, language);
}
