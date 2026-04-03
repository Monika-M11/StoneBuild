const lightColors = {
  primaryDark: '#3C467B',
  primary: '#50589C',
  primaryLight: '#636CCB',
  highlight: '#6E8CFB',
  accent: '#6E8CFB',

  background: '#FFFFFF',
  white: '#FFFFFF',
  text: '#1E1E2C',
  textSecondary: '#6B7280',
  icon: '#9CA3AF',
  inputBg: '#F9FAFB',
  inputBorder: '#E5E7EB',
  border: '#E5E7EB',
};

const darkColors = {
  primaryDark: '#5A64B6',
  primary: '#6D75C8',
  primaryLight: '#8C96E6',
  highlight: '#9FB4FF',
  accent: '#9FB4FF',

  background: '#0F0F23',
  white: '#F8FAFC',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  icon: '#94A3B8',
  inputBg: '#1E1B29',
  inputBorder: '#334155',
  border: '#334155',
};

const Colors = {
  light: lightColors,
  dark: darkColors,
  ...lightColors,  // Preserve flat access for backward compat
};

export { darkColors, lightColors };

export const Fonts = {
  regular: 'SourceSans3_400Regular',
  medium: 'SourceSans3_500Medium',
  bold: 'SourceSans3_700Bold',
  size: {
    base: 16,
    small: 14,
    large: 18,
    title: 24,
  },
};

export default Colors;
