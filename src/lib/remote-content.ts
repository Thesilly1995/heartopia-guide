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
}

export interface RemoteDailyPlots {
  oakPlotNl: string;
  oakPlotEn: string;
  fluoritePlotNl: string;
  fluoritePlotEn: string;
}

export interface RemoteEventSighting {
  nameNl: string;
  nameEn: string;
  spotNl: string;
  spotEn: string;
  noteNl: string | null;
  noteEn: string | null;
  emoji: string;
}

export interface RemoteEventRecipe {
  nameNl: string;
  nameEn: string;
  ingredientsNl: string[];
  ingredientsEn: string[];
  emoji: string;
}

export interface RemoteEventOverride {
  nameNl: string;
  nameEn: string;
  datesNl: string;
  datesEn: string;
  fish: RemoteEventSighting[];
  birds: RemoteEventSighting[];
  recipes: RemoteEventRecipe[];
}

export type WeatherKind = 'sunny' | 'rain' | 'rainbow';

export interface RemoteWeather {
  kind: WeatherKind;
  labelNl: string;
  labelEn: string;
  /** ISO-timestamp (UTC) waarop dit 6-uursblok eindigt — bepaalt of de weergave als verouderd geldt. */
  validUntil: string;
}

export type SpecialWeatherKind = 'rain' | 'rainbow' | 'warm_sun' | 'meteor';

export interface RemoteSpecialWeatherEntry {
  kind: SpecialWeatherKind;
  labelNl: string;
  labelEn: string;
  /** ISO-timestamp (UTC) waarop dit blok begint — de weekvoorspelling uit het in-game telefoontje. */
  startsAt: string;
}

export interface RemoteContentPayload {
  updatedAt: string;
  rainbowSpots?: RemoteMapSpot[];
  meteorSpots?: RemoteMapSpot[];
  dailyPlots?: RemoteDailyPlots;
  event?: RemoteEventOverride;
  weather?: RemoteWeather;
  /** Vooraf aangekondigde bijzondere weersomstandigheden deze week (regen/regenboog/warme zon/meteor) uit de in-game weekvoorspelling. Normaal weer wordt niet vermeld. */
  specialWeather?: RemoteSpecialWeatherEntry[];
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
