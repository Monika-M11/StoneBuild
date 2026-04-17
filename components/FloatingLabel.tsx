import Colors from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";
import { StyleSheet, Text } from "react-native";

interface FloatingLabelProps {
  label: string;
  isFocused: boolean;
  hasError: boolean;
}

export default function FloatingLabel({
  label,
  isFocused,
  hasError,
}: FloatingLabelProps) {
  const theme = useTheme();
  const primaryDark = Colors.light.primaryDark;

  const color = hasError
    ? "#ef4444"
    : isFocused
      ? primaryDark
      : Colors.light.icon;

  return (
    <Text
      style={[
        styles.label,
        {
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
        },
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginBottom: 6,
  },
});
