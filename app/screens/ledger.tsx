// import AuthInput from '@/components/AuthInput';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import { useRouter } from 'expo-router';
// import React, { useCallback, useMemo, useRef, useState } from 'react';
// import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import BottomSheetModal from '../../components/BottomSheetModal';
// import Footer from '../../components/Footer';
// import PrimaryButton from '../../components/PrimaryButton';
// import ScreenPage from '../../components/ScreenPage';
// import Colors from '../../constants/theme';
// import { useDrawer } from '../../contexts/DrawerContext';
// import { useFormValidation } from '../../hooks/useFormValidation';
// import { DefaultText } from '../../providers/ThemeProvider';
// import { useToast } from '../../providers/ToastProvider';

// type FormData = {
//   ledgerType: string;
//   ledgerName: string;
// };

// const LEDGER_TYPE_OPTIONS = ['Bank Account', 'Expenses Ledger'];

// export default function LedgerScreen() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('ledger');
//   const { openDrawer } = useDrawer();
//   const { showToast } = useToast();

//   const [formData, setFormData] = useState<FormData>({
//     ledgerType: '',
//     ledgerName: '',
//   });

//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showLedgerTypes, setShowLedgerTypes] = useState(false);

//   const addLedgerSheetRef = useRef<any>(null);
//   const addLedgerSnapPoints = useMemo(() => ['50%', '70%'], []);

//   const { errors, validate } = useFormValidation<keyof FormData>({
//     ledgerType: { required: true, requiredMessage: 'Ledger type is required' },
//     ledgerName: { required: true, requiredMessage: 'Ledger name is required' },
//   });

//   const handleInputChange = (field: keyof FormData) => (text: string) =>
//     setFormData((prev) => ({ ...prev, [field]: text }));

//   const openAddLedgerSheet = useCallback(() => {
//     Keyboard.dismiss();
//     setShowLedgerTypes(false);
//     addLedgerSheetRef.current?.snapToIndex(0);
//   }, []);

//   const toggleLedgerTypes = useCallback(() => {
//     Keyboard.dismiss();
//     setShowLedgerTypes((prev) => !prev);
//   }, []);

//   const selectLedgerType = (type: string) => {
//     handleInputChange('ledgerType')(type);
//     setShowLedgerTypes(false);
//   };

//   const handleSave = () => {
//     if (!validate(formData)) {
//       showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
//       return;
//     }

//     console.log('✅ New Ledger Saved:', formData);
//     showToast('Success', 'Ledger added successfully!', 'success');

//     setTimeout(() => {
//       addLedgerSheetRef.current?.close();
//       setFormData({ ledgerType: '', ledgerName: '' });
//       setShowLedgerTypes(false);
//     }, 1200);
//   };

//   const handleCancel = () => {
//     addLedgerSheetRef.current?.close();
//     setFormData({ ledgerType: '', ledgerName: '' });
//     setShowLedgerTypes(false);
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ScreenPage
//         title="Ledger"
//         onMenuPress={openDrawer}
//         rightAction={
//           <TouchableOpacity onPress={openAddLedgerSheet} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//             <Ionicons name="add" size={24} color={Colors.light.primaryDark} />
//           </TouchableOpacity>
//         }
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.contentContainer}
//         >
//           <DefaultText style={styles.emptyText}>
//             No ledgers added yet. Tap + to add one.
//           </DefaultText>
//         </ScrollView>

//         <Footer activeTab={activeTab} onTabChange={setActiveTab} />
//       </ScreenPage>

//       {/* ── Add New Ledger Bottom Sheet ── */}
//       <BottomSheetModal ref={addLedgerSheetRef} snapPoints={addLedgerSnapPoints}>
//         <View style={{flex: 1}}>
//           <BottomSheetScrollView
//             style={styles.sheetScrollView}
//             contentContainerStyle={styles.sheetContent}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag"
//           >
//             <DefaultText style={styles.sheetTitle} variant="bold">
//               Add New Ledger
//             </DefaultText>

//             {/* Ledger Type Field + Inline Options */}
//             <TouchableOpacity onPress={toggleLedgerTypes} activeOpacity={0.7}>
//               <View pointerEvents="none">
//                 <AuthInput
//                   label="Ledger Type *"
//                   fieldId="ledgerType"
//                   focusedField={focusedField}
//                   value={formData.ledgerType}
//                   onChangeText={handleInputChange('ledgerType')}
//                   onFocus={() => setFocusedField('ledgerType')}
//                   onBlur={() => setFocusedField(null)}
//                   editable={false}
//                   error={errors.ledgerType}
//                 />
//               </View>
//             </TouchableOpacity>

//             {/* Dynamic Inline Options (Radio style) */}
//             {showLedgerTypes && (
//               <View style={styles.optionsContainer}>
//                 {LEDGER_TYPE_OPTIONS.map((type) => {
//                   const isSelected = formData.ledgerType === type;
//                   return (
//                     <TouchableOpacity
//                       key={type}
//                       style={[
//                         styles.optionRow,
//                         isSelected && styles.selectedOption,
//                       ]}
//                       onPress={() => selectLedgerType(type)}
//                       activeOpacity={0.7}
//                     >
//                       <DefaultText
//                         style={[
//                           styles.optionText,
//                           isSelected && styles.selectedOptionText,
//                         ]}
//                       >
//                         {type}
//                       </DefaultText>
//                       {isSelected && (
//                         <Ionicons name="checkmark" size={20} color={Colors.light.primaryDark} />
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             )}

//             {/* Ledger Name */}
//             <AuthInput
//               label="Ledger Name *"
//               fieldId="ledgerName"
//               focusedField={focusedField}
//               value={formData.ledgerName}
//               onChangeText={handleInputChange('ledgerName')}
//               onFocus={() => setFocusedField('ledgerName')}
//               onBlur={() => setFocusedField(null)}
//               inputMode="default"
//               error={errors.ledgerName}
//             />

//             {/* Buttons */}
//             <View style={styles.buttonRow}>
//               <PrimaryButton
//                 onPress={handleCancel}
//                 variant="secondary"
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </PrimaryButton>
//               <PrimaryButton onPress={handleSave} style={styles.saveButton}>
//                 Save Ledger
//               </PrimaryButton>
//             </View>
//           </BottomSheetScrollView>
//         </View>
//       </BottomSheetModal>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollView: { flex: 1 },
//   contentContainer: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyText: {
//     color: Colors.light.textSecondary || '#9ca3af',
//     fontSize: 15,
//     textAlign: 'center',
//   },

//   // ── Bottom Sheet Styles ──
//   sheetScrollView: { flex: 1 },
//   sheetContent: {
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 60,
//   },
//   sheetTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.light.text,
//     marginBottom: 24,
//     textAlign: 'center',
//   },

//   // Inline Ledger Type Options
//   optionsContainer: {
//     marginBottom: 20,
//     gap: 10,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   selectedOption: {
//     borderColor: Colors.light.primaryDark || '#3b82f6',
//     backgroundColor: '#f0f9ff',
//   },
//   optionText: {
//     fontSize: 16,
//     color: Colors.light.text,
//   },
//   selectedOptionText: {
//     fontWeight: '600',
//     color: Colors.light.primaryDark || '#3b82f6',
//   },

//   // Buttons
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 28,
//   },
//   saveButton: { flex: 1 },
//   cancelButton: { flex: 1 },
// });


import AuthInput from '@/components/AuthInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import Loader from '@/components/Loader';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';

type Ledger = {
  id: string;
  ledgerType: string;
  ledgerName: string;
};

type FormData = {
  ledgerType: string;
  ledgerName: string;
};

const LEDGER_TYPE_OPTIONS = ['Bank Account', 'Expenses Ledger'];

export default function LedgerScreen() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('ledger');
  const [isLoading, setIsLoading] = useState(false);

  // List State
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [filteredLedgers, setFilteredLedgers] = useState<Ledger[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State for Add Ledger
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

  // Fetch Ledgers (Simple - No Pagination)
  const fetchLedgers = async () => {
    try {
      setLoading(true);
      const response = await postApi(ENDPOINTS.LEDGER_LIST, {});

      const apiList = response?.data?.ledgers || response?.data || [];

      const mappedList: Ledger[] = apiList.map((item: any) => ({
        id: item.id?.toString() || '',
        ledgerType: item.ledgerType || '',
        ledgerName: item.ledgerName || item.name || '',
      }));

      setLedgers(mappedList);
      setFilteredLedgers(mappedList);
    } catch (err: any) {
      console.error('LEDGER LIST API ERROR:', err);
      showToast('Error', 'Failed to load ledgers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Live Search Filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLedgers(ledgers);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = ledgers.filter((ledger) =>
      ledger.ledgerName.toLowerCase().includes(query) ||
      ledger.ledgerType.toLowerCase().includes(query)
    );

    setFilteredLedgers(filtered);
  }, [searchQuery, ledgers]);

  // Load ledgers when screen opens
  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleInputChange = (field: keyof FormData) => (text: string) =>
    setFormData((prev) => ({ ...prev, [field]: text }));

  const openAddLedgerSheet = useCallback(() => {
    Keyboard.dismiss();
    setShowLedgerTypes(false);
    setFormData({ ledgerType: '', ledgerName: '' });
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

  const handleSave = async () => {
    if (!validate(formData)) {
      showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ledgerType: formData.ledgerType,
        ledgerName: formData.ledgerName,
      };

      console.log("🔍 ENDPOINT:", ENDPOINTS.ADD_LEDGER);
      console.log("📤 Ledger Payload:", payload);

      const response = await postApi(ENDPOINTS.ADD_LEDGER, payload);

      if (response.status === "success") {
        showToast(
          "Success",
          response.message || "Ledger added successfully!",
          "success"
        );

        // Refresh list after successful add
        fetchLedgers();

        // Close sheet and reset form
        setTimeout(() => {
          addLedgerSheetRef.current?.close();
          setFormData({ ledgerType: '', ledgerName: '' });
          setShowLedgerTypes(false);
        }, 800);
      } else {
        showToast(
          "Error",
          response.message || "Failed to add ledger",
          "error"
        );
      }
    } catch (error: any) {
      console.error("❌ Ledger API Error:", error);
      showToast("Error", "Something went wrong while adding ledger", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    addLedgerSheetRef.current?.close();
    setFormData({ ledgerType: '', ledgerName: '' });
    setShowLedgerTypes(false);
  };

  const renderLedgerItem = ({ item }: { item: Ledger }) => (
    <View style={styles.ledgerItem}>
      <View style={styles.iconBox}>
        <Ionicons name="book-outline" size={24} color={Colors.light.primaryDark} />
      </View>
      <View style={styles.ledgerInfo}>
        <DefaultText style={styles.ledgerName} variant="bold">
          {item.ledgerName}
        </DefaultText>
        <DefaultText style={styles.ledgerType}>
          {item.ledgerType}
        </DefaultText>
      </View>
    </View>
  );

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
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by ledger name or type..."
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.body}>
          {loading ? (
            <Loader />
          ) : (
            <FlatList
              data={filteredLedgers}
              keyExtractor={(item) => item.id}
              renderItem={renderLedgerItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <DefaultText style={styles.emptyText}>
                    {searchQuery ? 'No matching ledgers found' : 'No ledgers added yet'}
                  </DefaultText>
                </View>
              }
            />
          )}
        </View>

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>

      {/* Add New Ledger Bottom Sheet */}
      <BottomSheetModal ref={addLedgerSheetRef} snapPoints={addLedgerSnapPoints}>
        {isLoading && <Loader />}

        <View style={{ flex: 1 }}>
          <BottomSheetScrollView
            style={styles.sheetScrollView}
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <DefaultText style={styles.sheetTitle} variant="bold">
              Add New Ledger
            </DefaultText>

            {/* Ledger Type */}
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

            {showLedgerTypes && (
              <View style={styles.optionsContainer}>
                {LEDGER_TYPE_OPTIONS.map((type) => {
                  const isSelected = formData.ledgerType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.optionRow, isSelected && styles.selectedOption]}
                      onPress={() => selectLedgerType(type)}
                      activeOpacity={0.7}
                    >
                      <DefaultText
                        style={[styles.optionText, isSelected && styles.selectedOptionText]}
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
                disabled={isLoading}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                onPress={handleSave}
                style={styles.saveButton}
                disabled={isLoading}
              >
                Save Ledger
              </PrimaryButton>
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },

  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },

  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  ledgerInfo: { flex: 1 },
  ledgerName: { fontSize: 16, color: Colors.light.text },
  ledgerType: { fontSize: 13, color: '#6b7280', marginTop: 4 },

  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
  },

  // Bottom Sheet Styles
  sheetScrollView: { flex: 1 },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },

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

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  saveButton: { flex: 1 },
  cancelButton: { flex: 1 },
});