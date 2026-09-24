import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventGroup, EventGroupsList } from '@/components/heartopia/event-groups-list';
import { RarityPill } from '@/components/heartopia/rarity-pill';
import { StarRow } from '@/components/heartopia/star-row';
import { ColorKey, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { Language, useLanguage } from '@/hooks/use-language';

export interface HobbyItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  xp?: number;
  emoji: string;
  spot?: string;
  watertype?: string;
  time?: string;
  weather?: string;
  tool?: string;
  ingredients?: string[];
  growTime?: string;
  seedPrice?: number;
  method?: string;
  /** Verkoopprijs op 1★ t/m 5★ (goud), null als nog niet bevestigd. */
  sellPriceByStar?: (number | null)[] | null;
}

export interface HobbySubTab {
  key: string;
  label: string;
  /** Weglaten als deze subtab in plaats daarvan `eventGroups` gebruikt (events-tabblad). */
  items?: HobbyItem[];
  disclaimer?: string;
  /** Toont, i.p.v. de normale gefilterde lijst, items gegroepeerd per event met een kopje — zoek/filter-chips worden dan verborgen. */
  eventGroups?: EventGroup[];
}

const LEVEL_FILTERS = ['Alle', 1, 3, 5, 7, 9] as const;
const PROGRESS_FILTERS = ['all', 'undiscovered', 'notFiveStar', 1, 2, 3, 4, 5, 'noMastery'] as const;
type ProgressFilter = (typeof PROGRESS_FILTERS)[number];

const WEATHER_WORDS = {
  nl: ['Zonnig', 'Regen', 'Regenboog'],
  en: ['Sunny', 'Rainy', 'Rainbow'],
  es: ['Soleado', 'Lluvia', 'Arcoíris'],
  pt: ['Ensolarado', 'Chuva', 'Arco-íris'],
  fr: ['Ensoleillé', 'Pluie', 'Arc-en-ciel'],
  de: ['Sonnig', 'Regen', 'Regenbogen'],
} as const;

const TIME_WORDS = {
  nl: ["'s Nachts", 'Ochtend', 'Overdag', 'Avond'],
  en: ['Night', 'Dawn', 'Day', 'Dusk'],
  es: ['Noche', 'Amanecer', 'Día', 'Atardecer'],
  pt: ['Noite', 'Amanhecer', 'Dia', 'Entardecer'],
  fr: ['Nuit', 'Aube', 'Jour', 'Crépuscule'],
  de: ['Nacht', 'Morgendämmerung', 'Tag', 'Abenddämmerung'],
} as const;

const STRINGS = {
  nl: {
    back: '‹ Terug',
    itemsInGuide: (n: number) => `${n} items in deze gids`,
    searchPlaceholder: 'Zoeken op naam...',
    all: 'Alle',
    allWeather: 'Alle weer',
    allTime: 'Alle tijdstippen',
    allSpots: 'Alle plekken',
    showSpots: (n: number) => `📍 Filter op plek (${n})`,
    hideSpots: '▲ Inklappen',
    spot: 'Plek',
    time: 'Tijdstip',
    weather: 'Weer',
    tool: 'Gereedschap',
    ingredients: 'Ingrediënten',
    growTime: 'Groeitijd',
    seedPrice: 'Zaadprijs',
    method: 'Hoe krijg je dit',
    sellPriceByStar: 'Verkoopprijs per ster',
    sellPriceUnknown: 'Nog niet bevestigd',
    bestResult: 'Hoogste resultaat',
    masteryAchieved: 'Mastery behaald',
    progressUndiscovered: '🔍 Nog te ontdekken',
    progressNotFiveStar: '⭐ Nog geen 5★',
    progressNoMastery: '🏆 Nog geen mastery',
    eventsTab: '🎉 Events',
    noEventsYet: 'Nog geen events vastgelegd voor deze catalogus.',
  },
  en: {
    back: '‹ Back',
    itemsInGuide: (n: number) => `${n} items in this guide`,
    searchPlaceholder: 'Search by name...',
    all: 'All',
    allWeather: 'All weather',
    allTime: 'All times',
    allSpots: 'All spots',
    showSpots: (n: number) => `📍 Filter by spot (${n})`,
    hideSpots: '▲ Collapse',
    spot: 'Spot',
    time: 'Time',
    weather: 'Weather',
    tool: 'Tool',
    ingredients: 'Ingredients',
    growTime: 'Grow time',
    seedPrice: 'Seed price',
    method: 'How to get this',
    sellPriceByStar: 'Sell price by star',
    sellPriceUnknown: 'Not confirmed yet',
    bestResult: 'Best result',
    masteryAchieved: 'Mastery achieved',
    progressUndiscovered: '🔍 Not discovered yet',
    progressNotFiveStar: '⭐ Not 5★ yet',
    progressNoMastery: '🏆 No mastery yet',
    eventsTab: '🎉 Events',
    noEventsYet: 'No events recorded yet for this catalog.',
  },
  es: {
    back: '‹ Volver',
    itemsInGuide: (n: number) => `${n} elementos en esta guía`,
    searchPlaceholder: 'Buscar por nombre...',
    all: 'Todos',
    allWeather: 'Todo el clima',
    allTime: 'Todos los horarios',
    allSpots: 'Todos los lugares',
    showSpots: (n: number) => `📍 Filtrar por lugar (${n})`,
    hideSpots: '▲ Contraer',
    spot: 'Lugar',
    time: 'Horario',
    weather: 'Clima',
    tool: 'Herramienta',
    ingredients: 'Ingredientes',
    growTime: 'Tiempo de crecimiento',
    seedPrice: 'Precio de semilla',
    method: 'Cómo conseguir esto',
    sellPriceByStar: 'Precio de venta por estrella',
    sellPriceUnknown: 'Aún no confirmado',
    bestResult: 'Mejor resultado',
    masteryAchieved: 'Maestría lograda',
    progressUndiscovered: '🔍 Aún por descubrir',
    progressNotFiveStar: '⭐ Aún sin 5★',
    progressNoMastery: '🏆 Aún sin maestría',
    eventsTab: '🎉 Eventos',
    noEventsYet: 'Todavía no hay eventos registrados para este catálogo.',
  },
  pt: {
    back: '‹ Voltar',
    itemsInGuide: (n: number) => `${n} itens neste guia`,
    searchPlaceholder: 'Buscar por nome...',
    all: 'Todos',
    allWeather: 'Todo o clima',
    allTime: 'Todos os horários',
    allSpots: 'Todos os locais',
    showSpots: (n: number) => `📍 Filtrar por local (${n})`,
    hideSpots: '▲ Recolher',
    spot: 'Local',
    time: 'Horário',
    weather: 'Clima',
    tool: 'Ferramenta',
    ingredients: 'Ingredientes',
    growTime: 'Tempo de crescimento',
    seedPrice: 'Preço da semente',
    method: 'Como conseguir isso',
    sellPriceByStar: 'Preço de venda por estrela',
    sellPriceUnknown: 'Ainda não confirmado',
    bestResult: 'Melhor resultado',
    masteryAchieved: 'Maestria alcançada',
    progressUndiscovered: '🔍 Ainda não descoberto',
    progressNotFiveStar: '⭐ Ainda sem 5★',
    progressNoMastery: '🏆 Ainda sem maestria',
    eventsTab: '🎉 Eventos',
    noEventsYet: 'Ainda não há eventos registrados para este catálogo.',
  },
  fr: {
    back: '‹ Retour',
    itemsInGuide: (n: number) => `${n} éléments dans ce guide`,
    searchPlaceholder: 'Rechercher par nom...',
    all: 'Tous',
    allWeather: 'Toute météo',
    allTime: 'Tous les horaires',
    allSpots: 'Tous les endroits',
    showSpots: (n: number) => `📍 Filtrer par endroit (${n})`,
    hideSpots: '▲ Réduire',
    spot: 'Endroit',
    time: 'Horaire',
    weather: 'Météo',
    tool: 'Outil',
    ingredients: 'Ingrédients',
    growTime: 'Temps de pousse',
    seedPrice: 'Prix de la graine',
    method: 'Comment l\'obtenir',
    sellPriceByStar: 'Prix de vente par étoile',
    sellPriceUnknown: 'Pas encore confirmé',
    bestResult: 'Meilleur résultat',
    masteryAchieved: 'Maîtrise obtenue',
    progressUndiscovered: '🔍 Pas encore découvert',
    progressNotFiveStar: '⭐ Pas encore 5★',
    progressNoMastery: '🏆 Pas encore de maîtrise',
    eventsTab: '🎉 Événements',
    noEventsYet: 'Aucun événement encore enregistré pour ce catalogue.',
  },
  de: {
    back: '‹ Zurück',
    itemsInGuide: (n: number) => `${n} Einträge in diesem Guide`,
    searchPlaceholder: 'Nach Namen suchen...',
    all: 'Alle',
    allWeather: 'Alles Wetter',
    allTime: 'Alle Zeiten',
    allSpots: 'Alle Orte',
    showSpots: (n: number) => `📍 Nach Ort filtern (${n})`,
    hideSpots: '▲ Einklappen',
    spot: 'Ort',
    time: 'Zeit',
    weather: 'Wetter',
    tool: 'Werkzeug',
    ingredients: 'Zutaten',
    growTime: 'Wachstumszeit',
    seedPrice: 'Samenpreis',
    method: 'So bekommst du das',
    sellPriceByStar: 'Verkaufspreis pro Stern',
    sellPriceUnknown: 'Noch nicht bestätigt',
    bestResult: 'Bestes Ergebnis',
    masteryAchieved: 'Meisterschaft erreicht',
    progressUndiscovered: '🔍 Noch zu entdecken',
    progressNotFiveStar: '⭐ Noch nicht 5★',
    progressNoMastery: '🏆 Noch keine Meisterschaft',
    eventsTab: '🎉 Events',
    noEventsYet: 'Noch keine Events für diesen Katalog erfasst.',
  },
} as const;

/** Gedeeld label voor de "Events"-subtab, te gebruiken door elk scherm dat `eventGroups` inzet. */
export function eventsTabLabel(language: Language): string {
  return STRINGS[language].eventsTab;
}

export function HobbyListScreen({
  title,
  icon,
  items,
  subTabs,
  gradient,
  storageKey,
}: {
  title: string;
  icon: string;
  items?: HobbyItem[];
  subTabs?: HobbySubTab[];
  gradient: [string, string];
  storageKey: string;
}) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const WEATHER_FILTERS = ['Alle', ...WEATHER_WORDS[language]] as const;
  const TIME_FILTERS = ['Alle', ...TIME_WORDS[language]] as const;

  const [openName, setOpenName] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [maxLevel, setMaxLevel] = useState<number>(99);
  // Index i.p.v. de vertaalde tekst zelf, zodat de keuze geldig blijft (en
  // opgeslagen kan worden) ongeacht taalwissels — 'Alle' is -1.
  const [weatherIndex, setWeatherIndex] = useState<number>(-1);
  const [timeIndex, setTimeIndex] = useState<number>(-1);
  const [spotFilter, setSpotFilter] = useState<string>('Alle');
  const [spotExpanded, setSpotExpanded] = useState(false);
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');
  const [activeSub, setActiveSub] = useState<string>(subTabs?.[0]?.key ?? '');
  const [stars, setStars] = useState<Record<string, number>>({});
  const [mastery, setMastery] = useState<Record<string, boolean>>({});

  const weatherFilter = weatherIndex === -1 ? 'Alle' : WEATHER_WORDS[language][weatherIndex];
  const timeFilter = timeIndex === -1 ? 'Alle' : TIME_WORDS[language][timeIndex];

  const activeTab = subTabs?.find((tab) => tab.key === activeSub);
  const isEventTab = !!activeTab?.eventGroups;
  const activeItems = subTabs ? (activeTab?.items ?? []) : (items ?? []);
  const hasWeather = activeItems.length > 0 && activeItems[0].weather !== undefined;
  const hasTime = activeItems.length > 0 && activeItems[0].time !== undefined;
  const hasSpot = activeItems.length > 0 && activeItems[0].spot !== undefined;
  const SPOT_FILTERS = useMemo(() => {
    if (!hasSpot) return ['Alle'];
    const unique = Array.from(new Set(activeItems.map((item) => item.spot).filter((spot): spot is string => !!spot)));
    return ['Alle', ...unique.sort((a, b) => a.localeCompare(b))];
  }, [activeItems, hasSpot]);
  const activeStorageKey = subTabs ? `${storageKey}:${activeSub}` : storageKey;

  // Sterren delen dezelfde sleutel voor alle subtabs van dit scherm (en het
  // "Huidig Event"-scherm op home, zie `app/events.tsx`) zodat een score die
  // je op de ene plek geeft, ook op de andere plek meteen zichtbaar is.
  const starsStorageKey = `heartopia:${storageKey}:stars`;
  const masteryStorageKey = `heartopia:${activeStorageKey}:mastery`;
  const filtersStorageKey = `heartopia:${activeStorageKey}:filters`;
  // Voorkomt dat het opslag-effect hieronder de nét geladen filters van dit
  // tabblad overschrijft met de (nog niet bijgewerkte) state van het vorige
  // tabblad, vlak na het wisselen van subtab.
  const hydratedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    hydratedKeyRef.current = null;
    (async () => {
      try {
        const [starsRaw, masteryRaw, filtersRaw] = await Promise.all([
          AsyncStorage.getItem(starsStorageKey),
          AsyncStorage.getItem(masteryStorageKey),
          AsyncStorage.getItem(filtersStorageKey),
        ]);
        setStars(starsRaw ? JSON.parse(starsRaw) : {});
        setMastery(masteryRaw ? JSON.parse(masteryRaw) : {});
        const f = filtersRaw ? JSON.parse(filtersRaw) : null;
        setMaxLevel(f?.maxLevel ?? 99);
        setProgressFilter(f?.progressFilter ?? 'all');
        setWeatherIndex(f?.weatherIndex ?? -1);
        setTimeIndex(f?.timeIndex ?? -1);
        setSpotFilter(f?.spotFilter ?? 'Alle');
      } catch {
        setStars({});
        setMastery({});
      }
      hydratedKeyRef.current = activeStorageKey;
    })();
  }, [starsStorageKey, masteryStorageKey, filtersStorageKey, activeStorageKey]);

  useEffect(() => {
    if (hydratedKeyRef.current !== activeStorageKey) return;
    AsyncStorage.setItem(
      filtersStorageKey,
      JSON.stringify({ maxLevel, progressFilter, weatherIndex, timeIndex, spotFilter })
    ).catch(() => {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    });
  }, [activeStorageKey, filtersStorageKey, maxLevel, progressFilter, weatherIndex, timeIndex, spotFilter]);

  const setItemStar = async (name: string, value: number) => {
    const current = stars[name] ?? 0;
    const nextValue = value === current ? 0 : value;
    const updated = { ...stars, [name]: nextValue };
    setStars(updated);
    try {
      await AsyncStorage.setItem(starsStorageKey, JSON.stringify(updated));
    } catch {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    }
  };

  const toggleMastery = async (name: string) => {
    const updated = { ...mastery, [name]: !mastery[name] };
    setMastery(updated);
    try {
      await AsyncStorage.setItem(masteryStorageKey, JSON.stringify(updated));
    } catch {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    }
  };

  const visibleItems = useMemo(() => {
    let filtered = activeItems
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => maxLevel === 99 || item.level >= maxLevel);

    if (spotFilter !== 'Alle') {
      filtered = filtered.filter((item) => item.spot === spotFilter);
    }

    if (progressFilter === 'undiscovered') {
      filtered = filtered.filter((item) => (stars[item.name] ?? 0) === 0);
    } else if (progressFilter === 'notFiveStar') {
      filtered = filtered.filter((item) => {
        const value = stars[item.name] ?? 0;
        return value > 0 && value < 5;
      });
    } else if (typeof progressFilter === 'number') {
      filtered = filtered.filter((item) => (stars[item.name] ?? 0) === progressFilter);
    } else if (progressFilter === 'noMastery') {
      filtered = filtered.filter((item) => !mastery[item.name]);
    }

    if (timeFilter !== 'Alle') {
      filtered = filtered.filter((item) => !!item.time?.includes(timeFilter));
    }

    if (weatherFilter === 'Alle') return filtered;

    return [...filtered].sort((a, b) => {
      const aScore = a.weather?.includes(weatherFilter) ? 1 : 0;
      const bScore = b.weather?.includes(weatherFilter) ? 1 : 0;
      return bScore - aScore;
    });
  }, [activeItems, query, maxLevel, weatherFilter, timeFilter, spotFilter, progressFilter, stars, mastery]);

  const listHeader = (
    <>
      <LinearGradient colors={gradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={8}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>{s.back}</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          {icon} {title}
        </Text>

        {subTabs && (
          <View style={styles.chipRow}>
            {subTabs.map((tab) => {
              const active = activeSub === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => {
                    setActiveSub(tab.key);
                    setOpenName(null);
                  }}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {!isEventTab && <Text style={styles.headerCount}>{s.itemsInGuide(visibleItems.length)}</Text>}

        {!isEventTab && (
        <>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={s.searchPlaceholder}
          placeholderTextColor={colors.forestSoft}
          style={styles.searchInput}
        />

        <View style={styles.chipRow}>
          {LEVEL_FILTERS.map((lvl) => {
            const isAll = lvl === 'Alle';
            const active = isAll ? maxLevel === 99 : maxLevel === lvl;
            return (
              <Pressable
                key={lvl}
                onPress={() => setMaxLevel(isAll ? 99 : (lvl as number))}
                style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {isAll ? s.all : `Lv.${lvl}+`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chipRow}>
          {PROGRESS_FILTERS.map((pf) => {
            const active = progressFilter === pf;
            const label =
              typeof pf === 'number'
                ? `${pf}★`
                : pf === 'all'
                  ? s.all
                  : pf === 'undiscovered'
                    ? s.progressUndiscovered
                    : pf === 'notFiveStar'
                      ? s.progressNotFiveStar
                      : s.progressNoMastery;
            return (
              <Pressable key={pf} onPress={() => setProgressFilter(pf)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {hasWeather && (
          <View style={styles.chipRow}>
            {WEATHER_FILTERS.map((w) => {
              const active = weatherFilter === w;
              const label =
                w === 'Alle' ? s.allWeather : `${w === WEATHER_WORDS[language][0] ? '☀️' : w === WEATHER_WORDS[language][1] ? '🌧️' : '🌈'} ${w}`;
              return (
                <Pressable key={w} onPress={() => setWeatherIndex(w === 'Alle' ? -1 : (WEATHER_WORDS[language] as readonly string[]).indexOf(w))} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {hasTime && (
          <View style={styles.chipRow}>
            {TIME_FILTERS.map((t) => {
              const active = timeFilter === t;
              const label =
                t === 'Alle'
                  ? s.allTime
                  : `${t === TIME_WORDS[language][0] ? '🌙' : t === TIME_WORDS[language][1] ? '🌅' : t === TIME_WORDS[language][2] ? '☀️' : '🌆'} ${t}`;
              return (
                <Pressable key={t} onPress={() => setTimeIndex(t === 'Alle' ? -1 : (TIME_WORDS[language] as readonly string[]).indexOf(t))} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {hasSpot && !spotExpanded && (
          <View style={styles.chipRow}>
            <Pressable onPress={() => setSpotExpanded(true)} style={[styles.chip, spotFilter !== 'Alle' && styles.chipActive]}>
              <Text style={[styles.chipText, spotFilter !== 'Alle' && styles.chipTextActive]}>
                {spotFilter === 'Alle' ? s.showSpots(SPOT_FILTERS.length - 1) : spotFilter}
              </Text>
            </Pressable>
          </View>
        )}

        {hasSpot && spotExpanded && (
          <View style={styles.chipRow}>
            {SPOT_FILTERS.map((spot) => {
              const active = spotFilter === spot;
              const label = spot === 'Alle' ? s.allSpots : spot;
              return (
                <Pressable key={spot} onPress={() => setSpotFilter(spot)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
            <Pressable onPress={() => setSpotExpanded(false)} style={styles.chip}>
              <Text style={styles.chipText}>{s.hideSpots}</Text>
            </Pressable>
          </View>
        )}
        </>
        )}
      </LinearGradient>

      {activeTab?.disclaimer && (
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{activeTab.disclaimer}</Text>
        </View>
      )}
    </>
  );

  if (isEventTab) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {listHeader}
          <EventGroupsList
            groups={activeTab!.eventGroups!}
            emptyText={s.noEventsYet}
            stars={stars}
            onSetStar={setItemStar}
            bestResultLabel={s.bestResult}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => {
          const isOpen = openName === item.name;
          const weatherMatch = hasWeather && weatherFilter !== 'Alle' && !!item.weather?.includes(weatherFilter);
          const weatherEmoji =
            weatherFilter === WEATHER_WORDS[language][0] ? '☀️' : weatherFilter === WEATHER_WORDS[language][1] ? '🌧️' : '🌈';
          const timeMatch = hasTime && timeFilter !== 'Alle' && !!item.time?.includes(timeFilter);
          const timeEmoji =
            timeFilter === TIME_WORDS[language][0]
              ? '🌙'
              : timeFilter === TIME_WORDS[language][1]
                ? '🌅'
                : timeFilter === TIME_WORDS[language][2]
                  ? '☀️'
                  : '🌆';
          return (
            <View style={[styles.card, (weatherMatch || timeMatch) && styles.cardHighlighted]}>
              <Pressable style={styles.cardHeader} onPress={() => setOpenName(isOpen ? null : item.name)}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.levelBadge}>Lv.{item.level}</Text>
                    <RarityPill label={item.rarity} colorKey={item.rarityColorKey} />
                    {weatherMatch && <Text style={styles.weatherBadge}>{weatherEmoji}</Text>}
                    {timeMatch && <Text style={styles.weatherBadge}>{timeEmoji}</Text>}
                    {stars[item.name] > 0 && <Text style={styles.starsText}>{'★'.repeat(stars[item.name])}</Text>}
                  </View>
                </View>
                <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.cardBody}>
                  {item.spot !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.spot}</Text>
                        <Text style={styles.detailValue}>
                          {item.spot} ({item.watertype})
                        </Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.time}</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.weather}</Text>
                        <Text style={styles.detailValue}>{item.weather}</Text>
                      </View>
                    </View>
                  )}

                  {item.ingredients !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.tool}</Text>
                        <Text style={styles.detailValue}>{item.tool}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.ingredients}</Text>
                        <View style={styles.ingredientRow}>
                          {item.ingredients.map((ing) => (
                            <Text key={ing} style={styles.ingredientPill}>
                              {ing}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  {item.growTime !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.growTime}</Text>
                        <Text style={styles.detailValue}>{item.growTime}</Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.seedPrice}</Text>
                        <Text style={styles.detailValue}>{item.seedPrice} 🪙</Text>
                      </View>
                    </View>
                  )}

                  {item.method !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.method}</Text>
                        <Text style={styles.detailValue}>{item.method}</Text>
                      </View>
                    </View>
                  )}

                  {item.sellPriceByStar !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.sellPriceByStar}</Text>
                        <Text style={styles.detailValue}>
                          {item.sellPriceByStar
                            ? item.sellPriceByStar.map((v, i) => `${i + 1}★ ${v != null ? `${v}🪙` : '—'}`).join('   ')
                            : s.sellPriceUnknown}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.starBox}>
                    <Text style={styles.starBoxLabel}>{s.bestResult}</Text>
                    <StarRow value={stars[item.name] || 0} onSet={(n) => setItemStar(item.name, n)} />
                  </View>

                  <Pressable
                    style={[styles.masteryBox, mastery[item.name] && styles.masteryBoxActive]}
                    onPress={() => toggleMastery(item.name)}>
                    <Text style={[styles.masteryLabel, mastery[item.name] && styles.masteryLabelActive]}>
                      {s.masteryAchieved}
                    </Text>
                    <View style={[styles.checkbox, mastery[item.name] && styles.checkboxActive]}>
                      {mastery[item.name] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginHorizontal: -16,
      marginTop: -16,
      marginBottom: 6,
    },
    backButton: { alignSelf: 'flex-start', marginBottom: 8 },
    backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
    headerCount: { color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 2 },
    searchInput: {
      marginTop: 12,
      backgroundColor: c.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: c.forest,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)', flexShrink: 0 },
    chipActive: { backgroundColor: '#FFFFFF' },
    chipText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    chipTextActive: { color: c.forest },
    listContent: { padding: 16, gap: 10 },
    disclaimer: { padding: 12, borderRadius: 12, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, marginBottom: 10 },
    disclaimerText: { fontSize: 11, color: c.forestSoft },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden', marginBottom: 10 },
    cardHighlighted: { borderWidth: 2, borderColor: c.yellow },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 20 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: c.forest },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
    levelBadge: { fontSize: 10, fontWeight: '700', color: c.skyDark, backgroundColor: c.chipBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    weatherBadge: { fontSize: 10, fontWeight: '700', color: c.warningText, backgroundColor: c.warningBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    starsText: { fontSize: 12, fontWeight: '700', color: c.yellow },
    chevron: { fontSize: 18, color: c.forestSoft },
    cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    detailBox: { flexBasis: '47%', flexGrow: 1, backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    detailBoxFull: { flexBasis: '100%' },
    detailLabel: { fontSize: 11, fontWeight: '700', color: c.forest },
    detailValue: { fontSize: 12, color: c.forestSoft, marginTop: 2 },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    starBox: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    starBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    masteryBox: { marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    masteryBoxActive: { backgroundColor: c.warningBg, borderColor: c.warningBorder },
    masteryLabel: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
    masteryLabelActive: { color: c.warningText },
    checkbox: { width: 22, height: 22, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  });
}
