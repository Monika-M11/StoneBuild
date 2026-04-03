import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface PrimaryButtonProps {
  onPress: () => void;
  children: string | React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
}

export default function PrimaryButton({
  onPress,
  children,
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: theme.colors.primaryDark },
        disabled && styles.disabled,
        style,
      ]}
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
    height: 56,
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

