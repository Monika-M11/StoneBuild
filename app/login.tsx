import { postApi } from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import { saveToken } from '@/auth/authStorage';
import Colors from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import { DefaultText, useTheme } from '../providers/ThemeProvider';
import { useToast } from '../providers/ToastProvider';



export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const { showToast } = useToast();

  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');
  const icon = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;



  // Floating label animation for Full Name field
  const nameAnimValue = useRef(new Animated.Value(name.length > 0 ? 1 : 0)).current;
  const isNameActive = focusedField === 'name' || name.length > 0;

  React.useEffect(() => {
    Animated.timing(nameAnimValue, {
      toValue: isNameActive ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isNameActive]);

  const nameTop = nameAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -8],
  });

  const nameFontSize = nameAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });

  const nameLabelColor = nameAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      Colors.light.icon,
      focusedField === 'name' ? primaryDark : Colors.light.icon,
    ],
  });

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // const handleSubmit = async () => {
  //   if (!email || !password || (isSignUp && !name)) {
  //     shake();
  //     return;
  //   }
  //   setLoading(true);
  //   await new Promise((res) => setTimeout(res, 1500));
  //   setLoading(false);
  //   router.replace('/home');
  // };

//   //backend url logic
const handleSubmit = async () => {
  if (loading) return;

  if (!email || !password || (isSignUp && !name)) {
    showToast('Validation Error', 'Please fill all required fields', 'error');
    shake();
    return;
  }

  try {
    setLoading(true);

    const payload = {
      userName: email.trim(),
      password: password.trim(),
    };

    const response = await postApi(
      ENDPOINTS.LOGIN,

      payload
    );

    console.log('API RESPONSE:', response);
   
    if (response?.status !== 'success') {
      showToast('Login Failed', response?.message || 'Something went wrong', 'error');
      shake();
      return;
    }

    //Save token
    if (response?.token) {
      await saveToken(response.token);
    }

    
    showToast('Welcome!', 'Successfully logged in', 'success');
    
    setTimeout(() => {
      router.replace('/home');
    }, 1000); 

  } catch (error: any) {
    showToast('Error', error?.message || 'Something went wrong', 'error');
    shake();
  } finally {
    setLoading(false);
  }
};


  const nameInputBorder =
    focusedField === 'name' ? primaryDark : inputBorder + '66';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.bgAccent, { backgroundColor: primaryDark + '1A' }]} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.centeredContent}>
            <DefaultText style={[styles.title, { color: primaryDark }]} variant="bold">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </DefaultText>
            <DefaultText style={[styles.subtitle, { color: icon }]} variant="regular">
              {isSignUp
                ? 'Sign up to get started today'
                : 'Sign in to continue your journey'}
            </DefaultText>
          </View>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
          {isSignUp && (
            <View style={styles.fieldWrapper}>
              <View style={[styles.inputGroup, { borderColor: nameInputBorder }]}>
                <Animated.Text
                  style={[
                    styles.floatingLabel,
                    {
                      top: nameTop,
                      fontSize: nameFontSize,
                      color: nameLabelColor,
                      backgroundColor: Colors.light.background,
                      paddingHorizontal: isNameActive ? 4 : 0,
                      fontFamily: isNameActive
                        ? 'SourceSans3_500Medium'
                        : theme.fonts.regular,
                      letterSpacing: isNameActive ? 0.8 : 0,
                      // @ts-ignore
                      textTransform: isNameActive ? 'uppercase' : 'none',
                    },
                  ]}
                  pointerEvents="none"
                >
                  Full Name
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: Colors.light.text, fontFamily: theme.fonts.regular },
                  ]}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
            </View>
          )}

          <AuthInput
            label="Username"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            focusedField={focusedField}
            fieldId="email"
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            secureTextEntry
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            focusedField={focusedField}
            fieldId="password"
          />

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotButton}>
              <DefaultText style={[styles.forgotText, { color: primaryDark }]} variant="medium">Forgot password?</DefaultText>
            </TouchableOpacity>
          )}



          <PrimaryButton onPress={handleSubmit} loading={loading}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </PrimaryButton>
        </Animated.View>
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
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: 0.1,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  // Full Name inline field wrapper
  fieldWrapper: {
    marginTop: 8,
  },
  inputGroup: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    left: 12,
    zIndex: 10,
  },
  input: {
    fontSize: 16,
    paddingVertical: 0,
    height: 48,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
