import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useSandSculptures } from '@/data/sand-sculptures';
import { useSnowSculptures } from '@/data/snow-sculptures';
import { useLanguage } from '@/hooks/use-language';

const SAND_DISCLAIMER = {
  nl: 'Je hoeft niets te kopen om te beeldhouwen — materialen (Steen, Kwaliteitshout) verzamel je gratis. Alleen om in level te stijgen koop je Hobby Upgrade Tickets bij Azure, met Wensterren (50 per ticket).',
  en: "You don't need to buy anything to sculpt — materials (Stone, Quality Wood) are gathered for free. Only leveling up requires Hobby Upgrade Tickets from Azure, bought with Wishing Stars (50 per ticket).",
  es: 'No necesitas comprar nada para esculpir — los materiales (Piedra, Madera de Calidad) se recolectan gratis. Solo para subir de nivel compras Hobby Upgrade Tickets con Azure, con Estrellas de los Deseos (50 por ticket).',
  pt: 'Você não precisa comprar nada para esculpir — os materiais (Pedra, Madeira de Qualidade) são coletados de graça. Só para subir de nível você compra Hobby Upgrade Tickets com a Azure, usando Estrelas dos Desejos (50 por ticket).',
};

const SNOW_DISCLAIMER = {
  nl: 'Sneeuwsculpturen waren onderdeel van de Winter Frost Season (event). De hobby kan nog steeds gedaan worden. Ook hier: materialen zijn gratis, alleen level omhoog kost Wensterren via Hobby Upgrade Tickets.',
  en: 'Snow sculptures were part of the Winter Frost Season (event). The hobby can still be done. Materials are free here too, only leveling up costs Wishing Stars via Hobby Upgrade Tickets.',
  es: 'Las esculturas de nieve formaron parte de la Winter Frost Season (evento). El hobby todavía se puede hacer. También aquí: los materiales son gratis, solo subir de nivel cuesta Estrellas de los Deseos mediante Hobby Upgrade Tickets.',
  pt: 'As esculturas de neve fizeram parte da Winter Frost Season (evento). O hobby ainda pode ser feito. Aqui também: os materiais são gratuitos, só subir de nível custa Estrelas dos Desejos via Hobby Upgrade Tickets.',
};

const TITLE = { nl: 'Beeldhouwen', en: 'Sculpting', es: 'Escultura', pt: 'Escultura' };
const SAND_LABEL = { nl: 'Zand', en: 'Sand', es: 'Arena', pt: 'Areia' };
const SNOW_LABEL = { nl: 'Sneeuw', en: 'Snow', es: 'Nieve', pt: 'Neve' };

export default function BeeldhouwenScreen() {
  const sandSculptures = useSandSculptures();
  const snowSculptures = useSnowSculptures();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={TITLE[language]}
      icon="🏖️"
      gradient={[COLORS.yellow, COLORS.sky]}
      storageKey="beeldhouwen"
      subTabs={[
        { key: 'zand', label: SAND_LABEL[language], items: sandSculptures, disclaimer: SAND_DISCLAIMER[language] },
        { key: 'sneeuw', label: SNOW_LABEL[language], items: snowSculptures, disclaimer: SNOW_DISCLAIMER[language] },
      ]}
    />
  );
}
