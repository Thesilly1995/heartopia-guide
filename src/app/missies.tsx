import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChecklistRow } from '@/components/heartopia/checklist-row';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';
import { useServer } from '@/hooks/use-server';
import { currentDailyResetKey, currentWeeklyResetKey } from '@/lib/reset-schedule';

const STORAGE_KEY = 'heartopia:missies:vinkjes';
const CUSTOM_STORAGE_KEY = 'heartopia:missies:eigen-dailies';
const DAILY_RESET_DAY_KEY = 'heartopia:missies:laatste-reset-dag';
const WEEKLY_RESET_WEEK_KEY = 'heartopia:missies:laatste-reset-week';

const DAILY = {
  nl: [
    { key: 'd0', label: 'Dagelijkse check-in' },
    { key: 'd1', label: '5x Bewonersverzoek (Resident Requests)' },
    { key: 'd3', label: 'Winkel-restock bekijken (meubels & kleding)' },
    { key: 'd4', label: 'Post/mailbox controleren' },
    { key: 'd6', label: 'Huisdier voeren, aaien & trainen' },
    { key: 'd7', label: 'Wilde dieren voeren' },
    { key: 'd10', label: 'Gewassen oogsten & water geven' },
    { key: 'd11', label: 'Bloemen checken & water geven' },
    { key: 'd12', label: "Ka Ching's winkel bekijken" },
    { key: 'd13', label: 'Azure bekijken (indien actief event)' },
    { key: 'd14', label: 'Laboratorium checken' },
    { key: 'd15', label: 'Zwervende Eik hakken' },
    { key: 'd16', label: 'Fluoriet hakken' },
    { key: 'd17', label: '5 vogelkaarten voor Bailey J' },
    { key: 'd18', label: 'Zeldzaam hout verzamelen' },
    { key: 'd19', label: 'Zee dailies (Whalefall Canyon)' },
  ],
  en: [
    { key: 'd0', label: 'Daily check-in' },
    { key: 'd1', label: '5x Resident Request' },
    { key: 'd3', label: 'Check shop restock (furniture & clothing)' },
    { key: 'd4', label: 'Check mail/mailbox' },
    { key: 'd6', label: 'Feed, pet & train your pet' },
    { key: 'd7', label: 'Feed wild animals' },
    { key: 'd10', label: 'Harvest crops & water them' },
    { key: 'd11', label: 'Check flowers & water them' },
    { key: 'd12', label: "Check Ka Ching's shop" },
    { key: 'd13', label: 'Check Azure (if an event is active)' },
    { key: 'd14', label: 'Check the Laboratory' },
    { key: 'd15', label: 'Chop the Wandering Oak' },
    { key: 'd16', label: 'Mine the Fluorite' },
    { key: 'd17', label: '5 bird cards for Bailey J' },
    { key: 'd18', label: 'Collect rare timber' },
    { key: 'd19', label: 'Sea dailies (Whalefall Canyon)' },
  ],
  es: [
    { key: 'd0', label: 'Check-in diario' },
    { key: 'd1', label: '5x Solicitud de residente (Resident Requests)' },
    { key: 'd3', label: 'Revisar reposición de tienda (muebles y ropa)' },
    { key: 'd4', label: 'Revisar correo/buzón' },
    { key: 'd6', label: 'Alimentar, acariciar y entrenar a tu mascota' },
    { key: 'd7', label: 'Alimentar animales salvajes' },
    { key: 'd10', label: 'Cosechar cultivos y regarlos' },
    { key: 'd11', label: 'Revisar flores y regarlas' },
    { key: 'd12', label: 'Revisar la tienda de Ka Ching' },
    { key: 'd13', label: 'Revisar Azure (si hay un evento activo)' },
    { key: 'd14', label: 'Revisar el Laboratorio' },
    { key: 'd15', label: 'Talar el Roble Errante' },
    { key: 'd16', label: 'Extraer Fluorita' },
    { key: 'd17', label: '5 cartas de pájaro para Bailey J' },
    { key: 'd18', label: 'Recolectar madera rara' },
    { key: 'd19', label: 'Dailies del mar (Whalefall Canyon)' },
  ],
  pt: [
    { key: 'd0', label: 'Check-in diário' },
    { key: 'd1', label: '5x Pedido de Morador (Resident Requests)' },
    { key: 'd3', label: 'Conferir reposição da loja (móveis e roupas)' },
    { key: 'd4', label: 'Conferir correio/caixa de correio' },
    { key: 'd6', label: 'Alimentar, fazer carinho e treinar seu bichinho' },
    { key: 'd7', label: 'Alimentar animais selvagens' },
    { key: 'd10', label: 'Colher plantações e regá-las' },
    { key: 'd11', label: 'Conferir as flores e regá-las' },
    { key: 'd12', label: 'Conferir a loja da Ka Ching' },
    { key: 'd13', label: 'Conferir a Azure (se houver evento ativo)' },
    { key: 'd14', label: 'Conferir o Laboratório' },
    { key: 'd15', label: 'Cortar o Carvalho Errante' },
    { key: 'd16', label: 'Minerar Fluorita' },
    { key: 'd17', label: '5 cartas de pássaro para Bailey J' },
    { key: 'd18', label: 'Coletar madeira rara' },
    { key: 'd19', label: 'Dailies do mar (Whalefall Canyon)' },
  ],
  fr: [
    { key: 'd0', label: 'Check-in quotidien' },
    { key: 'd1', label: '5x Demande de résident (Resident Requests)' },
    { key: 'd3', label: 'Vérifier le réassort des boutiques (meubles et vêtements)' },
    { key: 'd4', label: 'Vérifier le courrier/la boîte aux lettres' },
    { key: 'd6', label: 'Nourrir, caresser et entraîner ton animal' },
    { key: 'd7', label: 'Nourrir les animaux sauvages' },
    { key: 'd10', label: 'Récolter les cultures et les arroser' },
    { key: 'd11', label: 'Vérifier les fleurs et les arroser' },
    { key: 'd12', label: 'Vérifier la boutique de Ka Ching' },
    { key: 'd13', label: 'Vérifier Azure (si un événement est actif)' },
    { key: 'd14', label: 'Vérifier le Laboratoire' },
    { key: 'd15', label: 'Couper le Chêne Errant' },
    { key: 'd16', label: 'Extraire la Fluorite' },
    { key: 'd17', label: "5 cartes d'oiseaux pour Bailey J" },
    { key: 'd18', label: 'Récolter du bois rare' },
    { key: 'd19', label: 'Dailies de la mer (Whalefall Canyon)' },
  ],
  de: [
    { key: 'd0', label: 'Täglicher Check-in' },
    { key: 'd1', label: '5x Bewohneranfrage (Resident Requests)' },
    { key: 'd3', label: 'Shop-Nachschub ansehen (Möbel & Kleidung)' },
    { key: 'd4', label: 'Post/Postfach prüfen' },
    { key: 'd6', label: 'Haustier füttern, streicheln & trainieren' },
    { key: 'd7', label: 'Wildtiere füttern' },
    { key: 'd10', label: 'Pflanzen ernten & gießen' },
    { key: 'd11', label: 'Blumen checken & gießen' },
    { key: 'd12', label: 'Ka Chings Laden ansehen' },
    { key: 'd13', label: 'Azure ansehen (falls Event aktiv)' },
    { key: 'd14', label: 'Labor checken' },
    { key: 'd15', label: 'Wandernde Eiche fällen' },
    { key: 'd16', label: 'Fluorit abbauen' },
    { key: 'd17', label: '5 Vogelkarten für Bailey J' },
    { key: 'd18', label: 'Seltenes Holz sammeln' },
    { key: 'd19', label: 'Meeres-Dailies (Whalefall Canyon)' },
  ],
} as const;

const WEEKLY = {
  nl: [
    { key: 'w1', label: 'Wekelijkse taken afronden (D.G. Level 13+)' },
    { key: 'w2', label: 'Roze Bubbels verzamelen' },
    { key: 'w3', label: 'Event-weekdoelen (indien actief)' },
    { key: 'w4', label: 'Codes checken' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
  en: [
    { key: 'w1', label: 'Complete weekly tasks (D.G. Level 13+)' },
    { key: 'w2', label: 'Collect Pink Bubbles' },
    { key: 'w3', label: 'Event weekly goals (if active)' },
    { key: 'w4', label: 'Check codes' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
  es: [
    { key: 'w1', label: 'Completar tareas semanales (D.G. Nivel 13+)' },
    { key: 'w2', label: 'Recolectar Burbujas Rosas' },
    { key: 'w3', label: 'Objetivos semanales del evento (si está activo)' },
    { key: 'w4', label: 'Revisar códigos' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
  pt: [
    { key: 'w1', label: 'Completar tarefas semanais (D.G. Nível 13+)' },
    { key: 'w2', label: 'Coletar Bolhas Rosa' },
    { key: 'w3', label: 'Metas semanais do evento (se ativo)' },
    { key: 'w4', label: 'Conferir códigos' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
  fr: [
    { key: 'w1', label: 'Terminer les tâches hebdomadaires (D.G. Niveau 13+)' },
    { key: 'w2', label: 'Collecter des Bulles Roses' },
    { key: 'w3', label: "Objectifs hebdomadaires de l'événement (si actif)" },
    { key: 'w4', label: 'Vérifier les codes' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
  de: [
    { key: 'w1', label: 'Wöchentliche Aufgaben abschließen (D.G. Level 13+)' },
    { key: 'w2', label: 'Rosa Blasen sammeln' },
    { key: 'w3', label: 'Wöchentliche Event-Ziele (falls aktiv)' },
    { key: 'w4', label: 'Codes checken' },
    { key: 'w5', label: 'Home Evaluation' },
  ],
} as const;

const SHOPS = {
  nl: [
    { key: 's1', label: 'Boekenwinkel' },
    { key: 's2', label: 'Insectenwinkel (Naniwa)' },
    { key: 's3', label: 'Viswinkel (Vanya)' },
    { key: 's4', label: 'Tuinwinkel (Blanc)' },
    { key: 's5', label: 'Instrumentenwinkel (Annie)' },
    { key: 's6', label: 'Laboratorium (aanbiedingen)' },
    { key: 's7', label: 'Kookwinkel (Massimo)' },
    { key: 's8', label: 'Vogelwinkel (Bailey)' },
  ],
  en: [
    { key: 's1', label: 'Book Shop' },
    { key: 's2', label: 'Insect Shop (Naniwa)' },
    { key: 's3', label: 'Fishing Shop (Vanya)' },
    { key: 's4', label: 'Garden Shop (Blanc)' },
    { key: 's5', label: 'Instrument Shop (Annie)' },
    { key: 's6', label: 'Laboratory (offers)' },
    { key: 's7', label: 'Cooking Shop (Massimo)' },
    { key: 's8', label: 'Bird Shop (Bailey)' },
  ],
  es: [
    { key: 's1', label: 'Librería' },
    { key: 's2', label: 'Tienda de insectos (Naniwa)' },
    { key: 's3', label: 'Tienda de pesca (Vanya)' },
    { key: 's4', label: 'Tienda de jardín (Blanc)' },
    { key: 's5', label: 'Tienda de instrumentos (Annie)' },
    { key: 's6', label: 'Laboratorio (ofertas)' },
    { key: 's7', label: 'Tienda de cocina (Massimo)' },
    { key: 's8', label: 'Tienda de pájaros (Bailey)' },
  ],
  pt: [
    { key: 's1', label: 'Livraria' },
    { key: 's2', label: 'Loja de insetos (Naniwa)' },
    { key: 's3', label: 'Loja de pesca (Vanya)' },
    { key: 's4', label: 'Loja de jardim (Blanc)' },
    { key: 's5', label: 'Loja de instrumentos (Annie)' },
    { key: 's6', label: 'Laboratório (ofertas)' },
    { key: 's7', label: 'Loja de culinária (Massimo)' },
    { key: 's8', label: 'Loja de pássaros (Bailey)' },
  ],
  fr: [
    { key: 's1', label: 'Librairie' },
    { key: 's2', label: "Boutique d'insectes (Naniwa)" },
    { key: 's3', label: 'Boutique de pêche (Vanya)' },
    { key: 's4', label: 'Boutique de jardin (Blanc)' },
    { key: 's5', label: "Boutique d'instruments (Annie)" },
    { key: 's6', label: 'Laboratoire (offres)' },
    { key: 's7', label: 'Boutique de cuisine (Massimo)' },
    { key: 's8', label: "Boutique d'oiseaux (Bailey)" },
  ],
  de: [
    { key: 's1', label: 'Buchladen' },
    { key: 's2', label: 'Insektenladen (Naniwa)' },
    { key: 's3', label: 'Angelladen (Vanya)' },
    { key: 's4', label: 'Gartenladen (Blanc)' },
    { key: 's5', label: 'Instrumentenladen (Annie)' },
    { key: 's6', label: 'Labor (Angebote)' },
    { key: 's7', label: 'Kochladen (Massimo)' },
    { key: 's8', label: 'Vogelladen (Bailey)' },
  ],
} as const;

const DAILY_KEYS: string[] = DAILY.nl.map((item) => item.key);
const WEEKLY_KEYS: string[] = [...WEEKLY.nl.map((item) => item.key), ...SHOPS.nl.map((item) => item.key), 'shops_all'];

const STRINGS = {
  nl: {
    title: 'Missies',
    daily: 'Dagelijks',
    weekly: 'Wekelijks',
    reset: 'Reset',
    resetDaily: 'Elke dag om 06:00 (servertijd)',
    resetWeekly: 'Elke zaterdag om 06:00 (servertijd)',
    resetAll: 'Alles resetten',
    checkShops: 'Winkels checken',
    dailyTasks: 'Dagelijkse taken',
    ownDailies: 'Eigen dagelijkse taken',
    ownDailiesPlaceholder: 'Bijv. Ka Ching-aanbieding kopen...',
    add: 'Toevoegen',
    ownDailiesEmpty: 'Nog niks toegevoegd — zet hier je eigen dagelijkse taakjes bij.',
  },
  en: {
    title: 'Missions',
    daily: 'Daily',
    weekly: 'Weekly',
    reset: 'Reset',
    resetDaily: 'Every day at 06:00 (server time)',
    resetWeekly: 'Every Saturday at 06:00 (server time)',
    resetAll: 'Reset all',
    checkShops: 'Check shops',
    dailyTasks: 'Daily tasks',
    ownDailies: 'Your own daily tasks',
    ownDailiesPlaceholder: 'E.g. buy Ka Ching offer...',
    add: 'Add',
    ownDailiesEmpty: 'Nothing added yet — put your own daily tasks here.',
  },
  es: {
    title: 'Misiones',
    daily: 'Diario',
    weekly: 'Semanal',
    reset: 'Reinicio',
    resetDaily: 'Todos los días a las 06:00 (hora del servidor)',
    resetWeekly: 'Todos los sábados a las 06:00 (hora del servidor)',
    resetAll: 'Reiniciar todo',
    checkShops: 'Revisar tiendas',
    dailyTasks: 'Tareas diarias',
    ownDailies: 'Tus propias tareas diarias',
    ownDailiesPlaceholder: 'Ej. comprar oferta de Ka Ching...',
    add: 'Añadir',
    ownDailiesEmpty: 'Todavía no has añadido nada — pon aquí tus propias tareas diarias.',
  },
  pt: {
    title: 'Missões',
    daily: 'Diário',
    weekly: 'Semanal',
    reset: 'Redefinir',
    resetDaily: 'Todos os dias às 06:00 (horário do servidor)',
    resetWeekly: 'Todo sábado às 06:00 (horário do servidor)',
    resetAll: 'Redefinir tudo',
    checkShops: 'Conferir lojas',
    dailyTasks: 'Tarefas diárias',
    ownDailies: 'Suas próprias tarefas diárias',
    ownDailiesPlaceholder: 'Ex.: comprar oferta da Ka Ching...',
    add: 'Adicionar',
    ownDailiesEmpty: 'Nada adicionado ainda — coloque aqui suas próprias tarefas diárias.',
  },
  fr: {
    title: 'Missions',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    reset: 'Réinitialisation',
    resetDaily: 'Tous les jours à 06h00 (heure du serveur)',
    resetWeekly: 'Tous les samedis à 06h00 (heure du serveur)',
    resetAll: 'Tout réinitialiser',
    checkShops: 'Vérifier les boutiques',
    dailyTasks: 'Tâches quotidiennes',
    ownDailies: 'Tes propres tâches quotidiennes',
    ownDailiesPlaceholder: 'Ex. acheter une offre Ka Ching...',
    add: 'Ajouter',
    ownDailiesEmpty: "Rien d'ajouté pour l'instant — ajoute ici tes propres tâches quotidiennes.",
  },
  de: {
    title: 'Missionen',
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    reset: 'Zurücksetzen',
    resetDaily: 'Jeden Tag um 06:00 Uhr (Serverzeit)',
    resetWeekly: 'Jeden Samstag um 06:00 Uhr (Serverzeit)',
    resetAll: 'Alles zurücksetzen',
    checkShops: 'Shops checken',
    dailyTasks: 'Tägliche Aufgaben',
    ownDailies: 'Eigene tägliche Aufgaben',
    ownDailiesPlaceholder: 'Z. B. Ka Ching-Angebot kaufen...',
    add: 'Hinzufügen',
    ownDailiesEmpty: 'Noch nichts hinzugefügt — trage hier deine eigenen täglichen Aufgaben ein.',
  },
} as const;

interface CustomItem {
  text: string;
  done: boolean;
}

export default function MissiesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const { server } = useServer();
  const s = STRINGS[language];
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shopsOpen, setShopsOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    (async () => {
      let loadedChecked: Record<string, boolean> = {};
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        loadedChecked = raw ? JSON.parse(raw) : {};
      } catch {
        loadedChecked = {};
      }

      let loadedCustom: CustomItem[] = [];
      try {
        const rawCustom = await AsyncStorage.getItem(CUSTOM_STORAGE_KEY);
        loadedCustom = rawCustom ? JSON.parse(rawCustom) : [];
      } catch {
        loadedCustom = [];
      }

      let checkedChanged = false;
      let customChanged = false;

      try {
        const todayKey = currentDailyResetKey(server.offsetHours);
        if ((await AsyncStorage.getItem(DAILY_RESET_DAY_KEY)) !== todayKey) {
          loadedChecked = Object.fromEntries(Object.entries(loadedChecked).filter(([key]) => !DAILY_KEYS.includes(key)));
          checkedChanged = true;
          if (loadedCustom.some((item) => item.done)) {
            loadedCustom = loadedCustom.map((item) => ({ ...item, done: false }));
            customChanged = true;
          }
          await AsyncStorage.setItem(DAILY_RESET_DAY_KEY, todayKey);
        }

        const weekKey = currentWeeklyResetKey(server.offsetHours);
        if ((await AsyncStorage.getItem(WEEKLY_RESET_WEEK_KEY)) !== weekKey) {
          loadedChecked = Object.fromEntries(Object.entries(loadedChecked).filter(([key]) => !WEEKLY_KEYS.includes(key)));
          checkedChanged = true;
          await AsyncStorage.setItem(WEEKLY_RESET_WEEK_KEY, weekKey);
        }
      } catch {
        // reset-check mislukt (opslag niet bereikbaar) — bestaande vinkjes blijven gewoon staan
      }

      setChecked(loadedChecked);
      setCustomItems(loadedCustom);
      if (checkedChanged) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loadedChecked)).catch(() => {});
      if (customChanged) AsyncStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(loadedCustom)).catch(() => {});
    })();
  }, [server.offsetHours]);

  const toggle = async (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const resetCurrentTab = async () => {
    const keysToClear = tab === 'daily' ? DAILY_KEYS : WEEKLY_KEYS;
    const updated = Object.fromEntries(Object.entries(checked).filter(([key]) => !keysToClear.includes(key)));
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (tab === 'daily') {
        await AsyncStorage.setItem(DAILY_RESET_DAY_KEY, currentDailyResetKey(server.offsetHours));
      } else {
        await AsyncStorage.setItem(WEEKLY_RESET_WEEK_KEY, currentWeeklyResetKey(server.offsetHours));
      }
    } catch {
      // opslaan mislukt
    }
    if (tab === 'daily' && customItems.some((item) => item.done)) {
      saveCustom(customItems.map((item) => ({ ...item, done: false })));
    }
  };

  const saveCustom = async (updated: CustomItem[]) => {
    setCustomItems(updated);
    try {
      await AsyncStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const addCustomItem = () => {
    if (!customText.trim()) return;
    saveCustom([...customItems, { text: customText.trim(), done: false }]);
    setCustomText('');
  };

  const toggleCustomItem = (i: number) => {
    saveCustom(customItems.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));
  };

  const removeCustomItem = (i: number) => {
    saveCustom(customItems.filter((_, idx) => idx !== i));
  };

  const items = tab === 'daily' ? DAILY[language] : WEEKLY[language];
  const resetText = tab === 'daily' ? s.resetDaily : s.resetWeekly;
  const dailyDoneCount = DAILY[language].filter((item) => checked[item.key]).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#E8A24F', '#F0C674']}
        icon="📋"
        title={s.title}
        tabs={[
          { key: 'daily', label: s.daily },
          { key: 'weekly', label: s.weekly },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'daily' | 'weekly')}
      />
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.resetRow}>
          <View>
            <Text style={styles.resetLabel}>{s.reset}</Text>
            <Text style={styles.resetText}>{resetText}</Text>
          </View>
          <Pressable style={styles.resetButton} onPress={resetCurrentTab}>
            <Text style={styles.resetButtonText}>{s.resetAll}</Text>
          </Pressable>
        </View>

        {tab === 'daily' ? (
          <>
            <View style={styles.collapsibleCard}>
              <Pressable style={styles.collapsibleHeader} onPress={() => setDailyOpen(!dailyOpen)}>
                <Text style={styles.collapsibleTitle}>{s.dailyTasks}</Text>
                <Text style={styles.progressBadge}>
                  {dailyDoneCount}/{DAILY[language].length}
                </Text>
                <Text style={styles.chevron}>{dailyOpen ? '⌄' : '›'}</Text>
              </Pressable>
              {dailyOpen && (
                <View style={styles.collapsibleBody}>
                  {items.map((item) => (
                    <ChecklistRow key={item.key} label={item.label} checked={!!checked[item.key]} onPress={() => toggle(item.key)} />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.collapsibleCard}>
              <Pressable style={styles.collapsibleHeader} onPress={() => setCustomOpen(!customOpen)}>
                <Text style={styles.collapsibleTitle}>{s.ownDailies}</Text>
                {customItems.length > 0 && (
                  <Text style={styles.progressBadge}>
                    {customItems.filter((i) => i.done).length}/{customItems.length}
                  </Text>
                )}
                <Text style={styles.chevron}>{customOpen ? '⌄' : '›'}</Text>
              </Pressable>
              {customOpen && (
                <View style={styles.collapsibleBody}>
                  <View style={styles.addRow}>
                    <TextInput
                      value={customText}
                      onChangeText={setCustomText}
                      onSubmitEditing={addCustomItem}
                      placeholder={s.ownDailiesPlaceholder}
                      placeholderTextColor={colors.forestSoft}
                      style={styles.input}
                    />
                    <Pressable style={styles.addButton} onPress={addCustomItem}>
                      <Text style={styles.addButtonText}>{s.add}</Text>
                    </Pressable>
                  </View>
                  {customItems.length === 0 && <Text style={styles.emptyText}>{s.ownDailiesEmpty}</Text>}
                  {customItems.map((item, i) => (
                    <View key={i} style={styles.customRow}>
                      <Pressable style={[styles.checkbox, item.done && styles.checkboxActive]} onPress={() => toggleCustomItem(i)}>
                        {item.done && <Text style={styles.checkmark}>✓</Text>}
                      </Pressable>
                      <Text style={[styles.customItemText, item.done && styles.customItemTextDone]}>{item.text}</Text>
                      <Pressable onPress={() => removeCustomItem(i)} hitSlop={8}>
                        <Text style={styles.removeText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            {items.map((item) => (
              <ChecklistRow key={item.key} label={item.label} checked={!!checked[item.key]} onPress={() => toggle(item.key)} />
            ))}

            <View style={styles.shopsCard}>
              <Pressable style={styles.shopsHeader} onPress={() => setShopsOpen(!shopsOpen)}>
                <View style={[styles.checkbox, checked.shops_all && styles.checkboxActive]}>
                  {checked.shops_all && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.shopsTitle}>{s.checkShops}</Text>
                <Text style={styles.chevron}>{shopsOpen ? '⌄' : '›'}</Text>
              </Pressable>
              {shopsOpen && (
                <View style={styles.shopsList}>
                  {SHOPS[language].map((shop) => (
                    <Pressable key={shop.key} style={styles.shopRow} onPress={() => toggle(shop.key)}>
                      <View style={[styles.smallCheckbox, checked[shop.key] && styles.checkboxActive]}>
                        {checked[shop.key] && <Text style={styles.checkmarkSmall}>✓</Text>}
                      </View>
                      <Text style={[styles.shopLabel, checked[shop.key] && styles.shopLabelChecked]}>{shop.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    resetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder },
    resetLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    resetText: { fontSize: 12, color: c.forestSoft },
    resetButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    resetButtonText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    collapsibleCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden' },
    collapsibleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
    collapsibleTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: c.forest },
    progressBadge: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    collapsibleBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
    shopsCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden' },
    shopsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    checkbox: { width: 24, height: 24, borderRadius: 6, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
    shopsTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: c.forest },
    chevron: { fontSize: 18, color: c.forestSoft },
    shopsList: { paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
    shopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    smallCheckbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkmarkSmall: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
    shopLabel: { flex: 1, fontSize: 12, color: c.forest },
    shopLabelChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
    addRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    input: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: c.forest, backgroundColor: c.surfaceSoft },
    addButton: { paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.coral, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
    emptyText: { fontSize: 12, color: c.forestSoft },
    customRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    customItemText: { flex: 1, fontSize: 13, color: c.forest },
    customItemTextDone: { color: c.forestSoft, textDecorationLine: 'line-through' },
    removeText: { fontSize: 13, color: c.forestSoft },
  });
}
