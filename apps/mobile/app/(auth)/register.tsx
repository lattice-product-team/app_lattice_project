import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { AuthDivider } from '../../src/components/ui/AuthDivider';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  return (
    <AuthLayout transparent>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: insets.bottom + 20 }}>
        
        {/* Header Section - Minimalist */}
        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          style={styles.header}
        >
          <View style={[styles.logoDot, { backgroundColor: theme.colors.brand.primary }]} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Your new{'\n'}experience is here.
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Join the Lattice community today.
          </Text>
        </Animated.View>

        {/* Action Section */}
        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={{ gap: 16 }}>
            <PremiumButton 
              label="Sign in with Apple" 
              variant="apple" 
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            />
            <PremiumButton 
              label="Sign in with Google" 
              variant="google" 
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            />
            
            <View style={styles.dividerWrapper}>
              <AuthDivider label="or use email" />
            </View>

            <PremiumButton 
              label="Create Account" 
              variant="primary" 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/email-register');
              }}
              style={{ backgroundColor: '#000' }}
            />
          </Animated.View>
        </View>

        {/* Footer Section */}
        <Animated.View 
          entering={FadeIn.delay(800).duration(1200)}
          style={styles.footer}
        >
          <View style={styles.registerLink}>
            <Text style={{ color: theme.colors.text.muted, fontFamily: 'PlusJakartaSans-Medium', fontSize: 15 }}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={10}>
                <Text style={{ color: theme.colors.brand.primary, fontFamily: 'PlusJakartaSans-Bold', fontSize: 15 }}>
                  Log in
                </Text>
              </Pressable>
            </Link>
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Terms</Text> and{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Privacy Policy</Text>.
          </Text>
        </Animated.View>
      </View>

      {/* Decorative Gradient Glow at bottom */}
      <View style={styles.bottomGlowContainer}>
        <LinearGradient
          colors={['transparent', 'rgba(226, 176, 66, 0.08)', 'rgba(226, 176, 66, 0.15)']}
          style={styles.bottomGlow}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 80,
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  logoDot: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -1,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 12,
    opacity: 0.6,
  },
  actionsContainer: {
    paddingHorizontal: 0,
    width: '100%',
    marginTop: 40,
  },
  dividerWrapper: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 32,
    marginTop: 40,
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    color: 'rgba(150, 150, 150, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Medium',
    maxWidth: 280,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
  bottomGlowContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: -1,
    pointerEvents: 'none',
  },
  bottomGlow: {
    flex: 1,
  },
});
