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

import AuthInput from '../../components/AuthInput';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider'; // ← Added

type FormData = {
  name: string;
  incharge_number: string;
  address: string;
  pincode: string;
};

export default function AddWarehouseScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('warehouses');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    incharge_number: '',
    address: '',
    pincode: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { errors, validate } = useFormValidation<keyof FormData>({
    name: { required: true, requiredMessage: 'Warehouse name is required' },
    incharge_number: { 
      required: true, 
      requiredMessage: 'Incharge number is required' 
    },
    address: { 
      required: true, 
      requiredMessage: 'Address is required' 
    },
    pincode: { 
      required: true, 
      requiredMessage: 'Pincode is required',
      minLength: 6,
      minLengthMessage: 'Pincode must be 6 digits'
    },
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

    const payload = {
      name: formData.name,
      incharge_number: formData.incharge_number,
      address: formData.address,
      pincode: formData.pincode,
    };

    console.log('✅ New Warehouse Saved:', payload);

    Alert.alert('Success', 'Warehouse added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add New Warehouse" icon="business-outline">
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
                Warehouse Details
              </DefaultText>

              <AuthInput
                label="Warehouse Name *"
                fieldId="name"
                focusedField={focusedField}
                value={formData.name}
                onChangeText={handleInputChange('name')}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.name}
              />

              <AuthInput
                label="Incharge Number *"
                fieldId="incharge_number"
                focusedField={focusedField}
                value={formData.incharge_number}
                onChangeText={handleInputChange('incharge_number')}
                onFocus={() => handleFocus('incharge_number')}
                onBlur={handleBlur}
                inputMode="phone"
                error={errors.incharge_number}
              />

              <AuthInput
                label="Address *"
                fieldId="address"
                focusedField={focusedField}
                value={formData.address}
                onChangeText={handleInputChange('address')}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.address}
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
            Save Warehouse
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