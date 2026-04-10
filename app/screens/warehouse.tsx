import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer from '../../components/Footer';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

export default function WarehouseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('warehouse');

  const dummyWarehouses = [
    { id: '1', name: 'Main Warehouse - Coimbatore', location: 'Coimbatore', incharge: 'Ramesh Kumar' },
    { id: '2', name: 'North Zone Warehouse', location: 'Chennai', incharge: 'Priya Sharma' },
    { id: '3', name: 'South Storage Yard', location: 'Madurai', incharge: 'Karthik Raj' },
  ];

  const renderWarehouseItem = ({ item }: any) => (
    <TouchableOpacity style={styles.warehouseItem} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name="business-outline" size={24} color={Colors.light.primaryDark} />
      </View>
      <View style={styles.warehouseInfo}>
        <DefaultText 
          style={[styles.warehouseName, { fontFamily: theme.fonts.bold }]}
        >
          {item.name}
        </DefaultText>
        <DefaultText style={styles.warehouseLocation}>
          {item.location}
        </DefaultText>
        <DefaultText style={styles.warehouseIncharge}>
          Incharge: {item.incharge}
        </DefaultText>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={openDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="menu" size={26} color={Colors.light.primaryDark} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Ionicons name="business-outline" size={20} color={Colors.light.primaryDark} />
              <DefaultText 
                style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}
              >
                Warehouse
              </DefaultText>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/screens/addWarehouse' as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <FlatList
              data={dummyWarehouses}
              keyExtractor={(item) => item.id}
              renderItem={renderWarehouseItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>

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
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },

  warehouseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  warehouseInfo: { flex: 1 },
  warehouseName: { fontSize: 16, color: Colors.light.text },
  warehouseLocation: { fontSize: 13, color: '#2563eb', marginTop: 2 },
  warehouseIncharge: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});