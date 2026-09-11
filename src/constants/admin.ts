/**
 * Lokale beheerderscode voor het verwijderen van losse feedback-items
 * (zie src/app/feedback.tsx). Dit is GEEN echte beveiliging — de code zit
 * gewoon in de JS-bundle en is dus uit te lezen door wie er moeite voor
 * doet. Het is puur een drempel tegen per ongeluk of achteloos verwijderen
 * door gewone bezoekers, niet een vervanging voor echte authenticatie.
 * Pas 'm gerust aan naar een eigen code.
 */
export const ADMIN_CODE = 'heartopia-beheer';
