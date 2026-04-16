import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import AuthInput from '../../components/AuthInput';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider'; // ← Added

type FormData = {
  contactName: string;
  phoneNumber: string;
  emailId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  bankName: string;
  accountName: string;
  ifscCode: string;
  branchName: string;
  gstNumber: string;
  aadhaar: string;
  panNumber: string;
};

export default function AddContactScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('contacts');

  const [formData, setFormData] = useState<FormData>({
    contactName: '', 
    phoneNumber: '', 
    emailId: '', 
    addressLine1: '',
    addressLine2: '', 
    city: '', 
    pincode: '', 
    bankName: '', 
    accountName: '',
    ifscCode: '', 
    branchName: '', 
    gstNumber: '', 
    aadhaar: '', 
    panNumber: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { errors, validate } = useFormValidation<keyof FormData>({
    contactName: { required: true, requiredMessage: 'Contact name is required' },
    phoneNumber: { 
      required: true, 
      requiredMessage: 'Phone number is required',
      minLength: 10,
      minLengthMessage: 'Phone number must be at least 10 digits'
    },
    emailId: {},
    addressLine1: { required: true, requiredMessage: 'Address Line 1 is required' },
    addressLine2: {},
    city: { required: true, requiredMessage: 'City is required' },
    pincode: { 
      required: true, 
      requiredMessage: 'Pincode is required',
      minLength: 6,
      minLengthMessage: 'Pincode must be 6 digits'
    },
    bankName: {},
    accountName: {},
    ifscCode: {},
    branchName: {},
    gstNumber: {},
    aadhaar: {},
    panNumber: {},
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = useCallback((fieldId: string) => setFocusedField(fieldId), []);
  const handleBlur = useCallback(() => setFocusedField(null), []);

  // const handleSave = () => {
  //   if (!validate(formData)) {
  //     Alert.alert('Validation Error', 'Please fix the errors highlighted below');
  //     return;
  //   }

  //   console.log('✅ New Contact Saved:', formData);
  //   Alert.alert('Success', 'Contact added successfully!', [
  //     { text: 'OK', onPress: () => router.back() }
  //   ]);
  // };


  const handleSave = async () => {
  if (!validate(formData)) {
    Alert.alert('Validation Error', 'Please fix the errors highlighted below');
    return;
  }

  try {
    const payload = {
      contactName: formData.contactName,
      phoneNumber: formData.phoneNumber,
      email: formData.emailId,

      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      pincode: formData.pincode,

      bankName: formData.bankName,
      branchName: formData.branchName,
      bankAccountNumber: formData.accountName,
      ifscCode: formData.ifscCode,

      gstin: formData.gstNumber,
      aadhaarNumber: formData.aadhaar,
      panNumber: formData.panNumber,
    };

    console.log('📤 Payload:', payload); // ✅ debug

    const response = await postApi(ENDPOINTS.ADDCONTACT, payload);

    console.log('📥 Response:', response);

    if (response.status === 'success') {
      Alert.alert('Success', response.message || 'Contact added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', response.message || 'Failed to add contact');
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    Alert.alert('Error', 'Something went wrong');
  }
};

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add New Contact" icon="person-add-outline">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formCard}>
              <DefaultText style={styles.sectionTitle} variant="bold">
                Personal Information
              </DefaultText>

              <AuthInput
                label="Contact Name *"
                fieldId="contactName"
                focusedField={focusedField}
                value={formData.contactName}
                onChangeText={handleInputChange('contactName')}
                onFocus={() => handleFocus('contactName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.contactName}
              />

              <AuthInput
                label="Phone Number *"
                fieldId="phoneNumber"
                focusedField={focusedField}
                value={formData.phoneNumber}
                onChangeText={handleInputChange('phoneNumber')}
                onFocus={() => handleFocus('phoneNumber')}
                onBlur={handleBlur}
                inputMode="phone"
                error={errors.phoneNumber}
              />

              <AuthInput
                label="Email ID"
                fieldId="emailId"
                focusedField={focusedField}
                value={formData.emailId}
                onChangeText={handleInputChange('emailId')}
                onFocus={() => handleFocus('emailId')}
                onBlur={handleBlur}
                inputMode="email"
                error={errors.emailId}
              />

              <DefaultText style={styles.sectionTitle} variant="bold">
                Address Details
              </DefaultText>

              <AuthInput
                label="Address Line 1 *"
                fieldId="addressLine1"
                focusedField={focusedField}
                value={formData.addressLine1}
                onChangeText={handleInputChange('addressLine1')}
                onFocus={() => handleFocus('addressLine1')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.addressLine1}
              />

              <AuthInput
                label="Address Line 2"
                fieldId="addressLine2"
                focusedField={focusedField}
                value={formData.addressLine2}
                onChangeText={handleInputChange('addressLine2')}
                onFocus={() => handleFocus('addressLine2')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.addressLine2}
              />

              <AuthInput
                label="City *"
                fieldId="city"
                focusedField={focusedField}
                value={formData.city}
                onChangeText={handleInputChange('city')}
                onFocus={() => handleFocus('city')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.city}
              />

              <AuthInput
                label="Pincode *"
                fieldId="pincode"
                focusedField={focusedField}
                value={formData.pincode}
                onChangeText={handleInputChange('pincode')}
                onFocus={() => handleFocus('pincode')}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.pincode}
              />

              <DefaultText style={styles.sectionTitle} variant="bold">
                Bank Details
              </DefaultText>

              <AuthInput
                label="Bank Name"
                fieldId="bankName"
                focusedField={focusedField}
                value={formData.bankName}
                onChangeText={handleInputChange('bankName')}
                onFocus={() => handleFocus('bankName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.bankName}
              />

              <AuthInput
                label="Account Name"
                fieldId="accountName"
                focusedField={focusedField}
                value={formData.accountName}
                onChangeText={handleInputChange('accountName')}
                onFocus={() => handleFocus('accountName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.accountName}
              />

              <AuthInput
                label="IFSC Code"
                fieldId="ifscCode"
                focusedField={focusedField}
                value={formData.ifscCode}
                onChangeText={handleInputChange('ifscCode')}
                onFocus={() => handleFocus('ifscCode')}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.ifscCode}
              />

              <AuthInput
                label="Branch Name"
                fieldId="branchName"
                focusedField={focusedField}
                value={formData.branchName}
                onChangeText={handleInputChange('branchName')}
                onFocus={() => handleFocus('branchName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.branchName}
              />

              <DefaultText style={styles.sectionTitle} variant="bold">
                Tax & Identity Details
              </DefaultText>

              <AuthInput
                label="GST Number"
                fieldId="gstNumber"
                focusedField={focusedField}
                value={formData.gstNumber}
                onChangeText={handleInputChange('gstNumber')}
                onFocus={() => handleFocus('gstNumber')}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.gstNumber}
              />

              <AuthInput
                label="Aadhaar Number"
                fieldId="aadhaar"
                focusedField={focusedField}
                value={formData.aadhaar}
                onChangeText={handleInputChange('aadhaar')}
                onFocus={() => handleFocus('aadhaar')}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.aadhaar}
              />

              <AuthInput
                label="PAN Number"
                fieldId="panNumber"
                focusedField={focusedField}
                value={formData.panNumber}
                onChangeText={handleInputChange('panNumber')}
                onFocus={() => handleFocus('panNumber')}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.panNumber}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.fixedButtonContainer}>  
          <PrimaryButton 
            onPress={handleCancel} 
            variant="secondary" 
            style={styles.fixedCancelButton}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton 
            onPress={handleSave} 
            style={styles.fixedSaveButton}
          >
            Save Contact
          </PrimaryButton>
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { 
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  formCard: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 16,
  },
  fixedButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.light.white || '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border || '#e5e7eb',
  },
  fixedSaveButton: { flex: 1 },
  fixedCancelButton: { flex: 1 },
});