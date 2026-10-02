import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const PHOTO_KEY = 'heartopia:profiel:foto';
const NAME_KEY = 'heartopia:profiel:naam';
const UID_KEY = 'heartopia:profiel:uid';

const STRINGS = {
  nl: { nameLabel: 'Naam', namePlaceholder: 'Naam invoeren', uidLabel: 'UID', uidPlaceholder: 'UID invoeren', copy: 'Kopiëren', copied: 'Gekopieerd!' },
  en: { nameLabel: 'Name', namePlaceholder: 'Enter name', uidLabel: 'UID', uidPlaceholder: 'Enter UID', copy: 'Copy', copied: 'Copied!' },
  es: { nameLabel: 'Nombre', namePlaceholder: 'Introduce el nombre', uidLabel: 'UID', uidPlaceholder: 'Introduce el UID', copy: 'Copiar', copied: '¡Copiado!' },
  pt: { nameLabel: 'Nome', namePlaceholder: 'Digite o nome', uidLabel: 'UID', uidPlaceholder: 'Digite o UID', copy: 'Copiar', copied: 'Copiado!' },
  fr: { nameLabel: 'Nom', namePlaceholder: 'Saisis le nom', uidLabel: 'UID', uidPlaceholder: "Saisis l'UID", copy: 'Copier', copied: 'Copié !' },
  de: { nameLabel: 'Name', namePlaceholder: 'Name eingeben', uidLabel: 'UID', uidPlaceholder: 'UID eingeben', copy: 'Kopieren', copied: 'Kopiert!' },
} as const;

/** Puur lokaal (op dit toestel) — geen account/backend, alleen handig om je naam/UID makkelijk te delen. */
export function ProfileCard() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [photo, savedName, savedUid] = await Promise.all([
          AsyncStorage.getItem(PHOTO_KEY),
          AsyncStorage.getItem(NAME_KEY),
          AsyncStorage.getItem(UID_KEY),
        ]);
        if (photo) setPhotoUri(photo);
        if (savedName) setName(savedName);
        if (savedUid) setUid(savedUid);
      } catch {
        // opslag niet beschikbaar, blijft leeg
      }
    })();
  }, []);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || result.assets.length === 0) return;
    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    try {
      await AsyncStorage.setItem(PHOTO_KEY, uri);
    } catch {
      // opslaan mislukt
    }
  };

  const saveName = async (value: string) => {
    setName(value);
    try {
      await AsyncStorage.setItem(NAME_KEY, value);
    } catch {
      // opslaan mislukt
    }
  };

  const saveUid = async (value: string) => {
    setUid(value);
    try {
      await AsyncStorage.setItem(UID_KEY, value);
    } catch {
      // opslaan mislukt
    }
  };

  const copyUid = async () => {
    if (!uid.trim()) return;
    await Clipboard.setStringAsync(uid.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.row}>
      <Pressable style={styles.avatarButton} onPress={pickPhoto} hitSlop={4}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>👤</Text>
          </View>
        )}
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarBadgeText}>📷</Text>
        </View>
      </Pressable>

      <View style={styles.infoSection}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel} numberOfLines={1}>{s.nameLabel}</Text>
          <TextInput
            value={name}
            onChangeText={saveName}
            placeholder={s.namePlaceholder}
            placeholderTextColor={colors.forestSoft}
            style={styles.fieldInput}
          />
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel} numberOfLines={1}>{s.uidLabel}</Text>
          <TextInput
            value={uid}
            onChangeText={saveUid}
            placeholder={s.uidPlaceholder}
            placeholderTextColor={colors.forestSoft}
            style={styles.fieldInput}
            autoCapitalize="none"
          />
          <Pressable style={[styles.copyButton, copied && styles.copyButtonActive]} onPress={copyUid}>
            <Text style={[styles.copyText, copied && styles.copyTextActive]}>{copied ? s.copied : s.copy}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarButton: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    avatarPlaceholder: { backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    avatarPlaceholderText: { fontSize: 22 },
    avatarBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: c.coral,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.bg,
    },
    avatarBadgeText: { fontSize: 10 },
    infoSection: { flex: 1, gap: 6 },
    fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    fieldLabel: { fontSize: 11, fontWeight: '700', color: c.forestSoft, width: 48, flexShrink: 0 },
    fieldInput: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, color: c.forest, backgroundColor: c.surfaceSoft },
    copyButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: c.chipBg },
    copyButtonActive: { backgroundColor: c.yellow },
    copyText: { fontSize: 11, fontWeight: '700', color: c.skyDark },
    copyTextActive: { color: c.forest },
  });
}
