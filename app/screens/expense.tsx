import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
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

export default function ExpenseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState('expense');


  const dummyExpenses = [
    { 
      id: '1', 
      date: '08/04/2026', 
      category: 'Fuel', 
      amount: '2450', 
      mode: 'Cash' 
    },
    { 
      id: '2', 
      date: '07/04/2026', 
      category: 'Maintenance', 
      amount: '12500', 
      mode: 'Bank Transfer' 
    },
    { 
      id: '3', 
      date: '06/04/2026', 
      category: 'Salary', 
      amount: '45000', 
      mode: 'Bank Transfer' 
    },
    { 
      id: '4', 
      date: '05/04/2026', 
      category: 'Travel', 
      amount: '3200', 
      mode: 'Cash' 
    },
  ];

  const renderExpenseItem = ({ item }: any) => (
    <TouchableOpacity style={styles.expenseItem} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name="wallet-outline" size={24} color={Colors.light.primaryDark} />
      </View>
      <View style={styles.expenseInfo}>
        <Text style={[styles.expenseCategory, { fontFamily: theme.fonts.bold }]}>
          {item.category}
        </Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <Text style={styles.mode}>{item.mode}</Text>
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
              <Ionicons name="wallet-outline" size={20} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
                Expense
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/screens/addExpenses' as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <FlatList
              data={dummyExpenses}
              keyExtractor={(item) => item.id}
              renderItem={renderExpenseItem}
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

  expenseItem: {
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
  expenseInfo: { flex: 1 },
  expenseCategory: { fontSize: 16, color: Colors.light.text },
  expenseDate: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  amountContainer: { alignItems: 'flex-end' },
  amount: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: Colors.light.primaryDark 
  },
  mode: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 2 
  },
});