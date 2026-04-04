import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

const CONTACTS = [
  { id: '1', name: 'Arjun Mehta', role: 'Supplier', phone: '+91 98400 11111', initial: 'A' },
  { id: '2', name: 'Priya Nair', role: 'Client', phone: '+91 98400 22222', initial: 'P' },
  { id: '3', name: 'Ravi Kumar', role: 'Contractor', phone: '+91 98400 33333', initial: 'R' },
  { id: '4', name: 'Shalini Das', role: 'Vendor', phone: '+91 98400 44444', initial: 'S' },
  { id: '5', name: 'Vikram Singh', role: 'Client', phone: '+91 98400 55555', initial: 'V' },
  { id: '6', name: 'Meena Iyer', role: 'Supplier', phone: '+91 98400 66666', initial: 'M' },
];

export default function ContactsScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Contacts" icon="people-outline">
      <FlatList
        data={CONTACTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={[styles.avatarText, { fontFamily: theme.fonts.bold }]}>{item.initial}</Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { fontFamily: theme.fonts.bold }]}>{item.name}</Text>
              <Text style={[styles.role, { fontFamily: theme.fonts.regular }]}>{item.role}</Text>
              <Text style={[styles.phone, { fontFamily: theme.fonts.regular }]}>{item.phone}</Text>
            </View>
            <Ionicons name="call-outline" size={20} color={Colors.light.primaryDark} />
          </View>
        )}
      />
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  separator: { height: 0 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 4,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.light.primaryDark + '1A',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, color: Colors.light.primaryDark },
  info: { flex: 1 },
  name: { fontSize: 15, color: Colors.light.text },
  role: { fontSize: 12, color: Colors.light.icon, marginTop: 1 },
  phone: { fontSize: 12, color: Colors.light.icon, marginTop: 1 },
});

