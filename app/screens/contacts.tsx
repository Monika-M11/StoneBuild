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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function ContactsScreen() {
  const [activeTab, setActiveTab] = useState<string>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    bio: '',
  });

  const theme = useTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<any>(null);

  // 50% shows header + a couple of fields; 92% is near full screen
  const snapPoints = useMemo(() => ['50%', '92%'], []);

  const openFormSheet = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      fullName: contact.name,
      age: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
      bio: '',
    });
    // Open at 50% first — user can swipe up or the sheet auto-expands on focus
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedContact(null);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // When user taps a field, snap to 92% so full form is available
  const handleFocus = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
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
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { fontFamily: theme.fonts.bold }]}>
            {item.name}
          </Text>
          {item.status && (
            <Text style={styles.contactStatus}>{item.status}</Text>
          )}
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
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
                Contacts
              </Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          {/* CONTACT LIST */}
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
            /**
             * KeyboardAvoidingView INSIDE the sheet:
             * - On iOS: behavior="padding" shrinks the scroll area above the keyboard
             * - On Android: behavior="height" shrinks the sheet height so keyboard
             *   doesn't overlap. This is the key fix for Android scroll+keyboard.
             */
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              {/* Fixed header — never scrolls */}
              <View style={styles.sheetHeader}>
                <View style={styles.sheetAvatarContainer}>
                  <View style={styles.sheetAvatarPlaceholder}>
                    <Text style={styles.sheetAvatarText}>
                      {selectedContact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.sheetContactName,
                      { fontFamily: theme.fonts.bold },
                    ]}
                  >
                    {selectedContact.name}
                  </Text>
                  <Text style={styles.sheetStatus}>Fill User Details</Text>
                </View>
                <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              {/*
               * BottomSheetScrollView:
               * - flex: 1 so it fills space below the fixed header
               * - keyboardShouldPersistTaps="handled" so tapping inputs works
               * - This scrolls independently from the sheet drag gesture
               */}
              <BottomSheetScrollView
                style={styles.formScrollView}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.fullName}
                    onChangeText={(t) => handleInputChange('fullName', t)}
                    onFocus={handleFocus}
                    placeholder="Enter full name"
                    placeholderTextColor="#aaa"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.age}
                    onChangeText={(t) => handleInputChange('age', t)}
                    onFocus={handleFocus}
                    placeholder="Enter age"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(t) => handleInputChange('email', t)}
                    onFocus={handleFocus}
                    placeholder="Enter email address"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.phone}
                    onChangeText={(t) => handleInputChange('phone', t)}
                    onFocus={handleFocus}
                    placeholder="Enter phone number"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Occupation</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.occupation}
                    onChangeText={(t) => handleInputChange('occupation', t)}
                    onFocus={handleFocus}
                    placeholder="What do you do?"
                    placeholderTextColor="#aaa"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    value={formData.address}
                    onChangeText={(t) => handleInputChange('address', t)}
                    onFocus={handleFocus}
                    placeholder="Enter full address"
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Bio</Text>
                  <TextInput
                    style={[styles.textInput, styles.bioInput]}
                    value={formData.bio}
                    onChangeText={(t) => handleInputChange('bio', t)}
                    onFocus={handleFocus}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit is last item — scroll ends right after this */}
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

  // Page header
  header: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

  // Contact list
  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: { marginRight: 12 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primaryDark + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: Colors.light.primaryDark },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, color: Colors.light.text },
  contactStatus: { fontSize: 13, color: '#666', marginTop: 2 },

  // Sheet fixed header
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  sheetAvatarContainer: { marginRight: 12 },
  sheetAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primaryDark + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetAvatarText: { fontSize: 22, fontWeight: '700', color: Colors.light.primaryDark },
  sheetContactName: { fontSize: 18, color: Colors.light.text },
  sheetStatus: { fontSize: 14, color: '#666', marginTop: 2 },
  closeButton: { padding: 8 },

  // Scrollable form area
  formScrollView: {
    flex: 1, // fills remaining height inside KeyboardAvoidingView
  },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32, // just enough space after Submit button
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  textInput: {
    backgroundColor: Colors.light.inputBg,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  multilineInput: {
    height: 80,
    paddingTop: 12,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },

  // Submit button — last item in scroll
  submitButton: {
    backgroundColor: Colors.light.primaryDark,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
