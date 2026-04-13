import AuthInput from '@/components/AuthInput';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import Colors from '../../constants/theme';
import { DefaultText, useTheme } from '../../providers/ThemeProvider';

import * as ImagePicker from 'expo-image-picker';

export default function SupportScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [queryTitle, setQueryTitle] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedField(fieldId);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleImageUpload = async () => {
  // Ask permission
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Allow access to photos to upload image');
    return;
  }

  // Open gallery
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  // If user selected image
  if (!result.canceled) {
    setUploadedImage(result.assets[0].uri);
  }
};

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!queryTitle.trim()) newErrors.title = 'Query title is required';
    if (!queryDescription.trim()) newErrors.description = 'Please describe your issue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // TODO: call your support API here
    Alert.alert('Submitted', 'Your query has been submitted. We will get back to you shortly.', [
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
              <Ionicons name="help-circle-outline" size={20} color={Colors.light.primaryDark} />
              <DefaultText  style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>Support</DefaultText >
            </View>
            <View style={{ width: 40 }} />
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Banner */}
              <View style={styles.banner}>
                <View style={styles.bannerIconCircle}>
                  <Ionicons name="chatbubbles-outline" size={44} color={Colors.light.primaryDark} />
                </View>
                <DefaultText  style={[styles.bannerTitle, { fontFamily: theme.fonts.bold }]}>
                  How can we help?
                </DefaultText >
                <DefaultText  style={styles.bannerSubtitle}>
                  Fill in the details below and our team will respond within 24 hours.
                </DefaultText >
              </View>

              {/* Query Form Card */}
              <View style={styles.formCard}>
                <DefaultText  style={styles.sectionTitle}>Submit a Query</DefaultText >

                {/* Query Title */}
                <AuthInput
                  label="Query Title"
                  fieldId="queryTitle"
                  focusedField={focusedField}
                  value={queryTitle}
                  onChangeText={(text) => {
                    setQueryTitle(text);
                    if (errors.title) setErrors((p) => ({ ...p, title: '' }));
                  }}
                  onFocus={() => handleFocus('queryTitle')}
                  onBlur={handleBlur}
                  inputMode="default"
                  
                  error={errors.title}
                />

                {/* Query Description */}
                <View style={styles.textAreaGroup}>
                  <DefaultText  style={[
                    styles.textAreaLabel,
                    focusedField === 'queryDescription' && styles.textAreaLabelFocused,
                  ]}>
                    Query Description
                  </DefaultText >
                  <TextInput
                    style={[
                      styles.textArea,
                      focusedField === 'queryDescription' && styles.textAreaFocused,
                      errors.description ? styles.textAreaError : null,
                    ]}
                    value={queryDescription}
                    onChangeText={(text) => {
                      setQueryDescription(text);
                      if (errors.description) setErrors((p) => ({ ...p, description: '' }));
                    }}
                    onFocus={() => handleFocus('queryDescription')}
                    onBlur={handleBlur}
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                  />
                  {errors.description && (
                    <DefaultText  style={styles.errorText}>{errors.description}</DefaultText >
                  )}
                </View>

                {/* Image Upload */}
                <DefaultText  style={styles.uploadLabel}>Attach Screenshot (optional)</DefaultText >
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={handleImageUpload}
                  activeOpacity={0.7}
                >
                  {uploadedImage ? (
                    <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Ionicons name="cloud-upload-outline" size={32} color={Colors.light.primaryDark + '80'} />
                      <DefaultText  style={styles.uploadText}>Tap to upload image</DefaultText >
                      <DefaultText  style={styles.uploadSubText}>PNG, JPG up to 5MB</DefaultText >
                    </View>
                  )}
                </TouchableOpacity>

                <PrimaryButton onPress={handleSubmit} style={styles.submitButton}>
                  Submit Query
                </PrimaryButton>
              </View>

              {/* Contact Card */}
              <View style={styles.contactCard}>
                <DefaultText  style={[styles.contactTitle, { fontFamily: theme.fonts.bold }]}>
                  Contact Us Directly
                </DefaultText >
               

                {/* Email */}
                <TouchableOpacity style={styles.contactRow} activeOpacity={0.7}>
                  <View style={styles.contactIconBox}>
                    <Ionicons name="mail-outline" size={22} color={Colors.light.primaryDark} />
                  </View>
                  <View style={styles.contactInfo}>
                    <DefaultText  style={styles.contactLabel}>Email Support</DefaultText >
                    <DefaultText  style={styles.contactValue}>support@yourapp.com</DefaultText >
                  </View>
                </TouchableOpacity>

                {/* Phone */}
                <TouchableOpacity style={[styles.contactRow, { marginBottom: 0 }]} activeOpacity={0.7}>
                  <View style={styles.contactIconBox}>
                    <Ionicons name="call-outline" size={22} color={Colors.light.primaryDark} />
                  </View>
                  <View style={styles.contactInfo}>
                    <DefaultText style={styles.contactLabel}>Phone Support</DefaultText >
                    <DefaultText  style={styles.contactValue}>+91 98765 43210</DefaultText >
                  </View>
                  
                </TouchableOpacity>
              </View>

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
    padding: 16,
    paddingBottom: 60,
  },

  banner: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  bannerIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerTitle: {
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  formCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },

  textAreaGroup: {
    marginBottom: 16,
  },
  textAreaLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  textAreaLabelFocused: {
    color: Colors.light.primaryDark,
  },
  textArea: {
    backgroundColor: Colors.light.inputBg || '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 120,
  },
  textAreaFocused: {
    borderColor: Colors.light.primaryDark,
    borderWidth: 1.5,
  },
  textAreaError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
  },

  uploadLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: Colors.light.primaryDark + '40',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryDark + '05',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.light.primaryDark,
    fontWeight: '500',
  },
  uploadSubText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  uploadedImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },

  submitButton: {
    marginTop: 4,
  },

  contactCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder || '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 17,
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
   
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg || '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  contactIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryDark + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: { flex: 1 },
  contactLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: '500',
  },
});