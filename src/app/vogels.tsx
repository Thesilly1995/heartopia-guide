import { eventsTabLabel, HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useBirdEventGroups, useBirds } from '@/data/birds';
import { useLanguage } from '@/hooks/use-language';

const ALL_TAB_LABEL = { nl: 'Alle Vogels', en: 'All Birds', es: 'Todos', pt: 'Todos', fr: 'Tous', de: 'Alle' } as const;

export default function VogelsScreen() {
  const birds = useBirds();
  const eventGroups = useBirdEventGroups();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Vogels', en: 'Birds', es: 'Aves', pt: 'Aves', fr: 'Oiseaux', de: 'Vögel' }[language]}
      icon="🐦"
      gradient={[COLORS.sky, COLORS.forestSoft]}
      storageKey="vogels"
      subTabs={[
        { key: 'all', label: ALL_TAB_LABEL[language], items: birds },
        { key: 'events', label: eventsTabLabel(language), eventGroups },
      ]}
    />
  );
}
