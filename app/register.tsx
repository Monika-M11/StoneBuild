import { postApi } from "@/api/apiClient";
import { ENDPOINTS } from "@/api/endpoints";
import Colors from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFormValidation } from "@/hooks/useFormValidation";
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

import AuthInput from "../components/AuthInput";
import PrimaryButton from "../components/PrimaryButton";
import { DefaultText } from "../providers/ThemeProvider";
import { useToast } from "../providers/ToastProvider";

type RegisterFields =
  | "companyName"
  | "phone"
  | "email"
  | "password"
  | "confirmPassword";

export default function RegisterScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const primaryDark = Colors.light.primaryDark;
  const icon = useThemeColor(
    { light: "icon", dark: "icon" },
    "icon"
  );

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] =
    useState<string | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const shakeAnim = useRef(
    new Animated.Value(0)
  ).current;

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
    useFormValidation<RegisterFields>({
      companyName: {
        required: true,
        requiredMessage:
          "Company Name is required",
      },

      phone: {
        required: true,
        requiredMessage:
          "Phone Number is required",
        minLength: 10,
        minLengthMessage:
          "Phone Number must be 10 digits",
      },

      email: {
        required: true,
        requiredMessage: "Email is required",
      },

      password: {
        required: true,
        requiredMessage:
          "Password is required",
        minLength: 7,
        minLengthMessage:
          "Password must be at least 7 characters",
      },

      confirmPassword: {
        required: true,
        requiredMessage:
          "Confirm Password is required",
        minLength: 7,
        minLengthMessage:
          "Password must be at least 7 characters",
      },
    });

  const handleRegister = async () => {
    const isValid = validate({
      companyName,
      phone,
      email,
      password,
      confirmPassword,
    });

    if (!isValid) {
      shake();

      showToast(
        "Validation Error",
        "Please fix the highlighted fields",
        "error"
      );

      return;
    }

    if (password !== confirmPassword) {
      shake();

      showToast(
        "Validation Error",
        "Passwords do not match",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await postApi(
        ENDPOINTS.SIGNUP,
        {
          company_name: companyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          reenter_password: confirmPassword,
        },
        "raw"
      );

      console.log(
        "REGISTER RESPONSE:",
        response
      );

      if (!response?.status) {
        showToast(
          "Error",
          response?.message ||
            "Registration failed",
          "error"
        );
        return;
      }

      const username =
        response?.data?.username;

      showToast(
        "Success",
        response?.message ||
          "Account created successfully",
        "success"
      );

      console.log(
        "Generated Username:",
        username
      );

      setCompanyName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.replace("/");
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
              Create Account
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
              Fill the details to get
              started
            </DefaultText>
          </View>
        </View>

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
            label="Company Name"
            value={companyName}
            onChangeText={
              setCompanyName
            }
            focusedField={
              focusedField
            }
            fieldId="companyName"
            autoCapitalize="words"
            error={
              errors.companyName
            }
            onFocus={() =>
              setFocusedField(
                "companyName"
              )
            }
            onBlur={() =>
              setFocusedField(null)
            }
          />

          <AuthInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            focusedField={
              focusedField
            }
            fieldId="phone"
            error={errors.phone}
            onFocus={() =>
              setFocusedField(
                "phone"
              )
            }
            onBlur={() =>
              setFocusedField(null)
            }
          />

          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            focusedField={
              focusedField
            }
            fieldId="email"
            error={errors.email}
            onFocus={() =>
              setFocusedField(
                "email"
              )
            }
            onBlur={() =>
              setFocusedField(null)
            }
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={
              setPassword
            }
            secureTextEntry={
              !showPassword
            }
            focusedField={
              focusedField
            }
            fieldId="password"
            error={
              errors.password
            }
            rightIcon={
              showPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            onRightIconPress={() =>
              setShowPassword(
                !showPassword
              )
            }
            onFocus={() =>
              setFocusedField(
                "password"
              )
            }
            onBlur={() =>
              setFocusedField(null)
            }
          />

          <AuthInput
            label="Confirm Password"
            value={
              confirmPassword
            }
            onChangeText={
              setConfirmPassword
            }
            secureTextEntry={
              !showConfirmPassword
            }
            focusedField={
              focusedField
            }
            fieldId="confirmPassword"
            error={
              errors.confirmPassword
            }
            rightIcon={
              showConfirmPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            onRightIconPress={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            onFocus={() =>
              setFocusedField(
                "confirmPassword"
              )
            }
            onBlur={() =>
              setFocusedField(null)
            }
          />

          <PrimaryButton
            onPress={
              handleRegister
            }
            loading={loading}
          >
            Create Account
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
              Already have an account?
            </DefaultText>

            <TouchableOpacity
              onPress={() =>
                router.back()
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
                Sign In
              </DefaultText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});