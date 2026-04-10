import { Ionicons } from '@expo/vector-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthInput from '@/components/AuthInput';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';

const GST_OPTIONS = ['0', '5', '12', '18', '28'];

type FormData = {
  materialName: string;
  hsn: string;
  shortCode: string;
  printingName: string;
  gst: string;
  cess: string;
};

export default function AddMaterialScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('materials');

  const [formData, setFormData] = useState<FormData>({
    materialName: '',
    hsn: '',
    shortCode: '',
    printingName: '',
    gst: '',
    cess: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const gstSheetRef = useRef<any>(null);
  const gstSnapPoints = useMemo(() => ['50%', '72%'], []);

  const openGstSheet = useCallback(() => {
    Keyboard.dismiss();          
    gstSheetRef.current?.snapToIndex(0);
  }, []);

  const closeGstSheet = useCallback(() => {
    gstSheetRef.current?.close();
  }, []);

  const handleGstSelect = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, gst: value }));
    closeGstSheet();
  }, [closeGstSheet]);

  const { errors, validate } = useFormValidation<keyof FormData>({
    materialName: { required: true, requiredMessage: 'Material name is required' },
    hsn: {},
    shortCode: {},
    printingName: {},
    gst: {},
    cess: {},
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedField(fieldId);
  }, []);

  const handleBlur = useCallback(() => setFocusedField(null), []);

  const handleSave = () => {
    if (!validate(formData)) {
      Alert.alert('Validation Error', 'Please fix the errors highlighted below');
      return;
    }
    console.log('✅ New Material Saved:', formData);
    Alert.alert('Success', 'Material added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add New Material" icon="">
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
              <Text style={styles.sectionTitle}>Material Details</Text>

              <AuthInput
                label="Material Name *"
                fieldId="materialName"
                focusedField={focusedField}
                value={formData.materialName}
                onChangeText={handleInputChange('materialName')}
                onFocus={() => handleFocus('materialName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.materialName}
              />

              <AuthInput
                label="HSN Code"
                fieldId="hsn"
                focusedField={focusedField}
                value={formData.hsn}
                onChangeText={handleInputChange('hsn')}
                onFocus={() => handleFocus('hsn')}
                onBlur={handleBlur}
                inputMode="numeric"
                error={errors.hsn}
              />

              <AuthInput
                label="Short Code"
                fieldId="shortCode"
                focusedField={focusedField}
                value={formData.shortCode}
                onChangeText={handleInputChange('shortCode')}
                onFocus={() => handleFocus('shortCode')}
                onBlur={handleBlur}
                inputMode="alphanumeric"
                error={errors.shortCode}
              />

              <AuthInput
                label="Printing Name"
                fieldId="printingName"
                focusedField={focusedField}
                value={formData.printingName}
                onChangeText={handleInputChange('printingName')}
                onFocus={() => handleFocus('printingName')}
                onBlur={handleBlur}
                inputMode="default"
                error={errors.printingName}
              />

              {/* GST Field */}
              <TouchableOpacity
                style={{ marginBottom: 16 }}
                onPress={openGstSheet}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <AuthInput
                    label="GST %"
                    fieldId="gst"
                    focusedField={focusedField}
                    value={formData.gst ? `${formData.gst}%` : ''}
                    onChangeText={handleInputChange('gst')}
                    onFocus={() => handleFocus('gst')}
                    onBlur={handleBlur}
                    inputMode="numeric"
                    error={errors.gst}
                    placeholder="Select GST rate"
                    editable={false}
                  />
                </View>
              </TouchableOpacity>

              <AuthInput
                label="Cess %"
                fieldId="cess"
                focusedField={focusedField}
                value={formData.cess}
                onChangeText={handleInputChange('cess')}
                onFocus={() => handleFocus('cess')}
                onBlur={handleBlur}
                inputMode="numeric"
                error={errors.cess}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.fixedButtonContainer}>
          <PrimaryButton onPress={handleCancel} variant="secondary" style={styles.fixedCancelButton}>
            Cancel
          </PrimaryButton>
          <PrimaryButton onPress={handleSave} style={styles.fixedSaveButton}>
            Save Material
          </PrimaryButton>
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={gstSheetRef}
        snapPoints={gstSnapPoints}
        onClose={() => {}}
      >
        <View style={styles.sheetHeader}>
          <View style={styles.sheetIconBox}>
            <Ionicons name="receipt-outline" size={26} color={Colors.light.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetTitle}>Select GST Rate</Text>
            <Text style={styles.sheetSubtitle}>
              {formData.gst ? `Currently: ${formData.gst}%` : 'No rate selected'}
            </Text>
          </View>
          <TouchableOpacity onPress={closeGstSheet} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          style={styles.sheetScrollView}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {GST_OPTIONS.map((rate) => {
            const isSelected = formData.gst === rate;
            return (
              <TouchableOpacity
                key={rate}
                style={styles.gstOptionRow}
                onPress={() => handleGstSelect(rate)}
                activeOpacity={0.7}
              >
                <View style={styles.gstOptionIconBox}>
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={Colors.light.primaryDark + '80'}
                  />
                </View>

                <View style={styles.gstOptionInfo}>
                  <Text style={styles.gstOptionLabel}>
                    {rate}% GST
                  </Text>
                  <Text style={styles.gstOptionSub}>
                    {rate === '0' ? 'Exempted / Nil rated'
                      : rate === '5' ? 'Essential goods & services'
                      : rate === '12' ? 'Standard goods & services'
                      : rate === '18' ? 'Standard rate (most common)'
                      : 'Luxury / demerit goods'}
                  </Text>
                </View>

                {/* Only show tick for selected item - No shadow */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={18} color={Colors.light.primaryDark} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },

  // Bottom Sheet Styles
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  sheetIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sheetTitle: { fontSize: 17, fontWeight: '600', color: Colors.light.text },
  sheetSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 3 },
  closeButton: { padding: 8 },

  sheetScrollView: { flex: 1 },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 60,
  },


  gstOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  gstOptionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  gstOptionInfo: { flex: 1 },
  gstOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  gstOptionSub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 3,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryDark + '15',
    justifyContent: 'center',
    alignItems: 'center',
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