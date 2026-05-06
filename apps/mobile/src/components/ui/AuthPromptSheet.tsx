import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../hooks/useAppTheme';
import { PremiumButton } from './PremiumButton';
import { useAuthStore } from '../../store/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { SafeBlurView } from './SafeBlurView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AuthPromptSheetProps {
  sheetRef?: any;
  title?: string;
  subtitle?: string;
}

export const AuthPromptSheet: React.FC<AuthPromptSheetProps> = ({ 
  title = "Unlock the full experience",
  subtitle = "Sign in to Lattice to access this feature and personalize your urban discovery."
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthPromptOpen = useAuthStore((state) => state.isAuthPromptOpen);
  const closeAuthPrompt = useAuthStore((state) => state.closeAuthPrompt);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const animState = useSharedValue(0);

  // High performance spring config
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };

  useEffect(() => {
    if (isAuthPromptOpen) {
      animState.value = withSpring(1, springConfig);
    } else {
      animState.value = withSpring(0, springConfig);
    }
  }, [isAuthPromptOpen]);

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeAuthPrompt();
    setGuestMode(false);
    router.push('/(auth)/login');
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeAuthPrompt();
  };

  const containerStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      animState.value, 
      [0, 1], 
      [-SCREEN_HEIGHT, insets.bottom + 5], // Identical to EventDetailSheet MID position
      Extrapolation.CLAMP
    );
    const opacity = interpolate(animState.value, [0, 0.3], [0, 1], Extrapolation.CLAMP);

    return {
      bottom,
      opacity,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animState.value, [0, 1], [0, 0.4], Extrapolation.CLAMP),
    };
  });

  // Critical: Only block touches if the prompt is explicitly open
  return (
    <View 
      style={StyleSheet.absoluteFill} 
      pointerEvents={isAuthPromptOpen ? "auto" : "none"}
    >
      {/* Dimmer Backdrop */}
      <Pressable 
        onPress={handleClose}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>

      {/* Floating Card */}
      <Animated.View style={[styles.floatingCard, containerStyle]}>
        <SafeBlurView 
          tint={theme.colors.glass.tint} 
          intensity={100}
          style={[
            styles.blurBackground,
            { 
              backgroundColor: theme.colors.glass.background,
              borderColor: theme.colors.glass.border 
            }
          ]}
        >
          <View style={styles.innerGlowBorder} />
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <View style={{ flex: 1 }} />
            <Pressable onPress={handleClose} style={styles.actionCircle}>
              <Feather name="x" size={20} color={theme.colors.text.primary} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{subtitle}</Text>
            </View>

            <View style={styles.actions}>
              <PremiumButton 
                label="GET STARTED" 
                variant="primary" 
                onPress={handleAction}
              />
            </View>
          </View>
        </SafeBlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  floatingCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 3000,
  },
  blurBackground: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    pointerEvents: 'none',
  },
  headerActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 8,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  actions: {
    width: '100%',
    marginTop: 12,
  }
});
