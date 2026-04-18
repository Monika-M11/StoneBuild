// // import React from 'react';
// // import { ActivityIndicator, StyleSheet, View } from 'react-native';
// // import { useTheme } from '../providers/ThemeProvider';

// // export default function Loader() {
// //   const theme = useTheme();

// //   return (
// //     <View style={styles.overlay}>
// //       <View style={styles.loaderBox}>
// //         <ActivityIndicator size="large" color={theme.colors.primary} />
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   overlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.3)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 999,
// //   },
// //   loaderBox: {
// //     padding: 20,
// //     borderRadius: 12,
// //     backgroundColor: '#fff',
// //   },
// // });

// import React, { useEffect, useRef } from 'react';
// import { Animated, Easing, StyleSheet, View } from 'react-native';

// export default function Loader() {
//   const rotation = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotation, {
//         toValue: 1,
//         duration: 1000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const rotate = rotation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const spokes = Array.from({ length: 12 });

//   return (
//     <View style={styles.overlay}>
//       <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
//         {spokes.map((_, i) => (
//           <View
//             key={i}
//             style={[
//               styles.spoke,
//               {
//                 transform: [{ rotate: `${i * 30}deg` }, { translateY: -10 }],
//                 opacity: (i + 1) / 12,
//               },
//             ]}
//           />
//         ))}
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.15)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   spinner: {
//     width: 60,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   spoke: {
//     position: 'absolute',
//     width: 4,
//     height: 10,
//     borderRadius: 2,
//     backgroundColor: '#555',
//     top: '50%',
//     left: '50%',
//     marginLeft: -2,
//   },
// });


import Colors from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Loader() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const size = 40;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.overlay}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            stroke="#e5e7eb"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Animated Arc */}
          <AnimatedCircle
            stroke={Colors.light.primaryDark} // ✅ your theme color
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference * 0.6} // controls arc length
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});