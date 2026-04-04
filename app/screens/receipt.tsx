import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const RECEIPTS = [
  { id: 'RCP-001', from: 'Client A - Shankar Homes', date: '01 Apr 2026', amount: '₹75,000', method: 'NEFT' },
  { id: 'RCP-002', from: 'Client B - Green Builders', date: '02 Apr 2026', amount: '₹40,000', method: 'UPI' },
  { id: 'RCP-003', from: 'Client C - Urban Infra', date: '03 Apr 2026', amount: '₹1,20,000', method: 'Cheque' },
  { id: 'RCP-004', from: 'Client A - Shankar Homes', date: '04 Apr 2026', amount: '₹25,000', method: 'Cash' },
];

export default function ReceiptScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Receipt" icon="receipt-outline">
      <FlatList
        data={RECEIPTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text-outline" size={20} color={Colors.light.primaryDark} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.receiptId, { fontFamily: theme.fonts.bold }]}>{item.id}</Text>
              <Text style={[styles.from, { fontFamily: theme.fonts.medium }]}>{item.from}</Text>
              <Text style={[styles.date, { fontFamily: theme.fonts.regular }]}>{item.date} · {item.method}</Text>
            </View>
            <Text style={[styles.amount, { fontFamily: theme.fonts.bold }]}>{item.amount}</Text>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  iconBox: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: Colors.light.primaryDark + '1A',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  receiptId: { fontSize: 11, color: Colors.light.primaryDark },
  from: { fontSize: 13, color: Colors.light.text, marginTop: 2 },
  date: { fontSize: 11, color: Colors.light.icon, marginTop: 2 },
  amount: { fontSize: 15, color: '#22c55e' },
});

