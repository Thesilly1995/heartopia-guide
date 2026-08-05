import { useColorScheme } from 'react-native';

const light = {
  bg: '#EFF7EC',
  card: '#FFFFFF',
  surfaceSoft: '#F5FAF3',
  iconBg: '#F5FAF3',
  disclaimerBg: '#FFFBEF',
  disclaimerBorder: '#FBEBBD',
  chipBg: '#EAF4F4',
  warningBg: '#FFF6DC',
  warningBorder: '#F5E5A8',
  warningText: '#B8860B',
  forest: '#2B4739',
  forestSoft: '#6B8A7A',
  line: '#DCEBD8',
  coral: '#FF8FA3',
  coralDark: '#E86E86',
  sky: '#6EC6E8',
  skyDark: '#4FA8CC',
  yellow: '#FFD166',
} as const;

const dark = {
  bg: '#121B16',
  card: '#1E2C24',
  surfaceSoft: '#25352C',
  iconBg: '#25352C',
  disclaimerBg: '#2E2A18',
  disclaimerBorder: '#4A4126',
  chipBg: '#1D3034',
  warningBg: '#332B18',
  warningBorder: '#4F4423',
  warningText: '#E8C468',
  forest: '#EAF3EA',
  forestSoft: '#9AB3A5',
  line: '#2C3D33',
  coral: '#FF8FA3',
  coralDark: '#FF9CB0',
  sky: '#6EC6E8',
  skyDark: '#7DD3F5',
  yellow: '#FFD166',
} as const satisfies Record<keyof typeof light, string>;

export type ThemeColors = Record<keyof typeof light, string>;
export type ColorKey = keyof ThemeColors;

/** Statische lichte kleuren — alleen gebruiken buiten componenten (bv. in data-bestanden voor typing). Voor UI altijd useHeartopiaColors(). */
export const COLORS = light;

export function useHeartopiaColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
