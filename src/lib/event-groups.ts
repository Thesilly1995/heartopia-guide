import { EventGroup, EventGroupItem } from '@/components/heartopia/event-groups-list';
import { Language } from '@/hooks/use-language';
import { RemoteEventArchiveEntry, RemoteEventOverride, RemoteEventRecipe, RemoteEventSighting } from '@/lib/remote-content';

/** Eigen icoon per event (op naam, want die is taal-onafhankelijk), anders de generieke standaard. */
const EVENT_EMOJI_BY_NAME_EN: Record<string, string> = {
  'Echo of Ancients': '🗿',
  'Mid-Autumn Festival': '🍂',
  'Call of Whales': '🐳',
};

export function eventEmoji(nameEn: string, fallback: string): string {
  return EVENT_EMOJI_BY_NAME_EN[nameEn] ?? fallback;
}

function localizedEventName(ev: { nameNl: string; nameEn: string; nameEs?: string; namePt?: string; nameFr?: string; nameDe?: string }, language: Language): string {
  if (language === 'es') return ev.nameEs ?? ev.nameEn;
  if (language === 'pt') return ev.namePt ?? ev.nameEn;
  if (language === 'fr') return ev.nameFr ?? ev.nameEn;
  if (language === 'de') return ev.nameDe ?? ev.nameEn;
  return language === 'en' ? ev.nameEn : ev.nameNl;
}

function localizedEventDates(ev: { datesNl: string; datesEn: string; datesEs?: string; datesPt?: string; datesFr?: string; datesDe?: string }, language: Language): string {
  if (language === 'es') return ev.datesEs ?? ev.datesEn;
  if (language === 'pt') return ev.datesPt ?? ev.datesEn;
  if (language === 'fr') return ev.datesFr ?? ev.datesEn;
  if (language === 'de') return ev.datesDe ?? ev.datesEn;
  return language === 'en' ? ev.datesEn : ev.datesNl;
}

function localizedSighting(item: RemoteEventSighting, language: Language): EventGroupItem {
  const name = language === 'es' ? item.nameEs ?? item.nameEn : language === 'pt' ? item.namePt ?? item.nameEn : language === 'fr' ? item.nameFr ?? item.nameEn : language === 'de' ? item.nameDe ?? item.nameEn : language === 'en' ? item.nameEn : item.nameNl;
  const spot = language === 'es' ? item.spotEs ?? item.spotEn : language === 'pt' ? item.spotPt ?? item.spotEn : language === 'fr' ? item.spotFr ?? item.spotEn : language === 'de' ? item.spotDe ?? item.spotEn : language === 'en' ? item.spotEn : item.spotNl;
  const note = language === 'es' ? item.noteEs ?? item.noteEn : language === 'pt' ? item.notePt ?? item.noteEn : language === 'fr' ? item.noteFr ?? item.noteEn : language === 'de' ? item.noteDe ?? item.noteEn : language === 'en' ? item.noteEn : item.noteNl;
  return { name, spot, note, emoji: item.emoji };
}

function localizedRecipe(item: RemoteEventRecipe, language: Language): EventGroupItem {
  const name = language === 'es' ? item.nameEs ?? item.nameEn : language === 'pt' ? item.namePt ?? item.nameEn : language === 'fr' ? item.nameFr ?? item.nameEn : language === 'de' ? item.nameDe ?? item.nameEn : language === 'en' ? item.nameEn : item.nameNl;
  const ingredients = language === 'es' ? item.ingredientsEs ?? item.ingredientsEn : language === 'pt' ? item.ingredientsPt ?? item.ingredientsEn : language === 'fr' ? item.ingredientsFr ?? item.ingredientsEn : language === 'de' ? item.ingredientsDe ?? item.ingredientsEn : language === 'en' ? item.ingredientsEn : item.ingredientsNl;
  return { name, ingredients, emoji: item.emoji };
}

type SightingCategory = 'fish' | 'birds' | 'insects';

/** Bouwt de `EventGroup`-lijst (huidig event + archief) voor vissen/vogels/insecten. */
export function buildSightingEventGroups(
  category: SightingCategory,
  currentEvent: RemoteEventOverride | undefined,
  pastEvents: RemoteEventArchiveEntry[] | undefined,
  language: Language
): EventGroup[] {
  const groups: EventGroup[] = [];

  const currentItems = currentEvent?.[category];
  if (currentEvent && currentItems && currentItems.length > 0) {
    groups.push({
      key: 'current',
      eventName: localizedEventName(currentEvent, language),
      eventDates: localizedEventDates(currentEvent, language),
      emoji: eventEmoji(currentEvent.nameEn, '🎉'),
      items: currentItems.map((i) => localizedSighting(i, language)),
    });
  }

  (pastEvents ?? []).forEach((ev, index) => {
    const items = ev[category];
    if (!items || items.length === 0) return;
    groups.push({
      key: `past-${index}`,
      eventName: localizedEventName(ev, language),
      eventDates: localizedEventDates(ev, language),
      emoji: eventEmoji(ev.nameEn, '🗓️'),
      items: items.map((i) => localizedSighting(i, language)),
    });
  });

  return groups;
}

/** Zelfde als `buildSightingEventGroups`, maar voor recepten (andere velden: ingrediënten i.p.v. plek). */
export function buildRecipeEventGroups(
  currentEvent: RemoteEventOverride | undefined,
  pastEvents: RemoteEventArchiveEntry[] | undefined,
  language: Language
): EventGroup[] {
  const groups: EventGroup[] = [];

  if (currentEvent && currentEvent.recipes.length > 0) {
    groups.push({
      key: 'current',
      eventName: localizedEventName(currentEvent, language),
      eventDates: localizedEventDates(currentEvent, language),
      emoji: eventEmoji(currentEvent.nameEn, '🎉'),
      items: currentEvent.recipes.map((i) => localizedRecipe(i, language)),
    });
  }

  (pastEvents ?? []).forEach((ev, index) => {
    if (!ev.recipes || ev.recipes.length === 0) return;
    groups.push({
      key: `past-${index}`,
      eventName: localizedEventName(ev, language),
      eventDates: localizedEventDates(ev, language),
      emoji: eventEmoji(ev.nameEn, '🗓️'),
      items: ev.recipes.map((i) => localizedRecipe(i, language)),
    });
  });

  return groups;
}
