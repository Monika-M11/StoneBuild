import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'current-password' | 'new-password' | 'username';
  focusedField: string | null;
  fieldId: string;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  focusedField,
  fieldId,
}: AuthInputProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');

  const inputBorderDynamic = focusedField === fieldId ? primaryDark : inputBorder + '66';

  return (
    <View style={[styles.inputGroup, { borderColor: inputBorderDynamic }]}>
      <Text style={[styles.inputLabel, { color: Colors.light.icon }]}>{label}</Text>
      <TextInput
        style={[styles.input, { color: Colors.light.text, fontFamily: theme.fonts.regular }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  inputLabel: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
  },
});
