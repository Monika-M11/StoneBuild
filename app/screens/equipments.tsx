import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const EQUIPMENT = [
  { id: '1', name: 'Excavator JD 75G', status: 'Active', site: 'Site A', due: '10 Apr 2026' },
  { id: '2', name: 'Concrete Mixer CM-500', status: 'Idle', site: 'Main Store', due: '—' },
  { id: '3', name: 'Tower Crane TC-200', status: 'Active', site: 'Site B', due: '15 Apr 2026' },
  { id: '4', name: 'Bulldozer BD-150', status: 'Maintenance', site: 'Workshop', due: '08 Apr 2026' },
  { id: '5', name: 'Generator 50KVA', status: 'Active', site: 'Site A', due: '—' },
];

const statusColor: Record<string, string> = {
  Active: '#22c55e',
  Idle: '#f59e0b',
  Maintenance: '#ef4444',
};

export default function EquipmentsScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Equipments" icon="construct-outline">
      <FlatList
        data={EQUIPMENT}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.top}>
              <Text style={[styles.name, { fontFamily: theme.fonts.bold }]}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor[item.status] + '22' }]}>
                <Text style={[styles.statusText, { fontFamily: theme.fonts.bold, color: statusColor[item.status] }]}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { fontFamily: theme.fonts.regular }]}>Site:</Text>
              <Text style={[styles.value, { fontFamily: theme.fonts.medium }]}>{item.site}</Text>
              <Text style={[styles.label, { fontFamily: theme.fonts.regular, marginLeft: 20 }]}>Due:</Text>
              <Text style={[styles.value, { fontFamily: theme.fonts.medium }]}>{item.due}</Text>
            </View>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, color: Colors.light.text, flex: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 11 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  label: { fontSize: 12, color: Colors.light.icon },
  value: { fontSize: 12, color: Colors.light.text },
});

