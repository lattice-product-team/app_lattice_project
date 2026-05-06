import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Linking,
  StyleSheet
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { AuthDivider } from '../../src/components/ui/AuthDivider';
import { PasskeyOnboardingSheet } from '../../src/components/ui/PasskeyOnboardingSheet';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { AuthService } from '../../src/services/authService';
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);
  const [isPasskeySheetVisible, setIsPasskeySheetVisible] = React.useState(false);
  
  useEffect(() => {
    if (token || isGuest) {
      // If we have a user but no passkey, show the onboarding sheet
      if (token && user && !user.isPasskeyEnabled) {
        setIsPasskeySheetVisible(true);
      } else {
        router.replace('/(main)');
      }
    }
  }, [token, isGuest, user, router]);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleAppleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await AuthService.signInWithApple();
    if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    const result = await AuthService.signInWithGoogle(idToken);
    if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  const handleGuestMode = () => {
    Haptics.selectionAsync();
    setGuestMode(true);
    router.replace('/(main)');
  };

  return (
    <AuthLayout midnight>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: insets.bottom + 40 }}>
        
        {/* Header Section - Higher and more compact */}
        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          style={styles.header}
        >
          <View style={styles.logoSpacing} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Lattice
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            The social layer of your city.
          </Text>
        </Animated.View>

        {/* Action Section */}
        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={{ gap: 14 }}>
            {/* Apple login hidden until developer account is configured */}
            {/* <PremiumButton 
              label="Continue with Apple" 
              variant="apple" 
              onPress={handleAppleLogin}
            /> */}
            <PremiumButton 
              label="Continue with Google" 
              variant="google" 
              onPress={() => promptAsync()}
              disabled={!request}
            />
            
            <View style={styles.dividerWrapper}>
              <AuthDivider label="OR" />
            </View>

            <PremiumButton 
              label="Connect with Email" 
              variant="outline" 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/email-auth');
              }}
            />
          </Animated.View>

          {/* Elevated Guest Button - Fixed Alignment */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={styles.skipSection}
          >
            <Pressable 
              onPress={handleGuestMode}
              style={({ pressed }) => [
                styles.skipButton,
                { 
                  backgroundColor: theme.colors.glass.subtle,
                  borderColor: 'rgba(255,255,255,0.08)'
                },
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }
              ]}
            >
              <View style={styles.skipButtonContent}>
                <Text style={[styles.skipButtonText, { color: theme.colors.text.primary }]}>
                  Explore as Guest
                </Text>
                <View style={[styles.arrowCircle, { backgroundColor: '#000' }]}>
                  <Feather name="arrow-right" size={14} color="#fff" />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Footer Section */}
        <Animated.View 
          entering={FadeIn.delay(800).duration(1200)}
          style={styles.footer}
        >
          <Text style={styles.legalText}>
            By continuing, you confirm that you've read and agreed to our{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Terms</Text> and{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Privacy</Text>.
          </Text>
        </Animated.View>
      </View>

      <PasskeyOnboardingSheet 
        isVisible={isPasskeySheetVisible}
        onClose={() => {
          setIsPasskeySheetVisible(false);
          router.replace('/(main)');
        }}
        onConfirm={async () => {
          const result = await AuthService.registerPasskey();
          setIsPasskeySheetVisible(false);
          router.replace('/(main)');
        }}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoSpacing: {
    height: 40,
  },
  title: {
    fontSize: 56,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -2.5,
    lineHeight: 60,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    marginTop: 6,
    opacity: 0.8,
  },
  actionsContainer: {
    paddingHorizontal: 28,
    width: '100%',
    gap: 32,
  },
  dividerWrapper: {
    paddingVertical: 8,
  },
  skipSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  skipButton: {
    borderRadius: 40,
    borderWidth: 1,
    minWidth: 220,
    overflow: 'hidden',
  },
  skipButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 24,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 0.2,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  legalText: {
    fontSize: 11,
    color: 'rgba(150, 150, 150, 0.5)',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    maxWidth: 240,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});

