import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import Ionicons from '@expo/vector-icons/Ionicons';
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
import { useTheme } from '../providers/ThemeProvider';

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  
  // Colors matching getting-started exactly
  const primaryDark = Colors.light.primaryDark;
  const primary = useThemeColor({ light: 'primary', dark: 'primary' }, 'primary');
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');
  const inputBg = useThemeColor({ light: 'inputBg', dark: 'inputBg' }, 'inputBg');
  const text = useThemeColor({ light: 'text', dark: 'text' }, 'text');
  const textSecondary = useThemeColor({ light: 'textSecondary', dark: 'textSecondary' }, 'textSecondary');
  const icon = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');

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
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    router.replace('/');
  };

  const inputBorderDynamic = (field: string) =>
    focusedField === field ? primaryDark : inputBorder + '66';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.bgAccent, { backgroundColor: primaryDark + '1A' }]} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: inputBg + 'CC' }]}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={icon} />
          </TouchableOpacity>

          {/* Title only - centered, no logo */}
          <View style={styles.centeredContent}>
            <Text style={[styles.title, { color: primaryDark }]}>
              {isSignUp ? 'Create account' : 'Welcome back'}
            </Text>
            <Text style={[styles.subtitle, { color: icon }]}>
              {isSignUp
                ? 'Sign up to get started today'
                : 'Sign in to continue your journey'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
          {isSignUp && (
            <View style={[styles.inputGroup, { borderColor: inputBorderDynamic('name') }]}>
              <Text style={[styles.inputLabel, { color: icon }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: text, fontFamily: theme.fonts.regular }]}
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

          <View style={[styles.inputGroup, { borderColor: inputBorderDynamic('email') }]}>
            <Text style={[styles.inputLabel, { color: icon }]}>Username</Text>
            <TextInput
              style={[styles.input, { color: text, fontFamily: theme.fonts.regular }]}
              placeholder="Enter your username"
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

          <View style={[styles.inputGroup, { borderColor: inputBorderDynamic('password') }]}>
            <Text style={[styles.inputLabel, { color: icon }]}>Password</Text>
            <TextInput
              style={[styles.input, { color: text, fontFamily: theme.fonts.regular }]}
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
              <Text style={[styles.forgotText, { color: primaryDark }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.88}
            disabled={loading}
            style={[styles.submitWrapper, { backgroundColor: primaryDark }]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
            <Text style={[styles.dividerText, { color: icon }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
          </View>

          <TouchableOpacity style={[styles.socialButton, { 
            borderColor: inputBorder, 
            backgroundColor: inputBg 
          }]} activeOpacity={0.8}>
            <Text style={[styles.socialIcon, { color: text }]}>G</Text>
            <Text style={[styles.socialText, { color: text }]}>Continue with Google</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: icon }]}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={[styles.toggleAction, { color: primaryDark }]}>{isSignUp ? 'Sign in' : 'Sign up'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  bgAccent: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    position: 'relative',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: -4,
    top: 20,
    padding: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  centeredContent: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
    lineHeight: 22,
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
  },
  inputLabel: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 13,
    fontWeight: '500',
  },
  submitWrapper: {
    marginTop: 8,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'SourceSans3_700Bold',
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
  },
  dividerText: {
    fontFamily: 'SourceSans3_400Regular',
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
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  socialText: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 15,
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
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 14,
  },
  toggleAction: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 14,
    fontWeight: '700',
  },
});
