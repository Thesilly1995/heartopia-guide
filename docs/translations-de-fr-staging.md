# Duits/Frans namen — staging (nog niet verwerkt in de app)

Doel van dit bestand: Duitse (en straks Franse) officiële in-game namen verzamelen
uit screenshots van spelers, zodat we die later in één keer kunnen verwerken zoals
bij Spaans/Portugees is gedaan (zie `docs/SESSION_LOG.md`, deel 54). Dit bestand
wordt **niet** door de app gelezen — het is puur een tussenopslag voor een
toekomstige sessie, net als bij crops/fish/insects/birds destijds via heartodex.com,
maar dan handmatig aangeleverd via screenshots omdat er geen betrouwbare DE/FR-wiki
bestaat.

Werkwijze: elke keer als er nieuwe screenshots binnenkomen, hieronder aanvullen.
Zodra er genoeg dekking is (en/of ook Franse namen binnen zijn), kan een sessie dit
verwerken naar `nameDe`/`nameFr`-velden in `src/data/fish.ts`, `src/data/birds.ts`
etc. — zelfde patroon als `nameEs`/`namePt`.

Betrouwbaarheid:
- ✅ zeker — eenduidige match met de Engelse naam in onze data
- 🟡 waarschijnlijk — sterke match, maar niet 100% zeker (bv. generieke naam met meerdere kandidaten)
- ❓ onzeker/niet meegenomen — naam was afgesneden op de screenshot, of geen duidelijke match gevonden

## Vissen (bron: screenshots Fischbeobachtung, 20 sep 2026)

| Engelse naam (in app) | Duitse naam | Zekerheid |
|---|---|---|
| European Perch | Flussbarsch | ✅ |
| Common Chub | Döbel | ✅ |
| Barbel | Barbe | ✅ |
| Streber | Streber | ✅ |
| Minnow | Minnow | ✅ (zelfde woord in DE) |
| Tench | Schleie | ✅ |
| Common Whitefish | Lavaret | ✅ |
| Crucian Carp | Karausche | ✅ |
| Sardine | Sardine | ✅ |
| Sea Bass | Wolfsbarsch | ✅ |
| Skipjack Tuna | Echter Bonito | ✅ |
| Beltfish | Großkopf-Haarschwanz | ✅ |
| Scad | Bastardmakrele | ✅ |
| Pumpkinseed | Ohrenbarsch | ✅ |
| European Smelt | Stint | ✅ |
| Ruffe | Kaulbarsch | ✅ |
| Seahorse | Seepferdchen | ✅ |
| Mussel | Muschel | ✅ |
| Tadpole | Kaulquappe | ✅ |
| European Crayfish | Edelkrebs | ✅ |
| Common Octopus | Gewöhnlicher Krake | ✅ |
| Atlantic Salmon | Atlantischer Lachs | ✅ |
| Hermit Crab | Einsiedlerkrebs | ✅ |
| Clownfish | Clownfisch | ✅ |
| Largemouth Bass | Forellenbarsch | ✅ |
| Common Carp | Karpfen | ✅ |
| Burbot | Quappe | ✅ |
| Goby | Grundel | ✅ |
| River Crab | Bachkrabbe | ✅ |
| Turbot | Steinbutt | ✅ |
| Butterfly Koi | Butterfly-Koi | ✅ |
| Trout | Forelle | ✅ |
| Common Rudd | Rotfeder | ✅ |
| Grayling | Europäische Äsche | ✅ |
| Edible Frog | Teichfrosch | ✅ |
| European Lobster | Europäischer Hummer | ✅ |
| Striped Red Mullet | Streifenbarbe | 🟡 |
| False Scad | Stachelmakrele | 🟡 |
| Anglerfish | Armflosser | 🟡 |
| Atlantic Pygmy Octopus | (Atlantische) Zwergkrake | 🟡 (naam afgesneden op screenshot) |
| — | Alburnoides | ❓ geen zekere match (mogelijk een ondersoort van Common Bleak, niet gegokt) |
| — | Weißfußgarnele | ❓ geen zekere match (Common Prawn of Oriental Shrimp, niet gegokt) |
| — | Atlantische Seekatze | ❓ geen match gevonden in onze lijst |
| — | Acanthodii | ❓ onduidelijk, mogelijk verkeerd gelezen |

## Vogels (bron: screenshots Vogelbeobachtungstagebuch, 20 sep 2026)

| Engelse naam (in app) | Duitse naam | Zekerheid |
|---|---|---|
| Eurasian Robin | Rotkehlchen | ✅ |
| Great Tit | Kohlmeise | ✅ |
| Eurasian Wren | Zaunkönig | ✅ |
| Eurasian Bullfinch | Gimpel | ✅ |
| Eurasian Chaffinch | Buchfink | ✅ |
| Blue-and-Yellow Macaw | Gelbbrustara | ✅ |
| Stock Dove | Hohltaube | ✅ |
| Eurasian Collared Dove | Türkentaube | ✅ |
| Blue Peafowl | Blauer Pfau | ✅ |
| Mallard | Stockente | ✅ |
| Long-Tailed Tit | Schwanzmeise | ✅ |
| Eurasian Nuthatch | Kleiber | ✅ |
| Bearded Reedling | Bartmeise | ✅ |
| Woodchat Shrike | Rotkopfwürger | ✅ |
| Wonga Pigeon | Wongataube | ✅ |
| Eurasian Wigeon | Pfeifente | ✅ |
| Seagull | Möwe | ✅ |
| Double-Barred Finch | Ringelastrild | ✅ |
| Great Green Macaw | Grünflügelara | ✅ |
| Ruddy Shelduck | Rostgans | ✅ |
| King Eider | Prachteiderente | ✅ |
| Audouin's Gull | Auduansmöwe | ✅ (schrijfwijze op screenshot mist een "u", waarschijnlijk "Audouinmöwe") |
| European Shag | Krähenscharbe | ✅ |
| White Wagtail | Bachstelze | ✅ |
| Pine Grosbeak | Hakengimpel | ✅ |
| Regent Bowerbird | Gelbnacken-Laubenvogel | ✅ |
| Yellow Bellied Flycatcher | Gelbbauch-Zwergtyrann | ✅ |
| European Bee-Eater | Bienenfresser | ✅ |
| Orange Hoopoe *(huidig event: Echo of Ancients)* | Oranger Wiedehopf | ✅ (uit event-detailscherm, "Echo der Urzeit") |
| Greater Flamingo *(of American/Lesser Flamingo — niet zeker welke)* | Flamingo | 🟡 |
| African Olive Pigeon | Oliventaube | 🟡 (naam deels afgesneden op screenshot) |
| — | Frühlingsgrüntaube | ❓ geen zekere match |
| — | (tweede) Schwanzmeise | ❓ mogelijk Silver-Throated Tit, maar Duits maakt daar geen onderscheid — twijfelachtig |
| — | Gelbe Fidschi-Flaumfußtaube | ❓ geen match gevonden ("Fidschi" = Fiji, staat niet in onze lijst) |
| — | "...ntfasan" (afgesneden) | ❓ mogelijk Lady Amherst Pheasant, niet zeker genoeg |

## Nog te doen
- Insecten, gewassen, recepten etc. in het Duits (nog geen screenshots van binnen)
- Alles in het Frans (nog geen screenshots van binnen)
- De ❓-items hierboven met meer/duidelijkere screenshots bevestigen
