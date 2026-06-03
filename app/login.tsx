// // import Colors from '@/constants/theme';
// // import { useThemeColor } from '@/hooks/use-theme-color';
// // import { useAuth } from '@/providers/AuthProvider';
// // import { useFocusEffect, useRouter } from 'expo-router';
// // import React, { useCallback, useRef, useState } from 'react';
// // import {
// //   Animated,
// //   BackHandler,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   StyleSheet,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import AuthInput from '../components/AuthInput';
// // import PrimaryButton from '../components/PrimaryButton';
// // import { DefaultText, useTheme } from '../providers/ThemeProvider';
// // import { useToast } from '../providers/ToastProvider';



// // export default function Login() {
// //   const router = useRouter();
// //   const theme = useTheme();
// //   const { showToast } = useToast();

// //   const primaryDark = Colors.light.primaryDark;
// //   const inputBorder = useThemeColor({ light: 'inputBorder', dark: 'inputBorder' }, 'inputBorder');
// //   const icon = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');

// //   const [isSignUp, setIsSignUp] = useState(false);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [name, setName] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [focusedField, setFocusedField] = useState<string | null>(null);
// //   const shakeAnim = useRef(new Animated.Value(0)).current;
  
// // const [showPassword, setShowPassword] = useState(false);
// //   const { setIsLoggedIn } = useAuth();
  



// //   // Floating label animation for Full Name field
// //   const nameAnimValue = useRef(new Animated.Value(name.length > 0 ? 1 : 0)).current;
// //   const isNameActive = focusedField === 'name' || name.length > 0;

// //   React.useEffect(() => {
// //     Animated.timing(nameAnimValue, {
// //       toValue: isNameActive ? 1 : 0,
// //       duration: 180,
// //       useNativeDriver: false,
// //     }).start();
// //   }, [isNameActive]);

// //   const nameTop = nameAnimValue.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [14, -8],
// //   });

// // //To avoid back navigation
// // useFocusEffect(
// //   useCallback(() => {
// //     const onBackPress = () => {
// //       BackHandler.exitApp(); //exit app
// //       return true;
// //     };

// //     const subscription = BackHandler.addEventListener(
// //       'hardwareBackPress',
// //       onBackPress
// //     );

// //     return () => subscription.remove(); 
// //   }, [])
// // );


// //   const nameFontSize = nameAnimValue.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [16, 11],
// //   });

// //   const nameLabelColor = nameAnimValue.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [
// //       Colors.light.icon,
// //       focusedField === 'name' ? primaryDark : Colors.light.icon,
// //     ],
// //   });

// //   const shake = () => {
// //     Animated.sequence([
// //       Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
// //       Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
// //     ]).start();
// //   };

// //   const handleSubmit = async () => {
// //     if (!email || !password || (isSignUp && !name)) {
// //       shake();
// //       return;
// //     }
// //     setLoading(true);
// //     await new Promise((res) => setTimeout(res, 1500));
// //     setLoading(false);
// //     router.replace('/home');
// //   };

// // //   //backend url logic
// // // const handleSubmit = async () => {
// // //   if (loading) return;

// // //   if (!email || !password || (isSignUp && !name)) {
// // //     showToast('Validation Error', 'Please fill all required fields', 'error');
// // //     shake();
// // //     return;
// // //   }

// // //   try {
// // //     setLoading(true);

// // //     const payload = {
// // //       userName: email.trim(),
// // //       password: password.trim(),
// // //     };

// // //     const response = await postApi(
// // //       ENDPOINTS.LOGIN,

// // //       payload
// // //     );

// // //     console.log('API RESPONSE:', response);
   
// // //     if (response?.status !== 'success') {
// // //       showToast('Login Failed', response?.message || 'Something went wrong', 'error');
// // //       shake();
// // //       return;
// // //     }

// // //     //Save token
// // //     if (response?.token) {
// // //       await saveToken(response.token);
// // //     }

    
// // //     showToast('Welcome!', 'Successfully logged in', 'success');
    
// // //     setTimeout(() => {
// // //       router.replace('/home');
// // //     }, 1000); 

// // //   } catch (error: any) {
// // //     showToast('Error', error?.message || 'Something went wrong', 'error');
// // //     shake();
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };


// // // const handleSubmit = async () => {
// // //   if (loading) return;

// // //   if (!email || !password || (isSignUp && !name)) {
// // //     showToast('Validation Error', 'Please fill all required fields', 'error');
// // //     shake();
// // //     return;
// // //   }

// // //   try {
// // //     setLoading(true);

// // //  const payload = {
// // //   username: email.trim(),
// // //   password: password.trim(),
// // // };

// // //     const response = await postApi(
// // //       ENDPOINTS.LOGIN,
// // //       payload
// // //     );

// // //     console.log('API RESPONSE:', response);

// // //     if (response?.status) {
// // //       showToast('Login Failed', response?.message || 'Something went wrong', 'error');
// // //       shake();
// // //       return;
// // //     }

// // //     // ✅ Save token
// // //     if (response?.token) {
// // //       await saveToken(response.token);
// // //       setIsLoggedIn(true);
// // //     }

// // //     // ✅ Trigger global auth state
    

// // //     showToast('Welcome!', 'Successfully logged in', 'success');

// // //   } catch (error: any) {
// // //     showToast('Error', error?.message || 'Something went wrong', 'error');
// // //     shake();
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };

// //   const nameInputBorder =
// //     focusedField === 'name' ? primaryDark : inputBorder + '66';

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //     >
// //       <View style={[styles.bgAccent, { backgroundColor: primaryDark + '1A' }]} />
// //       <ScrollView
// //         contentContainerStyle={styles.scrollContent}
// //         keyboardShouldPersistTaps="handled"
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <View style={styles.centeredContent}>
// //             <DefaultText style={[styles.title, { color: primaryDark }]} variant="bold">
// //               {isSignUp ? 'Create account' : 'Welcome back'}
// //             </DefaultText>
// //             <DefaultText style={[styles.subtitle, { color: icon }]} variant="regular">
// //               {isSignUp
// //                 ? 'Sign up to get started today'
// //                 : 'Sign in to continue your journey'}
// //             </DefaultText>
// //           </View>
// //         </View>

// //         {/* Form */}
// //         <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
// //           {isSignUp && (
// //             <View style={styles.fieldWrapper}>
// //               <View style={[styles.inputGroup, { borderColor: nameInputBorder }]}>
// //                 <Animated.Text
// //                   style={[
// //                     styles.floatingLabel,
// //                     {
// //                       top: nameTop,
// //                       fontSize: nameFontSize,
// //                       color: nameLabelColor,
// //                       backgroundColor: Colors.light.background,
// //                       paddingHorizontal: isNameActive ? 4 : 0,
// //                       fontFamily: isNameActive
// //                         ? 'SourceSans3_500Medium'
// //                         : theme.fonts.regular,
// //                       letterSpacing: isNameActive ? 0.8 : 0,
// //                       // @ts-ignore
// //                       textTransform: isNameActive ? 'uppercase' : 'none',
// //                     },
// //                   ]}
// //                   pointerEvents="none"
// //                 >
// //                   Full Name
// //                 </Animated.Text>
// //                 <TextInput
// //                   style={[
// //                     styles.input,
// //                     { color: Colors.light.text, fontFamily: theme.fonts.regular },
// //                   ]}
// //                   value={name}
// //                   onChangeText={setName}
// //                   onFocus={() => setFocusedField('name')}
// //                   onBlur={() => setFocusedField(null)}
// //                   autoCapitalize="words"
// //                   autoComplete="name"
// //                 />
// //               </View>
// //             </View>
// //           )}

// //           <AuthInput
// //             label="Username"
// //             value={email}
// //             onChangeText={setEmail}
// //             onFocus={() => setFocusedField('email')}
// //             onBlur={() => setFocusedField(null)}
// //             keyboardType="email-address"
// //             autoCapitalize="none"
// //             autoComplete="email"
// //             focusedField={focusedField}
// //             fieldId="email"
// //           />

// //           <AuthInput
// //             label="Password"
// //             value={password}
// //             onChangeText={setPassword}
// //             onFocus={() => setFocusedField('password')}
// //             onBlur={() => setFocusedField(null)}
// //             secureTextEntry={!showPassword} //toggle
// //             autoComplete={isSignUp ? 'new-password' : 'current-password'}
// //             focusedField={focusedField}
// //             fieldId="password"

// //             // 👇 NEW PROPS (you will add in AuthInput)
// //             rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
// //             onRightIconPress={() => setShowPassword(prev => !prev)}
// //           />

          
// //             <TouchableOpacity style={styles.forgotButton}>
// //               <DefaultText style={[styles.forgotText, { color: primaryDark }]} variant="medium">Forgot password?</DefaultText>
// //             </TouchableOpacity>
       



// //           <PrimaryButton onPress={handleSubmit} loading={loading}>
// //             {isSignUp ? 'Create Account' : 'Sign In'}
// //           </PrimaryButton>
// //         </Animated.View>
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.light.background,
// //   },
// //   bgAccent: {
// //     position: 'absolute',
// //     top: -120,
// //     right: -80,
// //     width: 320,
// //     height: 320,
// //     borderRadius: 160,
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     paddingHorizontal: 28,
// //     paddingTop: 80,
// //     paddingBottom: 40,
// //   },
// //   header: {
// //     height: 140,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   centeredContent: {
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   title: {
// //     fontSize: 32,
// //     fontWeight: '600',
// //     letterSpacing: -0.8,
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontSize: 15,
// //     letterSpacing: 0.1,
// //     textAlign: 'center',
// //     lineHeight: 22,
// //   },
// //   form: {
// //     gap: 16,
// //   },
// //   // Full Name inline field wrapper
// //   fieldWrapper: {
// //     marginTop: 8,
// //   },
// //   inputGroup: {
// //     borderWidth: 1,
// //     borderRadius: 14,
// //     paddingHorizontal: 16,
// //     height: 48,
// //     justifyContent: 'center',
// //   },
// //   floatingLabel: {
// //     position: 'absolute',
// //     left: 12,
// //     zIndex: 10,
// //   },
// //   input: {
// //     fontSize: 16,
// //     paddingVertical: 0,
// //     height: 48,
// //   },
// //   forgotButton: {
// //     alignSelf: 'flex-end',
// //     marginTop: -4,
// //   },
// //   forgotText: {
// //     fontSize: 13,
// //     fontWeight: '500',
// //   },
// // });

// import { postApi } from "@/api/apiClient";
// import { ENDPOINTS } from "@/api/endpoints";
// import { saveToken } from "@/auth/authStorage";
// import Colors from '@/constants/theme';
// import { useThemeColor } from '@/hooks/use-theme-color';
// import { useFormValidation } from "@/hooks/useFormValidation";
// import { useAuth } from "@/providers/AuthProvider";
// import { useFocusEffect, useRouter } from 'expo-router';
// import React, { useCallback, useRef, useState } from 'react';
// import {
//   Animated,
//   BackHandler,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import AuthInput from '../components/AuthInput';
// import PrimaryButton from '../components/PrimaryButton';
// import { DefaultText, useTheme } from '../providers/ThemeProvider';
// import { useToast } from '../providers/ToastProvider';

// type AuthFields =
//   | "companyName"
//   | "phone"
//   | "email"
//   | "password"
//   | "confirmPassword";

// export default function AuthScreen() {
//   const router = useRouter();
//   const theme = useTheme();
//   const { showToast } = useToast();
//   const { setIsLoggedIn } = useAuth();

//   const primaryDark = Colors.light.primaryDark;
//   const icon = useThemeColor({ light: 'icon', dark: 'icon' }, 'icon');

//   const [isSignUp, setIsSignUp] = useState(false);

//   // Form States
//   const [companyName, setCompanyName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [loading, setLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const shakeAnim = useRef(new Animated.Value(0)).current;

//   const shake = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
//     ]).start();
//   };
// // ======================
// // VALIDATION SETUP
// // ======================
// const { errors, validate } = useFormValidation<AuthFields>({
//   companyName: {
//     required: true,
//     requiredMessage: "Company Name is required",
//   },
//   phone: {
//     required: true,
//     requiredMessage: "Phone Number is required",
//     minLength: 10,
//     minLengthMessage: "Phone Number must be 10 digits",
//   },
//   email: {
//     required: true,
//     requiredMessage: "Email is required",
//   },
//   password: {
//     required: true,
//     requiredMessage: "Password is required",
//     minLength: 7,
//     minLengthMessage: "Password must be at least 7 characters",
//   },
//   confirmPassword: {
//     required: true,
//     requiredMessage: "Confirm Password is required",
//     minLength: 7,
//     minLengthMessage: "Password must be at least 7 characters",
//   },
// });

// // ======================
// // HANDLE SUBMIT
// // ======================
// const handleSubmit = async () => {
//   let isValid = false;

//   if (isSignUp) {
//     // SIGNUP: All 5 fields required
//     isValid = validate({
//       companyName,
//       phone,
//       email,
//       password,
//       confirmPassword,
//     });
//   } else {
//     // LOGIN: Only email & password required
//     isValid = validate({
//       companyName: "",      // dummy (not required in login)
//       phone: "",            // dummy
//       email,
//       password,
//       confirmPassword: "",  // dummy
//     });
//   }

//   if (!isValid) {
//     shake();
//     const firstError = Object.values(errors).find((err) => err);
//     if (firstError) {
//       showToast("Validation Error", firstError, "error");
//     }
//     return;
//   }

//   // Extra password match check for Signup
//   if (isSignUp && password !== confirmPassword) {
//     showToast("Validation Error", "Passwords do not match", "error");
//     shake();
//     return;
//   }

//   try {
//     setLoading(true);

//     if (isSignUp) {
//       // ==================== SIGNUP ====================
//      const response = await postApi(
//   ENDPOINTS.SIGNUP,
//   {
//     company_name: companyName,
//     email,
//     phone,
//     password,
//     reenter_password: confirmPassword,
//   },
//   'raw'
// );

// console.log("REGISTER RESPONSE:", response);

// if (!response?.status) {
//   showToast(
//     "Error",
//     response?.message || "Registration failed",
//     "error"
//   );
//   return;
// }

// showToast(
//   "Success",
//   response?.message || "Account created successfully",
//   "success"
// );

// console.log(
//   "Generated Username:",
//   response?.data?.username
// );

// setCompanyName("");
// setPhone("");
// setEmail("");
// setPassword("");
// setConfirmPassword("");

// setIsSignUp(false);

// return;
// } else {


//       // ==================== LOGIN ====================
//       const response = await postApi(ENDPOINTS.LOGIN, {
//         username: email,
//         password,
//       },
//     'raw'
//   );
//     console.log("LOGIN PAYLOAD", {
//   username: email,
//   password,
// });

//       if (!response?.success) {
//         showToast("Error", response?.message || "Invalid credentials", "error");
//         return;
//       }

//       const token = response?.data?.token;
//       if (!token) {
//         showToast("Error", "Token not received", "error");
//         return;
//       }

//       await saveToken(token);
//       setIsLoggedIn(true);

//       showToast("Success", "Logged in successfully", "success");
//       router.replace("/home");
//     }
//   } catch (error: any) {
//     console.error(error);
//     showToast("Error", error?.message || "Something went wrong", "error");
//   } finally {
//     setLoading(false);
//   }
// };


//   // Back Handler
//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         if (isSignUp) {
//           setIsSignUp(false);
//           return true;
//         }
//         BackHandler.exitApp();
//         return true;
//       };

//       const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
//       return () => subscription.remove();
//     }, [isSignUp])
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={[styles.bgAccent, { backgroundColor: primaryDark + '1A' }]} />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.centeredContent}>
//             <DefaultText style={[styles.title, { color: primaryDark }]} variant="bold">
//               {isSignUp ? 'Create Account' : 'Welcome Back'}
//             </DefaultText>
//             <DefaultText style={[styles.subtitle, { color: icon }]} variant="regular">
//               {isSignUp ? 'Fill the details to get started' : 'Sign in to continue your journey'}
//             </DefaultText>
//           </View>
//         </View>

//         {/* Form */}
//         <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
//           {isSignUp && (
//             <>
//               <AuthInput
//                 label="Company Name"
//                 value={companyName}
//                 onChangeText={setCompanyName}
//                 onFocus={() => setFocusedField('companyName')}
//                 onBlur={() => setFocusedField(null)}
//                 focusedField={focusedField}
//                 fieldId="companyName"
//                 autoCapitalize="words"
//                 error={errors.companyName}
//               />

//               <AuthInput
//                 label="Phone Number"
//                 value={phone}
//                 onChangeText={setPhone}
//                 onFocus={() => setFocusedField('phone')}
//                 onBlur={() => setFocusedField(null)}
//                 keyboardType="number-pad"
//                 focusedField={focusedField}
//                 fieldId="phone"
//                 error={errors.phone}
//               />
//             </>
//           )}

//           <AuthInput
//             label="Email"
//             value={email}
//             onChangeText={setEmail}
//             onFocus={() => setFocusedField('email')}
//             onBlur={() => setFocusedField(null)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             focusedField={focusedField}
//             fieldId="email"
//             error={errors.email}
//           />

//           <AuthInput
//             label="Password"
//             value={password}
//             onChangeText={setPassword}
//             onFocus={() => setFocusedField('password')}
//             onBlur={() => setFocusedField(null)}
//             secureTextEntry={!showPassword}
//             focusedField={focusedField}
//             fieldId="password"
//             rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
//             onRightIconPress={() => setShowPassword((prev) => !prev)}
//             error={errors.password}
//           />

//           {isSignUp && (
//             <AuthInput
//               label="Confirm Password"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               onFocus={() => setFocusedField('confirmPassword')}
//               onBlur={() => setFocusedField(null)}
//               secureTextEntry={!showConfirmPassword}
//               focusedField={focusedField}
//               fieldId="confirmPassword"
//               rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
//               onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
//               error={errors.confirmPassword}
//             />
//           )}

//           {!isSignUp && (
//             <TouchableOpacity style={styles.forgotButton}>
//               <DefaultText style={[styles.forgotText, { color: primaryDark }]} variant="medium">
//                 Forgot password?
//               </DefaultText>
//             </TouchableOpacity>
//           )}

//           <PrimaryButton onPress={handleSubmit} loading={loading}>
//             {isSignUp ? 'Create Account' : 'Sign In'}
//           </PrimaryButton>

//           {/* Toggle Link */}
//           <View style={styles.switchContainer}>
//             <DefaultText style={{ color: icon }} variant="regular">
//               {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
//             </DefaultText>
//             <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
//               <DefaultText style={{ color: primaryDark, fontWeight: '600' }} variant="medium">
//                 {isSignUp ? 'Sign In' : 'Sign Up'}
//               </DefaultText>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.light.background,
//   },
//   bgAccent: {
//     position: 'absolute',
//     top: -120,
//     right: -80,
//     width: 320,
//     height: 320,
//     borderRadius: 160,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 28,
//     paddingTop: 80,
//     paddingBottom: 40,
//   },
//   header: {
//     height: 140,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centeredContent: {
//     alignItems: 'center',
//     gap: 8,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '600',
//     letterSpacing: -0.8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 15,
//     letterSpacing: 0.1,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   form: {
//     gap: 16,
//   },
//   forgotButton: {
//     alignSelf: 'flex-end',
//     marginTop: -4,
//   },
//   forgotText: {
//     fontSize: 13,
//     fontWeight: '500',
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
// });



import { postApi } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import { saveToken } from "@/auth/authStorage";
import Colors from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import BottomSheetModal from "@/components/BottomSheetModal";
import AuthInput from "../components/AuthInput";
import PrimaryButton from "../components/PrimaryButton";
import { DefaultText } from "../providers/ThemeProvider";
import { useToast } from "../providers/ToastProvider";

type LoginFields = "username" | "password";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setIsLoggedIn } = useAuth();

  const bottomSheetRef = useRef<any>(null);

  const primaryDark = Colors.light.primaryDark;
  const icon = useThemeColor(
    { light: "icon", dark: "icon" },
    "icon"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const { errors, validate } =
    useFormValidation<LoginFields>({
      username: {
        required: true,
        requiredMessage: "Username is required",
      },
      password: {
        required: true,
        requiredMessage: "Password is required",
      },
    });

  const handleLogin = async () => {
    const isValid = validate({
      username,
      password,
    });

    if (!isValid) {
      shake();

      showToast(
        "Validation Error",
        "Please enter username and password",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await postApi(
        ENDPOINTS.LOGIN,
        {
          username,
          password,
        },
        "raw"
      );

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      if (!response?.status) {
        showToast(
          "Error",
          response?.message || "Login failed",
          "error"
        );
        return;
      }

      const token =
        response?.data?.token;

      if (!token) {
        showToast(
          "Error",
          "Token not received",
          "error"
        );
        return;
      }

      await saveToken(token);

      setIsLoggedIn(true);

      showToast(
        "Success",
        response?.message ||
          "Login successful",
        "success"
      );

      router.replace("/login");
    } catch (error: any) {
      console.error(error);

      showToast(
        "Error",
        error?.message ||
          "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      {/* Background Circle */}
      <View
        style={[
          styles.bgAccent,
          {
            backgroundColor:
              primaryDark + "1A",
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={styles.centeredContent}
          >
            <DefaultText
              style={[
                styles.title,
                {
                  color: primaryDark,
                },
              ]}
              variant="bold"
            >
              Welcome Back
            </DefaultText>

            <DefaultText
              style={[
                styles.subtitle,
                {
                  color: icon,
                },
              ]}
              variant="regular"
            >
              Sign in to continue your
              journey
            </DefaultText>
          </View>
        </View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            {
              transform: [
                {
                  translateX:
                    shakeAnim,
                },
              ],
            },
          ]}
        >
          <AuthInput
            label="Username"
            value={username}
            onChangeText={
              setUsername
            }
            onFocus={() =>
              setFocusedField(
                "username"
              )
            }
            onBlur={() =>
              setFocusedField(
                null
              )
            }
            focusedField={
              focusedField
            }
            fieldId="username"
            error={errors.username}
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={
              setPassword
            }
            onFocus={() =>
              setFocusedField(
                "password"
              )
            }
            onBlur={() =>
              setFocusedField(
                null
              )
            }
            secureTextEntry={
              !showPassword
            }
            focusedField={
              focusedField
            }
            fieldId="password"
            error={errors.password}
            rightIcon={
              showPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            onRightIconPress={() =>
              setShowPassword(
                (prev) => !prev
              )
            }
          />

          <TouchableOpacity
  style={styles.forgotButton}
  onPress={() => bottomSheetRef.current?.snapToIndex(0)}
>
            <DefaultText
              style={[
                styles.forgotText,
                {
                  color:
                    primaryDark,
                },
              ]}
              variant="medium"
            >
              Forgot password?
            </DefaultText>
          </TouchableOpacity>

          <PrimaryButton
            onPress={
              handleLogin
            }
            loading={loading}
          >
            Sign In
          </PrimaryButton>

          <View
            style={
              styles.switchContainer
            }
          >
            <DefaultText
              style={{
                color: icon,
              }}
            >
              Don't have an
              account?
            </DefaultText>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/register"
                )
              }
            >
              <DefaultText
                style={{
                  color:
                    primaryDark,
                  fontWeight:
                    "600",
                }}
              >
                {" "}
                Sign Up
              </DefaultText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
      
      <BottomSheetModal
  ref={bottomSheetRef}
  snapPoints={["25%"]}
>
  <View style={styles.bottomSheetContainer}>
    <DefaultText
      style={styles.bottomSheetTitle}
      variant="bold"
    >
      Forgot Password
    </DefaultText>

    <DefaultText
      style={styles.bottomSheetText}
      variant="regular"
    >
      Please contact the administrator to reset your password.
    </DefaultText>
  </View>
</BottomSheetModal>
    </KeyboardAvoidingView>
    
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.light.background,
    },

    bgAccent: {
      position: "absolute",
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
      justifyContent: "center",
      alignItems: "center",
    },

    centeredContent: {
      alignItems: "center",
      gap: 8,
    },

    title: {
      fontSize: 32,
      fontWeight: "600",
      letterSpacing: -0.8,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 15,
      letterSpacing: 0.1,
      textAlign: "center",
      lineHeight: 22,
    },

    form: {
      gap: 16,
    },

    forgotButton: {
      alignSelf: "flex-end",
      marginTop: -4,
    },

    forgotText: {
      fontSize: 13,
      fontWeight: "500",
    },

    switchContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
    },
    bottomSheetContainer: {
  paddingHorizontal: 20,
  paddingTop: 10,
  alignItems: "center",
},

bottomSheetTitle: {
  fontSize: 18,
  marginBottom: 12,
},

bottomSheetText: {
  fontSize: 15,
  textAlign: "center",
  color: "#6B7280",
  lineHeight: 22,
},
  });