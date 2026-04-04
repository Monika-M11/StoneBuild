import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import SideDrawer from '../components/SideDrawer';
import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import { useFonts } from '@expo-google-fonts/source-sans-3';

import { SourceSans3_400Regular, SourceSans3_500Medium, SourceSans3_700Bold } from '@expo-google-fonts/source-sans-3';

import * as SplashScreen from 'expo-splash-screen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from '../providers/ThemeProvider';

function DrawerOverlay() {
  const { drawerVisible, closeDrawer } = useDrawer();
  const router = useRouter();

  if (!drawerVisible) return null;

  return (
    <SideDrawer
      visible={drawerVisible}
      onClose={closeDrawer}
      onMenuPress={(id) => {
        router.push(`/screens/${id}` as any);
        closeDrawer();
      }}
    />
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceSans3_400Regular,
    SourceSans3_500Medium,
    SourceSans3_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <ThemeProvider>
        <DrawerProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              // contentStyle bg removed for white child screens
            }}
          >
            <Stack.Screen name="getting-started" />
            <Stack.Screen name="login" />
            <Stack.Screen name="home" />
          </Stack>
          <DrawerOverlay />
        </DrawerProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

