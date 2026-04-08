
import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/providers/ThemeProvider';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

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

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'current-password' | 'new-password' | 'username';
  focusedField: string | null;
  fieldId: string;
  inputMode?: InputMode;
  error?: string | null;
  placeholder?: string; 
  editable?: boolean;
}

function applyTransform(text: string, mode: InputMode): string {
  switch (mode) {
    case 'allCaps':
      return text.toUpperCase();

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
      return text
        .toLowerCase()
        .replace(/[^a-z0-9@._+-]/g, '')
        .replace(/[@.]{2,}/g, '@');

    default:
      return text;
  }
}

function formatOnBlur(text: string, mode: InputMode): string {
  if (mode === 'amount') {
    const num = parseFloat(text);
    if (isNaN(num)) return '';
    return num.toFixed(2);
  }
  return text;
}

function resolveKeyboardType(
  mode: InputMode,
  override?: AuthInputProps['keyboardType']
): AuthInputProps['keyboardType'] {
  if (override) return override;
  if (mode === 'email') return 'email-address';
  if (mode === 'amount') return 'decimal-pad';
  if (mode === 'phone' || mode === 'wholeNumber' || mode === 'numeric') return 'number-pad';
  return 'default';
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  focusedField,
  fieldId,
  inputMode = 'default',
  error,
  placeholder,
  editable,
}: AuthInputProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');

  const isFocused = focusedField === fieldId;
  const isActive = isFocused || value.length > 0;
  const hasError = !!error;

  const animValue = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: isActive ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isActive, animValue]);

  // Dynamic border color (Red on error → Primary on focus → Gray default like NewInput)
  const borderColor = hasError
    ? '#ef4444'
    : isFocused
    ? primaryDark
    : '#e5e7eb';

  const labelTop = animValue.interpolate({ inputRange: [0, 1], outputRange: [14, -9] });
  const labelFontSize = animValue.interpolate({ inputRange: [0, 1], outputRange: [16, 11] });
  const labelColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      Colors.light.icon,
      hasError ? '#ef4444' : isFocused ? primaryDark : Colors.light.icon,
    ],
  });

  const handleChangeText = (text: string) => {
    onChangeText(applyTransform(text, inputMode));
  };

  const handleBlur = () => {
    const formatted = formatOnBlur(value, inputMode);
    if (formatted !== value) onChangeText(formatted);
    onBlur();
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, { borderColor }]}>
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
              backgroundColor: Colors.light.background,
              paddingHorizontal: isActive ? 4 : 0,
              fontFamily: isActive ? 'SourceSans3_500Medium' : theme.fonts.regular,
              letterSpacing: isActive ? 0.8 : 0,
              // @ts-ignore
              textTransform: isActive ? 'uppercase' : 'none',
            },
          ]}
          pointerEvents="none"
        >
          {label}
        </Animated.Text>

        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={secureTextEntry}
          keyboardType={resolveKeyboardType(inputMode, keyboardType)}
          autoCapitalize={
            inputMode === 'allCaps' ||
            inputMode === 'capitalize' ||
            inputMode === 'sentenceCase' ||
            inputMode === 'email'
              ? 'none'
              : autoCapitalize
          }
          autoComplete={autoComplete}
          editable={editable ?? true}
        />
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,        // Same as NewInput
  },
  inputContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,          // Changed from 1.5 to match NewInput style
    borderRadius: 12,        // Changed from 14 to match NewInput
    paddingHorizontal: 14,   // From NewInput
    paddingVertical: 12,     // From NewInput (gives better height)
    minHeight: 52,           // From NewInput - this is what you wanted
  },
  floatingLabel: {
    position: 'absolute',
    left: 14,                // Adjusted to match padding
    zIndex: 10,
  },
  textInput: {
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 0,
    // The container's paddingVertical + minHeight will control overall height
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
  },
});