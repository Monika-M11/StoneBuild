import React, { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';
import Colors, { darkColors, Fonts, lightColors } from '../constants/theme';

interface Theme {
  colors: typeof Colors.light;
  fonts: typeof Fonts;
  dark: boolean;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const theme: Theme = {
    colors,
    fonts: Fonts,
    dark: isDark,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}


// DefaultText component to apply base font
import { Text, TextProps } from 'react-native';

interface DefaultTextProps extends TextProps {
  children: ReactNode;
  variant?: 'regular' | 'medium' | 'bold';
}

export function DefaultText({ style, variant = 'regular', ...props }: DefaultTextProps) {
  const theme = useTheme();
  const fontFamily = theme.fonts[variant as keyof typeof Fonts];
  const fontSize = theme.fonts.size.base;

  return (
    <Text
      {...props}
      style={[{ fontFamily, fontSize }, style]}
    />
  );
}
