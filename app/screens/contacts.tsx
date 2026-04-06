import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../../components/AuthInput'; // ← modular input
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';

type Contact = {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
};

const dummyContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', status: 'Online' },
  { id: '2', name: 'Bob Smith', status: 'Away' },
  { id: '3', name: 'Carol Williams', status: 'Busy' },
  { id: '4', name: 'David Brown', status: 'Online' },
  { id: '5', name: 'Emma Davis', status: 'Offline' },
];

type FormData = {
  name: string;
  age: string;
  phone: string;
  amount: string;
  alphanumeric: string;
};

export default function ContactsScreen() {
  const [activeTab, setActiveTab] = useState<string>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    phone: '',
    amount: '',
    alphanumeric: '',
  });

  const theme = useTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['50%', '92%'], []);

  const openFormSheet = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      age: '',
      phone: '',
      amount: '',
      alphanumeric: '',
    });
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedContact(null);
    setFocusedField(null);
  }, []);

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedField(fieldId);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const renderContactItem = useCallback(
    ({ item }: { item: Contact }) => (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => openFormSheet(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </Text>
          {item.status && <Text style={styles.contactStatus}>{item.status}</Text>}
        </View>
        <Ionicons name="person-outline" size={24} color={Colors.light.primaryDark} />
      </TouchableOpacity>
    ),
    [openFormSheet, theme]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Ionicons name="people-outline" size={20} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Contacts</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          {/* LIST */}
          <View style={styles.body}>
            <FlatList
              data={dummyContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        {/* BOTTOM SHEET */}
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onClose={() => setSelectedContact(null)}
        >
          {selectedContact && (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              {/* Fixed sheet header */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetAvatarContainer}>
                  <View style={styles.sheetAvatarPlaceholder}>
                    <Text style={styles.sheetAvatarText}>
                      {selectedContact.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetContactName, { fontFamily: theme.fonts.bold }]}>
                    {selectedContact.name}
                  </Text>
                  <Text style={styles.sheetStatus}>Fill User Details</Text>
                </View>
                <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <BottomSheetScrollView
                style={styles.formScrollView}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollViewIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <AuthInput
                  label="Name"
                  fieldId="name"
                  focusedField={focusedField}
                  value={formData.name}
                  onChangeText={handleInputChange('name')}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
inputMode="default"
                />

                <AuthInput
                  label="Age"
                  fieldId="age"
                  focusedField={focusedField}
                  value={formData.age}
                  onChangeText={handleInputChange('age')}
                  onFocus={() => handleFocus('age')}
                  onBlur={handleBlur}
                  inputMode="wholeNumber"
                />

                <AuthInput
                  label="Phone Number"
                  fieldId="phone"
                  focusedField={focusedField}
                  value={formData.phone}
                  onChangeText={handleInputChange('phone')}
                  onFocus={() => handleFocus('phone')}
                  onBlur={handleBlur}
                  inputMode="phone"
                /> 

                <AuthInput
                  label="Amount"
                  fieldId="amount"
                  focusedField={focusedField}
                  value={formData.amount}
                  onChangeText={handleInputChange('amount')}
                  onFocus={() => handleFocus('amount')}
                  onBlur={handleBlur}
                  inputMode="amount"
                />

                <AuthInput
                  label="Alphanumeric"
                  fieldId="alphanumeric"
                  focusedField={focusedField}
                  value={formData.alphanumeric}
                  onChangeText={handleInputChange('alphanumeric')}
                  onFocus={() => handleFocus('alphanumeric')}
                  onBlur={handleBlur}
                  inputMode="alphanumeric"
                /> 

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    console.log('Form Submitted:', formData);
                    closeSheet();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>Save Details</Text>
                </TouchableOpacity>
              </BottomSheetScrollView>
            </KeyboardAvoidingView>
          )}
        </BottomSheetModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },
  header: {
    height: 64, paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3, shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },
  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },
  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  avatarContainer: { marginRight: 12 },
  avatarPlaceholder: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.light.primaryDark + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: Colors.light.primaryDark },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, color: Colors.light.text },
  contactStatus: { fontSize: 13, color: '#666', marginTop: 2 },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff',
  },
  sheetAvatarContainer: { marginRight: 12 },
  sheetAvatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.light.primaryDark + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  sheetAvatarText: { fontSize: 22, fontWeight: '700', color: Colors.light.primaryDark },
  sheetContactName: { fontSize: 18, color: Colors.light.text },
  sheetStatus: { fontSize: 14, color: '#666', marginTop: 2 },
  closeButton: { padding: 8 },
  formScrollView: { flex: 1 },
  formContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.light.text, marginBottom: 12 },
  submitButton: {
    backgroundColor: Colors.light.primaryDark,
    paddingVertical: 15, borderRadius: 12,
    alignItems: 'center', marginTop: 16,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
});
