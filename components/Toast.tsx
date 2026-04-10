import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function Toast({ title, message, type = 'info' }: Props) {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  message: {
    color: '#fff',
    fontSize: 13,
  },
  success: { backgroundColor: '#16a34a' },
  error: { backgroundColor: '#dc2626' },
  info: { backgroundColor: '#2563eb' },
});