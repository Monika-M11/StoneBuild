// import { useRouter } from 'expo-router';
// import React, { useEffect } from 'react';
// import SideDrawer from '../components/SideDrawer';
// import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

// import { Stack } from 'expo-router';

// import { StatusBar } from 'expo-status-bar';

// import { useFonts } from '@expo-google-fonts/source-sans-3';

// import { SourceSans3_400Regular, SourceSans3_500Medium, SourceSans3_700Bold } from '@expo-google-fonts/source-sans-3';

// import * as SplashScreen from 'expo-splash-screen';

// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { getToken } from '@/auth/authStorage';
// import { ToastProvider } from '@/providers/ToastProvider';
// import { LoaderProvider } from '../providers/LoaderProvider';
// import { ThemeProvider } from '../providers/ThemeProvider';






// function DrawerOverlay() {
//   const { drawerVisible, closeDrawer } = useDrawer();
//   const router = useRouter();

//   if (!drawerVisible) return null;

//   return (
//     <SideDrawer
//       visible={drawerVisible}
//       onClose={closeDrawer}
//       onMenuPress={(id) => {
//         router.push(`/screens/${id}` as any);
//         closeDrawer();
//       }}
//     />
//   );
// }

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SourceSans3_400Regular,
//     SourceSans3_500Medium,
//     SourceSans3_700Bold,
//   });
// const router = useRouter();
//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   if (!loaded && !error) {
//     return null;
//   }

  
//   //Checks authentication
//    useEffect(() => {
//     const checkAuth = async () => {
//       const token = await getToken();
//       console.log('STORED TOKEN:', token);
//       if (token) {
//         router.replace('/home'); //token exists → already logged in → go home
//       } else {
//         router.replace('/login');
//       }
//     };
//     checkAuth();
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar style="auto" />
//       <ThemeProvider>
//           <LoaderProvider>
//         <ToastProvider>
//         <DrawerProvider>
//           <Stack
//             screenOptions={{
//               headerShown: false,
//               animation: 'fade',
//             }}
//           >
//             <Stack.Screen name="getting-started" />
//             <Stack.Screen name="login" />
//             <Stack.Screen name="home" />
//             <Stack.Screen name="profileScreen" />
//           </Stack>
//           <DrawerOverlay />
//         </DrawerProvider>
//         </ToastProvider>
//         </LoaderProvider>
//       </ThemeProvider>
//     </GestureHandlerRootView>
//   );
// }


import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  SourceSans3_400Regular,
  SourceSans3_500Medium,
  SourceSans3_700Bold, useFonts
} from '@expo-google-fonts/source-sans-3';
import * as SplashScreen from 'expo-splash-screen';

import SideDrawer from '../components/SideDrawer';
import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

import { getToken } from '@/auth/authStorage';
import { ToastProvider } from '@/providers/ToastProvider';
import { LoaderProvider } from '../providers/LoaderProvider';
import { ThemeProvider } from '../providers/ThemeProvider';

// Prevent splash from auto hiding
SplashScreen.preventAutoHideAsync();


// 🔹 Drawer Overlay Component
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


// 🔹 Root Layout
export default function RootLayout() {
  const router = useRouter();

  const [loaded, error] = useFonts({
    SourceSans3_400Regular,
    SourceSans3_500Medium,
    SourceSans3_700Bold,
  });

  const [appReady, setAppReady] = useState(false);

  // ✅ Handle splash + fonts
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [loaded, error]);

  // ✅ Auth check ONLY after app is ready
  useEffect(() => {
    if (!appReady) return;

    const checkAuth = async () => {
      const token = await getToken();
      console.log('STORED TOKEN:', token);

      if (token) {
        router.replace('/home');
      } else {
        router.replace('/getting-started');
      }
    };

    checkAuth();
  }, [appReady]);

  // ⛔ Block UI until fonts are loaded
  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />

      <ThemeProvider>
        <LoaderProvider>
          <ToastProvider>
            <DrawerProvider>

              {/* 🔹 Navigation Stack */}
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="getting-started" />
                <Stack.Screen name="login" />
                <Stack.Screen name="home" />
                <Stack.Screen name="profileScreen" />
              </Stack>

              {/* 🔹 Drawer */}
              <DrawerOverlay />

            </DrawerProvider>
          </ToastProvider>
        </LoaderProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
