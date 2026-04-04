import Colors from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import ScreenPage from '../../components/ScreenPage';

export default function ReportsScreen() {
  const theme = useTheme();
  return (
    <ScreenPage title="Reports" icon="bar-chart-outline">
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: theme.fonts.bold }]}>Reports Page</Text>
        <Text style={[styles.subtitle, { fontFamily: theme.fonts.regular }]}>Reports content will go here</Text>
      </View>
    </ScreenPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg,
  },
  title: {
    fontSize: 24,
    color: Colors.light.primaryDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
});

