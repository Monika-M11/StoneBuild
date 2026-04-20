// import AuthInput from '@/components/AuthInput';
// import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from '@react-native-community/datetimepicker';
// import { useRouter } from 'expo-router';
// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import {
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { useToast } from '@/providers/ToastProvider';
// import BottomSheetModal from '../../components/BottomSheetModal';
// import Footer from '../../components/Footer';
// import PrimaryButton from '../../components/PrimaryButton';
// import ScreenPage from '../../components/ScreenPage';
// import Colors from '../../constants/theme';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { DefaultText } from '../../providers/ThemeProvider'; // ← Added

// type FormData = {
//   date: string;
//   category: string;
//   amount: string;
//   bankAccount: string;
//   paymentMode: string;
// };

// const CATEGORY_OPTIONS = [
//   'Fuel', 'Maintenance', 'Salary', 'Rent', 'Travel', 
//   'Office Supplies', 'Utilities', 'Food & Refreshment', 'Transportation',
// ];

// const BANK_OPTIONS = [
//   'HDFC Bank - 1234',
//   'ICICI Bank - 5678',
//   'SBI - 9012',
//   'Axis Bank - 3456',
// ];

// const PAYMENT_OPTIONS = ['Cash', 'Bank Transfer', 'UPI', 'Cheque'];

// export default function AddExpensesScreen() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('expense');
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const { showToast } = useToast();
  

//   const [formData, setFormData] = useState<FormData>({
//     date: '',
//     category: '',
//     amount: '',
//     bankAccount: '',
//     paymentMode: '',
//   });

//   const bankSheetRef = useRef<any>(null);
//   const bankSnapPoints = useMemo(() => ['50%', '55%'], []);

//   const categorySheetRef = useRef<any>(null);
//   const categorySnapPoints = useMemo(() => ['50%', '92%'], []);

//   const { errors, validate } = useFormValidation<keyof FormData>({
//     date: { required: true, requiredMessage: 'Date is required' },
//     category: { required: true, requiredMessage: 'Category is required' },
//     amount: { required: true, requiredMessage: 'Amount is required' },
//     bankAccount: { required: true, requiredMessage: 'Bank account is required' },
//     paymentMode: { required: true, requiredMessage: 'Payment mode is required' },
//   });

//   const handleInputChange = (field: keyof FormData) => (text: string) => {
//     setFormData((prev) => ({ ...prev, [field]: text }));
//   };

//   const handleFocus = (fieldId: string) => {
//     setFocusedField(fieldId);
//   };

//   const handleBlur = () => {
//     setFocusedField(null);
//   };

//   const openCategorySheet = useCallback(() => {
//     Keyboard.dismiss();
//     categorySheetRef.current?.snapToIndex(0);
//   }, []);

//   const selectCategory = (category: string) => {
//     handleInputChange('category')(category);
//     categorySheetRef.current?.close();
//   };

//   const openBankSheet = useCallback(() => {
//     Keyboard.dismiss();
//     bankSheetRef.current?.snapToIndex(0);
//   }, []);

//   const selectBank = (bank: string) => {
//     handleInputChange('bankAccount')(bank);
//     bankSheetRef.current?.close();
//   };

//   const handleSave = () => {
//     if (!validate(formData)) {
//       showToast('Validation  Error','Please fix the errors highlighted below','error')
//       return;
//     }
//     console.log('✅ New Expense Saved:', formData);
//      showToast('Success', 'Expense added successfully!', 'success');

//   // ✅ Navigate back after toast is visible
//   setTimeout(() => {
//     router.back();
//   }, 1500); // adjust timing if needed
// };

//   const handleCancel = () => router.back();

//   const formatDate = (date: Date) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleDateChange = (
//     event: DateTimePickerEvent,
//     date?: Date
//   ) => {
//     if (event.type === 'dismissed') {
//       setShowDatePicker(false);
//       return;
//     }

//     if (date) {
//       setShowDatePicker(false);
//       setSelectedDate(date);
//       handleInputChange('date')(formatDate(date));
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ScreenPage title="Add Expense" >
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.contentContainer}
//             keyboardShouldPersistTaps="handled" >
              
//              <DefaultText style={styles.sectionTitle} variant="bold">
//                 New Expense
//               </DefaultText>
          
//             <View style={styles.formContainer}>
             

//               {/* Date Picker */}
//               <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Date (DD/MM/YYYY) *"
//                     fieldId="date"
//                     focusedField={focusedField}
//                     value={formData.date}
//                     onChangeText={handleInputChange('date')}
//                     onFocus={() => handleFocus('date')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.date}
//                   />
//                 </View>
//               </TouchableOpacity>

//               {/* Category Field */}
//               <TouchableOpacity onPress={openCategorySheet}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Category *"
//                     fieldId="category"
//                     focusedField={focusedField}
//                     value={formData.category}
//                     onChangeText={handleInputChange('category')}
//                     onFocus={() => handleFocus('category')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.category}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <AuthInput
//                 label="Amount *"
//                 fieldId="amount"
//                 focusedField={focusedField}
//                 value={formData.amount}
//                 onChangeText={handleInputChange('amount')}
//                 onFocus={() => handleFocus('amount')}
//                 onBlur={handleBlur}
//                 inputMode="amount"
//                 error={errors.amount}
//               />

//               {/* Bank Account Field */}
//               <TouchableOpacity onPress={openBankSheet} activeOpacity={0.7}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Bank Account *"
//                     fieldId="bankAccount"
//                     focusedField={focusedField}
//                     value={formData.bankAccount}
//                     onChangeText={handleInputChange('bankAccount')}
//                     onFocus={() => handleFocus('bankAccount')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.bankAccount}
//                   />
//                 </View>
//               </TouchableOpacity>

//               {/* Payment Mode */}
//               <View style={styles.radioGroupContainer}>
//                 <DefaultText style={styles.radioGroupLabel} variant="bold">
//                   Payment Mode *
//                 </DefaultText>

//                 {PAYMENT_OPTIONS.map((mode) => {
//                   const selected = formData.paymentMode === mode;

//                   return (
//                     <TouchableOpacity
//                       key={mode}
//                       style={styles.radioOption}
//                       onPress={() => handleInputChange('paymentMode')(mode)}
//                       activeOpacity={0.7}
//                     >
//                       <View style={styles.radioOuter}>
//                         {selected && <View style={styles.radioInner} />}
//                       </View>

//                       <DefaultText style={styles.radioText}>{mode}</DefaultText>
//                     </TouchableOpacity>
//                   );
//                 })}

//                 {errors.paymentMode && (
//                   <DefaultText style={styles.errorText}>
//                     {errors.paymentMode}
//                   </DefaultText>
//                 )}
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         <View style={styles.buttonContainer}>
//           <PrimaryButton 
//             onPress={handleCancel} 
//             variant="secondary" 
//             style={styles.cancelButton}
//           >
//             Cancel
//           </PrimaryButton>
//           <PrimaryButton 
//             onPress={handleSave}
//             style={styles.saveButton}
//           >
//             Save Expense
//           </PrimaryButton>
//         </View>

//         {showDatePicker && (
//           <DateTimePicker
//             value={selectedDate}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={handleDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </ScreenPage>

//       {/* Category Bottom Sheet */}
//       <BottomSheetModal
//         ref={categorySheetRef}
//         snapPoints={categorySnapPoints}
//       >
//         <BottomSheetScrollView
//           contentContainerStyle={styles.bottomSheetContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <DefaultText style={styles.bottomSheetTitle} variant="bold">
//             Select Category
//           </DefaultText>

//           {CATEGORY_OPTIONS.map((category) => (
//             <TouchableOpacity
//               key={category}
//               style={styles.bottomSheetOption}
//               onPress={() => selectCategory(category)}
//               activeOpacity={0.7}
//             >
//               <DefaultText style={styles.bottomSheetOptionText}>
//                 {category}
//               </DefaultText>
//             </TouchableOpacity>
//           ))}
//         </BottomSheetScrollView>
//       </BottomSheetModal>

//       {/* Bank Bottom Sheet */}
//       <BottomSheetModal
//         ref={bankSheetRef}
//         snapPoints={bankSnapPoints}
//       >
//         <BottomSheetScrollView
//           contentContainerStyle={styles.bottomSheetContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <DefaultText style={styles.bottomSheetTitle} variant="bold">
//             Select Bank Account
//           </DefaultText>

//           {BANK_OPTIONS.map((bank) => (
//             <TouchableOpacity
//               key={bank}
//               style={styles.bottomSheetOption}
//               onPress={() => selectBank(bank)}
//               activeOpacity={0.7}
//             >
//               <DefaultText style={styles.bottomSheetOptionText}>
//                 {bank}
//               </DefaultText>
//             </TouchableOpacity>
//           ))}
//         </BottomSheetScrollView>
//       </BottomSheetModal>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: { flex: 1 },
//   contentContainer: {
//     padding: 20,
//     paddingBottom: 140,
//   },
//   formContainer: {
//     backgroundColor: Colors.light.white || '#fff',   
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderWidth: 1,
//     borderColor: Colors.light.inputBorder || '#e5e7eb',
   
//   },

//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     padding: 16,
    
    
//   },
//   saveButton: { flex: 1 },
//   cancelButton: { flex: 1 },

//   // Bottom Sheet Styles
//   bottomSheetContent: {
//     paddingTop: 20,
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   bottomSheetOption: {
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   bottomSheetOptionText: {
//     fontSize: 16,
//     color: Colors.light.text,
//   },

//   radioGroupContainer: {
//     marginTop: 16,
//   },
//   radioGroupLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 16,
//   },

//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },

//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: Colors.light.primary || '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },

//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: Colors.light.primary || '#2563eb',
//   },

//   radioText: {
//     fontSize: 15,
//     color: Colors.light.text,
//   },

//   errorText: {
//     marginTop: 4,
//     color: 'red',
//     fontSize: 12,
//   },
// });


import AuthInput from '@/components/AuthInput';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import Loader from '@/components/Loader';
import { useToast } from '@/providers/ToastProvider';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';

type FormData = {
  date: string;
  category: string;
  amount: string;
  bankAccount: string;
  paymentMode: string;
};

const CATEGORY_OPTIONS = [
  'Fuel', 'Maintenance', 'Salary', 'Rent', 'Travel',
  'Office Supplies', 'Utilities', 'Food & Refreshment', 'Transportation',
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
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState<FormData>({
    date: '',
    category: '',
    amount: '',
    bankAccount: '',
    paymentMode: '',
  });

  const bankSheetRef = useRef<any>(null);
  const categorySheetRef = useRef<any>(null);

  const bankSnapPoints = useMemo(() => ['50%', '55%'], []);
  const categorySnapPoints = useMemo(() => ['50%', '92%'], []);

  const { errors, validate } = useFormValidation<keyof FormData>({
    date: { required: true, requiredMessage: 'Date is required' },
    category: { required: true, requiredMessage: 'Category is required' },
    amount: { 
      required: true, 
      requiredMessage: 'Amount is required',
      min: 1,
      minMessage: 'Amount must be greater than 0'
    },
    bankAccount: { required: true, requiredMessage: 'Bank account is required' },
    paymentMode: { required: true, requiredMessage: 'Payment mode is required' },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = (fieldId: string) => setFocusedField(fieldId);
  const handleBlur = () => setFocusedField(null);

  const openCategorySheet = useCallback(() => {
    Keyboard.dismiss();
    categorySheetRef.current?.snapToIndex(0);
  }, []);

  const selectCategory = (category: string) => {
    handleInputChange('category')(category);
    categorySheetRef.current?.close();
  };

  const openBankSheet = useCallback(() => {
    Keyboard.dismiss();
    bankSheetRef.current?.snapToIndex(0);
  }, []);

  const selectBank = (bank: string) => {
    handleInputChange('bankAccount')(bank);
    bankSheetRef.current?.close();
  };

  const handleSave = async () => {
    if (!validate(formData)) {
      showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),   // Convert to number
        bankAccount: formData.bankAccount,
        paymentMode: formData.paymentMode,
      };

      console.log("🔍 ENDPOINT:", ENDPOINTS.ADD_EXPENSE);
      console.log("📤 Expense Payload:", payload);

      const response = await postApi(ENDPOINTS.ADD_EXPENSE, payload);

      console.log("📥 Expense Response:", response);

      if (response.status === "success") {
        showToast(
          "Success",
          response.message || "Expense added successfully!",
          "success"
        );

        setTimeout(() => {
          router.back();
        }, 800);
      } else {
        showToast(
          "Error",
          response.message || "Failed to add expense",
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Expense API Error:", error);
      showToast("Error", "Something went wrong while adding expense", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => router.back();

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (date) {
      setShowDatePicker(false);
      setSelectedDate(date);
      handleInputChange('date')(formatDate(date));
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add Expense">
        {isLoading && <Loader />}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <DefaultText style={styles.sectionTitle} variant="bold">
              New Expense
            </DefaultText>

            <View style={styles.formContainer}>
              {/* Date Picker */}
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <AuthInput
                    label="Date (DD/MM/YYYY) *"
                    fieldId="date"
                    focusedField={focusedField}
                    value={formData.date}
                    onChangeText={handleInputChange('date')}
                    onFocus={() => handleFocus('date')}
                    onBlur={handleBlur}
                    editable={false}
                    error={errors.date}
                  />
                </View>
              </TouchableOpacity>

              {/* Category Field */}
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

              {/* Bank Account Field */}
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

              {/* Payment Mode */}
              <View style={styles.radioGroupContainer}>
                <DefaultText style={styles.radioGroupLabel} variant="bold">
                  Payment Mode *
                </DefaultText>

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
                      <DefaultText style={styles.radioText}>{mode}</DefaultText>
                    </TouchableOpacity>
                  );
                })}

                {errors.paymentMode && (
                  <DefaultText style={styles.errorText}>
                    {errors.paymentMode}
                  </DefaultText>
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
            disabled={isLoading}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            onPress={handleSave}
            style={styles.saveButton}
            disabled={isLoading}
          >
            Save Expense
          </PrimaryButton>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Category Bottom Sheet */}
      <BottomSheetModal ref={categorySheetRef} snapPoints={categorySnapPoints}>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          <DefaultText style={styles.bottomSheetTitle} variant="bold">
            Select Category
          </DefaultText>

          {CATEGORY_OPTIONS.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.bottomSheetOption}
              onPress={() => selectCategory(category)}
              activeOpacity={0.7}
            >
              <DefaultText style={styles.bottomSheetOptionText}>
                {category}
              </DefaultText>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Bank Bottom Sheet */}
      <BottomSheetModal ref={bankSheetRef} snapPoints={bankSnapPoints}>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          <DefaultText style={styles.bottomSheetTitle} variant="bold">
            Select Bank Account
          </DefaultText>

          {BANK_OPTIONS.map((bank) => (
            <TouchableOpacity
              key={bank}
              style={styles.bottomSheetOption}
              onPress={() => selectBank(bank)}
              activeOpacity={0.7}
            >
              <DefaultText style={styles.bottomSheetOptionText}>
                {bank}
              </DefaultText>
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
    backgroundColor: Colors.light.white || '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
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