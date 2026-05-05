import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
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
    <AuthLayout transparent>
      <View style={{ flex: 1, paddingBottom: insets.bottom + 20, paddingHorizontal: 24 }}>
        
        {/* Header Section - Left Aligned (Like reference) */}
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
          
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Your new{'\n'}experience is here.
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Join the Lattice community today.
          </Text>
        </Animated.View>

        {/* Action Section */}
        <View style={styles.actionsContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={{ gap: 12 }}>
            <PremiumButton 
              label="Continue with Google" 
              variant="google" 
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={styles.socialButton}
            />
            
            <PremiumButton 
              label="Continue with Email" 
              variant="outline" 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(auth)/email-register');
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
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Terms</Text> and{' '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('#')}>Privacy Policy</Text>.
          </Text>
        </Animated.View>
      </View>

      {/* No more orange glow */}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: height * 0.12,
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
    fontSize: 40,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -1.5,
    lineHeight: 46,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 8,
    opacity: 0.4,
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
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 15,
  },
  footerLink: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
  },
  legalText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'PlusJakartaSans-Medium',
    maxWidth: 280,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});
