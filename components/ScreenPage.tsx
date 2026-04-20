// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Colors from '../constants/theme';
// import { DefaultText, useTheme } from '../providers/ThemeProvider';

// interface ScreenPageProps {
//   title: string;
//   icon?: string;           // Made optional
//   children: React.ReactNode;
//   rightAction?: React.ReactNode;
//   showBackButton?: boolean;   // New optional prop (default = true)
//   onMenuPress?: () => void;   // New prop for drawer menu (for Profile screen)
// }

// export default function ScreenPage({
//   title,
//   icon = '',
//   children,
//   rightAction,
//   showBackButton = true,
//   onMenuPress,
// }: ScreenPageProps) {
//   const theme = useTheme();
//   const router = useRouter();

//   const handleLeftPress = () => {
//     if (onMenuPress) {
//       onMenuPress();
//     } else {
//       router.back();
//     }
//   };

//   const leftIconName = onMenuPress ? 'menu' : 'arrow-back';

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* HEADER - Improved centering */}
//         <View style={styles.header}>
//           {/* Left Button */}
//           <TouchableOpacity
//             onPress={handleLeftPress}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             style={styles.leftButton}
//           >
//             <Ionicons
//               name={leftIconName as any}
//               size={24}
//               color={Colors.light.primaryDark}
//             />
//           </TouchableOpacity>

//           {/* Title - Perfectly Centered */}
//           <View style={styles.headerCenter}>
//             {icon ? (
//               <Ionicons name={icon as any} size={20} color={Colors.light.primaryDark} />
//             ) : null}
//             <DefaultText style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}>
//               {title}
//             </DefaultText>
//           </View>

//           {/* Right Side */}
//           <View style={styles.rightContainer}>
//             {rightAction}
//           </View>
//         </View>

//         {/* CONTENT */}
//         <View style={styles.body}>{children}</View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, backgroundColor: Colors.light.inputBg },

//   header: {
//     height: 64,
//     paddingHorizontal: 16,
//     backgroundColor: Colors.light.background,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//   },

//   leftButton: {
//     padding: 8,
//     width: 48,           // Fixed width for consistent centering
//     alignItems: 'flex-start',
//   },

//   headerCenter: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 8,
//     pointerEvents: 'none',   // So it doesn't block touches
//   },

//   headerTitle: {
//     fontSize: 20,
//     color: Colors.light.primaryDark,
//     textAlign: 'center',
//   },

//   rightContainer: {
//     width: 48,               
//     alignItems: 'flex-end',
//   },

//   body: { flex: 1 },
// });


import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/theme";
import { DefaultText, useTheme } from "../providers/ThemeProvider";

interface ScreenPageProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  onMenuPress?: () => void;
}

export default function ScreenPage({
  title,
  icon = "",
  children,
  rightAction,
  onMenuPress,
}: ScreenPageProps) {
  const theme = useTheme();
  const router = useRouter();

  const showMenu = !!onMenuPress;
  const leftIconName = showMenu ? "menu" : "arrow-back";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          
          {/* LEFT BUTTON */}
          <TouchableOpacity
            onPress={showMenu ? onMenuPress : () => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.leftButton}
          >
            <Ionicons
              name={leftIconName as any}
              size={24}
              color={Colors.light.background
                
              }
            />
          </TouchableOpacity>

          {/* TITLE */}
          <View style={styles.titleContainer}>
            {icon ? (
              <Ionicons
                name={icon as any}
                size={22}
                color={Colors.light.primaryDark}
              />
            ) : null}
            <DefaultText
              style={[styles.headerTitle, { fontFamily: theme.fonts.bold }]}
            >
              {title}
            </DefaultText>
          </View>

          {/* RIGHT ACTION */}
          <View style={styles.rightContainer}>
            {rightAction ? rightAction : <View style={{ width: 24 }} />}
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.body}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },

  header: {
    height: 55,
    paddingHorizontal: 16,
    // backgroundColor: Colors.light.background,
    backgroundColor:Colors.light.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },

  headerTitle: {
    fontSize: 18,
    // color: Colors.light.primaryDark,
   color: Colors.light.background,
  },

  leftButton: {
    width: 48,
    alignItems: "flex-start",
    

  },

  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  rightContainer: {
    width: 48,
    alignItems: "flex-end",
  },

  body: { flex: 1 },
});