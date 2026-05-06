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
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const FEATURE_CARDS = [
  { id: '1', label: 'Events', icon: 'calendar' },
  { id: '2', label: 'Map', icon: 'map-pin' },
  { id: '3', label: 'Social', icon: 'users' },
  { id: '4', label: 'Tickets', icon: 'tag' },
  { id: '5', label: 'Locations', icon: 'home' },
  { id: '6', label: 'Verified', icon: 'shield' },
  { id: '7', label: 'City', icon: 'target' },
  { id: '8', label: 'Exclusive', icon: 'star' },
  { id: '9', label: 'Real-time', icon: 'zap' },
];

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Lattice.',
    subtitle: 'Your City Grid',
    description: 'Simplify your city life. Find everything you need in one place.',
  },
  {
    id: '2',
    title: 'Explore the unseen.',
    subtitle: 'Exclusive Map',
    description: 'Discover underground events and secret locations around you.',
  },
  {
    id: '3',
    title: 'Connect with community.',
    subtitle: 'Social Hub',
    description: 'Join verified groups and connect with people who share your vibe.',
  },
];

const CardWall = () => (
  <View style={styles.wallGrid}>
    {FEATURE_CARDS.map((card, i) => (
      <View key={card.id} style={[styles.card, { opacity: 0.1 + (Math.random() * 0.3) }]}>
        <Feather name={card.icon as any} size={24} color="#000" style={{ opacity: 0.4 }} />
        <Text style={styles.cardLabel}>{card.label}</Text>
      </View>
    ))}
  </View>
);

const MapVisual = () => (
  <View style={styles.mapContainer}>
    {Array.from({ length: 16 }).map((_, i) => (
      <View key={i} style={styles.mapGridItem}>
        {Math.random() > 0.7 && (
          <View style={styles.mapPin}>
            <View style={styles.mapPinInner} />
          </View>
        )}
      </View>
    ))}
    <View style={styles.mapCircle} />
  </View>
);

const SocialVisual = () => (
  <View style={styles.socialContainer}>
    {Array.from({ length: 8 }).map((_, i) => (
      <View 
        key={i} 
        style={[
          styles.socialCircle, 
          { 
            top: 100 + (Math.random() * 200), 
            left: 50 + (Math.random() * 200),
            width: 40 + (Math.random() * 40),
            height: 40 + (Math.random() * 40),
            opacity: 0.1 + (Math.random() * 0.2)
          }
        ]} 
      >
        <Feather name="user" size={20} color="#000" />
      </View>
    ))}
  </View>
);

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
    setGuestMode(true);
    router.replace('/(main)');
  };

  const bg1Style = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, width], [1, 0], Extrapolate.CLAMP),
  }));

  const bg2Style = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, width, width * 2], [0, 1, 0], Extrapolate.CLAMP),
  }));

  const bg3Style = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [width, width * 2], [0, 1], Extrapolate.CLAMP),
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, width * 0.5], [1, 0], Extrapolate.CLAMP),
    transform: [
      { scale: interpolate(scrollX.value, [0, width * 0.5], [1, 0.8], Extrapolate.CLAMP) }
    ]
  }));

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={styles.slide}>
      <Animated.View 
        entering={FadeInDown.delay(200).duration(1000).springify()}
        style={styles.textContainer}
      >
        <Text style={styles.slideSubtitle}>
          {item.subtitle}
        </Text>
        <Text style={styles.slideTitle} numberOfLines={1} adjustsFontSizeToFit>
          {item.title}
        </Text>
        <Text style={styles.slideDescription}>
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#FFF' }]}>
      <View style={styles.backgroundLayer}>
        <Animated.View style={[StyleSheet.absoluteFill, bg1Style]}>
          <CardWall />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, bg2Style]}>
          <MapVisual />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, bg3Style]}>
          <SocialVisual />
        </Animated.View>
      </View>

      <Animated.View 
        style={[styles.logoWrapper, logoStyle, { top: height * 0.38 }]}
      >
         <View style={styles.centralLogoShadow}>
           <Image 
             source={require('../../assets/images/icon.png')} 
             style={styles.logoImage}
             contentFit="contain"
           />
         </View>
      </Animated.View>

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
                  backgroundColor: activeIndex === i ? '#000' : '#E5E5E5',
                  opacity: activeIndex === i ? 1 : 0.5
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={handleGetStarted} style={styles.getStartedButton}>
            <Text style={styles.getStartedText}>Get started</Text>
          </Pressable>

          <Pressable onPress={handleGuestMode} style={styles.guestButton}>
            <Text style={styles.guestText}>Entrar como invitado</Text>
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
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF',
  },
  wallGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 16,
    opacity: 0.6,
  },
  card: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 6,
  },
  cardLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000',
    opacity: 0.4,
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 140,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 2,
  },
  mapGridItem: {
    width: (width - 60) / 4,
    height: (width - 60) / 4,
    borderWidth: 0.5,
    borderColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFE5B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2B042',
  },
  mapCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    top: height * 0.2,
    opacity: 0.5,
  },
  socialContainer: {
    flex: 1,
    paddingTop: 150,
  },
  socialCircle: {
    position: 'absolute',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  logoWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 100,
  },
  centralLogoShadow: {
    shadowColor: '#E2B042',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  logoImage: {
    width: 140,
    height: 140,
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
    color: '#000',
  },
  slideTitle: {
    fontSize: 56,
    fontFamily: 'CormorantGaramond-Medium',
    lineHeight: 60,
    letterSpacing: -1,
    textAlign: 'center',
    color: '#000',
  },
  slideDescription: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 8,
    color: '#000',
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
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter-Bold',
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
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});
