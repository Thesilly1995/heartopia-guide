import { useMemo } from 'react';

import { Language, useLanguage } from '@/hooks/use-language';

export interface BadgeItem {
  name: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
  /** Hoe je deze badge behaalt — null als nog niet bevestigd. */
  howTo: string | null;
}

interface BadgeRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  nameFr: string;
  nameDe: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
  howToNl?: string;
  howToEn?: string;
  howToEs?: string;
  howToPt?: string;
}

const BADGES_RAW: BadgeRaw[] = [
  { nameNl: "Nooit met Lege Handen", nameEn: "Never Empty-Handed", nameEs: "Nunca con las Manos Vacías", namePt: "Nunca de Mãos Vazias", nameFr: "Jamais les mains vides", nameDe: "Nie mit leeren Händen", emoji: "🎣", hidden: false, iconKey: "never-empty-handed",
    howToNl: "Bereik Visniveau 10.", howToEn: "Reach Fishing level 10.", howToEs: "Alcanza el nivel 10 de Pesca.", howToPt: "Alcance o nível 10 de Pesca." },
  { nameNl: "Mystieke Visser", nameEn: "Mystic Fisher", nameEs: "Pescador Místico", namePt: "Pescador Místico", nameFr: "Le pêcheur mystique", nameDe: "Mystischer Fischer", emoji: "🎣", hidden: false, iconKey: "mystic-fisher",
    howToNl: "Trigger de Mystieke Route in totaal 10 keer tijdens zeevisevents.", howToEn: "Trigger the Mystic Route 10 times in total during sea fishing events.", howToEs: "Activa la Ruta Mística un total de 10 veces durante eventos de pesca marina.", howToPt: "Ative a Rota Mística um total de 10 vezes durante eventos de pesca no mar." },
  { nameNl: "Zegen van de School", nameEn: "Shoal's Blessing", nameEs: "Bendición del Banco de Peces", namePt: "Bênção do Cardume", nameFr: "La bénédiction du banc de poissons", nameDe: "Segen des Schwarms", emoji: "🎣", hidden: false, iconKey: "shoal-s-blessing",
    howToNl: "Trigger Scholen in totaal 100 keer tijdens zeevisevents.", howToEn: "Trigger Shoals 100 times in total during sea fishing events.", howToEs: "Activa Bancos de Peces un total de 100 veces durante eventos de pesca marina.", howToPt: "Ative Cardumes um total de 100 vezes durante eventos de pesca no mar." },
  { nameNl: "Sterke Zeeman", nameEn: "Strong Sailor", nameEs: "Marinero Fuerte", namePt: "Marinheiro Forte", nameFr: "Le marin courageux", nameDe: "Starker Seemann", emoji: "🎣", hidden: false, iconKey: "strong-sailor",
    howToNl: "Vang twee vissen van 100kg of meer achter elkaar.", howToEn: "Catch two 100kg+ fish in a row.", howToEs: "Captura dos peces de 100kg o más seguidos.", howToPt: "Capture dois peixes de 100kg ou mais seguidos." },
  { nameNl: "Tweelingvis Fortuin", nameEn: "Twin Fish Fortune", nameEs: "Fortuna de Peces Gemelos", namePt: "Fortuna dos Peixes Gêmeos", nameFr: "La chance des poissons jumeaux", nameDe: "Glück der Zwillingsfische", emoji: "🎣", hidden: false, iconKey: "twin-fish-fortune",
    howToNl: "Vang twee 5★-vissen binnen 1 minuut.", howToEn: "Catch two 5★ fish within 1 minute.", howToEs: "Captura dos peces de 5★ en 1 minuto.", howToPt: "Capture dois peixes de 5★ em 1 minuto." },
  { nameNl: "Vismachine", nameEn: "Fishing Machine", nameEs: "Máquina de Pescar", namePt: "Máquina de Pescar", nameFr: "La machine à pêcher", nameDe: "Fischmaschine", emoji: "🎣", hidden: false, iconKey: "fishing-machine",
    howToNl: "Vang 50 vissen van 100kg of meer.", howToEn: "Catch 50 fish of 100kg or more.", howToEs: "Captura 50 peces de 100kg o más.", howToPt: "Capture 50 peixes de 100kg ou mais." },
  { nameNl: "Haaienwaanzin", nameEn: "Shark Frenzy", nameEs: "Frenesí de Tiburones", namePt: "Frenesi de Tubarões", nameFr: "La folie des requins", nameDe: "Haienwahnsinn", emoji: "🎣", hidden: false, iconKey: "shark-frenzy",
    howToNl: "Vang 3 haaien uit gouden visschaduwen in één zeevisevent.", howToEn: "Catch 3 sharks from golden fish shadows in a single sea fishing event.", howToEs: "Captura 3 tiburones de sombras de peces dorados en un solo evento de pesca marina.", howToPt: "Capture 3 tubarões de sombras de peixes dourados em um único evento de pesca no mar." },
  { nameNl: "Scholenroeper", nameEn: "Shoal Caller", nameEs: "Llamador de Bancos", namePt: "Convocador de Cardumes", nameFr: "L'appelant des bancs de poissons", nameDe: "Schwarmrufer", emoji: "🎣", hidden: false, iconKey: "shoal-caller",
    howToNl: "Trigger Scholen 3 keer in één zeevisevent.", howToEn: "Trigger Shoals 3 times in a single sea fishing event.", howToEs: "Activa Bancos de Peces 3 veces en un solo evento de pesca marina.", howToPt: "Ative Cardumes 3 vezes em um único evento de pesca no mar." },
  { nameNl: "Sterrenlicht Visser", nameEn: "Starlight Fisher", nameEs: "Pescador de Luz Estelar", namePt: "Pescador da Luz das Estrelas", nameFr: "Pêcheur à la Lueur des Étoiles", nameDe: "Sternenlicht-Fischer", emoji: "🎣", hidden: false, iconKey: "starlight-fisher",
    howToNl: "Vang vier 5★-vissen in één zeevisevent.", howToEn: "Catch four 5★ fish in a single sea fishing event.", howToEs: "Captura cuatro peces de 5★ en un solo evento de pesca marina.", howToPt: "Capture quatro peixes de 5★ em um único evento de pesca no mar." },
  { nameNl: "Legende van het Dorpskoken", nameEn: "Town Cooking Legend", nameEs: "Leyenda Culinaria del Pueblo", namePt: "Lenda da Culinária da Cidade", nameFr: "Légende de la Cuisine du Village", nameDe: "Legende des Dorfkochens", emoji: "🍳", hidden: false, iconKey: "town-cooking-legend",
    howToNl: "Bereik Kookniveau 10.", howToEn: "Reach Cooking level 10.", howToEs: "Alcanza el nivel 10 de Cocina.", howToPt: "Alcance o nível 10 de Culinária." },
  { nameNl: "Snel & Foutloos", nameEn: "Fast & Flawless", nameEs: "Rápido y Perfecto", namePt: "Rápido e Impecável", nameFr: "Rapide et Sans Faute", nameDe: "Schnell & Fehlerfrei", emoji: "🍳", hidden: false, iconKey: "fast-flawless",
    howToNl: "Kook twee 5★-gerechten binnen 1 minuut.", howToEn: "Cook two 5★ dishes within 1 minute.", howToEs: "Cocina dos platos de 5★ en 1 minuto.", howToPt: "Cozinhe dois pratos de 5★ em 1 minuto." },
  { nameNl: "Groene Vingers", nameEn: "Green Touch", nameEs: "Toque Verde", namePt: "Toque Verde", nameFr: "Pouce Vert", nameDe: "Grüner Daumen", emoji: "🌱", hidden: false, iconKey: "green-touch",
    howToNl: "Bereik Tuinniveau 10.", howToEn: "Reach Gardening level 10.", howToEs: "Alcanza el nivel 10 de Jardinería.", howToPt: "Alcance o nível 10 de Jardinagem." },
  { nameNl: "Overvloedige Oogst", nameEn: "Plentiful Harvest", nameEs: "Cosecha Abundante", namePt: "Colheita Farta", nameFr: "Récolte Abondante", nameDe: "Reichhaltige Ernte", emoji: "🌱", hidden: false, iconKey: "plentiful-harvest",
    howToNl: "Oogst een 5★-gewas tijdens Overvloedige Oogst.", howToEn: "Harvest a 5★ crop during Bountiful Harvest.", howToEs: "Cosecha un cultivo de 5★ durante la Cosecha Abundante.", howToPt: "Colha uma plantação de 5★ durante a Colheita Farta." },
  { nameNl: "Regenbooggeluk", nameEn: "Rainbow Luck", nameEs: "Suerte de Arcoíris", namePt: "Sorte do Arco-Íris", nameFr: "Bonheur Arc-en-ciel", nameDe: "Regenbogen-Glück", emoji: "🌱", hidden: false, iconKey: "rainbow-luck",
    howToNl: "Trigger Regenboogzegen twee keer met één multi-gebied-beurt gieten.", howToEn: "Trigger Rainbow's Blessing twice with a single multi-area watering.", howToEs: "Activa la Bendición del Arcoíris dos veces con un solo riego multi-área.", howToPt: "Ative a Bênção do Arco-Íris duas vezes com uma única rega multi-área." },
  { nameNl: "Ster-Kattenverzorger", nameEn: "Ace Cat Servant", nameEs: "Sirviente Estrella de Gatos", namePt: "Servo Nota Dez dos Gatos", nameFr: "Soigneur de Chats Étoilés", nameDe: "Stern-Katzenpfleger", emoji: "🐱", hidden: false, iconKey: "ace-cat-servant",
    howToNl: "Bereik Kattenverzorgingsniveau 10.", howToEn: "Reach Cat Care level 10.", howToEs: "Alcanza el nivel 10 de Cuidado de Gatos.", howToPt: "Alcance o nível 10 de Cuidado de Gatos." },
  { nameNl: "Miauw-Miauw Kantine", nameEn: "Meow-Meow Canteen", nameEs: "Cantina Miau-Miau", namePt: "Cantina Miau-Miau", nameFr: "Cantine Miaou-Miaou", nameDe: "Miau-Miau-Kantine", emoji: "🐱", hidden: false, iconKey: "meow-meow-canteen",
    howToNl: "Voer 5 katten in één keer hun favoriete eten.", howToEn: "Feed 5 cats their favorite food in one go.", howToEs: "Alimenta a 5 gatos con su comida favorita de una vez.", howToPt: "Alimente 5 gatos com a comida favorita deles de uma vez." },
  { nameNl: "Ster-Hondentrainer", nameEn: "Ace Dog Trainer", nameEs: "Entrenador Estrella de Perros", namePt: "Treinador Nota Dez de Cães", nameFr: "Dresseur de chiens étoilé", nameDe: "Stern-Hundetrainer", emoji: "🐶", hidden: false, iconKey: "ace-dog-trainer",
    howToNl: "Bereik Hondenverzorgingsniveau 10.", howToEn: "Reach Dog Care level 10.", howToEs: "Alcanza el nivel 10 de Cuidado de Perros.", howToPt: "Alcance o nível 10 de Cuidado de Cães." },
  { nameNl: "Hondjes Kantine", nameEn: "Doggie Canteen", nameEs: "Cantina de Perritos", namePt: "Cantina dos Cachorrinhos", nameFr: "Cantine des toutous", nameDe: "Hündchen-Kantine", emoji: "🐶", hidden: false, iconKey: "doggie-canteen",
    howToNl: "Voer 3 honden in één keer hun favoriete eten.", howToEn: "Feed 3 dogs their favorite food in one go.", howToEs: "Alimenta a 3 perros con su comida favorita de una vez.", howToPt: "Alimente 3 cães com a comida favorita deles de uma vez." },
  { nameNl: "Insectencommandant", nameEn: "Insect Commander", nameEs: "Comandante de Insectos", namePt: "Comandante de Insetos", nameFr: "Commandant des insectes", nameDe: "Insektenkommandant", emoji: "🦋", hidden: false, iconKey: "insect-commander",
    howToNl: "Bereik Insectenvangniveau 10.", howToEn: "Reach Insect Catching level 10.", howToEs: "Alcanza el nivel 10 de Caza de Insectos.", howToPt: "Alcance o nível 10 de Captura de Insetos." },
  { nameNl: "Zwermcommandant", nameEn: "Swarm Commander", nameEs: "Comandante del Enjambre", namePt: "Comandante do Enxame", nameFr: "Commandant de l'essaim", nameDe: "Schwarmkommandant", emoji: "🦋", hidden: false, iconKey: "swarm-commander",
    howToNl: "Trigger Insectenzwermen in totaal 100 keer tijdens insectenvangevents.", howToEn: "Trigger Insect Swarms 100 times in total during insect catching events.", howToEs: "Activa Enjambres de Insectos un total de 100 veces durante eventos de caza de insectos.", howToPt: "Ative Enxames de Insetos um total de 100 vezes durante eventos de captura de insetos." },
  { nameNl: "Insectenoogster", nameEn: "Insect Harvester", nameEs: "Recolector de Insectos", namePt: "Coletor de Insetos", nameFr: "Récolteur d'insectes", nameDe: "Insektenernter", emoji: "🦋", hidden: false, iconKey: "insect-harvester",
    howToNl: "Vang 3 insecten tegelijk.", howToEn: "Catch 3 insects at the same time.", howToEs: "Captura 3 insectos al mismo tiempo.", howToPt: "Capture 3 insetos ao mesmo tempo." },
  { nameNl: "Zegen van Vijf Insecten", nameEn: "Five Insects Blessing", nameEs: "Bendición de Cinco Insectos", namePt: "Bênção dos Cinco Insetos", nameFr: "Bénédiction des cinq insectes", nameDe: "Segen der fünf Insekten", emoji: "🦋", hidden: false, iconKey: "five-insects-blessing",
    howToNl: "Vang vijf 5★-insecten in één insectenvangevent.", howToEn: "Catch five 5★ insects in a single insect catching event.", howToEs: "Captura cinco insectos de 5★ en un solo evento de caza de insectos.", howToPt: "Capture cinco insetos de 5★ em um único evento de captura de insetos." },
  { nameNl: "Menselijke Insectenlokker", nameEn: "Human Insect Attractor", nameEs: "Atractor Humano de Insectos", namePt: "Atrator Humano de Insetos", nameFr: "Appât à insectes humain", nameDe: "Menschlicher Insektenlocker", emoji: "🦋", hidden: false, iconKey: "human-insect-attractor",
    howToNl: "Trigger Insectenzwermen 4 keer in één insectenvangevent.", howToEn: "Trigger Insect Swarms 4 times in a single insect catching event.", howToEs: "Activa Enjambres de Insectos 4 veces en un solo evento de caza de insectos.", howToPt: "Ative Enxames de Insetos 4 vezes em um único evento de captura de insetos." },
  { nameNl: "Vogelfluisteraar", nameEn: "Bird Whisperer", nameEs: "Susurrador de Aves", namePt: "Sussurrador de Pássaros", nameFr: "Chuchoteur d'oiseaux", nameDe: "Vogelelfe", emoji: "🐦", hidden: false, iconKey: "bird-whisperer",
    howToNl: "Bereik Vogelspotniveau 10.", howToEn: "Reach Birdwatching level 10.", howToEs: "Alcanza el nivel 10 de Observación de Aves.", howToPt: "Alcance o nível 10 de Observação de Pássaros." },
  { nameNl: "Wolkenloper", nameEn: "Cloud Walker", nameEs: "Caminante de Nubes", namePt: "Andarilho das Nuvens", nameFr: "Marcheur sur les nuages", nameDe: "Wolkenläufer", emoji: "🐦", hidden: false, iconKey: "cloud-walker",
    howToNl: "Trigger de Extra Fase in totaal 10 keer tijdens vogelspotevents.", howToEn: "Trigger the Extra Stage 10 times in total during birdwatching events.", howToEs: "Activa la Fase Extra un total de 10 veces durante eventos de observación de aves.", howToPt: "Ative a Fase Extra um total de 10 vezes durante eventos de observação de pássaros." },
  { nameNl: "Harmonie met de Bries", nameEn: "Harmony with Breeze", nameEs: "Armonía con la Brisa", namePt: "Harmonia com a Brisa", nameFr: "Harmonie avec la brise", nameDe: "Harmonie mit der Brise", emoji: "🐦", hidden: false, iconKey: "harmony-with-breeze",
    howToNl: "Trigger Vogelgolven in totaal 100 keer tijdens vogelspotevents.", howToEn: "Trigger Bird Waves 100 times in total during birdwatching events.", howToEs: "Activa Oleadas de Aves un total de 100 veces durante eventos de observación de aves.", howToPt: "Ative Ondas de Pássaros um total de 100 vezes durante eventos de observação de pássaros." },
  { nameNl: "Vrolijk Koor", nameEn: "Joyful Chorus", nameEs: "Coro Alegre", namePt: "Coro Alegre", nameFr: "Chœur joyeux", nameDe: "Fröhlicher Chor", emoji: "🐦", hidden: false, iconKey: "joyful-chorus",
    howToNl: "Trigger Vogelgolven 3 keer in één vogelspotevent.", howToEn: "Trigger Bird Waves 3 times in a single birdwatching event.", howToEs: "Activa Oleadas de Aves 3 veces en un solo evento de observación de aves.", howToPt: "Ative Ondas de Pássaros 3 vezes em um único evento de observação de pássaros." },
  { nameNl: "Beslissend Moment", nameEn: "Decisive Moment", nameEs: "Momento Decisivo", namePt: "Momento Decisivo", nameFr: "Moment décisif", nameDe: "Entscheidender Moment", emoji: "🏖️", hidden: false, iconKey: "decisive-moment",
    howToNl: "Verzamel tien 5★-infokaarten in één vogelspotevent.", howToEn: "Obtain ten 5★ info cards in a single birdwatching event.", howToEs: "Consigue diez fichas informativas de 5★ en un solo evento de observación de aves.", howToPt: "Consiga dez cartões de informação de 5★ em um único evento de observação de pássaros." },
  { nameNl: "Zandsculptuur Artiest", nameEn: "Sand Sculpture Artist", nameEs: "Artista de Esculturas de Arena", namePt: "Artista de Esculturas de Areia", nameFr: "Artiste de sculptures de sable", nameDe: "Sandskulpturenkünstler", emoji: "🏖️", hidden: false, iconKey: "sand-sculpture-artist",
    howToNl: "Bereik Zandsculptuurniveau 5.", howToEn: "Reach Sand Sculpture level 5.", howToEs: "Alcanza el nivel 5 de Escultura de Arena.", howToPt: "Alcance o nível 5 de Escultura de Areia." },
  { nameNl: "Pompoenmonarchie", nameEn: "Pumpkinarchy", nameEs: "Calabazarquía", namePt: "Aboborarquia", nameFr: "Monarchie des citrouilles", nameDe: "Kürbismonarchie", emoji: "🎃", hidden: false, iconKey: "pumpkinarchy",
    howToNl: "Bereik Pompoen Beeldhouwenniveau 5.", howToEn: "Reach Pumpkin Carving level 5.", howToEs: "Alcanza el nivel 5 de Talla de Calabazas.", howToPt: "Alcance o nível 5 de Talha de Abóboras." },
  { nameNl: "Sneeuwkoning", nameEn: "Snow King", nameEs: "Rey de la Nieve", namePt: "Rei da Neve", nameFr: "Roi des neiges", nameDe: "Schneekönig", emoji: "❄️", hidden: false, iconKey: "snow-king",
    howToNl: "Bereik Sneeuwsculptuurniveau 5.", howToEn: "Reach Snow Sculpture level 5.", howToEs: "Alcanza el nivel 5 de Escultura de Nieve.", howToPt: "Alcance o nível 5 de Escultura de Neve." },
  { nameNl: "Ocean Cleanup Expert", nameEn: "Ocean Cleanup Expert", nameEs: "Experto en Limpieza Oceánica", namePt: "Especialista em Limpeza Oceânica", nameFr: "Expert en nettoyage des océans", nameDe: "Experte für Meeresreinigung", emoji: "🌊", hidden: false, iconKey: "ocean-cleanup-expert" },
  { nameNl: "Geen Hoekje Overgeslagen", nameEn: "No Corner Left Behind", nameEs: "Ningún Rincón Sin Limpiar", namePt: "Nenhum Cantinho Esquecido", nameFr: "Pas un recoin négligé", nameDe: "Keine Ecke ausgelassen", emoji: "🌊", hidden: false, iconKey: "no-corner-left-behind" },
  { nameNl: "Gediplomeerd & Klaar", nameEn: "Licensed & Ready", nameEs: "Licenciado y Listo", namePt: "Licenciado e Pronto", nameFr: "Diplômé et prêt", nameDe: "Diplomiert & bereit", emoji: "🌊", hidden: false, iconKey: "licensed-ready" },
  { nameNl: "Getijden van het Leven", nameEn: "Tides of Life", nameEs: "Mareas de la Vida", namePt: "Marés da Vida", nameFr: "Les marées de la vie", nameDe: "Gezeiten des Lebens", emoji: "🌊", hidden: false, iconKey: "tides-of-life" },
  { nameNl: "Verzamelaar", nameEn: "Collector", nameEs: "Coleccionista", namePt: "Colecionador", nameFr: "Collectionneur", nameDe: "Sammler", emoji: "🌟", hidden: false, iconKey: "collector",
    howToNl: "Bereik de rang Expert Verzamelaar.", howToEn: "Reach Expert Collector rank.", howToEs: "Alcanza el rango de Coleccionista Experto.", howToPt: "Alcance o posto de Colecionador Especialista." },
  { nameNl: "Raketsponsor", nameEn: "Rocket Sponsor", nameEs: "Patrocinador de Cohetes", namePt: "Patrocinador de Foguetes", nameFr: "Sponsor de fusées", nameDe: "Raketen-Sponsor", emoji: "🌟", hidden: false, iconKey: "rocket-sponsor",
    howToNl: "Verdien 5.000 goud door spullen te verkopen aan Albert Jr.", howToEn: "Earn 5,000 gold selling items to Albert Jr.", howToEs: "Gana 5.000 de oro vendiendo objetos a Albert Jr.", howToPt: "Ganhe 5.000 de ouro vendendo itens para Albert Jr." },
  { nameNl: "D.G. Lid", nameEn: "D.G. Member", nameEs: "Miembro D.G.", namePt: "Membro D.G.", nameFr: "Membre de la D.G.", nameDe: "D.G.-Mitglied", emoji: "🌟", hidden: false, iconKey: "d-g-member",
    howToNl: "Bereik D.G.-Lid niveau 30.", howToEn: "Reach D.G. Member level 30.", howToEs: "Alcanza el nivel 30 de Miembro D.G.", howToPt: "Alcance o nível 30 de Membro D.G." },
  { nameNl: "Puzzelartiest", nameEn: "Puzzle Artist", nameEs: "Artista de Rompecabezas", namePt: "Artista dos Quebra-Cabeças", nameFr: "Artiste des puzzles", nameDe: "Puzzle-Künstler", emoji: "🧩", hidden: false, iconKey: "puzzle-artist",
    howToNl: "Bereik de rang Puzzelartiest in de Puzzel-droom.", howToEn: "Reach Puzzle Artist rank in the Puzzle Dream.", howToEs: "Alcanza el rango de Artista de Rompecabezas en el Sueño de Rompecabezas.", howToPt: "Alcance o posto de Artista dos Quebra-Cabeças no Sonho dos Quebra-Cabeças." },
  { nameNl: "Volhardende Veer", nameEn: "Persistent Quill", nameEs: "Pluma Persistente", namePt: "Pena Persistente", nameFr: "Plume tenace", nameDe: "Beharrliche Feder", emoji: "🌟", hidden: false, iconKey: "persistent-quill",
    howToNl: "Bereik de rang Godheid in de Schrijf-droom.", howToEn: "Reach Deity rank in the Writing Dream.", howToEs: "Alcanza el rango de Deidad en el Sueño de Escritura.", howToPt: "Alcance o posto de Divindade no Sonho da Escrita." },
  { nameNl: "Gouden Muziek-CD", nameEn: "Golden Music CD", nameEs: "CD Musical Dorado", namePt: "CD Musical Dourado", nameFr: "CD de musique en or", nameDe: "Goldene Musik-CD", emoji: "🌟", hidden: false, iconKey: "golden-music-cd",
    howToNl: "Bereik de rang Gouden Muziek-CD in de Muziek-droom.", howToEn: "Reach Golden Music CD rank in the Music Dream.", howToEs: "Alcanza el rango de CD Musical Dorado en el Sueño de Música.", howToPt: "Alcance o posto de CD Musical Dourado no Sonho da Música." },
  { nameNl: "Dierenbuur", nameEn: "Animal Neighbor", nameEs: "Vecino Animal", namePt: "Vizinho Animal", nameFr: "Voisin des animaux", nameDe: "Tiernachbar", emoji: "🦊", hidden: false, iconKey: "animal-neighbor",
    howToNl: "Bereik bandniveau 10 met 8 wilde dieren.", howToEn: "Reach bond level 10 with 8 wild animals.", howToEs: "Alcanza el nivel de vínculo 10 con 8 animales salvajes.", howToPt: "Alcance o nível de vínculo 10 com 8 animais selvagens." },
  { nameNl: "Sterrenstof Verzamelaar", nameEn: "Stardust Collector", nameEs: "Coleccionista de Polvo Estelar", namePt: "Colecionador de Poeira Estelar", nameFr: "Collectionneur de poussière d'étoiles", nameDe: "Sternenstaub-Sammler", emoji: "☄️", hidden: false, iconKey: "stardust-collector",
    howToNl: "Verzamel 60 Sterrenval-scherven.", howToEn: "Collect 60 Starfall Shards.", howToEs: "Recolecta 60 Fragmentos de Lluvia de Estrellas.", howToPt: "Colete 60 Fragmentos de Chuva de Estrelas." },
  { nameNl: "Dierenverzorger", nameEn: "Animal Keeper", nameEs: "Cuidador de Animales", namePt: "Cuidador de Animais", nameFr: "Soigneur d'animaux", nameDe: "Tierpfleger", emoji: "🦊", hidden: false, iconKey: "animal-keeper",
    howToNl: "Ontdek het favoriete eten van 8 wilde dieren.", howToEn: "Discover the favorite food of 8 wild animals.", howToEs: "Descubre la comida favorita de 8 animales salvajes.", howToPt: "Descubra a comida favorita de 8 animais selvagens." },
  { nameNl: "IJself", nameEn: "Ice Elf", nameEs: "Elfo de Hielo", namePt: "Elfo do Gelo", nameFr: "Glace", nameDe: "Eisvogel", emoji: "🦊", hidden: false, iconKey: "ice-elf",
    howToNl: "Bereik de rang IJself in de Kunstschaats-droom.", howToEn: "Reach Ice Elf rank in the Figure Skating Dream.", howToEs: "Alcanza el rango de Elfo de Hielo en el Sueño de Patinaje Artístico.", howToPt: "Alcance o posto de Elfo do Gelo no Sonho da Patinação Artística." },
  { nameNl: "Voorman Bever", nameEn: "Foreman Beaver", nameEs: "Castor Capataz", namePt: "Castor Capataz", nameFr: "Chef castor", nameDe: "Biber-Vorarbeiter", emoji: "🦫", hidden: false, iconKey: "foreman-beaver",
    howToNl: "Ga het tentoonstellingsmoment in met een inzending, na deelname aan 4 bouwwedstrijden.", howToEn: "Enter the exhibition period with an entry after participating in 4 construction contests.", howToEs: "Entra en el período de exhibición con una propuesta tras participar en 4 concursos de construcción.", howToPt: "Entre no período de exposição com uma proposta após participar de 4 concursos de construção." },
  { nameNl: "Logistiek Bever", nameEn: "Logistics Beaver", nameEs: "Castor de Logística", namePt: "Castor da Logística", nameFr: "Castor logistique", nameDe: "Logistik-Biber", emoji: "🦫", hidden: false, iconKey: "logistics-beaver",
    howToNl: "Verzamel 5.000 scheuten voor één team tijdens bouwwedstrijden.", howToEn: "Stockpile 5,000 sprouts for one team during construction contests.", howToEs: "Almacena 5.000 brotes para un equipo durante los concursos de construcción.", howToPt: "Estoque 5.000 brotos para uma equipe durante os concursos de construção." },
  { nameNl: "Ideeën Hamster", nameEn: "Idea Hamster", nameEs: "Hámster de Ideas", namePt: "Hamster de Ideias", nameFr: "Hamster créatif", nameDe: "Ideen-Hamster", emoji: "🐹", hidden: false, iconKey: "idea-hamster",
    howToNl: "Bereik de rang Ideeën Hamster in de Feestkunstenaar-droom.", howToEn: "Reach Idea Hamster rank in the Party Artisan Dream.", howToEs: "Alcanza el rango de Hámster de Ideas en el Sueño de Artesano de Fiestas.", howToPt: "Alcance o posto de Hamster de Ideias no Sonho do Artesão de Festas." },
  { nameNl: "Feestbeest", nameEn: "Party Animal", nameEs: "Animal de Fiesta", namePt: "Animal Festeiro", nameFr: "Fêtard", nameDe: "Partylöwe", emoji: "🎉", hidden: false, iconKey: "party-animal",
    howToNl: "Bereik de rang Feestbeest in de Feestganger-droom.", howToEn: "Reach Party Animal rank in the Party Player Dream.", howToEs: "Alcanza el rango de Animal de Fiesta en el Sueño de Fiestero.", howToPt: "Alcance o posto de Animal Festeiro no Sonho do Festeiro." },
  { nameNl: "Snelle Schutter", nameEn: "Quick Draw Starter", nameEs: "Tirador Rápido Principiante", namePt: "Atirador Rápido Iniciante", nameFr: "Tireur rapide débutant", nameDe: "Schnellschuss-Anfänger", emoji: "🎯", hidden: false, iconKey: "quick-start",
    howToNl: "Vind 3 vermomde Grimkins binnen 60 seconden als Verslaggever in Verstoppertje Feest.", howToEn: "Find 3 disguised Grimkins within 60 seconds as an Explorer Reporter in Hide-and-Seek Party.", howToEs: "Encuentra 3 Grimkins disfrazados en 60 segundos como Reportero Explorador en Fiesta del Escondite.", howToPt: "Encontre 3 Grimkins disfarçados em 60 segundos como Repórter Explorador na Festa do Esconde-Esconde." },
  { nameNl: "Scherpschutter Basis", nameEn: "Sharpshooter Basics", nameEs: "Fundamentos de Tirador", namePt: "Fundamentos de Atirador", nameFr: "Tireur d'élite de base", nameDe: "Scharfschütze der Basis", emoji: "🎯", hidden: false, iconKey: "sharpshooter-basics",
    howToNl: "Neem 2 speciale clips achter elkaar op als Verslaggever in Verstoppertje Feest.", howToEn: "Record 2 special clips in a row as an Explorer Reporter in Hide-and-Seek Party.", howToEs: "Graba 2 clips especiales seguidos como Reportero Explorador en Fiesta del Escondite.", howToPt: "Grave 2 clipes especiais seguidos como Repórter Explorador na Festa do Esconde-Esconde." },
  { nameNl: "Samensmelten tot Eén", nameEn: "Merge into One", nameEs: "Fusión en Uno", namePt: "Fusão em Um", nameFr: "Fusion en un tout", nameDe: "Verschmelzung zu einem Ganzen", emoji: "👻", hidden: false, iconKey: "merge-into-one",
    howToNl: "Blijf 4 minuten onopgemerkt door Verslaggevers terwijl je een vermomde Grimkin bezielt in Verstoppertje Feest.", howToEn: "Avoid detection by Explorer Reporters for 4 minutes while possessing a disguised Grimkin in Hide-and-Seek Party.", howToEs: "Evita ser detectado por los Reporteros Exploradores durante 4 minutos mientras posees a un Grimkin disfrazado en Fiesta del Escondite.", howToPt: "Evite ser detectado pelos Repórteres Exploradores por 4 minutos enquanto possui um Grimkin disfarçado na Festa do Esconde-Esconde." },
  { nameNl: "Gedurfde Mysterieuze Grimkin", nameEn: "Bold Mysterious Grimkin", nameEs: "Grimkin Misterioso y Audaz", namePt: "Grimkin Misterioso e Ousado", nameFr: "Grimkin audacieux et mystérieux", nameDe: "Wagemutiger, geheimnisvoller Grimkin", emoji: "👻", hidden: false, iconKey: "bold-mysterious-grimkin",
    howToNl: "Laat 20 geestbubbels knappen terwijl je een vermomde Grimkin bezielt in Verstoppertje Feest.", howToEn: "Pop 20 spirit bubbles while possessing a disguised Grimkin in Hide-and-Seek Party.", howToEs: "Revienta 20 burbujas espirituales mientras posees a un Grimkin disfrazado en Fiesta del Escondite.", howToPt: "Estoure 20 bolhas espirituais enquanto possui um Grimkin disfarçado na Festa do Esconde-Esconde." },
  { nameNl: "Stroming van het Leven", nameEn: "Current of Life", nameEs: "Corriente de Vida", namePt: "Corrente da Vida", nameFr: "Courant de la vie", nameDe: "Strömung des Lebens", emoji: "🐋", hidden: false, iconKey: "current-of-life" },
  { nameNl: "Leider Bever", nameEn: "Leader Beaver", nameEs: "Castor Líder", namePt: "Castor Líder", nameFr: "Castor leader", nameDe: "Biber-Anführer", emoji: "🦫", hidden: true, iconKey: "leader-beaver" },
  { nameNl: "Mystic Tracker", nameEn: "Mystic Tracker", nameEs: "Rastreador Místico", namePt: "Rastreador Místico", nameFr: "Traqueur mystique", nameDe: "Mystischer Fährtenleser", emoji: "🗺️", hidden: false, iconKey: "mystic-tracker",
    howToNl: "Trigger de Verborgen Fase in totaal 10 keer tijdens insectenvangevents.", howToEn: "Trigger the Hidden Stage 10 times in total during insect catching events.", howToEs: "Activa la Fase Oculta un total de 10 veces durante eventos de caza de insectos.", howToPt: "Ative a Fase Oculta um total de 10 vezes durante eventos de captura de insetos." },
  { nameNl: "Gourmet Diplomaat", nameEn: "Gourmet Diplomat", nameEs: "Diplomático Gourmet", namePt: "Diplomata Gourmet", nameFr: "Diplomate gourmet", nameDe: "Gourmet-Diplomat", emoji: "🔒", hidden: true, iconKey: "gourmet-diplomat",
    howToNl: "Deel 100 keer eten.", howToEn: "Share food 100 times.", howToEs: "Comparte comida 100 veces.", howToPt: "Compartilhe comida 100 vezes." },
  { nameNl: "Reparatie-expert", nameEn: "Repair Expert", nameEs: "Experto en Reparaciones", namePt: "Especialista em Reparos", nameFr: "Expert en réparations", nameDe: "Reparatur-Experte", emoji: "🔒", hidden: true, iconKey: "repair-expert",
    howToNl: "Deel Reparatiekits 100 keer.", howToEn: "Share Repair Kits 100 times.", howToEs: "Comparte Kits de Reparación 100 veces.", howToPt: "Compartilhe Kits de Reparo 100 vezes." },
  { nameNl: "Popster", nameEn: "Pop Star", nameEs: "Estrella del Pop", namePt: "Estrela Pop", nameFr: "Star de la pop", nameDe: "Popstar", emoji: "🔒", hidden: true, iconKey: "pop-star",
    howToNl: "Ontvang 100 huis-likes.", howToEn: "Receive 100 home likes.", howToEs: "Recibe 100 me gusta en tu casa.", howToPt: "Receba 100 curtidas na sua casa." },
  { nameNl: "Onsen Maatje", nameEn: "Onsen Buddy", nameEs: "Compañero de Onsen", namePt: "Amigo do Onsen", nameFr: "Copain des sources thermales", nameDe: "Onsen-Kumpel", emoji: "🔒", hidden: true, iconKey: "onsen-buddy",
    howToNl: "Ontspan samen met een vriend(in) in de onsen.", howToEn: "Relax at the onsen with a friend.", howToEs: "Relájate en el onsen con un amigo.", howToPt: "Relaxe no onsen com um amigo." },
  { nameNl: "Onder de Meteorenregen", nameEn: "Beneath the Meteor Shower", nameEs: "Bajo la Lluvia de Meteoros", namePt: "Sob a Chuva de Meteoros", nameFr: "Sous la pluie de météores", nameDe: "Unter dem Meteoritenschauer", emoji: "🔒", hidden: true, iconKey: "beneath-the-meteor-shower",
    howToNl: "Doe samen met een vriend(in) een wens onder een meteorenregen.", howToEn: "Make a wish beneath a meteor shower with a friend.", howToEs: "Pide un deseo bajo una lluvia de meteoros junto a un amigo.", howToPt: "Faça um pedido sob uma chuva de meteoros com um amigo." },
  { nameNl: "Romantische Schaatser", nameEn: "Romantic Skater", nameEs: "Patinador Romántico", namePt: "Patinador Romântico", nameFr: "Patinateur romantique", nameDe: "Romantischer Eisläufer", emoji: "🔒", hidden: true, iconKey: "romantic-skater",
    howToNl: "Houd de hand vast van een vriend(in) en schaats samen onder een meteorenregen.", howToEn: "Hold hands with a friend and skate beneath a meteor shower.", howToEs: "Toma de la mano a un amigo y patina junto a él bajo una lluvia de meteoros.", howToPt: "Dê as mãos para um amigo e patinem juntos sob uma chuva de meteoros." },
  { nameNl: "Struik Groothandelaar", nameEn: "Bush Wholesaler", nameEs: "Mayorista de Arbustos", namePt: "Atacadista de Arbustos", nameFr: "Grossiste en buissons", nameDe: "Strauch-Großhändler", emoji: "🌳", hidden: true, iconKey: "bush-wholesaler",
    howToNl: "Deel Camouflagestruiken 100 keer.", howToEn: "Share Camouflage Bushes 100 times.", howToEs: "Comparte Arbustos de Camuflaje 100 veces.", howToPt: "Compartilhe Arbustos de Camuflagem 100 vezes." },
  { nameNl: "Bestsellende Auteur", nameEn: "Bestselling Author", nameEs: "Autor Más Vendido", namePt: "Autor Mais Vendido", nameFr: "Auteur à succès", nameDe: "Bestsellerautor", emoji: "📖", hidden: true, iconKey: "bestselling-author",
    howToNl: "Laat je originele boeken in totaal 1.000 keer kopen.", howToEn: "Have your original books purchased 1,000 times in total.", howToEs: "Haz que tus libros originales se compren 1.000 veces en total.", howToPt: "Faça seus livros originais serem comprados 1.000 vezes no total." },
  { nameNl: "Volhardende Veer (Lezers)", nameEn: "Persistent Quill", nameEs: "Pluma Persistente", namePt: "Pena Persistente", nameFr: "Plume tenace", nameDe: "Beharrliche Feder", emoji: "📖", hidden: true, iconKey: null,
    howToNl: "Bezit 10 gepubliceerde werken, elk met minstens 200 lezers.", howToEn: "Own 10 published works, each with at least 200 readers.", howToEs: "Ten 10 obras publicadas, cada una con al menos 200 lectores.", howToPt: "Tenha 10 obras publicadas, cada uma com pelo menos 200 leitores." },
  { nameNl: "Literaire Grootmeester", nameEn: "Great Literary Tycoon", nameEs: "Gran Magnate Literario", namePt: "Grande Magnata Literário", nameFr: "Grand maître littéraire", nameDe: "Literarischer Großmeister", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Zeevis Meester", nameEn: "Sea Fishing Master", nameEs: "Maestro de la Pesca Marina", namePt: "Mestre da Pesca no Mar", nameFr: "Maître des poissons de mer", nameDe: "Meister der Meeresfische", emoji: "🎣", hidden: true, iconKey: "sea-fishing-master",
    howToNl: "Behaal alle 8 titels van zeevissen.", howToEn: "Obtain all 8 titles from sea fishing.", howToEs: "Consigue los 8 títulos de la pesca marina.", howToPt: "Consiga os 8 títulos da pesca no mar." },
  { nameNl: "Insectenvangfeest", nameEn: "Insect Catching Party", nameEs: "Fiesta de Caza de Insectos", namePt: "Festa de Captura de Insetos", nameFr: "Fête de la chasse aux insectes", nameDe: "Insektenfangfest", emoji: "🦋", hidden: true, iconKey: "insect-catching-party",
    howToNl: "Deel de Luchtbij-lokmiddel 100 keer.", howToEn: "Share the Air Bee Attractor 100 times.", howToEs: "Comparte el Atrayente de Abejas del Aire 100 veces.", howToPt: "Compartilhe o Atrativo de Abelhas do Ar 100 vezes." },
  { nameNl: "Regenboogbode", nameEn: "Rainbow Messenger", nameEs: "Mensajero del Arcoíris", namePt: "Mensageiro do Arco-Íris", nameFr: "Messager de l'arc-en-ciel", nameDe: "Regenbogenbote", emoji: "🌈", hidden: true, iconKey: "rainbow-messenger",
    howToNl: "Deel Regenboogboeketten 50 keer.", howToEn: "Share Rainbow Bouquets 50 times.", howToEs: "Comparte Ramos de Arcoíris 50 veces.", howToPt: "Compartilhe Buquês de Arco-Íris 50 vezes." },
  { nameNl: "Onsen Berg Insectenkoning", nameEn: "Onsen Mountain Insect King", nameEs: "Rey de los Insectos de la Montaña Onsen", namePt: "Rei dos Insetos da Montanha Onsen", nameFr: "Roi des insectes de la montagne Onsen", nameDe: "Onsen-Berg-Insektenkönig", emoji: "🦋", hidden: true, iconKey: "onsen-mountain-insect-king",
    howToNl: "Behaal alle 7 titels van insectenvangevents.", howToEn: "Obtain all 7 titles from insect catching events.", howToEs: "Consigue los 7 títulos de los eventos de caza de insectos.", howToPt: "Consiga os 7 títulos dos eventos de captura de insetos." },
  { nameNl: "Boekenverzamelaar", nameEn: "Book Collector", nameEs: "Coleccionista de Libros", namePt: "Colecionador de Livros", nameFr: "Collectionneur de livres", nameDe: "Büchersammler", emoji: "🔒", hidden: true, iconKey: null,
    howToNl: "Bezit 500 verschillende boeken.", howToEn: "Own 500 different books.", howToEs: "Ten 500 libros diferentes.", howToPt: "Tenha 500 livros diferentes." },
  { nameNl: "Boekenlezer (Astralis)", nameEn: "Book Reader (Astralis)", nameEs: "Lector de Libros (Astralis)", namePt: "Leitor de Livros (Astralis)", nameFr: "Lecteur de livres (Astralis)", nameDe: "Leser (Astralis)", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Spook bij Jou Thuis", nameEn: "Ghost at Your House", nameEs: "Fantasma en tu Casa", namePt: "Fantasma na sua Casa", nameFr: "Fantôme chez toi", nameDe: "Geist bei dir zu Hause", emoji: "👻", hidden: true, iconKey: null,
    howToNl: "Krijg 200 likes bij jou thuis tijdens Verstoppertje Feest (inclusief jezelf).", howToEn: "Get 200 likes at your home during Hide-and-Seek Party (including your own).", howToEs: "Consigue 200 likes en tu casa durante la Fiesta del Escondite (incluyéndote a ti).", howToPt: "Consiga 200 curtidas na sua casa durante a Festa do Esconde-Esconde (incluindo você)." },
  { nameNl: "Hart Gezet op de Lucht", nameEn: "Heart Set on the Sky", nameEs: "Corazón Puesto en el Cielo", namePt: "Coração Voltado para o Céu", nameFr: "Le cœur tourné vers le ciel", nameDe: "Mit dem Herzen in der Luft", emoji: "🎈", hidden: true, iconKey: "heart-set-on-the-sky",
    howToNl: "Behaal alle titels van het Luchtballon-event.", howToEn: "Earn all titles from the Hot Air Balloon event.", howToEs: "Consigue todos los títulos del evento del Globo Aerostático.", howToPt: "Consiga todos os títulos do evento do Balão de Ar Quente." },
  { nameNl: "Met de Wind Mee", nameEn: "Ride the Wind", nameEs: "Cabalgando el Viento", namePt: "Cavalgando o Vento", nameFr: "Chevaucher le vent", nameDe: "Mit dem Wind reiten", emoji: "🎈", hidden: true, iconKey: null,
    howToNl: "Vind alle paaseieren tijdens het Luchtballon-event in de stad.", howToEn: "Find all the easter eggs during the town Hot Air Balloon event.", howToEs: "Encuentra todos los huevos de pascua durante el evento del Globo Aerostático en el pueblo.", howToPt: "Encontre todos os ovos de páscoa durante o evento do Balão de Ar Quente na cidade." },
  { nameNl: "Opruimmeester", nameEn: "Cleanup Master", nameEs: "Maestro de la Limpieza", namePt: "Mestre da Limpeza", nameFr: "Maître du rangement", nameDe: "Aufräummeister", emoji: "🌊", hidden: true, iconKey: "cleanup-master" },
];

function howToByLang(r: BadgeRaw, language: Language): string | null {
  if (!r.howToEn) return null;
  if (language === 'es') return r.howToEs ?? r.howToEn;
  if (language === 'pt') return r.howToPt ?? r.howToEn;
  if (language === 'fr') return r.howToEn;
  if (language === 'de') return r.howToEn;
  if (language === 'en') return r.howToEn;
  return r.howToNl ?? r.howToEn;
}

export function useBadges(): BadgeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      BADGES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : language === 'en' ? r.nameEn : r.nameNl,
    emoji: r.emoji,
    hidden: r.hidden,
    iconKey: r.iconKey,
    howTo: howToByLang(r, language),
      })),
    [language]
  );
}
