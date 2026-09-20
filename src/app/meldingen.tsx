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
    backupTitle: '☁️ Cloud save-herinnering',
    backupText: 'Wekelijkse melding om je voortgang te back-uppen.',
    permissionNote: 'De eerste keer dat je een categorie aanzet, vraagt je toestel om toestemming voor meldingen.',
    errorPrefix: 'Registreren mislukt:',
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
    backupTitle: '☁️ Cloud save reminder',
    backupText: 'Weekly reminder to back up your progress.',
    permissionNote: 'The first time you turn on a category, your device will ask for notification permission.',
    errorPrefix: 'Registration failed:',
  },
  es: {
    title: 'Notificaciones',
    subtitle: 'Elige sobre qué quieres recibir una notificación push',
    updateTitle: '🔄 Nueva versión disponible',
    updateText:
      'Funciona automáticamente y para todos, no requiere ajuste: en cuanto abras la app y haya una nueva actualización, aparecerá una ventana emergente con un botón para actualizar al instante.',
    lockedText:
      'Las notificaciones push para Rainbow/Lluvia de meteoros, nuevos eventos y nuevos códigos son una función Premium.',
    rainbowMeteorTitle: '🌈☄️ Rainbow y Lluvia de meteoros',
    rainbowMeteorText: 'Notificación en cuanto empiece un momento Rainbow o una lluvia de meteoros.',
    eventTitle: '🎉 Nuevo evento',
    eventText: 'Notificación en cuanto comience un nuevo evento.',
    codesTitle: '🎁 Nuevo código',
    codesText: 'Notificación en cuanto se añada un nuevo código de regalo.',
    backupTitle: '☁️ Recordatorio de guardado en la nube',
    backupText: 'Recordatorio semanal para hacer una copia de seguridad de tu progreso.',
    permissionNote: 'La primera vez que actives una categoría, tu dispositivo te pedirá permiso para las notificaciones.',
    errorPrefix: 'Error al registrar:',
  },
  pt: {
    title: 'Notificações',
    subtitle: 'Escolha sobre o que você quer receber uma notificação push',
    updateTitle: '🔄 Nova versão disponível',
    updateText:
      'Funciona automaticamente para todos, sem precisar configurar: assim que você abrir o app e houver uma atualização nova, aparece um pop-up com um botão para atualizar na hora.',
    lockedText:
      'Notificações push para Rainbow/Chuva de Meteoros, novos eventos e novos códigos são um recurso Premium.',
    rainbowMeteorTitle: '🌈☄️ Rainbow e Chuva de Meteoros',
    rainbowMeteorText: 'Receba um aviso assim que um momento Rainbow ou uma chuva de meteoros começar.',
    eventTitle: '🎉 Novo evento',
    eventText: 'Receba um aviso assim que um novo evento começar.',
    codesTitle: '🎁 Novo código',
    codesText: 'Receba um aviso assim que um novo código de presente for adicionado.',
    backupTitle: '☁️ Lembrete de save na nuvem',
    backupText: 'Lembrete semanal para fazer backup do seu progresso.',
    permissionNote: 'Na primeira vez que você ativar uma categoria, seu aparelho vai pedir permissão para notificações.',
    errorPrefix: 'Falha no registro:',
  },
  fr: {
    title: 'Notifications',
    subtitle: 'Choisis les sujets pour lesquels tu veux une notification push',
    updateTitle: '🔄 Nouvelle version disponible',
    updateText:
      "Fonctionne automatiquement pour tout le monde, aucun réglage nécessaire : dès que tu ouvres l'app et qu'une nouvelle mise à jour est disponible, une fenêtre apparaît avec un bouton pour mettre à jour immédiatement.",
    lockedText:
      'Les notifications push pour Rainbow/Pluie de météores, les nouveaux événements et les nouveaux codes sont une fonctionnalité Premium.',
    rainbowMeteorTitle: '🌈☄️ Rainbow & Pluie de météores',
    rainbowMeteorText: 'Notification dès qu\'un moment Rainbow ou une pluie de météores commence.',
    eventTitle: '🎉 Nouvel événement',
    eventText: 'Notification dès qu\'un nouvel événement commence.',
    codesTitle: '🎁 Nouveau code',
    codesText: "Notification dès qu'un nouveau code cadeau est ajouté.",
    backupTitle: '☁️ Rappel de sauvegarde cloud',
    backupText: 'Rappel hebdomadaire pour sauvegarder ta progression.',
    permissionNote: "La première fois que tu actives une catégorie, ton appareil te demandera l'autorisation pour les notifications.",
    errorPrefix: "Échec de l'enregistrement :",
  },
} as const;

export default function MeldingenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { premium } = usePremium();
  const { error } = useNotifications();

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
            {error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>
                  {s.errorPrefix} {error}
                </Text>
              </View>
            )}
            <ToggleRow titleKey="rainbowMeteorTitle" textKey="rainbowMeteorText" category="rainbow_meteor" s={s} styles={styles} />
            <ToggleRow titleKey="eventTitle" textKey="eventText" category="event" s={s} styles={styles} />
            <ToggleRow titleKey="codesTitle" textKey="codesText" category="codes" s={s} styles={styles} />
            <ToggleRow titleKey="backupTitle" textKey="backupText" category="cloud_backup_reminder" s={s} styles={styles} />
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
  titleKey: 'rainbowMeteorTitle' | 'eventTitle' | 'codesTitle' | 'backupTitle';
  textKey: 'rainbowMeteorText' | 'eventText' | 'codesText' | 'backupText';
  category: NotificationCategory;
  s: (typeof STRINGS)[keyof typeof STRINGS];
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
    errorCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.coralDark, padding: 14 },
    errorText: { fontSize: 12, color: c.coralDark, lineHeight: 17 },
  });
}
