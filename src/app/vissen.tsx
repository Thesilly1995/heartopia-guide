import { eventsTabLabel, HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useFish, useFishEventGroups } from '@/data/fish';
import { useLanguage } from '@/hooks/use-language';

const ALL_TAB_LABEL = { nl: 'Alle Vissen', en: 'All Fish', es: 'Todos', pt: 'Todos', fr: 'Tous', de: 'Alle' } as const;

export default function VissenScreen() {
  const fish = useFish();
  const eventGroups = useFishEventGroups();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Vissen', en: 'Fishing', es: 'Pesca', pt: 'Pesca', fr: 'Pêche', de: 'Angeln' }[language]}
      icon="🎣"
      gradient={[COLORS.sky, COLORS.coral]}
      storageKey="vissen"
      subTabs={[
        { key: 'all', label: ALL_TAB_LABEL[language], items: fish },
        { key: 'events', label: eventsTabLabel(language), eventGroups },
      ]}
    />
  );
}
