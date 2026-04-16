import AuthInput from '@/components/AuthInput';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Footer from '../../components/Footer';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenPage from '../../components/ScreenPage';
import Colors from '../../constants/theme';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DefaultText } from '../../providers/ThemeProvider';

type FormData = {
  projectName: string;
  address: string;
  startDate: string;
  endDate: string;
  value: string;
};

export default function AddProjectScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('projects');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [startDateObj, setStartDateObj] = useState(new Date());
  const [endDateObj, setEndDateObj] = useState(new Date());

  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    address: '',
    startDate: '',
    endDate: '',
    value: '',
  });

  // ✅ Validation
  const { errors, validate } = useFormValidation<keyof FormData>({
    projectName: { required: true, requiredMessage: 'Project name is required' },
    address: { required: true, requiredMessage: 'Address is required' },
    startDate: { required: true, requiredMessage: 'Start date is required' },
    endDate: { required: true, requiredMessage: 'End date is required' },
    value: { required: true, requiredMessage: 'Project value is required' },
  });

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleFocus = (fieldId: string) => setFocusedField(fieldId);
  const handleBlur = () => setFocusedField(null);

  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // ✅ Date handlers
  const handleStartDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') return setShowStartPicker(false);

    if (date) {
      setShowStartPicker(false);
      setStartDateObj(date);
      handleInputChange('startDate')(formatDate(date));
    }
  };

  const handleEndDate = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') return setShowEndPicker(false);

    if (date) {
      setShowEndPicker(false);
      setEndDateObj(date);
      handleInputChange('endDate')(formatDate(date));
    }
  };

  const handleSave = () => {
    if (!validate(formData)) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    console.log('✅ Project Saved:', formData);

    Alert.alert('Success', 'Project added successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleCancel = () => router.back();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenPage title="Add Project" icon="folder-outline">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.formContainer}>
              <DefaultText style={styles.sectionTitle} variant="bold">
                New Project
              </DefaultText>

              {/* Project Name */}
              <AuthInput
                label="Project Name *"
                fieldId="projectName"
                value={formData.projectName}
                onChangeText={handleInputChange('projectName')}
                onFocus={() => handleFocus('projectName')}
                onBlur={handleBlur}
                focusedField={focusedField}
                error={errors.projectName}
              />

              {/* Address */}
              <AuthInput
                label="Project Address *"
                fieldId="address"
                value={formData.address}
                onChangeText={handleInputChange('address')}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                focusedField={focusedField}
                error={errors.address}
              />

              {/* Start Date */}
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <View pointerEvents="none">
                 <AuthInput
  label="Start Date *"
  fieldId="startDate"
  value={formData.startDate}
  onChangeText={handleInputChange('startDate')}
  focusedField={focusedField}
  onFocus={() => handleFocus('startDate')}
  onBlur={handleBlur}
  editable={false} 

  error={errors.startDate}
/>
                </View>
              </TouchableOpacity>

              {/* End Date */}
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <View pointerEvents="none">

<AuthInput
  label="End Date *"
  fieldId="endDate"
  value={formData.endDate}
  onChangeText={handleInputChange('endDate')}
  focusedField={focusedField}
  onFocus={() => handleFocus('endDate')}
  onBlur={handleBlur}
  editable={false}
  error={errors.endDate}
/>
                </View>
              </TouchableOpacity>

              {/* Value */}
              <AuthInput
                label="Project Value *"
                fieldId="value"
                value={formData.value}
                onChangeText={handleInputChange('value')}
                onFocus={() => handleFocus('value')}
                onBlur={handleBlur}
                focusedField={focusedField}
                inputMode="amount"
                error={errors.value}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Buttons */}
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
  Save Project
</PrimaryButton>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
  value={startDateObj}
  mode="date"
  display="default"
  onChange={(event, date) => {
    if (!date) return;

    setShowStartPicker(false);
    setStartDateObj(date);
    handleInputChange('startDate')(formatDate(date));
  }}
/>
        )}

        {showEndPicker && (
            <DateTimePicker
  value={endDateObj}
  mode="date"
  display="default"
  onChange={(event, date) => {
    if (!date) return;

    setShowEndPicker(false);
    setEndDateObj(date);
    handleInputChange('endDate')(formatDate(date));
  }}
/>
        
        )}

        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenPage>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  formContainer: {
    backgroundColor: Colors.light.inputBg,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
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
});