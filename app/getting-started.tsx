import Colors from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList as RNFlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from 'react-native';
import PrimaryButton from './components/PrimaryButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome',
    subtitle: 'Your journey starts here.',
    description: 'Discover a seamless experience built around what matters most to you.',
    accent: Colors.light.primaryDark,
    icon: '✦',
  },
  {
    id: '2',
    title: 'Explore',
    subtitle: 'Everything in one place.',
    description: 'Powerful tools and beautiful design working together effortlessly.',
    accent: Colors.light.primaryDark,
    icon: '◈',
  },
  {
    id: '3',
    title: 'Begin',
    subtitle: 'Ready when you are.',
    description: 'Set up takes seconds. The impact lasts forever.',
    accent: Colors.light.primaryDark,
    icon: '⬡',
  },
];

export default function GettingStarted() {
  const router = useRouter();
  const flatListRef = useRef<RNFlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToOffset({ offset: (currentIndex + 1) * width, animated: true });
    } else {
      router.replace('/login');
    }
  }, [currentIndex, width]);

  const handleSkip = useCallback(() => {
    router.replace('/login');
  }, []);

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}    
        renderItem={({ item, index }) => {
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
              {/* Icon circle */}
              <Animated.View style={[styles.iconWrapper, { opacity, transform: [{ translateY }] }]}>
                <View style={[styles.iconCircle, { borderColor: item.accent + '44' }]}>
                  <Text style={[styles.iconText, { color: item.accent }]}>{item.icon}</Text>
                </View>
                <View style={[styles.iconGlow, { backgroundColor: item.accent + '18' }]} />
              </Animated.View>

              {/* Text content */}
              <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                <Text style={[styles.slideTitle, { color: item.accent }]}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                <Text style={styles.slideDescription}>{item.description}</Text>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* Bottom controls */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((slide, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: SLIDES[currentIndex].accent,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* CTA button */}
        <PrimaryButton onPress={handleNext} style={{ width: 250 }}>
          {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.textSecondary,
  },
  skipText: {
    fontFamily: 'SourceSans3_400Regular',
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 80,
    gap: 24,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    fontSize: 44,
  },
  slideTitle: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -1,
  },
  slideSubtitle: {
    fontFamily: 'SourceSans3_500Medium',
    fontSize: 20,
    color: Colors.light.primaryDark,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  slideDescription: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    letterSpacing: 0.1,
    marginTop: 4,
  },
  footer: {
    paddingBottom: 52,
    paddingHorizontal: 28,
    gap: 28,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  // ctaButton and ctaText removed - using PrimaryButton
});
