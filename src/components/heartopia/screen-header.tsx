import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface ScreenHeaderTab {
  key: string;
  label: string;
}

export function ScreenHeader({
  gradient,
  icon,
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
}: {
  gradient: [string, string];
  icon: string;
  title: string;
  subtitle?: string;
  tabs?: ScreenHeaderTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
}) {
  return (
    <LinearGradient colors={gradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        hitSlop={8}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>‹ Terug</Text>
      </Pressable>

      <Text style={styles.title}>
        {icon} {title}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {tabs && (
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onTabChange?.(tab.key)}
                style={[styles.tab, active && styles.tabActive]}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 2 },
  tabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  tabTextActive: { color: '#2B4739' },
});
