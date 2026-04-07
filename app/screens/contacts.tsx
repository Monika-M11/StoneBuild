import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthInput from '../../components/AuthInput';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import ScreenPage from '../../components/ScreenPage';
import { useFormValidation } from '../../hooks/useFormValidation'; // ← Import your hook

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
  const [activeTab, setActiveTab] = useState('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    phone: '',
    amount: '',
    alphanumeric: '',
  });

  const router = useRouter();
  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['50%', '92%'], []);

  // ==================== FORM VALIDATION HOOK ====================
  const { errors, validate, clearAll } = useFormValidation<keyof FormData>({
    name: { 
      required: true, 
      requiredMessage: 'Name is required' 
    },
    age: { 
      required: true, 
      requiredMessage: 'Age is required',
      min: 1,
      minMessage: 'Age must be at least 1',
      max: 120,
      maxMessage: 'Age cannot exceed 120'
    },
    phone: { 
      required: true, 
      requiredMessage: 'Phone number is required',
      minLength: 10,
      minLengthMessage: 'Phone number must be at least 10 digits'
    },
    amount: { 
      // optional but numeric check
      min: 0,
      minMessage: 'Amount cannot be negative'
    },
    alphanumeric: {
      // optional
    },
  });

  const openFormSheet = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      age: '',
      phone: '',
      amount: '',
      alphanumeric: '',
    });
    clearAll();                    // Clear previous errors
    bottomSheetRef.current?.snapToIndex(0);
  }, [clearAll]);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedContact(null);
    setFocusedField(null);
    clearAll();
  }, [clearAll]);

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

  // Save with validation
  const handleSave = () => {
    const isValid = validate(formData);

    if (!isValid) {
      Alert.alert('Validation Error', 'Please fix the errors above');
      return;
    }

    // If validation passes
    console.log('✅ Form Submitted Successfully:', formData);

    Alert.alert(
      'Success',
      `Details saved for ${formData.name}`,
      [{ text: 'OK', onPress: closeSheet }]
    );
  };

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
          <Text style={styles.contactName}>{item.name}</Text>
          {item.status && <Text style={styles.contactStatus}>{item.status}</Text>}
        </View>
        <Ionicons name="person-outline" size={24} color="#2563eb" />
      </TouchableOpacity>
    ),
    [openFormSheet]
  );

  const handleAddContact = () => {
    router.push('/screens/addContact');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Contacts" icon="people-outline" rightAction={
          <TouchableOpacity onPress={handleAddContact} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Ionicons name="add" size={24} color="#3C467B" />
          </TouchableOpacity>
        }>
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
      </ScreenPage>

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
            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatarContainer}>
                <View style={styles.sheetAvatarPlaceholder}>
                  <Text style={styles.sheetAvatarText}>
                    {selectedContact.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetContactName}>{selectedContact.name}</Text>
                <Text style={styles.sheetStatus}>Fill User Details</Text>
              </View>
              <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView
              style={styles.formScrollView}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <AuthInput
                label="Name *"
                fieldId="name"
                focusedField={focusedField}
                value={formData.name}
                onChangeText={handleInputChange('name')}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.name}                    // ← Pass error
              />

              <AuthInput
                label="Age *"
                fieldId="age"
                focusedField={focusedField}
                value={formData.age}
                onChangeText={handleInputChange('age')}
                onFocus={() => handleFocus('age')}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.age}
              />

              <AuthInput
                label="Phone Number *"
                fieldId="phone"
                focusedField={focusedField}
                value={formData.phone}
                onChangeText={handleInputChange('phone')}
                onFocus={() => handleFocus('phone')}
                onBlur={handleBlur}
                inputMode="phone"
                error={errors.phone}
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
                error={errors.amount}
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
                error={errors.alphanumeric}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Save Details</Text>
              </TouchableOpacity>
            </BottomSheetScrollView>
          </KeyboardAvoidingView>
        )}
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  listContent: { padding: 16 },

  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  avatarContainer: { marginRight: 12 },
  avatarPlaceholder: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: '#2563eb' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, color: '#111827' },
  contactStatus: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  sheetHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff',
  },
  sheetAvatarContainer: { marginRight: 12 },
  sheetAvatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#bfdbfe',
    justifyContent: 'center', alignItems: 'center',
  },
  sheetAvatarText: { fontSize: 22, fontWeight: '700', color: '#2563eb' },
  sheetContactName: { fontSize: 18, color: '#111827' },
  sheetStatus: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  closeButton: { padding: 8 },

  formScrollView: { flex: 1 },
  formContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    letterSpacing: 0.3 
  },
});
