// import AuthInput from '@/components/AuthInput';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import { useRouter } from 'expo-router';
// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import {
//   Alert,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import ScreenPage from '@/components/ScreenPage';
// import BottomSheetModal from '../../components/BottomSheetModal';
// import Footer from '../../components/Footer';
// import PrimaryButton from '../../components/PrimaryButton';
// import Colors from '../../constants/theme';
// import { useDrawer } from '../../contexts/DrawerContext';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { DefaultText } from '../../providers/ThemeProvider';

// type FormData = {
//   ledgerType: string;
//   ledgerName: string;
// };

// const LEDGER_TYPE_OPTIONS = ['Bank Account', 'Expenses Ledger'];

// export default function LedgerScreen() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('ledger');
//   const { openDrawer } = useDrawer();

//   const [formData, setFormData] = useState<FormData>({
//     ledgerType: '',
//     ledgerName: '',
//   });

//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   const ledgerTypeSheetRef = useRef<any>(null);
//   const ledgerTypeSnapPoints = useMemo(() => ['45%', '55%'], []);

//   const { errors, validate } = useFormValidation<keyof FormData>({
//     ledgerType: { required: true, requiredMessage: 'Ledger type is required' },
//     ledgerName: { required: true, requiredMessage: 'Ledger name is required' },
//   });

//   const handleInputChange = (field: keyof FormData) => (text: string) => {
//     setFormData((prev) => ({ ...prev, [field]: text }));
//   };

//   const handleFocus = (fieldId: string) => setFocusedField(fieldId);
//   const handleBlur = () => setFocusedField(null);

//   const openLedgerTypeSheet = useCallback(() => {
//     Keyboard.dismiss();
//     ledgerTypeSheetRef.current?.snapToIndex(0);
//   }, []);

//   const selectLedgerType = (type: string) => {
//     handleInputChange('ledgerType')(type);
//     ledgerTypeSheetRef.current?.close();
//   };

//   const handleSave = () => {
//     if (!validate(formData)) {
//       Alert.alert('Validation Error', 'Please fix the errors highlighted below');

//       return;
//     }

//     console.log('✅ New Ledger Saved:', formData);

//     Alert.alert('Success', 'Ledger added successfully!', [
//       { text: 'OK', onPress: () => router.back() },
//     ]);
//   };

//   const handleCancel = () => router.back();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//      <ScreenPage
//         title="Equipments"
//         icon="business-outline"
//         onMenuPress={openDrawer} // ✅ Menu on LEFT
//         rightAction={            // ✅ + icon on RIGHT
//           <TouchableOpacity
//             onPress={() => router.push('/screens/addEquipments' as any)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity>
//         }
//       >
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView
//             style={styles.scrollView}
//             contentContainerStyle={styles.contentContainer}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Form Card - White Background (same as AddContact) */}
//             <View style={styles.formCard}>
//               <DefaultText style={styles.sectionTitle} variant="bold">
//                 Add New Ledger
//               </DefaultText>

//               {/* Ledger Type */}
//               <TouchableOpacity onPress={openLedgerTypeSheet} activeOpacity={0.7}>
//                 <View pointerEvents="none">
//                   <AuthInput
//                     label="Ledger Type *"
//                     fieldId="ledgerType"
//                     focusedField={focusedField}
//                     value={formData.ledgerType}
//                     onChangeText={handleInputChange('ledgerType')}
//                     onFocus={() => handleFocus('ledgerType')}
//                     onBlur={handleBlur}
//                     editable={false}
//                     error={errors.ledgerType}
//                   />
//                 </View>
//               </TouchableOpacity>

//               {/* Ledger Name */}
//               <AuthInput
//                 label="Ledger Name *"
//                 fieldId="ledgerName"
//                 focusedField={focusedField}
//                 value={formData.ledgerName}
//                 onChangeText={handleInputChange('ledgerName')}
//                 onFocus={() => handleFocus('ledgerName')}
//                 onBlur={handleBlur}
//                 inputMode="default"
//                 error={errors.ledgerName}
//               />
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         {/* Fixed Buttons */}
//         <View style={styles.buttonContainer}>
//           <PrimaryButton
//             onPress={handleCancel}
//             variant="secondary"
//             style={styles.cancelButton}
//           >
//             Cancel
//           </PrimaryButton>
//           <PrimaryButton onPress={handleSave} style={styles.saveButton}>
//             Save Ledger
//           </PrimaryButton>
//         </View>

//         {/* Footer */}
//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
   

//         {/* Bottom Sheet */}
//         <BottomSheetModal ref={ledgerTypeSheetRef} snapPoints={ledgerTypeSnapPoints}>
//           <BottomSheetScrollView
//             contentContainerStyle={styles.bottomSheetContent}
//             showsVerticalScrollIndicator={false}
//           >
//             <DefaultText style={styles.bottomSheetTitle} variant="bold">
//               Select Ledger Type
//             </DefaultText>

//             {LEDGER_TYPE_OPTIONS.map((type) => (
//               <TouchableOpacity
//                 key={type}
//                 style={styles.bottomSheetOption}
//                 onPress={() => selectLedgerType(type)}
//                 activeOpacity={0.7}
//               >
//                 <DefaultText style={styles.bottomSheetOptionText}>{type}</DefaultText>
//               </TouchableOpacity>
//             ))}
//           </BottomSheetScrollView>
//         </BottomSheetModal>
//      </ScreenPage>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { 
//     flex: 1, 
//     backgroundColor: Colors.light.inputBg,     // ← Main background changed (like Add Contact)
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: '#fff',                    // Header stays white
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.light.border || '#e5e7eb',
//   },

//   headerCenter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: Colors.light.primaryDark,
//   },

//   scrollView: { flex: 1 },
//   contentContainer: {
//     padding: 20,
//     paddingBottom: 100,
//   },

//   // Form Card - White (interchanged)
//   formCard: {
//     backgroundColor: Colors.light.white || '#fff',     
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: Colors.light.inputBorder || '#e5e7eb',
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 20,
//   },

//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     padding: 16,
//     backgroundColor: Colors.light.white || '#fff',     // Button area also white
//     borderTopWidth: 1,
//     borderTopColor: Colors.light.inputBorder || '#e5e7eb',
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
// });


import AuthInput from '@/components/AuthInput';
import { useToast } from '@/providers/ToastProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';

type FormData = {
  ledgerType: string;
  ledgerName: string;
};

const LEDGER_TYPE_OPTIONS = ['Bank Account', 'Expenses Ledger'];

export default function LedgerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ledger');
  const { openDrawer } = useDrawer();
  const {showToast} = useToast();

  const [formData, setFormData] = useState<FormData>({
    ledgerType: '',
    ledgerName: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showLedgerTypes, setShowLedgerTypes] = useState(false);

  const addLedgerSheetRef = useRef<any>(null);
  const addLedgerSnapPoints = useMemo(() => ['50%', '70%'], []);

  const { errors, validate } = useFormValidation<keyof FormData>({
    ledgerType: { required: true, requiredMessage: 'Ledger type is required' },
    ledgerName: { required: true, requiredMessage: 'Ledger name is required' },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) =>
    setFormData((prev) => ({ ...prev, [field]: text }));

  const openAddLedgerSheet = useCallback(() => {
    Keyboard.dismiss();
    setShowLedgerTypes(false);
    addLedgerSheetRef.current?.snapToIndex(0);
  }, []);

  const toggleLedgerTypes = useCallback(() => {
    Keyboard.dismiss();
    setShowLedgerTypes((prev) => !prev);
  }, []);

  const selectLedgerType = (type: string) => {
    handleInputChange('ledgerType')(type);
    setShowLedgerTypes(false);
  };

  const handleSave = () => {
    if (!validate(formData)) {
        showToast('Validation Error', 'Please fix the errors highlighted below', 'success');
      return;
    }
    console.log('✅ New Ledger Saved:', formData);
    const handleSave = () => {
  if (!validate(formData)) {
    showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
    return;
  }

  console.log('✅ New Ledger Saved:', formData);
  showToast('Success', 'Ledger added successfully!', 'success');

  // ✅ Execute post-success actions after short delay
  setTimeout(() => {
    addLedgerSheetRef.current?.close();
    setFormData({ ledgerType: '', ledgerName: '' });
    setShowLedgerTypes(false);
  }, 1200); // adjust if needed
};

  const handleCancel = () => {
    addLedgerSheetRef.current?.close();
    setFormData({ ledgerType: '', ledgerName: '' });
    setShowLedgerTypes(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage
        title="Ledger"
        onMenuPress={openDrawer}
        rightAction={
          <TouchableOpacity onPress={openAddLedgerSheet} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <DefaultText style={styles.emptyText}>
            No ledgers added yet. Tap + to add one.
          </DefaultText>
        </ScrollView>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* ── Add New Ledger Bottom Sheet ── */}
      <BottomSheetModal ref={addLedgerSheetRef} snapPoints={addLedgerSnapPoints}>
          <View style={{flex: 1}}>
            <BottomSheetScrollView
              style={styles.sheetScrollView}
              contentContainerStyle={styles.sheetContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
            <DefaultText style={styles.sheetTitle} variant="bold">
              Add New Ledger
            </DefaultText>

            {/* Ledger Type Field + Inline Options */}
            <TouchableOpacity onPress={toggleLedgerTypes} activeOpacity={0.7}>
              <View pointerEvents="none">
                <AuthInput
                  label="Ledger Type *"
                  fieldId="ledgerType"
                  focusedField={focusedField}
                  value={formData.ledgerType}
                  onChangeText={handleInputChange('ledgerType')}
                  onFocus={() => setFocusedField('ledgerType')}
                  onBlur={() => setFocusedField(null)}
                  editable={false}
                  error={errors.ledgerType}
                />
              </View>
            </TouchableOpacity>

            {/* Dynamic Inline Options (Radio style) */}
            {showLedgerTypes && (
              <View style={styles.optionsContainer}>
                {LEDGER_TYPE_OPTIONS.map((type) => {
                  const isSelected = formData.ledgerType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionRow,
                        isSelected && styles.selectedOption,
                      ]}
                      onPress={() => selectLedgerType(type)}
                      activeOpacity={0.7}
                    >
                      <DefaultText
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {type}
                      </DefaultText>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color={Colors.light.primaryDark} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Ledger Name */}
            <AuthInput
              label="Ledger Name *"
              fieldId="ledgerName"
              focusedField={focusedField}
              value={formData.ledgerName}
              onChangeText={handleInputChange('ledgerName')}
              onFocus={() => setFocusedField('ledgerName')}
              onBlur={() => setFocusedField(null)}
              inputMode="default"
              error={errors.ledgerName}
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <PrimaryButton
                onPress={handleCancel}
                variant="secondary"
                style={styles.cancelButton}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton onPress={handleSave} style={styles.saveButton}>
                Save Ledger
              </PrimaryButton>
            </View>
            </BottomSheetScrollView>
            </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
  }
}
const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.light.textSecondary || '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
  },

  // ── Bottom Sheet Styles (Matched with AddMaterialScreen) ──
  sheetScrollView: { flex: 1 },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,           // Matched addMaterial - proper clearance for buttons/handle
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },

  // Inline Ledger Type Options
  optionsContainer: {
    marginBottom: 20,
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedOption: {
    borderColor: Colors.light.primaryDark || '#3b82f6',
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: Colors.light.primaryDark || '#3b82f6',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  saveButton: { flex: 1 },
  cancelButton: { flex: 1 },
});