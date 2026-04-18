


import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import ScreenPage from '@/components/ScreenPage';
import { useToast } from '@/providers/ToastProvider';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

type Contact = {
  id: string;
  name: string;
  phone: string;
  city: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
  bankName?: string;
  branchName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  gstin?: string;
  aadhaarNumber?: string;
  panNumber?: string;
};

type FormData = {
  name: string;
  phone: string;
  city: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  bankName: string;
  branchName: string;
  bankAccountNumber: string;
  ifscCode: string;
  gstin: string;
  aadhaarNumber: string;
  panNumber: string;
};

export default function ContactsScreen() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    city: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    bankName: '',
    branchName: '',
    bankAccountNumber: '',
    ifscCode: '',
    gstin: '',
    aadhaarNumber: '',
    panNumber: '',
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { showToast } = useToast();
  const { openDrawer } = useDrawer();
  const theme = useTheme();
  const bottomSheetRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['50%', '72%'], []);

  // Form Validation
  const { errors, validate, clearAll } = useFormValidation<keyof FormData>({
    name: { required: true, requiredMessage: 'Name is required' },
    phone: {
      required: true,
      requiredMessage: 'Phone number is required',
      minLength: 10,
      minLengthMessage: 'Phone must be 10 digits',
    },
    city: { required: true, requiredMessage: 'City is required' },
    email: {},
    addressLine1: {},
    addressLine2: {},
    pincode: {},
    bankName: {},
    branchName: {},
    bankAccountNumber: {},
    ifscCode: {},
    gstin: {},
    aadhaarNumber: {},
    panNumber: {},
  });

  const openFormSheet = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      phone: contact.phone || '',
      city: contact.city || '',
      email: contact.email || '',
      addressLine1: contact.addressLine1 || '',
      addressLine2: contact.addressLine2 || '',
      pincode: contact.pincode || '',
      bankName: contact.bankName || '',
      branchName: contact.branchName || '',
      bankAccountNumber: contact.bankAccountNumber || '',
      ifscCode: contact.ifscCode || '',
      gstin: contact.gstin || '',
      aadhaarNumber: contact.aadhaarNumber || '',
      panNumber: contact.panNumber || '',
    });
    clearAll();
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

  const handleBlur = useCallback(() => setFocusedField(null), []);

  const handleSave = () => {
    const isValid = validate(formData);
    if (!isValid) {
      showToast('Validation Error', 'Please fix the errors above', 'error');
      return;
    }

    console.log('✅ Form Submitted Successfully:', formData);
    showToast('Success', `Details saved for ${formData.name}`, 'success');
    setTimeout(() => router.back(), 1500);
  };

  const handleAddContact = () => {
    router.push('/screens/addContact');
  };

  // Render Contact Item - Improved UI
  // const renderContactItem = useCallback(
  //   ({ item }: { item: Contact }) => {
  //     const fullAddress = [item.addressLine1, item.addressLine2]
  //       .filter(Boolean)
  //       .join(', ');

  //     return (
  //       <TouchableOpacity
  //         style={styles.contactItem}
  //         onPress={() => openFormSheet(item)}
  //         activeOpacity={0.7}
  //       >
  //         <View style={styles.avatarContainer}>
  //           <View style={styles.avatarPlaceholder}>
  //             <DefaultText style={styles.avatarText} variant="medium">
  //               {item.name
  //                 .split(' ')
  //                 .map((n) => n[0])
  //                 .join('')
  //                 .toUpperCase()
  //                 .slice(0, 2)}
  //             </DefaultText>
  //           </View>
  //         </View>

  //         <View style={styles.contactInfo}>
  //           <DefaultText style={styles.contactName} variant="bold">
  //             {item.name}
  //           </DefaultText>

  //           <DefaultText style={styles.contactPhone}>{item.phone}</DefaultText>

  //           <DefaultText style={styles.contactCity}>{item.city}</DefaultText>

  //           {fullAddress ? (
  //             <DefaultText style={styles.contactAddress} numberOfLines={1} ellipsizeMode="tail">
  //               {fullAddress}
  //             </DefaultText>
  //           ) : null}
  //         </View>

  //         <Ionicons name="information-circle-outline" size={20} color={Colors.light.primaryDark} />
  //       </TouchableOpacity>
  //     );
  //   },
  //   [openFormSheet]
  // );

  // ==================== REPLACE THIS ENTIRE FUNCTION ====================
const renderContactItem = useCallback(({ item }: { item: Contact }) => {
  // Combine City + AddressLine1 + AddressLine2 on ONE line
  const locationParts = [
    item.city,
    item.addressLine1,
    item.addressLine2,
  ].filter(Boolean);                    // Remove empty values

  const locationText = locationParts.join(', ');

  return (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => openFormSheet(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <DefaultText style={styles.avatarText} variant="medium">
            {item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </DefaultText>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <DefaultText style={styles.contactName} variant="bold">
          {item.name}
        </DefaultText>

        <DefaultText style={styles.contactPhone}>
          {item.phone}
        </DefaultText>

        {/* ✅ FIXED: City + Both Address lines on SAME LINE */}
        {locationText ? (
          <DefaultText 
            style={styles.contactLocation} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {locationText}
          </DefaultText>
        ) : null}
      </View>

      {/* Info Icon */}
      <Ionicons 
        name="information-circle-outline" 
        size={22} 
        color={Colors.light.primaryDark} 
      />
    </TouchableOpacity>
  );
}, [openFormSheet]);

  // API Fetch Logic (unchanged)
  const fetchContacts = async (pageNumber: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setContacts([]);
        setPage(1);
      }

      const response = await postApi(ENDPOINTS.CONTACT_LIST, {
        page: pageNumber,
        count: 10,
      });

      const apiData = response?.data;
      const apiList = apiData?.contacts || [];

      const mappedList: Contact[] = apiList.map((item: any) => ({
        id: item.id.toString(),
        name: item.contactName,
        phone: item.phoneNumber,
        city: item.city,
        email: item.email,
        addressLine1: item.addressLine1,
        addressLine2: item.addressLine2,
        pincode: item.pincode,
        bankName: item.bankName,
        branchName: item.branchName,
        bankAccountNumber: item.bankAccountNumber,
        ifscCode: item.ifscCode,
        gstin: item.gstin,
        aadhaarNumber: item.aadhaarNumber,
        panNumber: item.panNumber,
      }));

      if (isLoadMore) {
        setContacts((prev) => [...prev, ...mappedList]);
      } else {
        setContacts(mappedList);
      }

      setHasMore(!!apiData?.has_more);
    } catch (err: any) {
      console.log('CONTACT API ERROR:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchContacts(1, false);
    }, [])
  );

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchContacts(nextPage, true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage
        title="Contacts"
        onMenuPress={openDrawer}
        rightAction={
          <TouchableOpacity onPress={handleAddContact}>
            <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        }
      >
        <View style={styles.body}>
          {loading ? (
            <Loader />
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              onEndReached={loadMore}
              onEndReachedThreshold={0.6}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={loadingMore ? <Loader /> : null}
            />
          )}
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Bottom Sheet - (You can enhance this later with AuthInput fields) */}
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
            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatarContainer}>
                <View style={styles.sheetAvatarPlaceholder}>
                  <DefaultText style={styles.sheetAvatarText} variant="bold">
                    {selectedContact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </DefaultText>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <DefaultText style={styles.sheetContactName} variant="bold">
                  {selectedContact.name}
                </DefaultText>
                <DefaultText style={styles.sheetStatus} variant="regular">
                  Fill User Details
                </DefaultText>
              </View>
              <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView
              style={styles.formScrollView}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* TODO: Add AuthInput fields here */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <DefaultText style={styles.submitButtonText} variant="bold">
                  Save Details
                </DefaultText>
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

  listContent: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },

  // Improved Contact Card
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  avatarContainer: { marginRight: 14 },
  avatarPlaceholder: {
    // width: 48,
    // height: 48,
    // borderRadius: 24,
    // backgroundColor: '#dbeafe',
    // justifyContent: 'center',
    // alignItems: 'center',
    
  width: 52,                    // slightly bigger for better look
  height: 52,
  borderRadius: 26,
  backgroundColor: '#dbeafe',   // light blue background (you can change)
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,               // ← Added border thickness
  borderColor: Colors.light.primaryDark,  // ← Primary color border

  },
  avatarText: {
    fontSize: 17,
    color: Colors.light.primaryDark,
  },

  // contactInfo: { flex: 1, paddingRight: 8 },
  // contactName: {
  //   fontSize: 16,
  //   color: '#111827',
  //   marginBottom: 3,
  // },
  // contactPhone: {
  //   fontSize: 13.5,
  //   color: '#2563eb',
  //   marginBottom: 1,
  // },
  
  contactInfo: { 
  flex: 1, 
  paddingRight: 12 
},

contactName: {
  fontSize: 16.5,
  color: '#1f2937',
  marginBottom: 4,
},

contactPhone: {
  fontSize: 14.5,
  color: '#2563eb',
  marginBottom: 4,
},
  contactCity: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  contactAddress: {
    fontSize: 12.5,
    color: '#6b7280',
    marginTop: 1,
  },

  // Bottom Sheet Styles (slightly refined)
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
  },
  sheetAvatarContainer: { marginRight: 14 },
  sheetAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#bfdbfe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetAvatarText: { 
    fontSize: 22, 
    color: '#2563eb' 
  },
  sheetContactName: { 
    fontSize: 18, 
    color: '#111827' 
  },
  sheetStatus: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginTop: 2 
  },
  closeButton: { padding: 8 },

  formScrollView: { flex: 1 },
  formContent: { 
    paddingHorizontal: 16, 
    paddingTop: 24, 
    paddingBottom: 40 
  },

  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16.5,
    letterSpacing: 0.3,
  },


// ✅ NEW STYLE - This displays city + address on same line
contactLocation: {
  fontSize: 13,
  color: '#6b7280',
},
});


