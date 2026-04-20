// // // import { useRouter } from 'expo-router';
// // // import React, { useEffect } from 'react';
// // // import SideDrawer from '../components/SideDrawer';
// // // import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

// // // import { Stack } from 'expo-router';

// // // import { StatusBar } from 'expo-status-bar';

// // // import { useFonts } from '@expo-google-fonts/source-sans-3';

// // // import { SourceSans3_400Regular, SourceSans3_500Medium, SourceSans3_700Bold } from '@expo-google-fonts/source-sans-3';

// // // import * as SplashScreen from 'expo-splash-screen';

// // // import { GestureHandlerRootView } from 'react-native-gesture-handler';

// // // import { getToken } from '@/auth/authStorage';
// // // import { ToastProvider } from '@/providers/ToastProvider';
// // // import { LoaderProvider } from '../providers/LoaderProvider';
// // // import { ThemeProvider } from '../providers/ThemeProvider';






// // // function DrawerOverlay() {
// // //   const { drawerVisible, closeDrawer } = useDrawer();
// // //   const router = useRouter();

// // //   if (!drawerVisible) return null;

// // //   return (
// // //     <SideDrawer
// // //       visible={drawerVisible}
// // //       onClose={closeDrawer}
// // //       onMenuPress={(id) => {
// // //         router.push(`/screens/${id}` as any);
// // //         closeDrawer();
// // //       }}
// // //     />
// // //   );
// // // }

// // // SplashScreen.preventAutoHideAsync();

// // // export default function RootLayout() {
// // //   const [loaded, error] = useFonts({
// // //     SourceSans3_400Regular,
// // //     SourceSans3_500Medium,
// // //     SourceSans3_700Bold,
// // //   });
// // // const router = useRouter();
// // //   useEffect(() => {
// // //     if (loaded || error) {
// // //       SplashScreen.hideAsync();
// // //     }
// // //   }, [loaded, error]);

// // //   if (!loaded && !error) {
// // //     return null;
// // //   }

  
// // //   //Checks authentication
// // //    useEffect(() => {
// // //     const checkAuth = async () => {
// // //       const token = await getToken();
// // //       console.log('STORED TOKEN:', token);
// // //       if (token) {
// // //         router.replace('/home'); //token exists → already logged in → go home
// // //       } else {
// // //         router.replace('/login');
// // //       }
// // //     };
// // //     checkAuth();
// // //   }, []);

// // //   return (
// // //     <GestureHandlerRootView style={{ flex: 1 }}>
// // //       <StatusBar style="auto" />
// // //       <ThemeProvider>
// // //           <LoaderProvider>
// // //         <ToastProvider>
// // //         <DrawerProvider>
// // //           <Stack
// // //             screenOptions={{
// // //               headerShown: false,
// // //               animation: 'fade',
// // //             }}
// // //           >
// // //             <Stack.Screen name="getting-started" />
// // //             <Stack.Screen name="login" />
// // //             <Stack.Screen name="home" />
// // //             <Stack.Screen name="profileScreen" />
// // //           </Stack>
// // //           <DrawerOverlay />
// // //         </DrawerProvider>
// // //         </ToastProvider>
// // //         </LoaderProvider>
// // //       </ThemeProvider>
// // //     </GestureHandlerRootView>
// // //   );
// // // }


// // import { Stack, useRouter } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import React, { useEffect, useState } from 'react';
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';

// // import {
// //   SourceSans3_400Regular,
// //   SourceSans3_500Medium,
// //   SourceSans3_700Bold, useFonts
// // } from '@expo-google-fonts/source-sans-3';
// // import * as SplashScreen from 'expo-splash-screen';

// // import SideDrawer from '../components/SideDrawer';
// // import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';
// // import { useRef } from 'react';

// // import { getToken } from '@/auth/authStorage';
// // import { ToastProvider } from '@/providers/ToastProvider';
// // import { LoaderProvider } from '../providers/LoaderProvider';
// // import { ThemeProvider } from '../providers/ThemeProvider';
// // import * as Device from 'expo-device';
// // import * as Battery from 'expo-battery';
// // import * as Network from 'expo-network';
// // import { useToast } from '@/providers/ToastProvider';

// // // Prevent splash from auto hiding
// // SplashScreen.preventAutoHideAsync();


// // // 🔹 Drawer Overlay Component
// // function DrawerOverlay() {
// //   const { drawerVisible, closeDrawer } = useDrawer();
// //   const router = useRouter();

// //   if (!drawerVisible) return null;

// //   return (
// //     <SideDrawer
// //       visible={drawerVisible}
// //       onClose={closeDrawer}
// //       onMenuPress={(id) => {
// //         router.push(`/screens/${id}` as any);
// //         closeDrawer();
// //       }}
// //     />
// //   );
// // }

// // function AppInitializer() {
// //   const { showToast } = useToast();
// //   const hasRun = useRef(false);

// //   useEffect(() => {
// //     if (hasRun.current) return;
// //     hasRun.current = true;

// //     const runChecks = async () => {
// //       try {
// //         const network = await Network.getNetworkStateAsync();

// //         if (!network.isConnected) {
// //           showToast('No Internet', 'Check your connection', 'error');
// //           return;
// //         }

// //         if (!Device.isDevice) {
// //           showToast('Invalid Device', 'Use a real device', 'error');
// //           return;
// //         }

// //         const batteryLevel = await Battery.getBatteryLevelAsync();

// //         if (batteryLevel < 0.2) {
// //           showToast(
// //             'Low Battery',
// //             `Battery is ${(batteryLevel * 100).toFixed(0)}%`,
// //             'error'
// //           );
// //         }

// //       } catch (err) {
// //         console.log('Init error:', err);
// //       }
// //     };

// //     runChecks();
// //   }, []);

// //   return null;
// // }

// // // 🔹 Root Layout
// // export default function RootLayout() {
// //   const router = useRouter();

// //   const [loaded, error] = useFonts({
// //     SourceSans3_400Regular,
// //     SourceSans3_500Medium,
// //     SourceSans3_700Bold,
// //   });

// //   const [appReady, setAppReady] = useState(false);

// //   // ✅ Handle splash + fonts
// //   useEffect(() => {
// //     if (loaded || error) {
// //       SplashScreen.hideAsync();
// //       setAppReady(true);
// //     }
// //   }, [loaded, error]);

// //   // ✅ Auth check ONLY after app is ready
// //   useEffect(() => {
// //     if (!appReady) return;

// //     const checkAuth = async () => {
// //       const token = await getToken();
// //       console.log('STORED TOKEN:', token);

// //       if (token) {
// //         router.replace('/home');
// //       } else {
// //         router.replace('/getting-started');
// //       }
// //     };

// //     checkAuth();
// //   }, [appReady]);

// //   // ⛔ Block UI until fonts are loaded
// //   if (!loaded && !error) {
// //     return null;
// //   }

// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <StatusBar style="auto" />

// //       <ThemeProvider>
// //         <LoaderProvider>
// //           <ToastProvider>
// //             <AppInitializer />
// //             <DrawerProvider>

// //               {/* 🔹 Navigation Stack */}
// //               <Stack
// //                 screenOptions={{
// //                   headerShown: false,
// //                   animation: 'fade',
// //                 }}
// //               >
// //                 <Stack.Screen name="getting-started" />
// //                 <Stack.Screen name="login" />
// //                 <Stack.Screen name="home" />
// //                 <Stack.Screen name="profileScreen" />
// //               </Stack>

// //               {/* 🔹 Drawer */}
// //               <DrawerOverlay />

// //             </DrawerProvider>
// //           </ToastProvider>
// //         </LoaderProvider>
// //       </ThemeProvider>
// //     </GestureHandlerRootView>
// //   );
// // }


// import { Stack, useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useRef, useState } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import {
//   SourceSans3_400Regular,
//   SourceSans3_500Medium,
//   SourceSans3_700Bold,
//   useFonts,
// } from '@expo-google-fonts/source-sans-3';
// import * as SplashScreen from 'expo-splash-screen';

// import SideDrawer from '../components/SideDrawer';
// import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

// import { getToken } from '@/auth/authStorage';
// import { ToastProvider, useToast } from '@/providers/ToastProvider';
// import { LoaderProvider } from '../providers/LoaderProvider';
// import { ThemeProvider } from '../providers/ThemeProvider';

// import { getDeviceInfo } from '@/utils/deviceInfo';
// import * as Battery from 'expo-battery';
// import * as Device from 'expo-device';
// import * as Network from 'expo-network';
// import * as SecureStore from 'expo-secure-store';

// import { isUpdateRequired } from '@/utils/versionCheck';
// import * as Application from 'expo-application';
// import ForceUpdateModal from './screens/forceUpdate';

// // Prevent splash auto hide
// SplashScreen.preventAutoHideAsync();



// // Drawer Overlay

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



// // 🔹 App Initializer (IMPORTANT)
// function AppInitializer() {
//   const { showToast } = useToast();

//   const hasShownOffline = useRef(false);
//   const hasShownBattery = useRef(false);

//   useEffect(() => {
//     let networkSub: any;
//     let batterySub: any;
//     let batteryInterval: any;

//     const init = async () => {
//       try {
       
//         // ✅ STORE DEVICE INFO (ONCE)
       
//         const existing = await SecureStore.getItemAsync('device_info');

//         if (!existing) {
//           const deviceInfo = getDeviceInfo();

//           await SecureStore.setItemAsync(
//             'device_info',
//             JSON.stringify(deviceInfo)
//           );

//           console.log('Device info stored:', deviceInfo);
//         }

        
//         // NETWORK CHECK
        
//         const network = await Network.getNetworkStateAsync();

//         if (!network.isConnected) {
//           showToast('No Internet', 'Check your connection', 'error');
//           hasShownOffline.current = true;
//         }

//         // ==========================
//         // 📱 DEVICE CHECK
//         // ==========================
//         if (!Device.isDevice) {
//           showToast('Invalid Device', 'Use a real device', 'error');
//         }

//         // ==========================
//         // 🔋 BATTERY CHECK FUNCTION
//         // ==========================
//         const checkBattery = async () => {
//           const level = await Battery.getBatteryLevelAsync();
//           const percentage = level * 100;

//           if (level < 0.2 && !hasShownBattery.current) {
//             showToast(
//               'Low Battery',
//               `Battery is ${percentage.toFixed(0)}%`,
//               'error'
//             );
//             hasShownBattery.current = true;
//           }

//           if (level >= 0.25) {
//             hasShownBattery.current = false;
//           }
//         };

//         // ✅ Initial battery check
//         await checkBattery();

//         // ==========================
//         // 🔁 NETWORK LISTENER
//         // ==========================
//         networkSub = Network.addNetworkStateListener((state) => {
//           const isOffline =
//             !state.isConnected || state.isInternetReachable === false;

//           if (isOffline && !hasShownOffline.current) {
//             showToast('No Internet', 'Connection lost', 'error');
//             hasShownOffline.current = true;
//           }

//           if (!isOffline) {
//             hasShownOffline.current = false;
//           }
//         });

//         // ==========================
//         // 🔋 BATTERY LISTENER
//         // ==========================
//         batterySub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
//           if (batteryLevel < 0.2 && !hasShownBattery.current) {
//             showToast(
//               'Low Battery',
//               `Battery is ${(batteryLevel * 100).toFixed(0)}%`,
//               'error'
//             );
//             hasShownBattery.current = true;
//           }
//         });

//         // ==========================
//         // 🔁 BATTERY POLLING
//         // ==========================
//         batteryInterval = setInterval(checkBattery, 30000);

//       } catch (err) {
//         console.log('Init error:', err);
//       }
//     };

//     // ✅ CALL FUNCTION CORRECTLY
//     init();

//     // ==========================
//     // 🧹 CLEANUP
//     // ==========================
//     return () => {
//       networkSub?.remove();
//       batterySub?.remove();
//       clearInterval(batteryInterval);
//     };
//   }, []);

//   return null;
// }

// //Later use
// // const data = await SecureStore.getItemAsync('device_info');

// // if (data) {
// //   const deviceInfo = JSON.parse(data);
// //   console.log(deviceInfo);
// // }



// // Root Layout (MAIN)

// export default function RootLayout() {
//   const router = useRouter();

//   const [loaded, error] = useFonts({
//     SourceSans3_400Regular,
//     SourceSans3_500Medium,
//     SourceSans3_700Bold,
//   });

//   const [appReady, setAppReady] = useState(false);
//   const [forceUpdate, setForceUpdate] = useState(false);
//   const [updateUrl, setUpdateUrl] = useState('');

//   // Splash + fonts
//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//       setAppReady(true);
//     }
//   }, [loaded, error]);

//   // Auth check
//   useEffect(() => {
//     if (!appReady) return;

//     const checkAuth = async () => {
//       const token = await getToken();

//       if (token) {
//         router.replace('/home');
//       } else {
//         router.replace('/getting-started');
//       }
//     };

//     checkAuth();
//   }, [appReady]);

//   if (!loaded && !error) return null;

//   useEffect(() => {
//   const checkVersion = async () => {
//     try {
//       const currentVersion =
//         Application.nativeApplicationVersion || '0.0.0';

//       console.log('Current Version:', currentVersion);

//       // 🔴 Replace with your backend API
//       const res = await fetch('https://your-api.com/app/version');
//       const data = await res.json();

//       console.log('Backend Version:', data);

//       const needsUpdate = isUpdateRequired(
//         currentVersion,
//         data.latestVersion
//       );

//       if (needsUpdate && data.forceUpdate) {
//         setForceUpdate(true);
//         setUpdateUrl(data.updateUrl);
//       }

//     } catch (err) {
//       console.log('Version check error:', err);
//     }
//   };

//   checkVersion();
// }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar style="auto" />

//       <ThemeProvider>
//         <LoaderProvider>
//           <ToastProvider>

//             {/* ✅ Runs global checks */}
//             <AppInitializer />

//             <DrawerProvider>
//               <Stack
//                 screenOptions={{
//                   headerShown: false,
//                   animation: 'fade',
//                 }}
//               >
//                 <Stack.Screen name="getting-started" />
//                 <Stack.Screen name="login" />
//                 <Stack.Screen name="home" />
//                 <Stack.Screen name="profileScreen" />
//               </Stack>

//               <DrawerOverlay />
//             </DrawerProvider>
//                <ForceUpdateModal
//   visible={forceUpdate}
//   updateUrl={updateUrl}
// />
//           </ToastProvider>
//         </LoaderProvider>
//       </ThemeProvider>
//     </GestureHandlerRootView>
 
//   );
// }



import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  SourceSans3_400Regular,
  SourceSans3_500Medium,
  SourceSans3_700Bold,
  useFonts,
} from '@expo-google-fonts/source-sans-3';
import * as SplashScreen from 'expo-splash-screen';

import SideDrawer from '../components/SideDrawer';
import { DrawerProvider, useDrawer } from '../contexts/DrawerContext';

import { getToken } from '@/auth/authStorage';
import { ToastProvider, useToast } from '@/providers/ToastProvider';
import { LoaderProvider } from '../providers/LoaderProvider';
import { ThemeProvider } from '../providers/ThemeProvider';

import { getDeviceInfo } from '@/utils/deviceInfo';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';

import * as Application from 'expo-application';
import ForceUpdateModal from './screens/forceUpdate';

// Prevent splash auto hide
SplashScreen.preventAutoHideAsync();


// 🔹 Drawer Overlay
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


// 🔹 App Initializer
function AppInitializer() {
  const { showToast } = useToast();

  const hasShownOffline = useRef(false);
  const hasShownBattery = useRef(false);

  useEffect(() => {
    let networkSub: any;
    let batterySub: any;
    let batteryInterval: any;

    const init = async () => {
      try {
        // Store device info once
        const existing = await SecureStore.getItemAsync('device_info');

        if (!existing) {
          const deviceInfo = getDeviceInfo();

          await SecureStore.setItemAsync(
            'device_info',
            JSON.stringify(deviceInfo)
          );
        }

        // Network check
        const network = await Network.getNetworkStateAsync();

        if (!network.isConnected) {
          showToast('No Internet', 'Check your connection', 'error');
          hasShownOffline.current = true;
        }

        // Device check
        if (!Device.isDevice) {
          showToast('Invalid Device', 'Use a real device', 'error');
        }

        // Battery check
        const checkBattery = async () => {
          const level = await Battery.getBatteryLevelAsync();

          if (level < 0.2 && !hasShownBattery.current) {
            showToast(
              'Low Battery',
              `Battery is ${(level * 100).toFixed(0)}%`,
              'error'
            );
            hasShownBattery.current = true;
          }

          if (level >= 0.25) {
            hasShownBattery.current = false;
          }
        };

        await checkBattery();

        // Network listener
        networkSub = Network.addNetworkStateListener((state) => {
          const isOffline =
            !state.isConnected || state.isInternetReachable === false;

          if (isOffline && !hasShownOffline.current) {
            showToast('No Internet', 'Connection lost', 'error');
            hasShownOffline.current = true;
          }

          if (!isOffline) {
            hasShownOffline.current = false;
          }
        });

        // Battery listener
        batterySub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          if (batteryLevel < 0.2 && !hasShownBattery.current) {
            showToast(
              'Low Battery',
              `Battery is ${(batteryLevel * 100).toFixed(0)}%`,
              'error'
            );
            hasShownBattery.current = true;
          }
        });

        batteryInterval = setInterval(checkBattery, 30000);

      } catch (err) {
        console.log('Init error:', err);
      }
    };

    init();

    return () => {
      networkSub?.remove();
      batterySub?.remove();
      clearInterval(batteryInterval);
    };
  }, []);

  return null;
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
  const [forceUpdate, setForceUpdate] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');

  // Splash + fonts
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [loaded, error]);

  // Auth check
  useEffect(() => {
    if (!appReady) return;

    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        router.replace('/home');
      } else {
        router.replace('/getting-started');
      }
    };

    checkAuth();
  }, [appReady]);

  // ✅ Version check (FIXED POSITION)
  // useEffect(() => {
  //   const checkVersion = async () => {
  //     try {
  //       const currentVersion =
  //         Application.nativeApplicationVersion || '0.0.0';

  //       console.log('Current Version:', currentVersion);

  //       // ⛔ TEMP: backend not ready → skip API
  //       return;


  //     } catch (err) {
  //       console.log('Version check error:', err);
  //     }
  //   };
  // ✅ Version check (MOVE THIS UP)
// ✅ Version check (MOVE THIS UP)
useEffect(() => {
  const checkVersion = async () => {
    try {
      const currentVersion =
        Application.nativeApplicationVersion || '0.0.0';

      console.log('Current Version:', currentVersion);

      // TEMP: disable API (since backend not running)
      return;


    } catch (err) {
      console.log('Version check error:', err);
    }
  };

  checkVersion();
}, []);


  // ⛔ RETURN AFTER ALL HOOKS
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />

      <ThemeProvider>
        <LoaderProvider>
          <ToastProvider>

            <AppInitializer />

            <DrawerProvider>
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

              <DrawerOverlay />
            </DrawerProvider>

            <ForceUpdateModal
              visible={forceUpdate}
              updateUrl={updateUrl}
            />

          </ToastProvider>
        </LoaderProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}