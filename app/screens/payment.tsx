import Footer from '@/components/Footer';
import Colors from '@/constants/theme';
import { DefaultText, useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('payment');

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
            <Ionicons name="card-outline" size={20} color={Colors.light.primaryDark} />
            <DefaultText style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Payment</DefaultText >
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <DefaultText  style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>
            Payment Page
          </DefaultText >
        </View>

        {/* FOOTER */}
        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
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
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bodyText: { fontSize: 16, color: Colors.light.text },
});

