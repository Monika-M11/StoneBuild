import AuthInput from '@/components/AuthInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '../../components/BottomSheetModal';
import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useDrawer } from '../../contexts/DrawerContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';

type FormData = {
  ledgerType: string;
  ledgerName: string;
};

const LEDGER_TYPE_OPTIONS = ['Bank Account', 'Expenses Ledger'];

export default function LedgerScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ledger');
  const { openDrawer } = useDrawer();
  const { showToast } = useToast();

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
      showToast('Validation Error', 'Please fix the errors highlighted below', 'error');
      return;
    }

    console.log('✅ New Ledger Saved:', formData);
    showToast('Success', 'Ledger added successfully!', 'success');

    setTimeout(() => {
      addLedgerSheetRef.current?.close();
      setFormData({ ledgerType: '', ledgerName: '' });
      setShowLedgerTypes(false);
    }, 1200);
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

  // ── Bottom Sheet Styles ──
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
