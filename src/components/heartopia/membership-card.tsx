import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const TYPE_KEY = 'heartopia:membership:type';
const ACTIVATED_KEY = 'heartopia:membership:geactiveerd';

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
    notSetLabel: '+ Membership toevoegen',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `Nog ${d}d ${h}u`,
    expired: 'Verlopen — vernieuw je Membership',
    modalTitle: 'Membership instellen',
    typeJunior: 'Junior (7d)',
    typeFull: 'Full (30d)',
    dailyRewards: 'Dagelijks (max. 7d opsparen)',
    totalRewards: (d: number) => `${d}d totaal`,
    activationRewards: 'Bij activeren',
    perksLabel: 'Extra voordelen',
    activatedLabel: 'Geactiveerd op',
    day: 'Dag', month: 'Maand', year: 'Jaar', hour: 'Uur', minute: 'Min',
    nowButton: 'Nu',
    saveButton: 'Opslaan',
    removeButton: 'Verwijderen',
    cancelButton: 'Annuleren',
  },
  en: {
    notSetLabel: '+ Add Membership',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `${d}d ${h}h left`,
    expired: 'Expired — renew your Membership',
    modalTitle: 'Set up Membership',
    typeJunior: 'Junior (7d)',
    typeFull: 'Full (30d)',
    dailyRewards: 'Daily (accumulates up to 7d)',
    totalRewards: (d: number) => `${d}d total`,
    activationRewards: 'On activation',
    perksLabel: 'Extra perks',
    activatedLabel: 'Activated on',
    day: 'Day', month: 'Month', year: 'Year', hour: 'Hour', minute: 'Min',
    nowButton: 'Now',
    saveButton: 'Save',
    removeButton: 'Remove',
    cancelButton: 'Cancel',
  },
  es: {
    notSetLabel: '+ Añadir Membership',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `${d}d ${h}h restantes`,
    expired: 'Caducado — renueva tu Membership',
    modalTitle: 'Configurar Membership',
    typeJunior: 'Junior (7d)',
    typeFull: 'Full (30d)',
    dailyRewards: 'Diario (acumula hasta 7d)',
    totalRewards: (d: number) => `Total ${d}d`,
    activationRewards: 'Al activar',
    perksLabel: 'Ventajas extra',
    activatedLabel: 'Activado el',
    day: 'Día', month: 'Mes', year: 'Año', hour: 'Hora', minute: 'Min',
    nowButton: 'Ahora',
    saveButton: 'Guardar',
    removeButton: 'Eliminar',
    cancelButton: 'Cancelar',
  },
  pt: {
    notSetLabel: '+ Adicionar Membership',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `Faltam ${d}d ${h}h`,
    expired: 'Expirado — renove sua Membership',
    modalTitle: 'Configurar Membership',
    typeJunior: 'Junior (7d)',
    typeFull: 'Full (30d)',
    dailyRewards: 'Diário (acumula até 7d)',
    totalRewards: (d: number) => `Total ${d}d`,
    activationRewards: 'Ao ativar',
    perksLabel: 'Benefícios extras',
    activatedLabel: 'Ativado em',
    day: 'Dia', month: 'Mês', year: 'Ano', hour: 'Hora', minute: 'Min',
    nowButton: 'Agora',
    saveButton: 'Salvar',
    removeButton: 'Remover',
    cancelButton: 'Cancelar',
  },
  fr: {
    notSetLabel: '+ Ajouter Membership',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `${d}j ${h}h restant`,
    expired: 'Expiré — renouvelle ton Membership',
    modalTitle: 'Configurer Membership',
    typeJunior: 'Junior (7j)',
    typeFull: 'Full (30j)',
    dailyRewards: 'Quotidien (cumul jusqu\'à 7j)',
    totalRewards: (d: number) => `Total ${d}j`,
    activationRewards: "À l'activation",
    perksLabel: 'Avantages supplémentaires',
    activatedLabel: 'Activé le',
    day: 'Jour', month: 'Mois', year: 'Année', hour: 'Heure', minute: 'Min',
    nowButton: 'Maintenant',
    saveButton: 'Enregistrer',
    removeButton: 'Supprimer',
    cancelButton: 'Annuler',
  },
  de: {
    notSetLabel: '+ Membership hinzufügen',
    typeLabel: (t: MembershipType) => (t === 'junior' ? 'Junior Membership' : 'Full Membership'),
    remaining: (d: number, h: number) => `Noch ${d}T ${h}Std`,
    expired: 'Abgelaufen — erneuere deine Membership',
    modalTitle: 'Membership einrichten',
    typeJunior: 'Junior (7T)',
    typeFull: 'Full (30T)',
    dailyRewards: 'Täglich (sammelt bis zu 7T)',
    totalRewards: (d: number) => `${d}T gesamt`,
    activationRewards: 'Bei Aktivierung',
    perksLabel: 'Zusätzliche Vorteile',
    activatedLabel: 'Aktiviert am',
    day: 'Tag', month: 'Monat', year: 'Jahr', hour: 'Std', minute: 'Min',
    nowButton: 'Jetzt',
    saveButton: 'Speichern',
    removeButton: 'Entfernen',
    cancelButton: 'Abbrechen',
  },
} as const;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Countdown voor het in-game "Membership"-abonnement (Acorn Store). De app kent de
 * echte resterende tijd niet (geen API) — de speler vult zelf in wanneer ze het
 * geactiveerd hebben, wij rekenen daarna zelf de vervaldatum/countdown uit.
 */
export function MembershipCard() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [type, setType] = useState<MembershipType | null>(null);
  const [activatedAt, setActivatedAt] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftType, setDraftType] = useState<MembershipType>('full');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    (async () => {
      try {
        const [storedType, storedActivatedAt] = await Promise.all([
          AsyncStorage.getItem(TYPE_KEY),
          AsyncStorage.getItem(ACTIVATED_KEY),
        ]);
        if (storedType === 'junior' || storedType === 'full') setType(storedType);
        if (storedActivatedAt) setActivatedAt(storedActivatedAt);
      } catch {
        // opslag niet beschikbaar, blijft leeg
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = useMemo(() => {
    if (!type || !activatedAt) return null;
    const expiresAt = new Date(activatedAt).getTime() + TIERS[type].days * 24 * 3600000;
    return expiresAt - now;
  }, [type, activatedAt, now]);

  const fillNow = () => {
    const d = new Date();
    setDay(pad2(d.getDate()));
    setMonth(pad2(d.getMonth() + 1));
    setYear(String(d.getFullYear()));
    setHour(pad2(d.getHours()));
    setMinute(pad2(d.getMinutes()));
  };

  const openModal = () => {
    setDraftType(type ?? 'full');
    if (activatedAt) {
      const d = new Date(activatedAt);
      setDay(pad2(d.getDate()));
      setMonth(pad2(d.getMonth() + 1));
      setYear(String(d.getFullYear()));
      setHour(pad2(d.getHours()));
      setMinute(pad2(d.getMinutes()));
    } else {
      fillNow();
    }
    setModalOpen(true);
  };

  const save = async () => {
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    if (isNaN(parsed.getTime())) return;
    const iso = parsed.toISOString();
    setType(draftType);
    setActivatedAt(iso);
    try {
      await Promise.all([AsyncStorage.setItem(TYPE_KEY, draftType), AsyncStorage.setItem(ACTIVATED_KEY, iso)]);
    } catch {
      // opslaan mislukt
    }
    setModalOpen(false);
  };

  const remove = async () => {
    setType(null);
    setActivatedAt(null);
    try {
      await Promise.all([AsyncStorage.removeItem(TYPE_KEY), AsyncStorage.removeItem(ACTIVATED_KEY)]);
    } catch {
      // verwijderen mislukt
    }
    setModalOpen(false);
  };

  const tier = TIERS[draftType];
  const days = remainingMs !== null ? Math.max(0, Math.floor(remainingMs / (24 * 3600000))) : 0;
  const hours = remainingMs !== null ? Math.max(0, Math.floor((remainingMs % (24 * 3600000)) / 3600000)) : 0;
  const isExpired = remainingMs !== null && remainingMs <= 0;

  return (
    <>
      <Pressable style={styles.row} onPress={openModal}>
        {type && activatedAt ? (
          <>
            <View style={[styles.membershipBadge, { backgroundColor: TIER_BADGE_COLORS[type].bg, borderColor: TIER_BADGE_COLORS[type].border }]}>
              <Text style={styles.membershipBadgeIcon}>🌰</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.typeText}>{s.typeLabel(type)}</Text>
              <Text style={[styles.remainingText, isExpired && styles.expiredText]}>
                {isExpired ? s.expired : s.remaining(days, hours)}
              </Text>
            </View>
            <View style={styles.rewardsRow}>
              {TIERS[type].totalMedals > 0 && <Text style={styles.rewardText}>🏅{TIERS[type].totalMedals}</Text>}
              <Text style={styles.rewardText}>💙{TIERS[type].totalBlueHearts}</Text>
              <Text style={styles.rewardText}>💗{TIERS[type].activationHearts}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.notSetText}>{s.notSetLabel}</Text>
        )}
      </Pressable>

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalOpen(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{s.modalTitle}</Text>

            <View style={styles.typeToggleRow}>
              <Pressable style={[styles.typeOption, draftType === 'junior' && styles.typeOptionActive]} onPress={() => setDraftType('junior')}>
                <View style={[styles.membershipBadge, { backgroundColor: TIER_BADGE_COLORS.junior.bg, borderColor: TIER_BADGE_COLORS.junior.border }]}>
                  <Text style={styles.membershipBadgeIcon}>🌰</Text>
                </View>
                <Text style={[styles.typeOptionText, draftType === 'junior' && styles.typeOptionTextActive]}>{s.typeJunior}</Text>
              </Pressable>
              <Pressable style={[styles.typeOption, draftType === 'full' && styles.typeOptionActive]} onPress={() => setDraftType('full')}>
                <View style={[styles.membershipBadge, { backgroundColor: TIER_BADGE_COLORS.full.bg, borderColor: TIER_BADGE_COLORS.full.border }]}>
                  <Text style={styles.membershipBadgeIcon}>🌰</Text>
                </View>
                <Text style={[styles.typeOptionText, draftType === 'full' && styles.typeOptionTextActive]}>{s.typeFull}</Text>
              </Pressable>
            </View>

            <View style={styles.rewardsPreview}>
              <Text style={styles.rewardsPreviewLabel}>{s.dailyRewards}</Text>
              <Text style={styles.rewardsPreviewValue}>
                {tier.dailyMedals > 0 ? `🏅${tier.dailyMedals} ` : ''}💙{tier.dailyBlueHearts}
              </Text>
              <Text style={styles.rewardsPreviewLabel}>{s.totalRewards(tier.days)}</Text>
              <Text style={styles.rewardsPreviewValue}>
                {tier.totalMedals > 0 ? `🏅${tier.totalMedals} ` : ''}💙{tier.totalBlueHearts}
              </Text>
              <Text style={styles.rewardsPreviewLabel}>{s.activationRewards}</Text>
              <Text style={styles.rewardsPreviewValue}>💗{tier.activationHearts}</Text>
              {draftType === 'full' && (
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
                <TextInput value={day} onChangeText={setDay} keyboardType="number-pad" maxLength={2} style={styles.dateInput} />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateFieldLabel}>{s.month}</Text>
                <TextInput value={month} onChangeText={setMonth} keyboardType="number-pad" maxLength={2} style={styles.dateInput} />
              </View>
              <View style={[styles.dateField, styles.dateFieldWide]}>
                <Text style={styles.dateFieldLabel}>{s.year}</Text>
                <TextInput value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} style={styles.dateInput} />
              </View>
            </View>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.dateFieldLabel}>{s.hour}</Text>
                <TextInput value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} style={styles.dateInput} />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateFieldLabel}>{s.minute}</Text>
                <TextInput value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} style={styles.dateInput} />
              </View>
            </View>

            <View style={styles.actionsRow}>
              {type && (
                <Pressable style={styles.removeButton} onPress={remove}>
                  <Text style={styles.removeButtonText}>{s.removeButton}</Text>
                </Pressable>
              )}
              <Pressable style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>{s.saveButton}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    membershipBadge: { width: 32, height: 24, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    membershipBadgeIcon: { fontSize: 13 },
    infoSection: { flex: 1 },
    typeText: { fontSize: 13, fontWeight: '700', color: c.forest },
    remainingText: { fontSize: 12, color: c.forestSoft, marginTop: 1 },
    expiredText: { color: c.coralDark, fontWeight: '700' },
    rewardsRow: { flexDirection: 'row', gap: 8 },
    rewardText: { fontSize: 12, fontWeight: '600', color: c.forestSoft },
    notSetText: { fontSize: 13, fontWeight: '700', color: c.coral },

    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    modalCard: { width: '100%', maxWidth: 340, maxHeight: '85%', backgroundColor: c.card, borderRadius: 18, padding: 16, gap: 10 },
    modalTitle: { fontSize: 15, fontWeight: '700', color: c.forest },
    typeToggleRow: { flexDirection: 'row', gap: 8 },
    typeOption: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', gap: 6 },
    typeOptionActive: { backgroundColor: c.coral, borderColor: c.coral },
    typeOptionText: { fontSize: 13, fontWeight: '700', color: c.forest },
    typeOptionTextActive: { color: '#FFFFFF' },
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
