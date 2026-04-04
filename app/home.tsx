import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/Footer';
import { useDrawer } from '../contexts/DrawerContext';

export default function Home() {
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState<string>('home');
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={openDrawer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Home</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <Text style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>Home Screen Content</Text>
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
    height: 70, paddingHorizontal: 16, backgroundColor: Colors.light.background,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3, shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84,
  },
  headerTitle: { fontSize: 28, color: Colors.light.primaryDark },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bodyText: { fontSize: 16, color: Colors.light.text },
});

