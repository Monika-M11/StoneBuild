import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthInput from '../../components/AuthInput';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
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

  // ==================== FORM VALIDATION ====================
  const { errors, validate, clearAll } = useFormValidation<keyof FormData>({
    contactName: { 
      required: true, 
      requiredMessage: 'Contact name is required' 
    },
    phoneNumber: { 
      required: true, 
      requiredMessage: 'Phone number is required',
      minLength: 10,
      minLengthMessage: 'Phone number must be at least 10 digits'
    },
    emailId: {},
    addressLine1: { 
      required: true, 
      requiredMessage: 'Address Line 1 is required' 
    },
    addressLine2: {},
    city: { 
      required: true, 
      requiredMessage: 'City is required' 
    },
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

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedField(fieldId);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleSave = () => {
    const isValid = validate(formData);

    if (!isValid) {
      Alert.alert('Validation Error', 'Please fix the errors highlighted below');
      return;
    }

    console.log('✅ New Contact Saved:', formData);

    Alert.alert(
      'Success',
      'Contact added successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add New Contact" icon="person-add-outline">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <Text style={styles.sectionTitle}>Personal Information</Text>

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

            <Text style={styles.sectionTitle}>Address Details</Text>

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

            <Text style={styles.sectionTitle}>Bank Details</Text>

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

            <Text style={styles.sectionTitle}>Tax & Identity Details</Text>

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

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                onPress={handleCancel}
                style={styles.cancelButton}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onPress={handleSave}
                style={styles.saveButton}
              >
                Save Contact
              </PrimaryButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer - Same as Contacts Screen */}
        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
});
