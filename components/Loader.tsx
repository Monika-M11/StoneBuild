import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';

export default function Loader() {
  const theme = useTheme();

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
});