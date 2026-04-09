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
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';

type FormData = {
  name: string;
  brand: string;
  model: string;
  totalCount: string;
};

export default function AddEquipmentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('equipments');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    model: '',
    totalCount: '',
  });

  // Dynamic serial number fields — length driven by totalCount
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { errors, validate } = useFormValidation<keyof FormData>({
    name: { required: true, requiredMessage: 'Name is required' },
    brand: { required: true, requiredMessage: 'Brand is required' },
    model: { required: true, requiredMessage: 'Model is required' },
    totalCount: {
      required: true,
      requiredMessage: 'Total count is required',
      min: 1,
      minMessage: 'Total count must be at least 1'
    },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  // When totalCount changes, grow or shrink the serialNumbers array
  const handleTotalCountChange = (text: string) => {
    handleInputChange('totalCount')(text);

    const parsed = parseInt(text, 10);

    if (!text || isNaN(parsed) || parsed < 1) {
      // No valid count — clear all serial fields
      setSerialNumbers([]);
      return;
    }

    const count = Math.max(0, parsed);

    setSerialNumbers((prev) => {
      if (count > prev.length) {
        // Add empty slots for new fields
        return [...prev, ...Array(count - prev.length).fill('')];
      } else {
        // Trim extra fields (removing from the end)
        return prev.slice(0, count);
      }
    });
  };

  const handleSerialNumberChange = (index: number, value: string) => {
    setSerialNumbers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleFocus = useCallback((fieldId: string) => setFocusedField(fieldId), []);
  const handleBlur = useCallback(() => setFocusedField(null), []);

  // const handleSave = () => {
  //   if (!validate(formData)) {
  //     Alert.alert('Validation Error', 'Please fix the errors highlighted below');
  //     return;
  //   }

  //   const payload = {
  //     ...formData,
  //     ...serialNumbers,
  //   };

  //   console.log('✅ New Equipment Saved:', payload);
  //   Alert.alert('Success', 'Equipment added successfully!', [
  //     { text: 'OK', onPress: () => router.back() }
  //   ]);
  // };

  const handleSave = () => {
  if (!validate(formData)) {
    Alert.alert('Validation Error', 'Please fix the errors highlighted below');
    return;
  }

  const payload = {
    brand: formData.brand,
    model: formData.model,
    name: formData.name,
    totalCount: formData.totalCount,
    serialNumbers: serialNumbers, 
  };

  console.log('✅ New Equipment Saved:', payload);

  Alert.alert('Success', 'Equipment added successfully!', [
    { text: 'OK', onPress: () => router.back() }
  ]);
};

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add New Equipment" icon="construct-outline">
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
             <AuthInput
                label="Name *"
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
                label="Brand *"
                fieldId="brand"
                focusedField={focusedField}
                value={formData.brand}
                onChangeText={handleInputChange('brand')}
                onFocus={() => handleFocus('brand')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.brand}
              />

              <AuthInput
                label="Model *"
                fieldId="model"
                focusedField={focusedField}
                value={formData.model}
                onChangeText={handleInputChange('model')}
                onFocus={() => handleFocus('model')}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.model}
              />

              <AuthInput
                label="Total Count *"
                fieldId="totalCount"
                focusedField={focusedField}
                value={formData.totalCount}
                onChangeText={handleTotalCountChange}
                onFocus={() => handleFocus('totalCount')}
                onBlur={handleBlur}
                inputMode="wholeNumber"
                error={errors.totalCount}
              />
            </View>

            {/* Dynamic Serial Number Fields */}
            {serialNumbers.length > 0 && (
              <View style={styles.serialSection}>
                <Text style={styles.serialSectionTitle}>Serial Numbers</Text>
                <Text style={styles.serialSectionSubtitle}>
                  Enter the serial number for each unit
                </Text>

                <View style={styles.serialCard}>
                  {serialNumbers.map((serial, index) => (
                    <AuthInput
                      key={`serial-${index}`}
                      label={`Unit ${index + 1} Serial Number`}
                      fieldId={`serial-${index}`}
                      focusedField={focusedField}
                      value={serial}
                      onChangeText={(value) => handleSerialNumberChange(index, value)}
                      onFocus={() => handleFocus(`serial-${index}`)}
                      onBlur={handleBlur}
                      inputMode="alphanumeric"
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.fixedButtonContainer}>
          <PrimaryButton onPress={handleCancel} variant="secondary" style={styles.fixedCancelButton}>
            Cancel
          </PrimaryButton>
          <PrimaryButton onPress={handleSave} style={styles.fixedSaveButton}>
            Save Equipment
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
    gap: 16,
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

  // Serial number section
  serialSection: {
    width: '100%',
  },
  serialSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  serialSectionSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  serialCard: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
    width: '100%',
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