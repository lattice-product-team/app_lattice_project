import React, { useEffect } from 'react';
import { View, Text, Pressable, Linking, StyleSheet, Dimensions } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { AuthDivider } from '../../src/components/ui/AuthDivider';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { Image } from 'expo-image';

const { height } = Dimensions.get('window');

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
    <AuthLayout transparent showBack onBack={() => router.replace('/(auth)/onboarding')}>
      <View style={{ flex: 1, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>

          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Your new{'\n'}experience is here.
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Join the Lattice community today.
          </Text>
        </Animated.View>

        {/* Action Section */}
        <View style={styles.actionsContainer}>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={{ gap: 12 }}
          >
            <PremiumButton
              label="Continue with Google"
              variant="google"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={[
                styles.socialButton,
                {
                  backgroundColor: theme.colors.bg.surface,
                  borderColor: theme.colors.border.subtle,
                },
              ]}
            />

            <PremiumButton
              label="Continue with Email"
              variant="outline"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/email-register');
              }}
              style={[
                styles.socialButton,
                {
                  backgroundColor: theme.colors.bg.surface,
                  borderColor: theme.colors.border.subtle,
                },
              ]}
            />
          </Animated.View>
        </View>

        {/* Footer Section */}
        <Animated.View entering={FadeIn.delay(800).duration(1200)} style={styles.footer}>
          <View style={styles.switchLink}>
            <Text style={[styles.footerText, { color: theme.colors.text.muted }]}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable hitSlop={10}>
                <Text style={[styles.footerLink, { color: theme.colors.brand.primary }]}>
                  Sign in
                </Text>
              </Pressable>
            </Link>
          </View>

          <Text style={[styles.legalText, { color: theme.colors.text.muted }]}>
            By continuing, you agree to our{' '}
            <Text
              style={[styles.legalLink, { color: theme.colors.text.secondary }]}
              onPress={() => Linking.openURL('#')}
            >
              Terms
            </Text>{' '}
            and{' '}
            <Text
              style={[styles.legalLink, { color: theme.colors.text.secondary }]}
              onPress={() => Linking.openURL('#')}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </Animated.View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: height * 0.16,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },
  title: {
    fontSize: 64,
    fontFamily: 'CormorantGaramond-Medium',
    lineHeight: 68,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 40,
  },
  socialButton: {
    height: 60,
    borderRadius: 30,
    borderWidth: 1.2,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 60,
  },
  switchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  footerLink: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
    maxWidth: 280,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});
