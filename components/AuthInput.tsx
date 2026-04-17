import Colors from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DefaultText, useTheme } from "@/providers/ThemeProvider";
import { useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FloatingLabel from "./FloatingLabel";

export type InputMode =
  | "default"
  | "allCaps"
  | "capitalize"
  | "sentenceCase"
  | "amount"
  | "phone"
  | "wholeNumber"
  | "alphanumeric"
  | "numeric"
  | "email";

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "decimal-pad"
    | "number-pad";
  focusedField: string | null;
  fieldId: string;
  inputMode?: InputMode;
  error?: string | null;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "email" | "current-password" | "new-password" | "username";
}

function applyTransform(text: string, mode: InputMode): string {
  switch (mode) {
    case "allCaps":
      return text.toUpperCase();
    case "capitalize":
      return text
        .toLowerCase()
        .replace(/\b[a-z]/g, (char) => char.toUpperCase());
    case "sentenceCase":
      return text.length === 0
        ? text
        : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "amount":
      return text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    case "phone": {
      let digits = text.replace(/[^0-9]/g, "");
      if (digits.length > 10) digits = digits.slice(0, 10);
      if (digits.length > 0 && !"6789".includes(digits[0])) return "";
      return digits;
    }
    case "wholeNumber":
    case "numeric":
      return text.replace(/[^0-9]/g, "");
    case "alphanumeric":
      return text.replace(/[^a-zA-Z0-9]/g, "");
    case "email":
      return text
        .toLowerCase()
        .replace(/[^a-z0-9@._+-]/g, "")
        .replace(/[@.]{2,}/g, "@");
    default:
      return text;
  }
}

function formatOnBlur(text: string, mode: InputMode): string {
  if (mode === "amount") {
    const num = parseFloat(text);
    if (isNaN(num)) return "";
    return num.toFixed(2);
  }
  return text;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType,
  focusedField,
  fieldId,
  inputMode = "default",
  error,
  placeholder,
  editable = true,
  multiline = false,
  autoCapitalize = "none",
  numberOfLines,
}: AuthInputProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;
  const inputBorder = useThemeColor(
    { light: "inputBorder", dark: "inputBorder" },
    "inputBorder",
  );

  const textInputRef = useRef<TextInput>(null);

  const isFocused = focusedField === fieldId;
  const isActive = isFocused || value.length > 0;
  const hasError = !!error;

  const borderColor = hasError
    ? "#ef4444"
    : isFocused
      ? primaryDark
      : "#e5e7eb";

  const handlePress = () => {
    if (editable) {
      textInputRef.current?.focus();
    }
  };

  const handleChangeText = (text: string) => {
    onChangeText(applyTransform(text, inputMode));
  };

  const handleBlur = () => {
    const formatted = formatOnBlur(value, inputMode);
    if (formatted !== value) onChangeText(formatted);
    onBlur();
  };

  return (
    <View style={styles.wrapper}>
      {/* ✅ LABEL OUTSIDE */}
      <FloatingLabel label={label} isFocused={isFocused} hasError={hasError} />

      <TouchableWithoutFeedback onPress={handlePress} accessible={false}>
        <View style={[styles.inputContainer, { borderColor }]}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            value={value}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
            autoCapitalize={
              inputMode === "allCaps" ||
              inputMode === "capitalize" ||
              inputMode === "sentenceCase" ||
              inputMode === "email"
                ? "none"
                : autoCapitalize
            }
          />
        </View>
      </TouchableWithoutFeedback>

      {hasError && (
        <DefaultText style={styles.errorText} variant="regular">
          {error}
        </DefaultText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 45,
  },
  textInput: {
    fontSize: 15,
    color: Colors.light.text,
    paddingVertical: 1,
    minHeight: 15,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#ef4444",
  },
});
