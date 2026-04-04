import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const EXPENSES = [
  { id: '1', category: 'Fuel', desc: 'Diesel for vehicles', date: '01 Apr', amount: '₹4,200' },
  { id: '2', category: 'Food', desc: 'Labour site meals', date: '02 Apr', amount: '₹2,800' },
  { id: '3', category: 'Transport', desc: 'Material delivery', date: '02 Apr', amount: '₹6,000' },
  { id: '4', category: 'Tools', desc: 'Drill bits & blades', date: '03 Apr', amount: '₹1,500' },
  { id: '5', category: 'Misc', desc: 'Office supplies', date: '04 Apr', amount: '₹900' },
];

const catColor: Record<string, string> = {
  Fuel: '#f97316', Food: '#22c55e', Transport: '#3b82f6',
  Tools: '#8b5cf6', Misc: '#f59e0b',
};

export default function ExpenseScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Expense" icon="wallet-outline">
      <View style={styles.totalBox}>
        <Text style={[styles.totalLabel, { fontFamily: theme.fonts.regular }]}>Total Expenses — April 2026</Text>
        <Text style={[styles.totalValue, { fontFamily: theme.fonts.bold }]}>₹15,400</Text>
      </View>
      <FlatList
        data={EXPENSES}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.catDot, { backgroundColor: catColor[item.category] + '22' }]}>
              <Text style={[styles.catText, { fontFamily: theme.fonts.bold, color: catColor[item.category] }]}>{item.category[0]}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.desc, { fontFamily: theme.fonts.medium }]}>{item.desc}</Text>
              <View style={styles.row}>
                <View style={[styles.catBadge, { backgroundColor: catColor[item.category] + '22' }]}>
                  <Text style={[styles.catLabel, { fontFamily: theme.fonts.bold, color: catColor[item.category] }]}>{item.category}</Text>
                </View>
                <Text style={[styles.date, { fontFamily: theme.fonts.regular }]}>{item.date}</Text>
              </View>
            </View>
            <Text style={[styles.amount, { fontFamily: theme.fonts.bold }]}>{item.amount}</Text>
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  totalBox: {
    margin: 16, backgroundColor: '#fff', borderRadius: 16, padding: 18,
    borderLeftWidth: 4, borderLeftColor: Colors.light.primaryDark,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  totalLabel: { fontSize: 12, color: Colors.light.icon },
  totalValue: { fontSize: 26, color: Colors.light.primaryDark, marginTop: 4 },
  list: { paddingHorizontal: 16, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  catDot: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  catText: { fontSize: 18 },
  info: { flex: 1 },
  desc: { fontSize: 14, color: Colors.light.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  catBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  catLabel: { fontSize: 10 },
  date: { fontSize: 11, color: Colors.light.icon },
  amount: { fontSize: 14, color: '#ef4444' },
});

