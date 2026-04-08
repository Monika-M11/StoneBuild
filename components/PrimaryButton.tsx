import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

interface PrimaryButtonProps {
  onPress: () => void;
  children: string | React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  variant?: 'primary' | 'secondary';
}

export default function PrimaryButton({
  onPress,
  children,
  loading = false,
  disabled = false,
  style,
  variant = 'primary',
}: PrimaryButtonProps) {
  const theme = useTheme();

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: variant === 'secondary' 
        ? theme.colors.primaryDark + '66' 
        : theme.colors.primaryDark,
      opacity: variant === 'secondary' ? 0.8 : 1,
    },
    disabled && styles.disabled,
    style,
  ];

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: 'SourceSans3_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

