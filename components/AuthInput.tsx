import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DefaultText, useTheme } from '@/providers/ThemeProvider';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

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
  focusedField: string | null;
  fieldId: string;
  inputMode?: InputMode;
  error?: string | null;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'current-password' | 'new-password' | 'username';
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
      return text.toLowerCase().replace(/[^a-z0-9@._+-]/g, '').replace(/[@.]{2,}/g, '@');
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

export default function AuthInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType,
  focusedField,
  fieldId,
  inputMode = 'default',
  error,
  placeholder,
  editable = true,
  multiline = false,
  autoCapitalize = 'none',
  numberOfLines,
}: AuthInputProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');

  const textInputRef = useRef<TextInput>(null);

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

  const handlePress = () => {
    if (editable) {
      textInputRef.current?.focus();
    }
  };

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
      <TouchableWithoutFeedback onPress={handlePress} accessible={false}>
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
                textTransform: isActive ? 'uppercase' : 'none',
              },
            ]}
            pointerEvents="none"
          >
            {label}
          </Animated.Text>

          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            value={value}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            // Important: This helps with better touch area
            textAlignVertical={multiline ? 'top' : 'center'}
            autoCapitalize={
            inputMode === 'allCaps' ||
            inputMode === 'capitalize' ||
            inputMode === 'sentenceCase' ||
            inputMode === 'email'
              ? 'none'
              : autoCapitalize
          }
          />
        </View>
      </TouchableWithoutFeedback>

      {hasError && (
        <DefaultText style={styles.errorText} variant="regular">
          {error}
        </DefaultText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,        // Increased vertical padding
    minHeight: 56,              // Slightly increased for better touch area
  },
  floatingLabel: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
  },
  textInput: {
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 2,         // Small padding so text doesn't overlap label
    minHeight: 24,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
  },
});