import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Footer from '../../components/Footer';
import NewInput from '../../components/NewInput';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';

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
    contactName: '', phoneNumber: '', emailId: '', addressLine1: '',
    addressLine2: '', city: '', pincode: '', bankName: '', accountName: '',
    ifscCode: '', branchName: '', gstNumber: '', aadhaar: '', panNumber: '',
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

  const handleSave = () => {
    if (!validate(formData)) {
      Alert.alert('Validation Error', 'Please fix the errors highlighted below');
      return;
    }

    console.log('✅ New Contact Saved:', formData);
    Alert.alert('Success', 'Contact added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
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
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <NewInput
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

              <NewInput
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

              <NewInput
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

              <Text style={styles.sectionTitle}>Address Details</Text>

              <NewInput
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

              <NewInput
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

              <NewInput
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

              <NewInput
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

              <Text style={styles.sectionTitle}>Bank Details</Text>

              <NewInput
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

              <NewInput
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

              <NewInput
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

              <NewInput
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

              <Text style={styles.sectionTitle}>Tax & Identity Details</Text>

              <NewInput
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

              <NewInput
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

              <NewInput
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
          <PrimaryButton onPress={handleCancel} style={styles.fixedCancelButton}>
            Cancel
          </PrimaryButton>
          <PrimaryButton onPress={handleSave} style={styles.fixedSaveButton}>
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
