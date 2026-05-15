import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Lattice.',
    subtitle: '', // Vacío porque usaremos el logo aquí
    description: 'Simplify your city life. Find everything you need in one place.',
    image: require('../../assets/images/onboarding/Barcelona_hero_shutterstock_2156289499_ipmhcw.avif'),
    showLogo: true,
  },
  {
    id: '2',
    title: 'Explore the unseen.',
    subtitle: 'Exclusive Map',
    description: 'Discover underground events and secret locations around you.',
    image: require('../../assets/images/onboarding/Picasso-barcelona-2048x1366.webp'),
    showLogo: false,
  },
  {
    id: '3',
    title: 'Connect with community.',
    subtitle: 'Social Hub',
    description: 'Join verified groups and connect with people who share your vibe.',
    image: require('../../assets/images/onboarding/16296368889498.jpg'),
    showLogo: false,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const setGuestMode = useAuthStore((state) => state.setGuestMode);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    scrollX.value = x;
    setActiveIndex(Math.round(x / width));
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(auth)/login');
  };

  const handleGuestMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Reset screen to Explore for the new guest session
    const { useMapUIStore } = require('../../src/features/map/store/useMapUIStore');
    useMapUIStore.getState().setLastScreenMode(0);

    setGuestMode(true);
    router.replace('/(main)');
  };

  const renderBackground = (index: number) => {
    const imageStyle = useAnimatedStyle(() => {
      const inputSize = width;
      const scale = interpolate(
        scrollX.value,
        [(index - 1) * inputSize, index * inputSize, (index + 1) * inputSize],
        [1.15, 1, 1.15],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        scrollX.value,
        [(index - 1) * inputSize, index * inputSize, (index + 1) * inputSize],
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View key={`bg-${index}`} style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={ONBOARDING_DATA[index].image}
          style={styles.backgroundImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={[
            'transparent',
            theme.dark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
            theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            theme.dark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
            theme.colors.bg.main,
          ]}
          locations={[0, 0.35, 0.55, 0.75, 1]}
          style={styles.gradient}
        />
      </Animated.View>
    );
  };

  const renderItem = ({ item }: { item: (typeof ONBOARDING_DATA)[0] }) => (
    <View style={styles.slide}>
      <Animated.View
        entering={FadeInDown.delay(200).duration(1000).springify()}
        style={styles.textContainer}
      >
        {item.showLogo ? (
          <View style={styles.centralLogoShadow}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
        ) : (
          <Text style={[styles.slideSubtitle, { color: theme.colors.text.primary }]}>
            {item.subtitle}
          </Text>
        )}
        <Text
          style={[
            styles.slideTitle,
            { color: theme.colors.text.primary },
            item.showLogo && { fontSize: 64, lineHeight: 68 }, // Larger title for first slide
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {item.title}
        </Text>
        <Text style={[styles.slideDescription, { color: theme.colors.text.secondary }]}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      <View style={styles.backgroundLayer}>
        {ONBOARDING_DATA.map((_, index) => renderBackground(index))}
      </View>

      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        style={styles.pager}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: activeIndex === i ? 16 : 4,
                  backgroundColor:
                    activeIndex === i ? theme.colors.text.primary : theme.colors.border.strong,
                  opacity: activeIndex === i ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.buttonContainer}
        >
          <Pressable
            onPress={handleGetStarted}
            style={[styles.getStartedButton, { backgroundColor: theme.colors.text.primary }]}
          >
            <Text style={[styles.getStartedText, { color: theme.colors.bg.main }]}>
              Get started
            </Text>
          </Pressable>

          <Pressable
            onPress={handleGuestMode}
            style={[
              styles.guestButton,
              { backgroundColor: 'transparent', borderColor: theme.colors.border.strong },
            ]}
          >
            <Text style={[styles.guestText, { color: theme.colors.text.primary }]}>
              Continue as Guest
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.7,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: height * 0.3,
    height: height * 0.5,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  centralLogoShadow: {
    shadowColor: '#F8D548',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  pager: {
    flex: 1,
  },
  slide: {
    width,
    height: height,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: height * 0.24,
  },
  textContainer: {
    gap: 12,
    alignItems: 'center',
  },
  slideSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  slideTitle: {
    fontSize: 56,
    fontFamily: 'CormorantGaramond-Medium',
    lineHeight: 60,
    letterSpacing: -1,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 32,
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  pagination: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingBottom: 30,
  },
  getStartedButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
  },
  guestButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});
