import AuthInput from '@/components/AuthInput';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import Colors from '../../constants/theme';
import { useTheme } from '../../providers/ThemeProvider';

type FormData = {
  currentPassword: string;
  newPassword: string;
  retypePassword: string;
};

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
    // Clear error on type
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedField(fieldId);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.retypePassword) {
      newErrors.retypePassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.retypePassword) {
      newErrors.retypePassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = () => {
    if (!validate()) return;

    // TODO: call your API here
    Alert.alert('Success', 'Password updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.primaryDark} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Ionicons name="key-outline" size={20} color={Colors.light.primaryDark} />
              <Text style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
                Change Password
              </Text>
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* Body */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon Banner */}
              <View style={styles.iconBanner}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed-outline" size={48} color={Colors.light.primaryDark} />
                </View>
                <Text style={[styles.bannerTitle, { fontFamily: theme.fonts.bold }]}>
                  Update Password
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Your new password must be at least 6 characters long.
                </Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                <AuthInput
                  label="Current Password"
                  fieldId="currentPassword"
                  focusedField={focusedField}
                  value={formData.currentPassword}
                  onChangeText={handleInputChange('currentPassword')}
                  onFocus={() => handleFocus('currentPassword')}
                  onBlur={handleBlur}
                  inputMode="default"
                  secureTextEntry
                  error={errors.currentPassword}
                />

                <AuthInput
                  label="New Password"
                  fieldId="newPassword"
                  focusedField={focusedField}
                  value={formData.newPassword}
                  onChangeText={handleInputChange('newPassword')}
                  onFocus={() => handleFocus('newPassword')}
                  onBlur={handleBlur}
                  inputMode="default"
                  secureTextEntry
                  error={errors.newPassword}
                />

                <AuthInput
                  label="Retype New Password"
                  fieldId="retypePassword"
                  focusedField={focusedField}
                  value={formData.retypePassword}
                  onChangeText={handleInputChange('retypePassword')}
                  onFocus={() => handleFocus('retypePassword')}
                  onBlur={handleBlur}
                  inputMode="default"
                  secureTextEntry
                  error={errors.retypePassword}
                />
              </View>

              {/* Button */}
              <PrimaryButton
                onPress={handleUpdatePassword}
                style={styles.updateButton}
              >
                Update Password
              </PrimaryButton>

            </ScrollView>
          </KeyboardAvoidingView>

        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },

  header: {
    height: 70,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, color: Colors.light.primaryDark },

  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  iconBanner: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 12,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  updateButton: {
    marginTop: 4,
  },
});