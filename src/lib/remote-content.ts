import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { REMOTE_CONTENT_URL } from '@/constants/remote';

const CACHE_KEY = 'heartopia:remote-content:cache';
const FETCH_TIMEOUT_MS = 8000;

export interface RemoteMapSpot {
  num: number;
  x: number;
  y: number;
  descriptionNl: string;
  descriptionEn: string;
  /** Optioneel — ontbreekt dit (nog) in de JSON, dan valt de app terug op Engels. */
  descriptionEs?: string;
  descriptionPt?: string;
  descriptionFr?: string;
  descriptionDe?: string;
}

export interface RemoteBubbleSpot extends RemoteMapSpot {
  /** true = onderwater op de Whalefall Canyon-kaart, false = hoofdeiland-kaart. */
  underwater: boolean;
}

export interface RemoteBubbleWeek {
  weekLabelNl: string;
  weekLabelEn: string;
  weekLabelEs?: string;
  weekLabelPt?: string;
  weekLabelFr?: string;
  weekLabelDe?: string;
  spots: RemoteBubbleSpot[];
}

export interface RemoteEventSpot extends RemoteBubbleSpot {
  /** true = dit is Doris' plek (NPC bij Whalefall Canyon, aanwezig tijdens regen/regenboog/meteorenregen), laat een ander icoon zien dan de gewone locatiepinnen. */
  isDoris?: boolean;
}

export interface RemoteDailyPlots {
  oakPlotNl: string;
  oakPlotEn: string;
  oakPlotEs?: string;
  oakPlotPt?: string;
  oakPlotFr?: string;
  oakPlotDe?: string;
  fluoritePlotNl: string;
  fluoritePlotEn: string;
  fluoritePlotEs?: string;
  fluoritePlotPt?: string;
  fluoritePlotFr?: string;
  fluoritePlotDe?: string;
}

export interface RemoteDailyPlotDay {
  /** Kalenderdatum "YYYY-MM-DD" (lokale speldatum). */
  date: string;
  oakPlotNl: string;
  oakPlotEn: string;
  oakPlotEs?: string;
  oakPlotPt?: string;
  oakPlotFr?: string;
  oakPlotDe?: string;
  fluoritePlotNl: string;
  fluoritePlotEn: string;
  fluoritePlotEs?: string;
  fluoritePlotPt?: string;
  fluoritePlotFr?: string;
  fluoritePlotDe?: string;
}

export interface RemoteEventSighting {
  nameNl: string;
  nameEn: string;
  nameEs?: string;
  namePt?: string;
  nameFr?: string;
  nameDe?: string;
  spotNl: string;
  spotEn: string;
  spotEs?: string;
  spotPt?: string;
  spotFr?: string;
  spotDe?: string;
  noteNl: string | null;
  noteEn: string | null;
  noteEs?: string | null;
  notePt?: string | null;
  noteFr?: string | null;
  noteDe?: string | null;
  emoji: string;
  gold?: (number | null)[] | null;
  tokens?: (number | null)[] | null;
}

export interface RemoteEventRecipe {
  nameNl: string;
  nameEn: string;
  nameEs?: string;
  namePt?: string;
  nameFr?: string;
  nameDe?: string;
  ingredientsNl: string[];
  ingredientsEn: string[];
  ingredientsEs?: string[];
  ingredientsPt?: string[];
  ingredientsFr?: string[];
  ingredientsDe?: string[];
  emoji: string;
  gold?: (number | null)[] | null;
  tokens?: (number | null)[] | null;
}

export interface RemoteEventOverride {
  nameNl: string;
  nameEn: string;
  datesNl: string;
  datesEn: string;
  datesEs?: string;
  datesPt?: string;
  datesFr?: string;
  datesDe?: string;
  fish: RemoteEventSighting[];
  birds: RemoteEventSighting[];
  recipes: RemoteEventRecipe[];
  insects: RemoteEventSighting[];
}

/**
 * Eén afgesloten event in het archief (zie `pastEvents` hieronder) — zelfde
 * vorm als `RemoteEventOverride`, maar alle categorieën zijn optioneel (een
 * event had bv. alleen vissen en geen insecten) en er zit geen actieve
 * countdown/disclaimer-logica aan vast zoals bij het huidige event.
 */
export interface RemoteEventArchiveEntry {
  nameNl: string;
  nameEn: string;
  nameEs?: string;
  namePt?: string;
  nameFr?: string;
  nameDe?: string;
  datesNl: string;
  datesEn: string;
  datesEs?: string;
  datesPt?: string;
  datesFr?: string;
  datesDe?: string;
  fish?: RemoteEventSighting[];
  birds?: RemoteEventSighting[];
  insects?: RemoteEventSighting[];
  recipes?: RemoteEventRecipe[];
}

export type WeatherKind = 'sunny' | 'rain' | 'rainbow';

export interface RemoteWeather {
  kind: WeatherKind;
  labelNl: string;
  labelEn: string;
  labelEs?: string;
  labelPt?: string;
  labelFr?: string;
  labelDe?: string;
  /** ISO-timestamp (UTC) waarop dit 6-uursblok eindigt — bepaalt of de weergave als verouderd geldt. */
  validUntil: string;
}

export interface RemoteCode {
  code: string;
  rewardNl: string;
  rewardEn: string;
  rewardEs?: string;
  rewardPt?: string;
  rewardFr?: string;
  rewardDe?: string;
  expiresNl: string;
  expiresEn: string;
  expiresEs?: string;
  expiresPt?: string;
  expiresFr?: string;
  expiresDe?: string;
}

export type WeekForecastKind = 'normal' | 'rain' | 'rainbow' | 'warm_sun' | 'meteor' | 'heatwave';

/** De vier vaste 6-uursblokken (servertijd) waarin het spelweer wisselt. */
export type WeekForecastBlock = '00-06' | '06-12' | '12-18' | '18-00';

export interface RemoteWeekForecastSlot {
  kind: WeekForecastKind;
  /** Het 6-uursblok waarin dit optreedt — weglaten als het tijdstip nog niet bekend is (dan toont de app alleen het icoon/de tekst, zonder tijd). */
  block?: WeekForecastBlock;
}

export interface RemoteWeekForecastDay {
  /** Kalenderdatum "YYYY-MM-DD" (lokale speldatum), niet een terugkerende weekdag. */
  date: string;
  /**
   * Meestal 1 element, maar een dag kan meerdere bijzonderheden tegelijk
   * hebben (bv. hittegolf overdag + meteorenregen 's nachts). Elk element is
   * óf een kale kind-string (geen tijd bekend, oude schrijfwijze) óf een
   * object met een `block` erbij zodra het tijdstip bekend is.
   */
  kinds: (WeekForecastKind | RemoteWeekForecastSlot)[];
}

export interface RemoteContentPayload {
  updatedAt: string;
  /** Rainbow-boeketten op de hoofdeiland- en Whalefall Canyon-kaart, onderscheiden via `underwater`. */
  rainbowSpots?: RemoteEventSpot[];
  /** Meteorenregen-kristalfragmenten — kan net als `rainbowSpots` op de hoofdeiland- én Whalefall Canyon-kaart staan (`underwater`), en Doris (`isDoris`) kan hier ook bij staan. */
  meteorSpots?: RemoteEventSpot[];
  /** Wekelijkse roze-bubbels-locaties (verspringen elke zaterdag 6:00) — ontbreekt dit veld, dan valt de app terug op de gebundelde (verouderde) standaardlijst. */
  bubbleWeek?: RemoteBubbleWeek;
  dailyPlots?: RemoteDailyPlots;
  /** Meerdaagse plot-kalender (bv. weken vooruit uit een in-game-kalenderafbeelding) — heeft voorrang op `dailyPlots` als er een entry voor vandaag in staat. */
  dailyPlotsCalendar?: RemoteDailyPlotDay[];
  event?: RemoteEventOverride;
  /**
   * Archief van afgesloten events — zodra een event eindigt, verhuist de
   * inhoud van `event` hierheen (i.p.v. verloren te gaan) zodat spelers
   * kunnen terugkijken welke vissen/vogels/insecten/recepten bij welk event
   * hoorden. Elke entry krijgt een eigen kopje + datum in de catalogus-tabs
   * (zie `docs/remote-content.md`).
   */
  pastEvents?: RemoteEventArchiveEntry[];
  weather?: RemoteWeather;
  /** Actieve redemption-codes — ontbreekt dit veld, dan valt de app terug op de gebundelde (per definitie verouderde) standaardlijst. */
  codes?: RemoteCode[];
  /**
   * De weekvoorspelling uit het in-game telefoontje: één entry per dag,
   * inclusief dagen zonder bijzonderheden (`kind: "normal"`) — zo kan de app
   * een echte weekweergave tonen i.p.v. alleen bijzondere dagen te noemen.
   */
  weekForecast?: RemoteWeekForecastDay[];
}

interface RemoteContentState {
  payload: RemoteContentPayload | null;
  loading: boolean;
  /** true als de laatst bekende payload uit cache/bundel komt i.p.v. een verse fetch. */
  stale: boolean;
}

// Eén gedeelde fetch voor de hele app — elk scherm dat useRemoteContent() aanroept
// deelt dezelfde in-memory state i.p.v. los te fetchen. Om het weer (wisselt elke
// 6 uur) redelijk actueel te houden, wordt er opnieuw gefetcht als een scherm
// mount en de laatste geslaagde fetch langer dan REFETCH_INTERVAL_MS geleden is —
// niet bij elke render, en nooit vaker dan dat interval.
const REFETCH_INTERVAL_MS = 5 * 60 * 1000;
let sharedState: RemoteContentState = { payload: null, loading: REMOTE_CONTENT_URL !== null, stale: true };
let lastFetchedAt = 0;
let fetchInFlight = false;
const listeners = new Set<(state: RemoteContentState) => void>();

function setSharedState(next: RemoteContentState) {
  sharedState = next;
  listeners.forEach((listener) => listener(sharedState));
}

async function loadCachedPayload(): Promise<RemoteContentPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as RemoteContentPayload) : null;
  } catch {
    return null;
  }
}

async function fetchRemoteContent() {
  if (!REMOTE_CONTENT_URL || fetchInFlight) return;
  if (lastFetchedAt !== 0 && Date.now() - lastFetchedAt < REFETCH_INTERVAL_MS) return;
  fetchInFlight = true;

  if (lastFetchedAt === 0) {
    const cached = await loadCachedPayload();
    if (cached) setSharedState({ payload: cached, loading: true, stale: true });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(REMOTE_CONTENT_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.json()) as RemoteContentPayload;
    lastFetchedAt = Date.now();
    setSharedState({ payload, loading: false, stale: false });
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload)).catch(() => {});
  } catch {
    // Fetch mislukt (geen internet, host offline, etc.) — blijf op cache/bundel-fallback staan.
    setSharedState({ payload: sharedState.payload, loading: false, stale: true });
  } finally {
    fetchInFlight = false;
  }
}

/**
 * Haalt de gedeelde remote-content payload op (rainbow/meteor-locaties, dagelijkse
 * plots, event-override). Geeft meteen gecachte/bundel-data terug terwijl er op de
 * achtergrond ververst wordt. Als REMOTE_CONTENT_URL niet is ingesteld, blijft
 * `payload` altijd `null` en gebruiken de aanroepende hooks hun bundel-fallback.
 */
export function useRemoteContent(): RemoteContentState {
  const [state, setState] = useState(sharedState);

  useEffect(() => {
    listeners.add(setState);
    fetchRemoteContent();
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
