import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  icon: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Welcome',
    subtitle: 'Your journey starts here.',
    description: 'Discover a seamless experience built around what matters most to you.',
    accent: '#6C63FF',
    icon: '✦',
  },
  {
    id: '2',
    title: 'Explore',
    subtitle: 'Everything in one place.',
    description: 'Powerful tools and beautiful design working together effortlessly.',
    accent: '#FF6584',
    icon: '◈',
  },
  {
    id: '3',
    title: 'Begin',
    subtitle: 'Ready when you are.',
    description: 'Set up takes seconds. The impact lasts forever.',
    accent: '#43E97B',
    icon: '⬡',
  },
];

export default function SplashScreen() {
  const router = useRouter();

  // ✅ Properly typed FlatList ref
  const flatListRef = useRef<FlatList<Slide>>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // ✅ Properly typed viewability callback
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  // ✅ Properly typed renderItem
  const renderItem: ListRenderItem<Slide> = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 0, 40],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View
          style={[
            styles.iconWrapper,
            { opacity, transform: [{ translateY }] },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { borderColor: item.accent + '44' },
            ]}
          >
            <Text style={[styles.iconText, { color: item.accent }]}>
              {item.icon}
            </Text>
          </View>
          <View
            style={[
              styles.iconGlow,
              { backgroundColor: item.accent + '18' },
            ]}
          />
        </Animated.View>

        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Text style={[styles.slideTitle, { color: item.accent }]}>
            {item.title}
          </Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          <Text style={styles.slideDescription}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={styles.safeContainer}>\n      <SafeAreaView style={styles.container}>\n        <LinearGradient\n          colors={['#0A0A0F', '#12121A', '#0A0A0F']}\n          style={StyleSheet.absoluteFill}\n        />\n\n        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>\n          <Text style={styles.skipText}>Skip</Text>\n        </TouchableOpacity>\n\n        <Animated.FlatList\n          ref={flatListRef}\n          data={SLIDES}\n          renderItem={renderItem}\n          keyExtractor={(item) => item.id}\n          horizontal\n          pagingEnabled\n          showsHorizontalScrollIndicator={false}\n          onScroll={Animated.event(\n            [{ nativeEvent: { contentOffset: { x: scrollX } } }],\n            { useNativeDriver: false }\n          )}\n          onViewableItemsChanged={onViewableItemsChanged}\n          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}\n        />\n\n        <View style={styles.footer}>\n          <View style={styles.dotsContainer}>\n            {SLIDES.map((_, index) => {\n              const dotWidth = scrollX.interpolate({\n                inputRange: [\n                  (index - 1) * width,\n                  index * width,\n                  (index + 1) * width,\n                ],\n                outputRange: [8, 24, 8],\n                extrapolate: 'clamp',\n              });\n\n              const dotOpacity = scrollX.interpolate({\n                inputRange: [\n                  (index - 1) * width,\n                  index * width,\n                  (index + 1) * width,\n                ],\n                outputRange: [0.3, 1, 0.3],\n                extrapolate: 'clamp',\n              });\n\n              return (\n                <Animated.View\n                  key={index}\n                  style={[\n                    styles.dot,\n                    {\n                      width: dotWidth,\n                      opacity: dotOpacity,\n                      backgroundColor:\n                        SLIDES[currentIndex].accent,\n                    },\n                  ]}\n                />\n              );\n            })}\n          </View>\n\n          <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>\n            <LinearGradient\n              colors={[\n                SLIDES[currentIndex].accent,\n                SLIDES[currentIndex].accent + 'CC',\n              ]}\n              start={{ x: 0, y: 0 }}\n              end={{ x: 1, y: 0 }}\n              style={styles.ctaButton}\n            >\n              <Text style={styles.ctaText}>\n                {currentIndex === SLIDES.length - 1\n                  ? 'Get Started'\n                  : 'Continue'}\n              </Text>\n            </LinearGradient>\n          </TouchableOpacity>\n        </View>\n      </SafeAreaView>\n    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },

  container: {
    flex: 1,
  },

  /* ---------- Skip Button ---------- */

  skipButton: {
    position: 'absolute',
    top: 20,
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  skipText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },

  /* ---------- Slide ---------- */

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
    gap: 28,
  },

  /* ---------- Icon Section ---------- */

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  iconGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    zIndex: 0,
  },

  iconText: {
    fontSize: 46,
  },

  /* ---------- Text Content ---------- */

  slideTitle: {
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },

  slideSubtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  slideDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 23,
    letterSpacing: 0.1,
    marginTop: 6,
  },

  /* ---------- Footer ---------- */

  footer: {
    paddingBottom: 50,
    paddingHorizontal: 28,
    gap: 32,
    alignItems: 'center',
  },

  /* ---------- Dots ---------- */

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  dot: {
    height: 5,
    borderRadius: 3,
  },

  /* ---------- CTA Button ---------- */

  ctaButton: {
    paddingVertical: 17,
    paddingHorizontal: 68,
    borderRadius: 16,
    alignItems: 'center',
  },

  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});