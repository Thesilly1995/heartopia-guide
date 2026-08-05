export const COLORS = {
  bg: '#EFF7EC',
  card: '#FFFFFF',
  coral: '#FF8FA3',
  coralDark: '#E86E86',
  sky: '#6EC6E8',
  skyDark: '#4FA8CC',
  yellow: '#FFD166',
  forest: '#2B4739',
  forestSoft: '#6B8A7A',
  line: '#DCEBD8',
} as const;

export type ColorKey = keyof typeof COLORS;
