import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const ACTIVATED_KEY: Record<MembershipType, string> = {
  junior: 'heartopia:membership:junior:geactiveerd',
  full: 'heartopia:membership:full:geactiveerd',
};

/** Aantal keer achter elkaar gekocht (stapelt de looptijd) — bv. 4x Junior = 28 dagen i.p.v. 7. */
const COUNT_KEY: Record<MembershipType, string> = {
  junior: 'heartopia:membership:junior:aantal',
  full: 'heartopia:membership:full:aantal',
};
const MIN_COUNT = 1;
const MAX_COUNT = 24;

/** Oude opslag vóór junior+full tegelijk kon — eenmalig migreren naar de nieuwe per-tier keys. */
const LEGACY_TYPE_KEY = 'heartopia:membership:type';
const LEGACY_ACTIVATED_KEY = 'heartopia:membership:geactiveerd';

type MembershipType = 'junior' | 'full';

/**
 * Beloningen zoals getoond in de Acorn Store (GAMG Junior/Full Membership).
 * 🏅 = gouden medailles, 💙 = blauwe hartjes, 💗 = roze hartjes.
 */
const TIERS: Record<MembershipType, { days: number; dailyBlueHearts: number; totalBlueHearts: number; dailyMedals: number; totalMedals: number; activationHearts: number }> = {
  junior: { days: 7, dailyBlueHearts: 30, totalBlueHearts: 210, dailyMedals: 0, totalMedals: 0, activationHearts: 30 },
  full: { days: 30, dailyBlueHearts: 20, totalBlueHearts: 600, dailyMedals: 2, totalMedals: 60, activationHearts: 180 },
};

/** Junior = zilver, Full = goud — matcht de kaartkleur in de Acorn Store. */
const TIER_BADGE_COLORS: Record<MembershipType, { bg: string; border: string }> = {
  junior: { bg: '#D9DEE3', border: '#AEB6C0' },
  full: { bg: '#FFD166', border: '#E0A93A' },
};

const FULL_PERKS = {
  nl: ['Gratis ritjes met de Town Bus', 'Resident Requests & verkopen leveren 1,1× Goud op', '24u extra gratis Custom Town-tijd per week', 'Wekelijks de Membership 60%-off Pack kopen'],
  en: ['Free rides on the Town Bus', 'Resident Requests & selling grant 1.1× Gold', '24h extra free Custom Town time per week', 'Weekly access to the Membership 60% Off Pack'],
  es: ['Viajes gratis en el Town Bus', 'Resident Requests y ventas dan 1,1× Oro', '24h extra de tiempo gratis en Custom Town por semana', 'Acceso semanal al Pack de 60% de descuento en Membership'],
  pt: ['Viagens gratuitas no Town Bus', 'Resident Requests e vendas rendem 1,1× Ouro', '24h extras de tempo grátis na Custom Town por semana', 'Acesso semanal ao Pack de 60% de desconto na Membership'],
  fr: ['Trajets gratuits en Town Bus', 'Les Resident Requests et les ventes rapportent 1,1× Or', '24h de temps gratuit supplémentaire en Custom Town par semaine', "Accès hebdomadaire au Pack Membership à -60%"],
  de: ['Kostenlose Fahrten mit dem Town Bus', 'Resident Requests & Verkäufe geben 1,1× Gold', '24 Std. zusätzliche kostenlose Custom-Town-Zeit pro Woche', 'Wöchentlicher Zugang zum Membership-60%-Rabattpaket'],
} as const;

const STRINGS = {
  nl: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'Niet actief — tik om in te stellen',
    remaining: (d: number, h: number) => `Nog ${d}d ${h}u`,
    expired: 'Verlopen — vernieuw',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Junior Membership instellen' : 'Full Membership instellen'),
    dailyRewards: 'Dagelijks (max. 7d opsparen)',
    totalRewards: (d: number) => `${d}d totaal`,
    activationRewards: 'Bij activeren',
    perksLabel: 'Extra voordelen',
    activatedLabel: 'Geactiveerd op',
    day: 'Dag', month: 'Maand', year: 'Jaar', hour: 'Uur', minute: 'Min',
    timesPurchased: 'Aantal keer gekocht',
    nowButton: 'Nu',
    saveButton: 'Opslaan',
    removeButton: 'Verwijderen',
    cancelButton: 'Annuleren',
  },
  en: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'Not active — tap to set up',
    remaining: (d: number, h: number) => `${d}d ${h}h left`,
    expired: 'Expired — renew',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Set up Junior Membership' : 'Set up Full Membership'),
    dailyRewards: 'Daily (accumulates up to 7d)',
    totalRewards: (d: number) => `${d}d total`,
    activationRewards: 'On activation',
    perksLabel: 'Extra perks',
    activatedLabel: 'Activated on',
    day: 'Day', month: 'Month', year: 'Year', hour: 'Hour', minute: 'Min',
    timesPurchased: 'Times purchased',
    nowButton: 'Now',
    saveButton: 'Save',
    removeButton: 'Remove',
    cancelButton: 'Cancel',
  },
  es: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'No activo — toca para configurar',
    remaining: (d: number, h: number) => `${d}d ${h}h restantes`,
    expired: 'Caducado — renueva',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Configurar Junior Membership' : 'Configurar Full Membership'),
    dailyRewards: 'Diario (acumula hasta 7d)',
    totalRewards: (d: number) => `Total ${d}d`,
    activationRewards: 'Al activar',
    perksLabel: 'Ventajas extra',
    activatedLabel: 'Activado el',
    day: 'Día', month: 'Mes', year: 'Año', hour: 'Hora', minute: 'Min',
    timesPurchased: 'Veces comprado',
    nowButton: 'Ahora',
    saveButton: 'Guardar',
    removeButton: 'Eliminar',
    cancelButton: 'Cancelar',
  },
  pt: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'Não ativo — toque para configurar',
    remaining: (d: number, h: number) => `Faltam ${d}d ${h}h`,
    expired: 'Expirado — renove',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Configurar Junior Membership' : 'Configurar Full Membership'),
    dailyRewards: 'Diário (acumula até 7d)',
    totalRewards: (d: number) => `Total ${d}d`,
    activationRewards: 'Ao ativar',
    perksLabel: 'Benefícios extras',
    activatedLabel: 'Ativado em',
    day: 'Dia', month: 'Mês', year: 'Ano', hour: 'Hora', minute: 'Min',
    timesPurchased: 'Vezes comprado',
    nowButton: 'Agora',
    saveButton: 'Salvar',
    removeButton: 'Remover',
    cancelButton: 'Cancelar',
  },
  fr: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'Non actif — appuie pour configurer',
    remaining: (d: number, h: number) => `${d}j ${h}h restant`,
    expired: 'Expiré — renouvelle',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Configurer Junior Membership' : 'Configurer Full Membership'),
    dailyRewards: 'Quotidien (cumul jusqu\'à 7j)',
    totalRewards: (d: number) => `Total ${d}j`,
    activationRewards: "À l'activation",
    perksLabel: 'Avantages supplémentaires',
    activatedLabel: 'Activé le',
    day: 'Jour', month: 'Mois', year: 'Année', hour: 'Heure', minute: 'Min',
    timesPurchased: "Nombre d'achats",
    nowButton: 'Maintenant',
    saveButton: 'Enregistrer',
    removeButton: 'Supprimer',
    cancelButton: 'Annuler',
  },
  de: {
    juniorLabel: 'Junior Membership',
    fullLabel: 'Full Membership',
    notSetLabel: 'Nicht aktiv — zum Einrichten tippen',
    remaining: (d: number, h: number) => `Noch ${d}T ${h}Std`,
    expired: 'Abgelaufen — erneuern',
    modalTitle: (t: MembershipType) => (t === 'junior' ? 'Junior Membership einrichten' : 'Full Membership einrichten'),
    dailyRewards: 'Täglich (sammelt bis zu 7T)',
    totalRewards: (d: number) => `${d}T gesamt`,
    activationRewards: 'Bei Aktivierung',
    perksLabel: 'Zusätzliche Vorteile',
    activatedLabel: 'Aktiviert am',
    day: 'Tag', month: 'Monat', year: 'Jahr', hour: 'Std', minute: 'Min',
    timesPurchased: 'Anzahl gekauft',
    nowButton: 'Jetzt',
    saveButton: 'Speichern',
    removeButton: 'Entfernen',
    cancelButton: 'Abbrechen',
  },
} as const;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function clampCount(n: number): number {
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(n) || MIN_COUNT));
}

/**
 * Countdowns voor de twee in-game "Membership"-abonnementen (Acorn Store) — Junior
 * (zilver) en Full (goud) kunnen tegelijk actief zijn, dus elke tier heeft zijn eigen
 * onafhankelijke activatie-datum/countdown. De app kent de echte resterende tijd niet
 * (geen API) — de speler vult zelf in wanneer ze het geactiveerd hebben.
 */
export function MembershipCard() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [activatedAt, setActivatedAtState] = useState<Record<MembershipType, string | null>>({ junior: null, full: null });
  const [count, setCount] = useState<Record<MembershipType, number>>({ junior: 1, full: 1 });
  const [countDraft, setCountDraft] = useState(1);
  const [modalType, setModalType] = useState<MembershipType | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      try {
        const [storedJunior, storedFull, legacyType, legacyActivatedAt, storedCountJunior, storedCountFull] = await Promise.all([
          AsyncStorage.getItem(ACTIVATED_KEY.junior),
          AsyncStorage.getItem(ACTIVATED_KEY.full),
          AsyncStorage.getItem(LEGACY_TYPE_KEY),
          AsyncStorage.getItem(LEGACY_ACTIVATED_KEY),
          AsyncStorage.getItem(COUNT_KEY.junior),
          AsyncStorage.getItem(COUNT_KEY.full),
        ]);
        const next: Record<MembershipType, string | null> = { junior: storedJunior, full: storedFull };
        if ((legacyType === 'junior' || legacyType === 'full') && legacyActivatedAt && !next[legacyType]) {
          next[legacyType] = legacyActivatedAt;
          await AsyncStorage.setItem(ACTIVATED_KEY[legacyType], legacyActivatedAt);
        }
        if (legacyType || legacyActivatedAt) {
          await Promise.all([AsyncStorage.removeItem(LEGACY_TYPE_KEY), AsyncStorage.removeItem(LEGACY_ACTIVATED_KEY)]);
        }
        setActivatedAtState(next);
        setCount({
          junior: clampCount(Number(storedCountJunior) || 1),
          full: clampCount(Number(storedCountFull) || 1),
        });
      } catch {
        // opslag niet beschikbaar, blijft leeg
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const remainingMsFor = (type: MembershipType): number | null => {
    const iso = activatedAt[type];
    if (!iso) return null;
    const totalDays = TIERS[type].days * count[type];
    const expiresAt = new Date(iso).getTime() + totalDays * 24 * 3600000;
    return expiresAt - now;
  };

  /** Snelle "+" op het icoontje op het homescherm — stapelt er meteen 1 aankoop bij, zonder de modal te openen. */
  const incrementQuick = (type: MembershipType) => {
    const next = clampCount((count[type] ?? 1) + 1);
    setCount((prev) => ({ ...prev, [type]: next }));
    AsyncStorage.setItem(COUNT_KEY[type], String(next)).catch(() => {
      // opslaan mislukt
    });
  };

  const fillNow = () => {
    const d = new Date();
    setDay(pad2(d.getDate()));
    setMonth(pad2(d.getMonth() + 1));
    setYear(String(d.getFullYear()));
    setHour(pad2(d.getHours()));
    setMinute(pad2(d.getMinutes()));
  };

  const openModal = (type: MembershipType) => {
    const iso = activatedAt[type];
    if (iso) {
      const d = new Date(iso);
      setDay(pad2(d.getDate()));
      setMonth(pad2(d.getMonth() + 1));
      setYear(String(d.getFullYear()));
      setHour(pad2(d.getHours()));
      setMinute(pad2(d.getMinutes()));
    } else {
      fillNow();
    }
    setCountDraft(count[type] ?? 1);
    setModalType(type);
  };

  const save = async () => {
    if (!modalType) return;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    if (isNaN(parsed.getTime())) return;
    const iso = parsed.toISOString();
    const clampedCount = clampCount(countDraft);
    setActivatedAtState((prev) => ({ ...prev, [modalType]: iso }));
    setCount((prev) => ({ ...prev, [modalType]: clampedCount }));
    try {
      await Promise.all([
        AsyncStorage.setItem(ACTIVATED_KEY[modalType], iso),
        AsyncStorage.setItem(COUNT_KEY[modalType], String(clampedCount)),
      ]);
    } catch {
      // opslaan mislukt
    }
    setModalType(null);
  };

  const remove = async () => {
    if (!modalType) return;
    const type = modalType;
    setActivatedAtState((prev) => ({ ...prev, [type]: null }));
    setCount((prev) => ({ ...prev, [type]: 1 }));
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACTIVATED_KEY[type]),
        AsyncStorage.removeItem(COUNT_KEY[type]),
      ]);
    } catch {
      // verwijderen mislukt
    }
    setModalType(null);
  };

  const renderRow = (type: MembershipType) => {
    const remainingMs = remainingMsFor(type);
    const isSet = remainingMs !== null;
    const isExpired = isSet && remainingMs <= 0;
    const days = isSet ? Math.max(0, Math.floor(remainingMs / (24 * 3600000))) : 0;
    const hours = isSet ? Math.max(0, Math.floor((remainingMs % (24 * 3600000)) / 3600000)) : 0;
    const tierLabel = type === 'junior' ? s.juniorLabel : s.fullLabel;
    const stack = count[type] ?? 1;

    return (
      <Pressable key={type} style={styles.row} onPress={() => openModal(type)}>
        <View style={styles.badgeWrap}>
          <View style={[styles.membershipBadge, { backgroundColor: TIER_BADGE_COLORS[type].bg, borderColor: TIER_BADGE_COLORS[type].border }]}>
            <Text style={styles.membershipBadgeIcon}>🌰</Text>
          </View>
          <Pressable
            style={styles.plusBadge}
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              incrementQuick(type);
            }}
          >
            <Text style={styles.plusBadgeText}>+</Text>
          </Pressable>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.typeText}>
            {tierLabel}
            {stack > 1 ? ` ×${stack}` : ''}
          </Text>
          <Text style={[styles.remainingText, isExpired && styles.expiredText, !isSet && styles.notSetText]}>
            {isSet ? (isExpired ? s.expired : s.remaining(days, hours)) : s.notSetLabel}
          </Text>
        </View>
        {isSet && (
          <View style={styles.rewardsRow}>
            {TIERS[type].totalMedals > 0 && <Text style={styles.rewardText}>🏅{TIERS[type].totalMedals * stack}</Text>}
            <Text style={styles.rewardText}>💙{TIERS[type].totalBlueHearts * stack}</Text>
            <Text style={styles.rewardText}>💗{TIERS[type].activationHearts * stack}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const tier = modalType ? TIERS[modalType] : null;

  return (
    <>
      <View style={styles.rowsWrap}>
        {renderRow('junior')}
        <View style={styles.rowDivider} />
        {renderRow('full')}
      </View>

      <Modal visible={modalType !== null} transparent animationType="fade" onRequestClose={() => setModalType(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalType(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {modalType && tier && (
              <>
                <Text style={styles.modalTitle}>{s.modalTitle(modalType)}</Text>

                <View style={styles.countRow}>
                  <Text style={styles.countLabel}>{s.timesPurchased}</Text>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepperBtn} onPress={() => setCountDraft((c) => clampCount(c - 1))}>
                      <Text style={styles.stepperBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.stepperValue}>×{countDraft}</Text>
                    <Pressable style={styles.stepperBtn} onPress={() => setCountDraft((c) => clampCount(c + 1))}>
                      <Text style={styles.stepperBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.rewardsPreview}>
                  <Text style={styles.rewardsPreviewLabel}>{s.dailyRewards}</Text>
                  <Text style={styles.rewardsPreviewValue}>
                    {tier.dailyMedals > 0 ? `🏅${tier.dailyMedals} ` : ''}💙{tier.dailyBlueHearts}
                  </Text>
                  <Text style={styles.rewardsPreviewLabel}>{s.totalRewards(tier.days * countDraft)}</Text>
                  <Text style={styles.rewardsPreviewValue}>
                    {tier.totalMedals > 0 ? `🏅${tier.totalMedals * countDraft} ` : ''}💙{tier.totalBlueHearts * countDraft}
                  </Text>
                  <Text style={styles.rewardsPreviewLabel}>{s.activationRewards}</Text>
                  <Text style={styles.rewardsPreviewValue}>💗{tier.activationHearts * countDraft}</Text>
                  {modalType === 'full' && (
                    <>
                      <Text style={[styles.rewardsPreviewLabel, styles.perksLabel]}>{s.perksLabel}</Text>
                      {FULL_PERKS[language].map((perk) => (
                        <Text key={perk} style={styles.perkText}>• {perk}</Text>
                      ))}
                    </>
                  )}
                </View>

                <View style={styles.activatedHeaderRow}>
                  <Text style={styles.activatedLabel}>{s.activatedLabel}</Text>
                  <Pressable style={styles.nowButton} onPress={fillNow}>
                    <Text style={styles.nowButtonText}>{s.nowButton}</Text>
                  </Pressable>
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateField}>
                    <Text style={styles.dateFieldLabel}>{s.day}</Text>
                    <TextInput value={day} onChangeText={setDay} keyboardType="number-pad" maxLength={2} selectTextOnFocus style={styles.dateInput} />
                  </View>
                  <View style={styles.dateField}>
                    <Text style={styles.dateFieldLabel}>{s.month}</Text>
                    <TextInput value={month} onChangeText={setMonth} keyboardType="number-pad" maxLength={2} selectTextOnFocus style={styles.dateInput} />
                  </View>
                  <View style={[styles.dateField, styles.dateFieldWide]}>
                    <Text style={styles.dateFieldLabel}>{s.year}</Text>
                    <TextInput value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} selectTextOnFocus style={styles.dateInput} />
                  </View>
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateField}>
                    <Text style={styles.dateFieldLabel}>{s.hour}</Text>
                    <TextInput value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} selectTextOnFocus style={styles.dateInput} />
                  </View>
                  <View style={styles.dateField}>
                    <Text style={styles.dateFieldLabel}>{s.minute}</Text>
                    <TextInput value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} selectTextOnFocus style={styles.dateInput} />
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  {activatedAt[modalType] && (
                    <Pressable style={styles.removeButton} onPress={remove}>
                      <Text style={styles.removeButtonText}>{s.removeButton}</Text>
                    </Pressable>
                  )}
                  <Pressable style={styles.saveButton} onPress={save}>
                    <Text style={styles.saveButtonText}>{s.saveButton}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    rowsWrap: { gap: 8 },
    rowDivider: { height: StyleSheet.hairlineWidth, backgroundColor: c.line },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    badgeWrap: { position: 'relative' },
    membershipBadge: { width: 32, height: 24, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    membershipBadgeIcon: { fontSize: 13 },
    plusBadge: {
      position: 'absolute', right: -6, bottom: -6, width: 17, height: 17, borderRadius: 9,
      backgroundColor: c.coral, borderWidth: 1.5, borderColor: c.card, alignItems: 'center', justifyContent: 'center',
    },
    plusBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', lineHeight: 12 },
    infoSection: { flex: 1 },
    typeText: { fontSize: 13, fontWeight: '700', color: c.forest },
    remainingText: { fontSize: 12, color: c.forestSoft, marginTop: 1 },
    expiredText: { color: c.coralDark, fontWeight: '700' },
    rewardsRow: { flexDirection: 'row', gap: 8 },
    rewardText: { fontSize: 12, fontWeight: '600', color: c.forestSoft },
    notSetText: { color: c.coral, fontWeight: '700' },

    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    modalCard: { width: '100%', maxWidth: 340, maxHeight: '85%', backgroundColor: c.card, borderRadius: 18, padding: 16, gap: 10 },
    modalTitle: { fontSize: 15, fontWeight: '700', color: c.forest },
    countRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    countLabel: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    stepperBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    stepperBtnText: { fontSize: 16, fontWeight: '800', color: c.forest, lineHeight: 18 },
    stepperValue: { fontSize: 14, fontWeight: '700', color: c.forest, minWidth: 28, textAlign: 'center' },
    rewardsPreview: { backgroundColor: c.surfaceSoft, borderRadius: 12, padding: 10, gap: 2 },
    rewardsPreviewLabel: { fontSize: 10, fontWeight: '700', color: c.forestSoft, marginTop: 4 },
    rewardsPreviewValue: { fontSize: 13, fontWeight: '600', color: c.forest },
    perksLabel: { marginTop: 8 },
    perkText: { fontSize: 11, color: c.forestSoft, lineHeight: 15 },
    activatedHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    activatedLabel: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    dateRow: { flexDirection: 'row', gap: 8 },
    dateField: { flex: 1, gap: 3 },
    dateFieldWide: { flex: 1.6 },
    dateFieldLabel: { fontSize: 10, fontWeight: '700', color: c.forestSoft },
    dateInput: { borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 7, fontSize: 13, color: c.forest, backgroundColor: c.card, textAlign: 'center' },
    nowButton: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    nowButtonText: { fontSize: 11, fontWeight: '700', color: c.skyDark },
    actionsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
    removeButton: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line },
    removeButtonText: { fontSize: 13, fontWeight: '700', color: c.coralDark },
    saveButton: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: c.coral },
    saveButtonText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  });
}
