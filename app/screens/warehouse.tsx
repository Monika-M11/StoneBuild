import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const WAREHOUSES = [
  { id: '1', name: 'Main Store', location: 'Coimbatore', items: 142, capacity: '80%' },
  { id: '2', name: 'Site A Store', location: 'Tiruppur', items: 87, capacity: '55%' },
  { id: '3', name: 'Site B Store', location: 'Erode', items: 34, capacity: '20%' },
  { id: '4', name: 'Transit Hub', location: 'Salem', items: 19, capacity: '35%' },
];

export default function WarehouseScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Warehouse" icon="business-outline">
      <FlatList
        data={WAREHOUSES}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="business-outline" size={22} color={Colors.light.primaryDark} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { fontFamily: theme.fonts.bold }]}>{item.name}</Text>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={12} color={Colors.light.icon} />
                <Text style={[styles.sub, { fontFamily: theme.fonts.regular }]}>{item.location}</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: item.capacity }]} />
              </View>
              <Text style={[styles.cap, { fontFamily: theme.fonts.regular }]}>Capacity: {item.capacity}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { fontFamily: theme.fonts.bold }]}>{item.items}</Text>
              <Text style={[styles.badgeLabel, { fontFamily: theme.fonts.regular }]}>items</Text>
            </View>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  iconBox: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '1A',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, color: Colors.light.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  sub: { fontSize: 12, color: Colors.light.icon },
  barBg: { height: 4, backgroundColor: Colors.light.inputBorder + '55', borderRadius: 2, marginTop: 8 },
  barFill: { height: 4, backgroundColor: Colors.light.primaryDark, borderRadius: 2 },
  cap: { fontSize: 11, color: Colors.light.icon, marginTop: 3 },
  badge: { alignItems: 'center' },
  badgeText: { fontSize: 20, color: Colors.light.primaryDark },
  badgeLabel: { fontSize: 10, color: Colors.light.icon },
});

