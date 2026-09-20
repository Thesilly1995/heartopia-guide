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
  fr: "Tu n'as besoin d'acheter rien pour sculpter — les matériaux (Pierre, Bois de Qualité) se récoltent gratuitement. Seule la montée de niveau demande des Hobby Upgrade Tickets achetés chez Azure, avec des Étoiles à Vœux (50 par ticket).",
  de: 'Du musst nichts kaufen, um zu bildhauern — Materialien (Stein, Qualitätsholz) sammelst du kostenlos. Nur für den Levelaufstieg brauchst du Hobby Upgrade Tickets von Azure, die du mit Wunschsternen kaufst (50 pro Ticket).',
};

const SNOW_DISCLAIMER = {
  nl: 'Sneeuwsculpturen waren onderdeel van de Winter Frost Season (event). De hobby kan nog steeds gedaan worden. Ook hier: materialen zijn gratis, alleen level omhoog kost Wensterren via Hobby Upgrade Tickets.',
  en: 'Snow sculptures were part of the Winter Frost Season (event). The hobby can still be done. Materials are free here too, only leveling up costs Wishing Stars via Hobby Upgrade Tickets.',
  es: 'Las esculturas de nieve formaron parte de la Winter Frost Season (evento). El hobby todavía se puede hacer. También aquí: los materiales son gratis, solo subir de nivel cuesta Estrellas de los Deseos mediante Hobby Upgrade Tickets.',
  pt: 'As esculturas de neve fizeram parte da Winter Frost Season (evento). O hobby ainda pode ser feito. Aqui também: os materiais são gratuitos, só subir de nível custa Estrelas dos Desejos via Hobby Upgrade Tickets.',
  fr: "Les sculptures de neige faisaient partie de la Winter Frost Season (événement). Le hobby peut encore être pratiqué. Là aussi : les matériaux sont gratuits, seule la montée de niveau coûte des Étoiles à Vœux via des Hobby Upgrade Tickets.",
  de: 'Schneeskulpturen waren Teil der Winter Frost Season (Event). Das Hobby kann weiterhin ausgeübt werden. Auch hier: Materialien sind kostenlos, nur der Levelaufstieg kostet Wunschsterne über Hobby Upgrade Tickets.',
};

const TITLE = { nl: 'Beeldhouwen', en: 'Sculpting', es: 'Escultura', pt: 'Escultura', fr: 'Sculpture', de: 'Bildhauerei' };
const SAND_LABEL = { nl: 'Zand', en: 'Sand', es: 'Arena', pt: 'Areia', fr: 'Sable', de: 'Sand' };
const SNOW_LABEL = { nl: 'Sneeuw', en: 'Snow', es: 'Nieve', pt: 'Neve', fr: 'Neige', de: 'Schnee' };

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
