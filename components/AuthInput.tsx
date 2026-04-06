import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/providers/ThemeProvider';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

/**
 * inputMode controls what transformation/validation is applied:
 *
 *  'default'        — no transformation
 *  'allCaps'        — every character forced to UPPERCASE
 *  'capitalize'     — first letter of each word capitalised, rest lowercase
 *  'sentenceCase'   — only the very first letter capitalised
 *  'amount'         — numeric with decimals; formats to X.XX on blur
 *  'wholeNumber'    — integers only, no decimals allowed
 *  'alphanumeric'   — strips all characters that are not A-Z, a-z, 0-9
 */
export type InputMode =
  | 'default'
  | 'allCaps'
  | 'capitalize'
  | 'sentenceCase'
  | 'amount'
  | 'phone'
  | 'wholeNumber'
  | 'alphanumeric';

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
}



function applyTransform(text: string, mode: InputMode): string {
  switch (mode) {
    case 'allCaps':
      return text.toUpperCase();


      return text.replace(/(^|[ \\t\\r\\n])[a-z]/g, c => c.toUpperCase());

    case 'sentenceCase':
      // Only the very first character capitalised
      if (text.length === 0) return text;
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    case 'amount':
      // Allow only digits and a single decimal point while typing
return text.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');

    case 'phone':
      // Only allow 10 digits, starting with 6,7,8,9
      let digits = text.replace(/[^0-9]/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      if (digits.length > 0 && !'6789'.includes(digits[0])) return '';
      return digits;

    case 'wholeNumber':
      // Strip everything that isn't a digit
      return text.replace(/[^0-9]/g, ''); 

    case 'alphanumeric':
      // Strip special characters; keep letters and digits
      return text.replace(/[^a-zA-Z0-9]/g, '');

    default:
      return text;
  }
}

function formatOnBlur(text: string, mode: InputMode): string {
  if (mode === 'amount') {
    const num = parseFloat(text);
    if (isNaN(num)) return '';
    return num.toFixed(2); // e.g. "5" → "5.00", "3.1" → "3.10"
  }
  return text;
}

// Derive best native keyboardType for each mode
function resolveKeyboardType(
  mode: InputMode,
  override?: AuthInputProps['keyboardType']
): AuthInputProps['keyboardType'] {
  if (override) return override;
  if (mode === 'amount') return 'decimal-pad';
  if (mode === 'phone' || mode === 'wholeNumber') return 'number-pad';
  return 'default';
}

// ─── Component ────────────────────────────────────────────────────────────────

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
}: AuthInputProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');

  const isFocused = focusedField === fieldId;
  const isActive = isFocused || value.length > 0;

  const animValue = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: isActive ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isActive, animValue]);

  const inputBorderDynamic = isFocused ? primaryDark : inputBorder + '66';

  const labelTop = animValue.interpolate({ inputRange: [0, 1], outputRange: [14, -9] });
  const labelFontSize = animValue.interpolate({ inputRange: [0, 1], outputRange: [16, 11] });
  const labelColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.icon, isFocused ? primaryDark : Colors.light.icon],
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChangeText = (text: string) => {
    const transformed = applyTransform(text, inputMode);
    onChangeText(transformed);
  };

  const handleBlur = () => {
    // Format amount to 2 decimal places when user leaves the field
    const formatted = formatOnBlur(value, inputMode);
    if (formatted !== value) onChangeText(formatted);
    onBlur();
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputGroup, { borderColor: inputBorderDynamic }]}>

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
          style={[
            styles.input,
            { color: Colors.light.text, fontFamily: theme.fonts.regular },
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={resolveKeyboardType(inputMode, keyboardType)}
          // Let our transform handle casing — disable native autoCapitalize
          autoCapitalize={
            inputMode === 'allCaps' || inputMode === 'capitalize' || inputMode === 'sentenceCase'
              ? 'none'
              : autoCapitalize
          }
          autoComplete={autoComplete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },
  inputGroup: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    overflow: 'visible',
  },
  floatingLabel: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
    height: 48,
  },
});
