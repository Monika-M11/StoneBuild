import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/theme';
import { useTheme } from '../../providers/ThemeProvider';

export default function TermsAndConditionsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="document-text-outline" size={20} color={Colors.light.primaryDark} />
            <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
              Terms & Conditions
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Replace everything inside here with your real content later */}

          <Text style={styles.lastUpdated}>Last updated: April 2025</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.body}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          <Text style={styles.sectionTitle}>2. Use of the App</Text>
          <Text style={styles.body}>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
          <Text style={styles.body}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Collection</Text>
          <Text style={styles.body}>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          <Text style={styles.sectionTitle}>5. Contact Us</Text>
          <Text style={styles.body}>
            If you have any questions about these Terms, please contact us at support@yourapp.com.
          </Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },

  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

  content: {
    padding: 20,
    paddingBottom: 60,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 20,
  },
  body: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
});