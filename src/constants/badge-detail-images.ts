import type { ImageSourcePropType } from 'react-native';

interface BadgeDetailImage {
  source: ImageSourcePropType;
  /** Breedte/hoogte van de afbeelding, voor correcte weergave in de zoom-popup. */
  aspectRatio: number;
}

/**
 * Extra afbeelding per badge (bv. een titelslijst of easter-egg-gids),
 * getoond via een knopje onder de "hoe behaal je dit"-tekst (Premium-only).
 */
export const BADGE_DETAIL_IMAGE_MAP: Record<string, BadgeDetailImage> = {
  'sea-fishing-master-titles': {
    source: require('@/assets/images/badge-details/sea-fishing-master-titles.jpg'),
    aspectRatio: 896 / 1200,
  },
  'onsen-mountain-insect-king-titles': {
    source: require('@/assets/images/badge-details/onsen-mountain-insect-king-titles.jpg'),
    aspectRatio: 896 / 1200,
  },
  'heart-set-on-the-sky-titles': {
    source: require('@/assets/images/badge-details/heart-set-on-the-sky-titles.jpg'),
    aspectRatio: 896 / 1200,
  },
  'ride-the-wind-easter-eggs': {
    source: require('@/assets/images/badge-details/ride-the-wind-easter-eggs.jpg'),
    aspectRatio: 896 / 1200,
  },
};
