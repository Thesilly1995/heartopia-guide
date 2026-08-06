/**
 * URL van het los gehoste JSON-bestand met tijdgebonden content (rainbow-locaties,
 * meteorenregen-plekken, boom/fluoriet-plots van vandaag, en optioneel een override
 * van het huidige event). Zie docs/remote-content.md voor het exacte JSON-schema.
 *
 * Zolang dit `null` is, gebruikt de app overal de vast-gebakken standaardwaarden —
 * de app werkt dus prima zonder dat dit is ingevuld. Vul een URL in (bv. een raw
 * GitHub-link naar een JSON-bestand, of een Gist raw-link) zodra er een hostingplek
 * gekozen is, en die content kan daarna bijgewerkt worden zonder nieuwe appversie.
 */
export const REMOTE_CONTENT_URL: string | null =
  'https://raw.githubusercontent.com/thesilly1995/heartopia-guide/main/remote-content.json';
