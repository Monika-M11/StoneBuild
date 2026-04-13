import ScreenPage from '@/components/ScreenPage';
import Colors from '@/constants/theme';
import { DefaultText, useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Footer from '../components/Footer';
import { useDrawer } from '../contexts/DrawerContext';

export default function Home() {
  const { openDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState<string>('home');
  const router = useRouter();
  const theme = useTheme();

  return (
 
     <GestureHandlerRootView style={{ flex: 1 }}>
          <ScreenPage title="Home" onMenuPress={openDrawer} icon="home">
           

        {/* BODY */}
        <View style={styles.body}>
          <DefaultText style={styles.bodyText} variant="regular">Home Screen Content</DefaultText>
        </View>

  
        {/* FOOTER */}
        <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </ScreenPage>
</GestureHandlerRootView>

    
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: Colors.light.inputBg },
  header: {
    height: 70, paddingHorizontal: 16, backgroundColor: Colors.light.background,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3, shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84,
  },
  headerTitle: { fontSize: 28, color: Colors.light.primaryDark },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bodyText: { fontSize: 16, color: Colors.light.text },
});
