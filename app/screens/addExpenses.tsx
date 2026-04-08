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

type FormData = {
  date: string;
  category: string;
  amount: string;
  bankAccount: string;
  paymentMode: string;
};

const CATEGORY_OPTIONS = [
  'Fuel',
  'Maintenance',
  'Salary',
  'Rent',
  'Travel',
  'Office Supplies',
  'Utilities',
  'Food & Refreshment',
  'Transportation',
  
];

const BANK_OPTIONS = [
  'HDFC Bank - 1234',
  'ICICI Bank - 5678',
  'SBI - 9012',
  'Axis Bank - 3456',
];

const PAYMENT_OPTIONS = ['Cash', 'Bank Transfer', 'UPI', 'Cheque'];

export default function AddExpensesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('expense');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    date: '',
    category: '',
    amount: '',
    bankAccount: '',
    paymentMode: '',
  });

const bankSheetRef = useRef<any>(null);
const bankSnapPoints = useMemo(() => ['50%', '55%'], []);

const categorySheetRef = useRef<any>(null);
const categorySnapPoints = useMemo(() => ['50%', '92%'], []);

  const { errors, validate } = useFormValidation<keyof FormData>({
    date: { required: true, requiredMessage: 'Date is required' },
    category: { required: true, requiredMessage: 'Category is required' },
    amount: { required: true, requiredMessage: 'Amount is required' },
    bankAccount: { required: true, requiredMessage: 'Bank account is required' },
    paymentMode: { required: true, requiredMessage: 'Payment mode is required' },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Open Category Bottom Sheet
  const openCategorySheet = useCallback(() => {
    Keyboard.dismiss();                    
    categorySheetRef.current?.snapToIndex(0);
  }, []);

  const selectCategory = (category: string) => {
    handleInputChange('category')(category);
    categorySheetRef.current?.close();
  };
  //open banksheet
  const openBankSheet = useCallback(() => {
  Keyboard.dismiss();
  bankSheetRef.current?.snapToIndex(0);
}, []);

const selectBank = (bank: string) => {
  handleInputChange('bankAccount')(bank);
  bankSheetRef.current?.close();
};

  const handleSave = () => {
    if (!validate(formData)) {
      Alert.alert('Validation Error', 'Please fix the errors highlighted below');
      return;
    }
    console.log('✅ New Expense Saved:', formData);
    Alert.alert('Success', 'Expense added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add Expense" icon="add-circle-outline">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
             <Text style={styles.sectionTitle}>New expense</Text>

              <AuthInput
                label="Date(DD/MM/YYYY) *"
                fieldId="date"
                focusedField={focusedField}
                value={formData.date}
                onChangeText={handleInputChange('date')}
                onFocus={() => handleFocus('date')}
                onBlur={handleBlur}
                
                inputMode="default"
                error={errors.date}
              />

              {/* Category Field with Bottom Sheet */}
              <TouchableOpacity onPress={openCategorySheet}>
                <View pointerEvents="none">
                  <AuthInput
                    label="Category *"
                    fieldId="category"
                    focusedField={focusedField}
                    value={formData.category}
                    onChangeText={handleInputChange('category')}
                    onFocus={() => handleFocus('category')}
                    onBlur={handleBlur}
                    
                    editable={false}
                    error={errors.category}
                  />
                </View>
              </TouchableOpacity>

              <AuthInput
                label="Amount *"
                fieldId="amount"
                focusedField={focusedField}
                value={formData.amount}
                onChangeText={handleInputChange('amount')}
                onFocus={() => handleFocus('amount')}
                onBlur={handleBlur}
                inputMode="amount"
                error={errors.amount}
              />

              <TouchableOpacity onPress={openBankSheet} activeOpacity={0.7}>
                <View pointerEvents="none">
                  <AuthInput
                    label="Bank Account *"
                    fieldId="bankAccount"
                    focusedField={focusedField}
                    value={formData.bankAccount}
                    onChangeText={handleInputChange('bankAccount')}
                    onFocus={() => handleFocus('bankAccount')}
                    onBlur={handleBlur}                   
                    editable={false}
                    error={errors.bankAccount}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.radioGroupContainer}>
  <Text style={styles.radioGroupLabel}>Payment Mode *</Text>

  {PAYMENT_OPTIONS.map((mode) => {
    const selected = formData.paymentMode === mode;

    return (
      <TouchableOpacity
        key={mode}
        style={styles.radioOption}
        onPress={() => handleInputChange('paymentMode')(mode)}
        activeOpacity={0.7}
      >
        <View style={styles.radioOuter}>
          {selected && <View style={styles.radioInner} />}
        </View>

        <Text style={styles.radioText}>{mode}</Text>
      </TouchableOpacity>
    );
  })}

  {errors.paymentMode && (
    <Text style={styles.errorText}>{errors.paymentMode}</Text>
  )}
</View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            onPress={handleCancel} 
            variant="secondary" 
            style={styles.cancelButton}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton 
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Expense
          </PrimaryButton>
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Category Bottom Sheet */}
      <BottomSheetModal
        ref={categorySheetRef}
        snapPoints={categorySnapPoints}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.bottomSheetTitle}>Select Category</Text>

          {CATEGORY_OPTIONS.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.bottomSheetOption}
              onPress={() => selectCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={styles.bottomSheetOptionText}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
        {/* Bank Bottom Sheet */}
       
      </BottomSheetModal>
       <BottomSheetModal
          ref={bankSheetRef}
          snapPoints={bankSnapPoints}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.bottomSheetTitle}>Select Bank Account</Text>

            {BANK_OPTIONS.map((bank) => (
              <TouchableOpacity
                key={bank}
                style={styles.bottomSheetOption}
                onPress={() => selectBank(bank)}
                activeOpacity={0.7}
              >
                <Text style={styles.bottomSheetOptionText}>
                  {bank}
                </Text>
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  formContainer: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.inputBorder || '#e5e7eb',
  },
  saveButton: { flex: 1 },
  cancelButton: { flex: 1 },

  // Bottom Sheet Styles
  bottomSheetContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  bottomSheetOption: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bottomSheetOptionText: {
    fontSize: 16,
    color: Colors.light.text,
  },

  radioGroupContainer: {
  marginTop: 16,
},

radioGroupLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.light.text,
  marginBottom: 10,
},
 sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },

radioOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
},

radioOuter: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: Colors.light.primary || '#2563eb',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},

radioInner: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: Colors.light.primary || '#2563eb',
},

radioText: {
  fontSize: 15,
  color: Colors.light.text,
},

errorText: {
  marginTop: 4,
  color: 'red',
  fontSize: 12,
},
});