import React, { useState, useRef } from 'react';
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
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  interpolate, 
  useSharedValue 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { PremiumButton } from '../../src/components/ui/PremiumButton';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Lattice',
    subtitle: 'The social layer of your city.',
    description: 'Find exclusive events, secret venues, and connect with your community in real-time.',
    icon: 'map',
  },
  {
    id: '2',
    title: 'Discover Events',
    subtitle: 'Never miss a beat.',
    description: 'From underground concerts to tech summits, everything is on your grid.',
    icon: 'calendar',
  },
  {
    id: '3',
    title: 'Verified Access',
    subtitle: 'Secure and seamless.',
    description: 'Manage your tickets and access venues with your unique Lattice identity.',
    icon: 'shield',
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
    router.push('/(auth)/register');
  };

  const handleGuestMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGuestMode(true);
    router.replace('/(main)');
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={styles.slide}>
      <Animated.View 
        entering={FadeInDown.delay(200).duration(1000).springify()}
        style={styles.textContainer}
      >
        <Text style={[styles.slideSubtitle, { color: theme.colors.brand.primary }]}>
          {item.subtitle}
        </Text>
        <Text style={[styles.slideTitle, { color: theme.colors.text.primary }]}>
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
      <LinearGradient
        colors={[theme.colors.bg.main, theme.colors.bg.surface, theme.colors.brand.primarySurface]}
        style={StyleSheet.absoluteFill}
      />

      {/* Dynamic Grid Background (Lattice) */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.gridItem, 
              { borderColor: theme.colors.border.subtle, opacity: 0.05 }
            ]} 
          />
        ))}
      </View>

      {/* Floating Glass Logo (Roi Style) */}
      <Animated.View 
        entering={FadeInUp.delay(100).duration(1200).springify()}
        style={[styles.logoWrapper, { top: insets.top + 60 }]}
      >
        <BlurView intensity={80} tint={theme.dark ? 'dark' : 'light'} style={styles.logoBlur}>
          <View style={[styles.logoCircle, { borderColor: theme.colors.brand.primary }]}>
            <Text style={[styles.logoText, { color: theme.colors.text.primary }]}>L</Text>
          </View>
        </BlurView>
      </Animated.View>

      {/* Pager */}
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

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { 
                  backgroundColor: activeIndex === i ? theme.colors.brand.primary : theme.colors.border.strong,
                  width: activeIndex === i ? 24 : 8,
                  opacity: activeIndex === i ? 1 : 0.3
                },
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.buttonContainer}
        >
          <Pressable 
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.getStartedButton,
              { backgroundColor: '#000' },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
            ]}
          >
            <Text style={styles.getStartedText}>Get started</Text>
          </Pressable>

          <Pressable 
            onPress={handleGuestMode}
            style={({ pressed }) => [
              styles.guestButton,
              { 
                backgroundColor: theme.colors.glass.background,
                borderColor: theme.colors.glass.border
              },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 }
            ]}
          >
            <View style={styles.guestButtonContent}>
              <Text style={[styles.guestText, { color: theme.colors.text.primary }]}>Explore →</Text>
            </View>
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
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 100,
  },
  gridItem: {
    width: width / 4,
    height: width / 4,
    borderWidth: 0.5,
  },
  logoWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  logoBlur: {
    borderRadius: 30,
    overflow: 'hidden',
    padding: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Outfit-Bold',
  },
  pager: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  textContainer: {
    gap: 12,
  },
  slideSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  slideTitle: {
    fontSize: 48,
    fontFamily: 'Outfit-Bold',
    lineHeight: 52,
    letterSpacing: -1.5,
  },
  slideDescription: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Medium',
    lineHeight: 26,
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 30,
    gap: 32,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  getStartedButton: {
    flex: 1.5,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  guestButton: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
