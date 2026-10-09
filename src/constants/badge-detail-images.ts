import type { ImageSourcePropType } from 'react-native';

interface BadgeDetailImage {
  source: ImageSourcePropType;
  /** Breedte/hoogte van de afbeelding, voor correcte weergave in de zoom-popup. */
  aspectRatio: number;
}

/**
 * Extra afbeelding per badge (bv. een titelslijst of easter-egg-gids),
 * getoond via een knopje onder de "hoe behaal je dit"-tekst (Premium-only).
 * Leeg totdat de bijbehorende afbeeldingen zijn aangeleverd — badges.tsx
 * toont het knopje alleen als er voor die detailImageKey een entry bestaat.
 */
export const BADGE_DETAIL_IMAGE_MAP: Record<string, BadgeDetailImage> = {};
