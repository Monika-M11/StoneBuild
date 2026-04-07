import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../constants/theme';
import { useTheme } from '../providers/ThemeProvider';

export type InputMode =
  | 'default'
  | 'allCaps'
  | 'capitalize'
  | 'sentenceCase'
  | 'amount'
  | 'phone'
  | 'wholeNumber'
  | 'alphanumeric'
  | 'numeric'
  | 'email';

interface NewInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  fieldId: string;
  focusedField: string | null;
  inputMode?: InputMode;
  error?: string | null;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad' | 'decimal-pad';
}

function applyTransform(text: string, mode: InputMode): string {
  switch (mode) {
    case 'allCaps': return text.toUpperCase();
    case 'capitalize':
      return text.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
    case 'sentenceCase':
      return text.length === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'amount':
      return text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    case 'phone': {
      let digits = text.replace(/[^0-9]/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      if (digits.length > 0 && !'6789'.includes(digits[0])) return '';
      return digits;
    }
    case 'wholeNumber':
    case 'numeric':
      return text.replace(/[^0-9]/g, '');
    case 'alphanumeric':
      return text.replace(/[^a-zA-Z0-9]/g, '');
    case 'email':
      return text.toLowerCase().replace(/[^a-z0-9@._+-]/g, '').replace(/[@.]{2,}/g, '@');
    default:
      return text;
  }
}

export default function NewInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  fieldId,
  focusedField,
  inputMode = 'default',
  error,
  placeholder,
  keyboardType,
}: NewInputProps) {
  const theme = useTheme();
  const isFocused = focusedField === fieldId;
  const hasError = !!error;

  const borderColor = hasError 
    ? '#ef4444' 
    : isFocused 
    ? Colors.light.primaryDark 
    : '#ddd';

  const handleChangeText = (text: string) => {
    onChangeText(applyTransform(text, inputMode));
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
        />
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
  },
  textInput: {
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
  },
});
