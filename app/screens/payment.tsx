import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const PAYMENTS = [
  { id: '1', to: 'Ravi Suppliers', date: '01 Apr 2026', amount: '₹25,000', mode: 'UPI', status: 'Paid' },
  { id: '2', to: 'Labour Contractor', date: '02 Apr 2026', amount: '₹18,000', mode: 'Cash', status: 'Paid' },
  { id: '3', to: 'Steel Traders', date: '03 Apr 2026', amount: '₹55,000', mode: 'NEFT', status: 'Pending' },
  { id: '4', to: 'Cement Corp', date: '04 Apr 2026', amount: '₹30,000', mode: 'Cheque', status: 'Paid' },
  { id: '5', to: 'Site Electrician', date: '04 Apr 2026', amount: '₹8,500', mode: 'UPI', status: 'Pending' },
];

export default function PaymentScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Payment" icon="card-outline">
      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={[styles.totalLabel, { fontFamily: theme.fonts.regular }]}>Total Paid This Month</Text>
        <Text style={[styles.totalValue, { fontFamily: theme.fonts.bold }]}>₹1,36,500</Text>
      </View>
      <FlatList
        data={PAYMENTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.left}>
              <Text style={[styles.to, { fontFamily: theme.fonts.bold }]}>{item.to}</Text>
              <Text style={[styles.date, { fontFamily: theme.fonts.regular }]}>{item.date} · {item.mode}</Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.amount, { fontFamily: theme.fonts.bold }]}>{item.amount}</Text>
              <Text style={[styles.status, { fontFamily: theme.fonts.medium, color: item.status === 'Paid' ? '#22c55e' : '#f59e0b' }]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  totalBox: {
    margin: 16, backgroundColor: Colors.light.primaryDark, borderRadius: 16,
    padding: 20, alignItems: 'center',
  },
  totalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  totalValue: { fontSize: 28, color: '#fff', marginTop: 4 },
  list: { paddingHorizontal: 16, gap: 10 },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  left: { flex: 1 },
  to: { fontSize: 14, color: Colors.light.text },
  date: { fontSize: 12, color: Colors.light.icon, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 15, color: Colors.light.primaryDark },
  status: { fontSize: 11, marginTop: 2 },
});

