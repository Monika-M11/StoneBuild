import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const ENTRIES = [
  { id: '1', date: '01 Apr 2026', desc: 'Sales Invoice #1021', type: 'credit', amount: '₹45,000' },
  { id: '2', date: '02 Apr 2026', desc: 'Material Purchase', type: 'debit', amount: '₹12,500' },
  { id: '3', date: '02 Apr 2026', desc: 'Labour Payment', type: 'debit', amount: '₹8,000' },
  { id: '4', date: '03 Apr 2026', desc: 'Client Advance', type: 'credit', amount: '₹60,000' },
  { id: '5', date: '03 Apr 2026', desc: 'Equipment Rent', type: 'debit', amount: '₹5,500' },
  { id: '6', date: '04 Apr 2026', desc: 'Sales Invoice #1022', type: 'credit', amount: '₹32,000' },
];

export default function LedgerScreen() {
  const theme = useTheme();
  const total = { credit: '₹1,37,000', debit: '₹26,000' };

  return (
    <ScreenPage title="Ledger" icon="book-outline">
      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: '#22c55e' }]}>
          <Text style={[styles.summaryLabel, { fontFamily: theme.fonts.regular }]}>Total Credit</Text>
          <Text style={[styles.summaryValue, { fontFamily: theme.fonts.bold, color: '#22c55e' }]}>{total.credit}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: '#ef4444' }]}>
          <Text style={[styles.summaryLabel, { fontFamily: theme.fonts.regular }]}>Total Debit</Text>
          <Text style={[styles.summaryValue, { fontFamily: theme.fonts.bold, color: '#ef4444' }]}>{total.debit}</Text>
        </View>
      </View>

      <FlatList
        data={ENTRIES}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: item.type === 'credit' ? '#22c55e' : '#ef4444' }]} />
            <View style={styles.rowInfo}>
              <Text style={[styles.rowDesc, { fontFamily: theme.fonts.medium }]}>{item.desc}</Text>
              <Text style={[styles.rowDate, { fontFamily: theme.fonts.regular }]}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, { fontFamily: theme.fonts.bold, color: item.type === 'credit' ? '#22c55e' : '#ef4444' }]}>
              {item.type === 'credit' ? '+' : '-'}{item.amount}
            </Text>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', gap: 12, padding: 16 },
  summaryCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderLeftWidth: 4, elevation: 1, shadowColor: '#000',
    shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  summaryLabel: { fontSize: 11, color: Colors.light.icon },
  summaryValue: { fontSize: 18, marginTop: 4 },
  list: { paddingHorizontal: 16, gap: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowInfo: { flex: 1 },
  rowDesc: { fontSize: 14, color: Colors.light.text },
  rowDate: { fontSize: 11, color: Colors.light.icon, marginTop: 2 },
  amount: { fontSize: 14 },
});

