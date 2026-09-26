import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

const BLOEMEN_KWEEKGIDS = require('@/assets/images/tips/bloemen-kweekgids.jpg');

export interface TipItem {
  title: string;
  body: string;
  emoji: string;
  /** Optionele afbeelding (bv. een community-kweekgids) i.p.v. alleen tekst. */
  image?: number;
}

export interface TipCategory {
  key: string;
  label: string;
  tips: TipItem[];
}

interface TipRaw {
  titleNl: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  bodyNl: string;
  bodyEn: string;
  bodyEs: string;
  bodyPt: string;
  emoji: string;
  image?: number;
}

interface TipCategoryRaw {
  key: string;
  labelNl: string;
  labelEn: string;
  labelEs: string;
  labelPt: string;
  tips: TipRaw[];
}

const TIP_CATEGORIES_RAW: TipCategoryRaw[] = [
  {
    key: 'algemeen',
    labelNl: 'Algemene tips',
    labelEn: 'General tips',
    labelEs: 'Consejos generales',
    labelPt: 'Dicas gerais',
    tips: [
      {
        titleNl: 'Vis tijdens Regenboog-weer',
        titleEn: 'Fish during Rainbow weather',
        titleEs: 'Pesca durante el clima Arcoíris',
        titlePt: 'Pesque durante o clima Arco-Íris',
        bodyNl: 'Sommige zeldzame vissen en insecten zijn alleen te vangen tijdens Regenboog-weer — check "Weer deze week" op het homescherm en plan je vangsessies daarop.',
        bodyEn: 'Some rare fish and insects can only be caught during Rainbow weather — check "Weather this week" on the homescreen and plan your catching sessions around it.',
        bodyEs: 'Algunos peces e insectos raros solo se pueden capturar durante el clima Arcoíris — revisa "El clima esta semana" en la pantalla de inicio y planea tus sesiones de captura en función de eso.',
        bodyPt: 'Alguns peixes e insetos raros só podem ser capturados durante o clima Arco-Íris — confira "Clima desta semana" na tela inicial e planeje suas sessões de captura de acordo.',
        emoji: '🌈',
      },
      {
        titleNl: 'Wissel elke dag van plot',
        titleEn: 'Check the daily plot rotation',
        titleEs: 'Revisa la rotación diaria de parcelas',
        titlePt: 'Confira o rodízio diário de lotes',
        bodyNl: 'De Zwervende Eik en de dagelijkse Fluoriet-plek verspringen elke dag naar een andere plot — check de Plotkalender op het homescherm voordat je op pad gaat, anders sta je voor niets bij de verkeerde plot.',
        bodyEn: 'The Roaming Oak and the daily Fluorite spot move to a different plot every day — check the Plot Calendar on the homescreen before heading out, otherwise you might show up at the wrong plot.',
        bodyEs: 'El Roble Errante y el punto diario de Fluorita se mueven a una parcela distinta cada día — revisa el Calendario de Parcelas en la pantalla de inicio antes de salir, o podrías llegar a la parcela equivocada.',
        bodyPt: 'O Carvalho Errante e o ponto diário de Fluorita mudam para um lote diferente todos os dias — confira o Calendário de Lotes na tela inicial antes de sair, senão você pode acabar indo ao lote errado.',
        emoji: '🌳',
      },
      {
        titleNl: 'Meteorenscherven blijven even beschikbaar',
        titleEn: 'Meteor shards stay around for a while',
        titleEs: 'Los fragmentos de meteoro siguen disponibles por un tiempo',
        titlePt: 'Os fragmentos de meteoro continuam disponíveis por um tempo',
        bodyNl: 'Na een meteorenregen blijven de kristalfragmenten nog 24 uur na de start van de regen beschikbaar — je hoeft dus niet meteen die avond nog alles te doen.',
        bodyEn: 'After a meteor shower, the crystal fragments stay available for 24 hours after the shower starts — you don’t have to get everything done that same evening.',
        bodyEs: 'Después de una lluvia de meteoros, los fragmentos de cristal siguen disponibles durante 24 horas desde que empieza la lluvia — no tienes que hacerlo todo esa misma noche.',
        bodyPt: 'Depois de uma chuva de meteoros, os fragmentos de cristal continuam disponíveis por 24 horas após o início da chuva — você não precisa terminar tudo naquela mesma noite.',
        emoji: '☄️',
      },
      {
        titleNl: 'Sommige wilde dieren zijn tijdelijk',
        titleEn: 'Some wild animals are temporary',
        titleEs: 'Algunos animales salvajes son temporales',
        titlePt: 'Alguns animais selvagens são temporários',
        bodyNl: 'Dieren zoals de Dolfijn en Pinguïn horen bij een event en zijn buiten dat event niet te voeren — hun vriendschapsniveau blijft wel gewoon bijgehouden voor het geval ze terugkeren.',
        bodyEn: 'Animals like the Dolphin and Penguin belong to an event and can’t be fed outside of it — their friendship level stays tracked in case they return.',
        bodyEs: 'Animales como el Delfín y el Pingüino pertenecen a un evento y no se pueden alimentar fuera de él — su nivel de amistad se sigue registrando por si regresan.',
        bodyPt: 'Animais como o Golfinho e o Pinguim pertencem a um evento e não podem ser alimentados fora dele — o nível de amizade continua sendo registrado caso eles voltem.',
        emoji: '🐬',
      },
    ],
  },
  {
    key: 'bouwen',
    labelNl: 'Bouwen & inrichten',
    labelEn: 'Building & decorating',
    labelEs: 'Construcción y decoración',
    labelPt: 'Construção e decoração',
    tips: [
      {
        titleNl: 'Eerst de indeling, dan pas decoratie',
        titleEn: 'Layout first, decoration second',
        titleEs: 'Primero la distribución, luego la decoración',
        titlePt: 'Primeiro o layout, depois a decoração',
        bodyNl: 'Zet eerst je bed, opslag en werkbanken op hun plek voordat je gaat decoreren — zo voorkom je dat je alles steeds opnieuw moet verschuiven als de indeling toch niet klopt.',
        bodyEn: "Place your bed, storage and workstations first before decorating — this way you won't have to keep shifting everything around once the layout turns out not to work.",
        bodyEs: 'Coloca primero tu cama, el almacenamiento y las estaciones de trabajo antes de decorar — así evitas tener que mover todo de nuevo si la distribución no termina funcionando.',
        bodyPt: 'Coloque primeiro sua cama, armazenamento e estações de trabalho antes de decorar — assim você evita ter que mudar tudo de novo caso o layout não funcione.',
        emoji: '🧱',
      },
      {
        titleNl: 'Let op het type oppervlak',
        titleEn: 'Watch the surface type',
        titleEs: 'Fíjate en el tipo de superficie',
        titlePt: 'Preste atenção ao tipo de superfície',
        bodyNl: 'Meubels moeten op de vloer staan, wandobjecten aan een muur, en kleine spulletjes (lampen, vazen) op ander meubilair — een groene gloed betekent een geldige plek, rood betekent dat je moet schuiven of draaien.',
        bodyEn: 'Furniture needs a floor, wall items need a wall, and small objects (lamps, vases) need to go on other furniture — a green glow means a valid spot, red means you need to move or rotate it.',
        bodyEs: 'Los muebles necesitan un suelo, los objetos de pared necesitan una pared, y los objetos pequeños (lámparas, jarrones) deben colocarse sobre otros muebles — un brillo verde indica un lugar válido, rojo significa que debes moverlo o girarlo.',
        bodyPt: 'Móveis precisam de um piso, itens de parede precisam de uma parede, e objetos pequenos (luminárias, vasos) precisam ficar sobre outros móveis — um brilho verde indica um lugar válido, vermelho significa que você precisa mover ou girar o item.',
        emoji: '🟩',
      },
      {
        titleNl: 'Stapelen kan',
        titleEn: 'You can layer items',
        titleEs: 'Puedes apilar objetos',
        titlePt: 'Você pode empilhar itens',
        bodyNl: 'Sommige items kun je op elkaar stapelen: eerst een vloerkleed, dan een tafel erop, en dan weer spulletjes op de tafel — zo krijg je een gelaagde, minder kale look.',
        bodyEn: 'Some items can be layered: a rug first, then a table on top, then small objects on the table — this gives a layered look instead of a bare room.',
        bodyEs: 'Algunos objetos se pueden apilar: primero una alfombra, luego una mesa encima, y después objetos pequeños sobre la mesa — así consigues un aspecto más elaborado en vez de una habitación vacía.',
        bodyPt: 'Alguns itens podem ser empilhados: primeiro um tapete, depois uma mesa em cima, e então objetos pequenos sobre a mesa — isso dá um visual mais elaborado em vez de um cômodo vazio.',
        emoji: '📚',
      },
      {
        titleNl: 'Sla je indeling op zodra je blueprints hebt',
        titleEn: 'Save a blueprint as soon as you unlock it',
        titleEs: 'Guarda un plano en cuanto lo desbloquees',
        titlePt: 'Salve uma planta assim que desbloquear',
        bodyNl: 'Wacht niet tot je helemaal klaar bent — sla je huidige indeling meteen op als blueprint zodra die functie beschikbaar is, dan kun je altijd terug als een nieuw ontwerp toch niet bevalt.',
        bodyEn: "Don't wait until you're fully done — save your current layout as a blueprint as soon as that feature unlocks, so you can always go back if a new design doesn't work out.",
        bodyEs: 'No esperes a estar completamente terminado — guarda tu distribución actual como plano en cuanto se desbloquee esa función, así siempre podrás volver atrás si un nuevo diseño no resulta.',
        bodyPt: 'Não espere terminar tudo — salve seu layout atual como uma planta assim que esse recurso for desbloqueado, assim você sempre pode voltar atrás se um novo design não der certo.',
        emoji: '📐',
      },
    ],
  },
  {
    key: 'tekenen',
    labelNl: 'Tekenen op de schildersezel',
    labelEn: 'Drawing on the easel',
    labelEs: 'Dibujar en el caballete',
    labelPt: 'Desenhar no cavalete',
    tips: [
      {
        titleNl: 'Ontgrendelen en neerzetten',
        titleEn: 'Unlocking and placing the easel',
        titleEs: 'Desbloquear y colocar el caballete',
        titlePt: 'Desbloquear e posicionar o cavalete',
        bodyNl: "De schildersezel ontgrendelt op D.G. Level 14 — koop hem daarna bij Ka Ching's winkel (inclusief een korte uitleg van de tools) en zet hem neer in je huis of ergens in de stad om te beginnen met tekenen.",
        bodyEn: "The drawing board unlocks at D.G. Level 14 — buy it afterwards from Ka Ching's shop (comes with a short tools tutorial) and place it inside your home or anywhere in town to start drawing.",
        bodyEs: 'El caballete de dibujo se desbloquea en el Nivel 14 de D.G. — cómpralo después en la tienda de Ka Ching (incluye un breve tutorial de herramientas) y colócalo dentro de tu casa o en cualquier lugar de la ciudad para empezar a dibujar.',
        bodyPt: 'O cavalete de desenho é desbloqueado no Nível 14 de D.G. — compre-o depois na loja da Ka Ching (vem com um breve tutorial das ferramentas) e coloque-o dentro da sua casa ou em qualquer lugar da cidade para começar a desenhar.',
        emoji: '🔓',
      },
      {
        titleNl: 'Geen tekentalent? Begin met een sjabloon',
        titleEn: 'Not confident freehand? Start from a template',
        titleEs: '¿No se te da bien dibujar a mano alzada? Empieza con una plantilla',
        titlePt: 'Não é bom de mão livre? Comece com um molde',
        bodyNl: 'Kun je niet goed freehand tekenen, gebruik dan een inkleursjabloon als basis in plaats van vanaf een leeg canvas te beginnen — dat geeft meteen een nette, herkenbare vorm.',
        bodyEn: "If freehand drawing isn't your strong point, use a coloring-page template as a base instead of starting from a blank canvas — this immediately gives you a neat, recognizable shape.",
        bodyEs: 'Si dibujar a mano alzada no es tu fuerte, usa una plantilla de página para colorear como base en lugar de empezar desde un lienzo en blanco — así consigues de inmediato una forma limpia y reconocible.',
        bodyPt: 'Se desenhar à mão livre não é o seu forte, use um molde de página para colorir como base em vez de começar do zero — assim você já consegue uma forma limpa e reconhecível de cara.',
        emoji: '🎨',
      },
      {
        titleNl: 'Gebruik het raster en de spiegelfunctie',
        titleEn: 'Use the grid and the mirror tool',
        titleEs: 'Usa la cuadrícula y la herramienta de espejo',
        titlePt: 'Use a grade e a ferramenta de espelho',
        bodyNl: 'Zet het raster aan voor meer precisie, en gebruik vooral de spiegel-/symmetriefunctie voor symmetrische ontwerpen — je tekent dan maar de helft, de andere kant vult zich automatisch aan.',
        bodyEn: "Turn on the grid for more precision, and especially use the mirror/symmetry tool for symmetric designs — you only draw one half, the other side fills in automatically.",
        bodyEs: 'Activa la cuadrícula para más precisión, y sobre todo usa la herramienta de espejo/simetría para diseños simétricos — solo dibujas la mitad, el otro lado se rellena automáticamente.',
        bodyPt: 'Ative a grade para mais precisão, e principalmente use a ferramenta de espelho/simetria para desenhos simétricos — você desenha só metade, o outro lado se completa automaticamente.',
        emoji: '🪞',
      },
      {
        titleNl: 'Stempels voor de basis, penseel voor details',
        titleEn: 'Stamps for the base, brush for details',
        titleEs: 'Sellos para la base, pincel para los detalles',
        titlePt: 'Carimbos para a base, pincel para os detalhes',
        bodyNl: 'Gebruik kant-en-klare stempels/decals voor de basisvorm, en werk daarna met een kleine penseelgrootte de details bij — dat oogt netter dan alles in één keer freehand proberen.',
        bodyEn: 'Use ready-made stamps/decals for the base shape, then switch to a small brush size to add details on top — this looks neater than trying to freehand everything in one go.',
        bodyEs: 'Usa sellos/calcomanías prediseñados para la forma base, y luego cambia a un pincel pequeño para añadir los detalles — se ve más limpio que intentar hacerlo todo a mano alzada de una vez.',
        bodyPt: 'Use carimbos/decalques prontos para a forma base, e depois mude para um pincel pequeno para adicionar os detalhes — fica mais limpo do que tentar fazer tudo à mão livre de uma vez.',
        emoji: '🖌️',
      },
      {
        titleNl: 'Zoom in, en gebruik de verf-emmer voor vlakken',
        titleEn: 'Zoom in, and use the fill bucket for large areas',
        titleEs: 'Haz zoom y usa el bote de pintura para áreas grandes',
        titlePt: 'Dê zoom e use o balde de tinta para áreas grandes',
        bodyNl: 'Zoom in voor precies werk bij randen en details, en gebruik de vul-/emmerfunctie om grote vlakken in één keer te kleuren voordat je met een klein penseel de fijne details toevoegt.',
        bodyEn: 'Zoom in for precise edges and details, and use the fill/bucket tool to color large areas in one go before adding fine details with a small brush.',
        bodyEs: 'Haz zoom para bordes y detalles precisos, y usa la herramienta de relleno/bote para colorear áreas grandes de una vez antes de añadir los detalles finos con un pincel pequeño.',
        bodyPt: 'Dê zoom para bordas e detalhes precisos, e use a ferramenta de preenchimento/balde para colorir áreas grandes de uma vez antes de adicionar os detalhes finos com um pincel pequeno.',
        emoji: '🔍',
      },
    ],
  },
  {
    key: 'bloemen',
    labelNl: 'Bloemen kweken',
    labelEn: 'Growing flowers',
    labelEs: 'Cultivar flores',
    labelPt: 'Cultivar flores',
    tips: [
      {
        titleNl: 'Community-kweekgids: kruisen & sterren',
        titleEn: 'Community growing guide: crossbreeding & stars',
        titleEs: 'Guía de cultivo de la comunidad: cruces y estrellas',
        titlePt: 'Guia de cultivo da comunidade: cruzamentos e estrelas',
        bodyNl: 'Een aangeleverde infographic over bloemen kruisen en sterniveaus verhogen — gemaakt door @liviafae.',
        bodyEn: 'A community-made infographic about crossbreeding flowers and raising star levels — made by @liviafae.',
        bodyEs: 'Una infografía de la comunidad sobre cruces de flores y cómo subir el nivel de estrellas — hecha por @liviafae.',
        bodyPt: 'Um infográfico feito pela comunidade sobre cruzamento de flores e como subir o nível de estrelas — feito por @liviafae.',
        emoji: '🌸',
        image: BLOEMEN_KWEEKGIDS,
      },
    ],
  },
];

export function useTips(): TipCategory[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      TIP_CATEGORIES_RAW.map((c) => ({
        key: c.key,
        label: language === 'es' ? c.labelEs : language === 'pt' ? c.labelPt : language === 'fr' ? c.labelEn : language === 'de' ? c.labelEn : language === 'en' ? c.labelEn : c.labelNl,
        tips: c.tips.map((t) => ({
          title: language === 'es' ? t.titleEs : language === 'pt' ? t.titlePt : language === 'fr' ? t.titleEn : language === 'de' ? t.titleEn : language === 'en' ? t.titleEn : t.titleNl,
          body: language === 'es' ? t.bodyEs : language === 'pt' ? t.bodyPt : language === 'fr' ? t.bodyEn : language === 'de' ? t.bodyEn : language === 'en' ? t.bodyEn : t.bodyNl,
          emoji: t.emoji,
          image: t.image,
        })),
      })),
    [language]
  );
}
