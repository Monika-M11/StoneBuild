import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenPageProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export default function ScreenPage({ title, icon, children }: ScreenPageProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name={icon as any} size={20} color={Colors.light.primaryDark} />
            <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>{title}</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        <View style={styles.body}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },
  header: {
    height: 64, paddingHorizontal: 16, backgroundColor: Colors.light.background,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },
  body: { flex: 1 },
});

