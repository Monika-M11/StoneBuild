/**
 * Theme for Pinterest-inspired social media UI
 * Palette: #574964 (primary dark purple), #9F8383 (accent), #C8AAAA (bg light), #FFDAB3 (highlight peach)
 */

import { Platform } from 'react-native';

const palette = {
  primary: '#574964',
  accent: '#9F8383',
  backgroundLight: '#C8AAAA',
  highlight: '#FFDAB3',
  white: '#FFFFFF',
  black: '#000000',
};

export const Colors = {
  light: {
    text: palette.primary,
    background: palette.backgroundLight,
    tint: palette.highlight,
    icon: palette.accent,
    tabIconDefault: palette.accent,
    tabIconSelected: palette.highlight,
    primary: palette.primary,
    accent: palette.accent,
    highlight: palette.highlight,
    gradientStart: palette.highlight,
    gradientEnd: palette.backgroundLight,
    inputBg: palette.white,
    inputBorder: palette.accent,
  },
  dark: {
    text: palette.white,
    background: palette.primary,
    tint: palette.highlight,
    icon: palette.accent,
    tabIconDefault: palette.accent,
    tabIconSelected: palette.highlight,
    primary: palette.primary,
    accent: palette.accent,
    highlight: palette.highlight,
    gradientStart: palette.highlight,
    gradientEnd: palette.primary,
    inputBg: palette.primary + 'CC',
    inputBorder: palette.accent,
  },
};

export const Shadows = {
  card: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: palette.highlight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Hook to get theme colors
export function useThemeColor(paletteName, colorScheme) {
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return theme[paletteName];
}
