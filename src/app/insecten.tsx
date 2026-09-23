import { eventsTabLabel, HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useInsectEventGroups, useInsects } from '@/data/insects';
import { useLanguage } from '@/hooks/use-language';

const ALL_TAB_LABEL = { nl: 'Alle Insecten', en: 'All Insects', es: 'Todos', pt: 'Todos', fr: 'Tous', de: 'Alle' } as const;

export default function InsectenScreen() {
  const insects = useInsects();
  const eventGroups = useInsectEventGroups();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Insecten', en: 'Insects', es: 'Insectos', pt: 'Insetos', fr: 'Insectes', de: 'Insekten' }[language]}
      icon="🦋"
      gradient={[COLORS.forestSoft, COLORS.sky]}
      storageKey="insecten"
      subTabs={[
        { key: 'all', label: ALL_TAB_LABEL[language], items: insects },
        { key: 'events', label: eventsTabLabel(language), eventGroups },
      ]}
    />
  );
}
