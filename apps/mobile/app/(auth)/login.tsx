import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { AuthService } from '../../src/services/authService';
import * as Google from 'expo-auth-session/providers/google';
import { Image } from 'expo-image';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (token || isGuest) {
      router.replace('/(main)');
    }
  }, [token, isGuest, router]);

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

  const handleGoogleLogin = async (idToken: string) => {
    const result = await AuthService.signInWithGoogle(idToken);
    if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <AuthLayout 
      transparent 
      showBack 
      onBack={() => router.replace('/(auth)/onboarding')}
    >
      <View style={{ flex: 1, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
        
        {/* Header Section - Centered */}
        <Animated.View 
          entering={FadeInDown.duration(1000).springify()}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          
          <Text style={styles.title}>
            Welcome back{'\n'}to Lattice.
          </Text>
          <Text style={styles.subtitle}>
            Log in to your account.
          </Text>
        </Animated.View>

        {/* Action Section */}
        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={{ gap: 12 }}>
            <PremiumButton 
              label="Continue with Google" 
              variant="google" 
              onPress={() => promptAsync()}
              disabled={!request}
              style={styles.socialButton}
            />
            
            <PremiumButton 
              label="Continue with Email" 
              variant="outline" 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/email-auth');
              }}
              style={styles.socialButton}
            />
          </Animated.View>
        </View>

        {/* Footer Section */}
        <Animated.View 
          entering={FadeIn.delay(800).duration(1200)}
          style={styles.footer}
        >
          <View style={styles.switchLink}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable hitSlop={10}>
                <Text style={styles.footerLink}>
                  Register
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
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  title: {
    fontSize: 56,
    fontFamily: 'CormorantGaramond-Medium',
    lineHeight: 60,
    letterSpacing: -1,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    opacity: 0.5,
    textAlign: 'center',
    color: '#000',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 40,
  },
  socialButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 1.2,
    borderColor: '#F0F0F0',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
  },
  switchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(0,0,0,0.4)',
  },
  footerLink: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#E2B042', // Lattice Orange
  },
  legalText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
    maxWidth: 280,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});
