import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Simplify your\ncity life.',
    subtitle: 'Welcome to Lattice',
    description: 'Find exclusive events, secret venues, and connect with your community in real-time.',
  },
  {
    id: '2',
    title: 'Discover the\nunseen.',
    subtitle: 'Exclusive Access',
    description: 'From underground concerts to tech summits, everything is on your grid.',
  },
  {
    id: '3',
    title: 'Your city,\nyour grid.',
    subtitle: 'Lattice Verified',
    description: 'Manage your tickets and access venues with your unique Lattice identity.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const setGuestMode = useAuthStore((state) => state.setGuestMode);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animación para el fondo de aura
  const auraScale = useSharedValue(1);
  const auraTranslateX = useSharedValue(0);

  useEffect(() => {
    auraScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    auraTranslateX.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-20, { duration: 5000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: auraScale.value },
      { translateX: auraTranslateX.value }
    ],
  }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
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
        <Text style={[styles.slideSubtitle, { color: theme.colors.text.secondary }]}>
          {item.subtitle}
        </Text>
        <Text style={[styles.slideTitle, { color: theme.colors.text.primary }]}>
          {item.title}
        </Text>
        <Text style={[styles.slideDescription, { color: theme.colors.text.muted }]}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFF' }]}>
      {/* Aura / Mesh Gradient Background */}
      <View style={styles.auraContainer}>
        <Animated.View style={[styles.auraCircle, styles.aura1, animatedAuraStyle]} />
        <Animated.View style={[styles.auraCircle, styles.aura2, animatedAuraStyle]} />
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.auraOverlay}
        />
      </View>

      {/* Floating Logo - Moved higher */}
      <Animated.View 
        entering={FadeInUp.delay(100).duration(1200).springify()}
        style={[styles.logoWrapper, { top: height * 0.18 }]}
      >
         <View style={styles.centralLogoShadow}>
           <Image 
             source={require('../../assets/images/icon.png')} 
             style={styles.logoImage}
             contentFit="contain"
           />
         </View>
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
                  backgroundColor: activeIndex === i ? '#000' : '#E5E5E5',
                  opacity: activeIndex === i ? 1 : 0.4
                },
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable 
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          >
            <Text 
              style={styles.getStartedText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Get started
            </Text>
          </Pressable>

          <Pressable 
            onPress={handleGuestMode}
            style={styles.guestButton}
          >
            <Text 
              style={styles.guestText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Entrar como invitado
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  auraContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  auraCircle: {
    position: 'absolute',
    borderRadius: 2000,
  },
  aura1: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: '#FFBE4D', // Lattice Orange
    top: -height * 0.1,
    left: -width * 0.2,
    opacity: 0.15,
  },
  aura2: {
    width: width,
    height: width,
    backgroundColor: '#FFE5B4', // Soft Amber
    top: height * 0.1,
    right: -width * 0.3,
    opacity: 0.1,
  },
  auraOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  logoWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  centralLogoShadow: {
    shadowColor: '#E2B042',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  pager: {
    flex: 1,
  },
  slide: {
    width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: height * 0.15,
  },
  textContainer: {
    gap: 12,
    alignItems: 'center',
  },
  slideSubtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  slideTitle: {
    fontSize: 48,
    fontFamily: 'Outfit-Bold',
    lineHeight: 52,
    letterSpacing: -2,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Medium',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
    opacity: 0.7,
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
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingBottom: 20,
    justifyContent: 'center',
  },
  getStartedButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  guestButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'center',
  },
});
