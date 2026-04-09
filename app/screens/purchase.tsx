import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { useTheme } from '../../providers/ThemeProvider';

export default function PurchaseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('purchase');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* HEADER - Same as Warehouse Screen */}
          <View style={styles.header}>
            {/* Menu Button (Drawer) */}
            <TouchableOpacity
              onPress={openDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
            </TouchableOpacity>

            {/* Center Title */}
            <View style={styles.headerCenter}>
              <Ionicons name="cart-outline" size={20} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
                Purchase
              </Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={() => router.push('/screens/addPurchase' as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            <Text style={[styles.bodyText, { fontFamily: theme.fonts.regular }]}>
              Purchase Page
            </Text>
          </View>

          {/* FOOTER */}
          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  headerCenter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  headerTitle: { 
    fontSize: 20, 
    color: Colors.light.primaryDark 
  },

  body: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bodyText: { 
    fontSize: 16, 
    color: Colors.light.text 
  },
});