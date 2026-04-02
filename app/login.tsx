import Colors from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Login() {
  const router = useRouter();
  const theme = useColorScheme();
  const primary = useThemeColor({ light: 'primary', dark: 'primary' }, 'primary');
  const highlight = useThemeColor({ light: 'highlight', dark: 'highlight' }, 'highlight');
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');
  const inputBg = useThemeColor({ light: 'inputBg', dark: 'inputBg' }, 'inputBg');
  const text = useThemeColor({ light: 'text', dark: 'text' }, 'text');
  const textSecondary = useThemeColor({ light: 'textSecondary', dark: 'textSecondary' }, 'textSecondary');
  const icon = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');
  const border = useThemeColor({ light: 'border', dark: 'border' }, 'border');
  const background = useThemeColor({ light: 'background', dark: 'background' }, 'background');

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      shake();
      return;
    }

  setLoading(true);
  // Simulate API call
  await new Promise((res) => setTimeout(res, 1500));
  setLoading(false);

  // Navigate to main app after login
  router.replace('/');
  };

  const inputBorderColor = (field: string) =>
    focusedField === field ? primary : inputBorder + '66';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background accent */}
      <View style={styles.bgAccent} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={icon} 
            />
          </TouchableOpacity>
          
          <View style={styles.logoMark}>
            <Text style={styles.logoSymbol}>✦</Text>
          </View>
          <Text style={styles.title}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Sign up to get started today'
              : 'Sign in to continue your journey'}
          </Text>
        </View>

        {/* Form */}
        <Animated.View
          style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}
        >
          {isSignUp && (
            <View style={[styles.inputGroup, { borderColor: inputBorderColor('name') }]}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Jane Doe"
                placeholderTextColor={icon}
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>
          )}

          <View style={[styles.inputGroup, { borderColor: inputBorderColor('email') }]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
                placeholderTextColor={icon}
                value={email}
                onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={[styles.inputGroup, { borderColor: inputBorderColor('password') }]}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password..."
                placeholderTextColor={icon}
                value={password}
                onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </View>

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.88}
            disabled={loading}
            style={styles.submitWrapper}
          >
            <LinearGradient
              colors={[Colors.light.primary, Colors.light.highlight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login placeholder */}
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleAction}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgAccent: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.light.highlight + '1A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 120, // Increased for back button space
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 20,
    marginBottom: 20,
    gap: 16,
  },
  backButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: Colors.light.background + 'CC',
    marginTop: 10,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.light.primary + '1A',
    borderWidth: 1,
    borderColor: Colors.light.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoSymbol: {
    fontSize: 22,
    color: Colors.light.primary,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.icon,
    letterSpacing: 0.1,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.light.inputBg,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.light.icon,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 0,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  submitWrapper: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitButton: {
    paddingVertical: 17,
    alignItems: 'center',
    borderRadius: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.inputBorder,
  },
  dividerText: {
    color: Colors.light.icon,
    fontSize: 13,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    backgroundColor: Colors.light.inputBg,
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  socialText: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 36,
  },
  toggleLabel: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  toggleAction: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
