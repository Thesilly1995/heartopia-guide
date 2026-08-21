import { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PremiumLockedView } from '@/components/heartopia/premium-locked';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';
import { useNotifications } from '@/hooks/use-notifications';
import { usePremium } from '@/hooks/use-premium';
import { NotificationCategory } from '@/lib/push-notifications';

const STRINGS = {
  nl: {
    title: 'Meldingen',
    subtitle: 'Kies waarover je een pushmelding wil krijgen',
    updateTitle: '🔄 Nieuwe versie beschikbaar',
    updateText:
      'Werkt automatisch en voor iedereen, geen instelling nodig: zodra je de app opent en er een nieuwe update is, verschijnt er een pop-up met een knop om meteen bij te werken.',
    lockedText:
      'Pushmeldingen voor Rainbow/Meteorenregen, nieuwe events en nieuwe codes zijn een Premium-functie.',
    rainbowMeteorTitle: '🌈☄️ Rainbow & Meteorenregen',
    rainbowMeteorText: 'Melding zodra een Rainbow-moment of meteorenregen begint.',
    eventTitle: '🎉 Nieuw event',
    eventText: 'Melding zodra er een nieuw event van start gaat.',
    codesTitle: '🎁 Nieuwe code',
    codesText: 'Melding zodra er een nieuwe gift code is toegevoegd.',
    permissionNote: 'De eerste keer dat je een categorie aanzet, vraagt je toestel om toestemming voor meldingen.',
  },
  en: {
    title: 'Notifications',
    subtitle: 'Choose what you want a push notification for',
    updateTitle: '🔄 New version available',
    updateText:
      'Works automatically for everyone, no setting needed: as soon as you open the app and there is a new update, a pop-up appears with a button to update right away.',
    lockedText: 'Push notifications for Rainbow/Meteor Shower, new events and new codes are a Premium feature.',
    rainbowMeteorTitle: '🌈☄️ Rainbow & Meteor Shower',
    rainbowMeteorText: 'Get notified as soon as a Rainbow moment or meteor shower starts.',
    eventTitle: '🎉 New event',
    eventText: 'Get notified as soon as a new event starts.',
    codesTitle: '🎁 New code',
    codesText: 'Get notified as soon as a new gift code is added.',
    permissionNote: 'The first time you turn on a category, your device will ask for notification permission.',
  },
} as const;

export default function MeldingenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { premium } = usePremium();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[colors.coral, colors.yellow]} icon="🔔" title={s.title} subtitle={s.subtitle} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.updateTitle}</Text>
          <Text style={styles.cardText}>{s.updateText}</Text>
        </View>

        {premium ? (
          <>
            <DisclaimerBox text={s.permissionNote} />
            <ToggleRow titleKey="rainbowMeteorTitle" textKey="rainbowMeteorText" category="rainbow_meteor" s={s} styles={styles} />
            <ToggleRow titleKey="eventTitle" textKey="eventText" category="event" s={s} styles={styles} />
            <ToggleRow titleKey="codesTitle" textKey="codesText" category="codes" s={s} styles={styles} />
          </>
        ) : (
          <PremiumLockedView text={s.lockedText} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  titleKey,
  textKey,
  category,
  s,
  styles,
}: {
  titleKey: 'rainbowMeteorTitle' | 'eventTitle' | 'codesTitle';
  textKey: 'rainbowMeteorText' | 'eventText' | 'codesText';
  category: NotificationCategory;
  s: (typeof STRINGS)['nl'] | (typeof STRINGS)['en'];
  styles: ReturnType<typeof makeStyles>;
}) {
  const colors = useHeartopiaColors();
  const { enabled, loading, enableCategory, disableCategory } = useNotifications();
  const isOn = enabled[category];

  return (
    <View style={styles.card}>
      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <Text style={styles.cardTitle}>{s[titleKey]}</Text>
          <Text style={styles.cardText}>{s[textKey]}</Text>
        </View>
        <Switch
          value={isOn}
          disabled={loading}
          onValueChange={(next) => (next ? enableCategory(category) : disableCategory(category))}
          trackColor={{ false: colors.line, true: colors.coral }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 10, paddingBottom: 40 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, gap: 4 },
    cardTitle: { fontSize: 14, fontWeight: '700', color: c.forest },
    cardText: { fontSize: 12, color: c.forestSoft, lineHeight: 17 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    toggleText: { flex: 1, gap: 4 },
  });
}
