// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         animation: "fade",
//       }}
//     />
//   );
// }




import { useEffect } from 'react';

import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({

    // Add custom fonts here if needed

    // 'MyFont': require('../assets/fonts/MyFont.ttf'),

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

      <Stack

        screenOptions={{

          headerShown: false,

          animation: 'fade',

          // contentStyle bg removed for white child screens

        }}

      >

        <Stack.Screen name="index" />

        <Stack.Screen name="getting-started" />

        <Stack.Screen name="login" />

      </Stack>

    </GestureHandlerRootView>

  );

}