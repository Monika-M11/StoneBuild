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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CRM() {
  const { openDrawer } = useDrawer();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('');

  const customers = [
    { id: '1', name: 'John Doe', phone: '9876543210', status: 'Active' },
    { id: '2', name: 'Ravi Kumar', phone: '9876543211', status: 'Inactive' },
    { id: '3', name: 'Arun S', phone: '9876543212', status: 'Active' },
  ];

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <DefaultText style={[styles.name, { fontFamily: theme.fonts.bold }]}>
          {item.name}
        </DefaultText>
        <DefaultText style={styles.phone}>{item.phone}</DefaultText>
      </View>

      <View style={styles.right}>
        <DefaultText
          style={[
            styles.status,
            { color: item.status === 'Active' ? '#16a34a' : '#ef4444' },
          ]}
        >
          {item.status}
        </DefaultText>

        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </View>
  );

  return (
    <ScreenPage title="CRM" onMenuPress={openDrawer}>
      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            placeholder="Search customers..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={18} color="#fff" />
          <DefaultText style={styles.addText}>Add Customer</DefaultText>
        </TouchableOpacity>

        {/* List */}
        <FlatList
          data={filtered}
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  input: { flex: 1, padding: 10 },

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
  phone: { fontSize: 13, color: '#6b7280' },

  right: { alignItems: 'flex-end', justifyContent: 'center' },
  status: { fontSize: 13, marginBottom: 4 },
});