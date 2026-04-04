import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/providers/ThemeProvider';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

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

  const labelTop = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -9],
  });

  const labelFontSize = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });

  const labelColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.icon, isFocused ? primaryDark : Colors.light.icon],
  });

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
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
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

