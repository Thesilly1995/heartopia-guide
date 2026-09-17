import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PinMap } from '@/components/heartopia/pin-map';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useMeteorSpots } from '@/data/meteor-spots';
import { useRainbowSpots } from '@/data/rainbow-spots';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:rainbow-meteor:vinkjes';

const ISLAND_MAP = require('@/assets/images/maps/island-map.jpg');
const WHALEFALL_MAP = require('@/assets/images/maps/whalefall-map.jpg');

const STRINGS = {
  nl: {
    title: 'Rainbow & Meteorenregen',
    subtitle: 'Boeketten & sterrenscherven per gebeurtenis',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteorenregen',
    emptyText: 'Niet actief op dit moment. Zodra dit weer gebeurt, komen de actuele locaties hier te staan.',
    resetProgress: 'Voortgang resetten',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      'In Whalefall Canyon staan tijdens een Rainbow-moment 4 boeketplekken, maar je kunt er maar 1 van de 4 pakken — welke dat is, verschilt per speler.',
    dorisNoteWhalefall:
      '👧 Doris staat bij Whalefall Canyon tijdens regen, regenboog én meteorenregen — bij haar kun je dan shoppen. Het exacte tijdsblok zie je op het homescherm bij "Weer deze week".',
    dorisNoteLand:
      '👧 Doris staat tijdens meteorenregen aan land (zie de pin hieronder) — bij haar kun je dan shoppen. Het exacte tijdsblok zie je op het homescherm bij "Weer deze week".',
    mailboxNote: '📮 Vergeet ook niet het boeket bij je eigen brievenbus — die staat er altijd, maar niet op de kaart (want dat is jouw eigen huisplek).',
    meteorLingerNote: '⛏️ De ertsstukken blijven hakbaar tot 24u na de start van de meteorenregen (dus tot dezelfde tijd de volgende dag) — deze kaart blijft dus nog een tijd bruikbaar nadat de meteorenregen zelf is afgelopen.',
  },
  en: {
    title: 'Rainbow & Meteor Shower',
    subtitle: 'Bouquets & star shards per event',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteor Shower',
    emptyText: 'Not active right now. Once this happens again, the current locations will appear here.',
    resetProgress: 'Reset progress',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      "During a Rainbow moment, Whalefall Canyon has 4 bouquet spots, but you can only grab 1 of the 4 — which one differs per player.",
    dorisNoteWhalefall:
      "👧 Doris is at Whalefall Canyon during rain, rainbow AND meteor showers — you can shop with her then. Check the homescreen's \"Weather this week\" for the exact time block.",
    dorisNoteLand:
      "👧 During meteor showers Doris is on land (see the pin below) — you can shop with her then. Check the homescreen's \"Weather this week\" for the exact time block.",
    mailboxNote: "📮 Don't forget the bouquet above your own mailbox either — it's always there, but not on the map (since that's your own house spot).",
    meteorLingerNote: '⛏️ Ore pieces stay mineable for 24h after the meteor shower starts (so until the same time the next day) — this map stays useful for a while even after the shower itself has ended.',
  },
  es: {
    title: 'Rainbow & Lluvia de Meteoros',
    subtitle: 'Ramos y fragmentos de estrella por evento',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Lluvia de Meteoros',
    emptyText: 'No está activo en este momento. En cuanto esto vuelva a pasar, las ubicaciones actuales aparecerán aquí.',
    resetProgress: 'Restablecer progreso',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      'Durante un momento Rainbow, Whalefall Canyon tiene 4 puntos de ramo, pero solo puedes conseguir 1 de los 4 — cuál depende de cada jugador.',
    dorisNoteWhalefall:
      '👧 Doris está en Whalefall Canyon durante la lluvia, el arcoíris Y la lluvia de meteoros — puedes comprarle en esos momentos. Consulta la pantalla de inicio en "El clima esta semana" para ver el horario exacto.',
    dorisNoteLand:
      '👧 Durante la lluvia de meteoros, Doris está en tierra (mira el pin abajo) — puedes comprarle en esos momentos. Consulta la pantalla de inicio en "El clima esta semana" para ver el horario exacto.',
    mailboxNote: '📮 Tampoco olvides el ramo junto a tu propio buzón — siempre está ahí, pero no aparece en el mapa (porque es tu propio punto de casa).',
    meteorLingerNote: '⛏️ Los trozos de mineral se pueden seguir picando hasta 24h después del inicio de la lluvia de meteoros (es decir, hasta la misma hora al día siguiente) — este mapa sigue siendo útil un buen rato después de que termine la lluvia de meteoros.',
  },
  pt: {
    title: 'Rainbow & Chuva de Meteoros',
    subtitle: 'Buquês e fragmentos de estrela por evento',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Chuva de Meteoros',
    emptyText: 'Não está ativo no momento. Assim que isso acontecer de novo, os locais atuais vão aparecer aqui.',
    resetProgress: 'Redefinir progresso',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      'Durante um momento Rainbow, Whalefall Canyon tem 4 pontos de buquê, mas você só pode pegar 1 dos 4 — qual deles varia de jogador para jogador.',
    dorisNoteWhalefall:
      '👧 A Doris fica em Whalefall Canyon durante chuva, arco-íris E chuva de meteoros — você pode comprar com ela nesses momentos. Veja o horário exato na tela inicial em "Clima desta semana".',
    dorisNoteLand:
      '👧 Durante a chuva de meteoros, a Doris fica em terra (veja o pin abaixo) — você pode comprar com ela nesse momento. Veja o horário exato na tela inicial em "Clima desta semana".',
    mailboxNote: '📮 Não esqueça também do buquê perto da sua própria caixa de correio — ele sempre está lá, mas não aparece no mapa (porque é o seu próprio ponto de casa).',
    meteorLingerNote: '⛏️ Os pedaços de minério continuam mineráveis até 24h depois do início da chuva de meteoros (ou seja, até o mesmo horário no dia seguinte) — este mapa continua útil por um tempo mesmo depois que a chuva de meteoros termina.',
  },
} as const;

export default function RainbowMeteorScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const rainbowSpots = useRainbowSpots();
  const meteorSpots = useMeteorSpots();
  const [tab, setTab] = useState<'rainbow' | 'meteor'>('rainbow');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setChecked(raw ? JSON.parse(raw) : {});
      } catch {
        setChecked({});
      }
    })();
  }, []);

  const toggle = async (num: number) => {
    const key = `${tab[0]}${num}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const resetAll = async () => {
    setChecked({});
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    } catch {
      // opslaan mislukt
    }
  };

  const spots = tab === 'rainbow' ? rainbowSpots : meteorSpots;
  const prefix = tab[0];
  const prefixedChecked = Object.fromEntries(
    Object.entries(checked)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [Number(k.slice(1)), v])
  );

  // Whalefall Canyon (onderwater) komt alleen voor bij Rainbow — meteorenregen is altijd aan land.
  const islandSpots = tab === 'rainbow' ? spots.filter((spot) => !spot.underwater) : spots;
  const whalefallSpots = tab === 'rainbow' ? spots.filter((spot) => spot.underwater) : [];
  const pinColor = tab === 'rainbow' ? '#B78CD8' : colors.skyDark;
  const defaultIcon = tab === 'rainbow' ? '🌈' : '☄️';
  const withIcon = (list: typeof spots) => list.map((spot) => ({ ...spot, icon: spot.isDoris ? '👧' : defaultIcon }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#B78CD8', '#6EC6E8']}
        icon="🌈☄️"
        title={s.title}
        subtitle={s.subtitle}
        tabs={[
          { key: 'rainbow', label: s.rainbowTab },
          { key: 'meteor', label: s.meteorTab },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'rainbow' | 'meteor')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'rainbow' && <DisclaimerBox text={s.mailboxNote} />}
        {tab === 'meteor' && spots.length > 0 && <DisclaimerBox text={s.meteorLingerNote} />}
        {spots.some((spot) => spot.isDoris) && (
          <DisclaimerBox text={tab === 'rainbow' ? s.dorisNoteWhalefall : s.dorisNoteLand} />
        )}

        <PinMap
          source={ISLAND_MAP}
          aspectRatio={825 / 799}
          pins={withIcon(islandSpots)}
          checked={prefixedChecked}
          onToggle={toggle}
          pinColor={pinColor}
          emptyText={whalefallSpots.length > 0 ? undefined : s.emptyText}
        />

        {whalefallSpots.length > 0 && (
          <>
            <Text style={styles.mapLabel}>{s.whalefallLabel}</Text>
            {tab === 'rainbow' && <DisclaimerBox text={s.whalefallDisclaimer} />}
            <PinMap
              source={WHALEFALL_MAP}
              aspectRatio={1197 / 880}
              pins={withIcon(whalefallSpots)}
              checked={prefixedChecked}
              onToggle={toggle}
              pinColor={pinColor}
            />
          </>
        )}

        {spots.length > 0 && (
          <Pressable style={styles.resetButton} onPress={resetAll}>
            <Text style={styles.resetButtonText}>{s.resetProgress}</Text>
          </Pressable>
        )}

        {spots.map((spot) => {
          const isChecked = prefixedChecked[spot.num];
          const underwater = spot.underwater;
          return (
            <Pressable key={spot.num} style={styles.row} onPress={() => toggle(spot.num)}>
              <View style={[styles.numBadge, isChecked && styles.numBadgeActive]}>
                <Text style={[styles.numText, isChecked && styles.numTextActive]}>{isChecked ? '✓' : spot.num}</Text>
              </View>
              <Text style={[styles.desc, isChecked && styles.descChecked]}>
                {underwater ? '🌊 ' : ''}
                {spot.description}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 12 },
    resetButton: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    resetButtonText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    mapLabel: { fontSize: 13, fontWeight: '700', color: c.forest, marginTop: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12 },
    numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    numBadgeActive: { backgroundColor: c.yellow },
    numText: { fontSize: 12, fontWeight: '700', color: c.skyDark },
    numTextActive: { color: c.forest },
    desc: { flex: 1, fontSize: 12, color: c.forest },
    descChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
