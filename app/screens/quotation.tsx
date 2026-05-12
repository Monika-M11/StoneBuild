import Footer from '@/components/Footer';
import ScreenPage from '@/components/ScreenPage';
import Colors from '@/constants/theme';
import { useDrawer } from '@/contexts/DrawerContext';
import { DefaultText, useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Quotation() {
  const { openDrawer } = useDrawer();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('');

  const quotations = [
    { id: '1', customer: 'John', amount: '₹50,000', status: 'Approved' },
    { id: '2', customer: 'Ravi', amount: '₹75,000', status: 'Pending' },
    { id: '3', customer: 'Arun', amount: '₹30,000', status: 'Rejected' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#16a34a';
      case 'Pending':
        return '#f59e0b';
      case 'Rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <DefaultText style={[styles.name, { fontFamily: theme.fonts.bold }]}>
          {item.customer}
        </DefaultText>
        <DefaultText style={styles.amount}>{item.amount}</DefaultText>
      </View>

      <View style={styles.right}>
        <DefaultText
          style={[styles.status, { color: getStatusColor(item.status) }]}
        >
          {item.status}
        </DefaultText>

        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </View>
  );

  return (
    <ScreenPage title="Quotation" onMenuPress={openDrawer}>
      <View style={styles.container}>
        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={18} color="#fff" />
          <DefaultText style={styles.addText}>Create Quotation</DefaultText>
        </TouchableOpacity>

        <FlatList
          data={quotations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
            <Footer activeTab={activeTab} onTabChange={setActiveTab} />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  addBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primaryDark,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 6,
  },
  addText: { color: '#fff', fontWeight: '600' },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },

  name: { fontSize: 16, color: Colors.light.text },
  amount: { fontSize: 13, color: '#6b7280' },

  right: { alignItems: 'flex-end', justifyContent: 'center' },
  status: { fontSize: 13, marginBottom: 4 },
});