import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { typography } from '../../src/styles/typography';
import { useAuthStore } from '../../src/store/useAuthStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PasskeyIntroScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const setHasSeenPasskeyPrompt = useAuthStore((state) => state.setHasSeenPasskeyPrompt);

  const handleEnable = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, trigger native Passkey API here
    setHasSeenPasskeyPrompt(Date.now());
    router.replace('/(main)');
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    setHasSeenPasskeyPrompt(Date.now());
    router.replace('/(main)');
  };

  return (
    <AuthLayout midnight>
      <View className="flex-1 justify-center items-center px-8">
        
        {/* Visual Metaphor Area */}
        <Animated.View 
          entering={FadeIn.duration(1200)}
          className="mb-12 items-center justify-center"
        >
          <View 
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.colors.brand.primary + '15' }}
          >
            <View 
              className="w-24 h-24 rounded-full items-center justify-center border-2"
              style={{ borderColor: theme.colors.brand.primary + '30', backgroundColor: theme.colors.brand.primary + '20' }}
            >
               <MaterialCommunityIcons name="fingerprint" size={48} color={theme.colors.brand.primary} />
            </View>
          </View>
          
          {/* Decorative circles */}
          <View 
            className="absolute w-48 h-48 rounded-full border border-dashed opacity-20"
            style={{ borderColor: theme.colors.brand.primary }}
          />
        </Animated.View>

        {/* Text Content */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800).springify()}
          className="items-center mb-12"
        >
          <Text 
            className="text-3xl text-center mb-4"
            style={{ fontFamily: 'Outfit-Bold', color: theme.colors.text.primary, letterSpacing: -0.5 }}
          >
            The future of security is here.
          </Text>
          <Text 
            className="text-center text-base leading-6 px-4"
            style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.secondary }}
          >
            Passkeys are a safer, easier replacement for passwords. Use your FaceID or Fingerprint to sign in instantly.
          </Text>
        </Animated.View>

        {/* Benefits List */}
        <View className="w-full gap-y-4 mb-12">
          {[
            { icon: 'shield-check', text: 'Impossible to phish or leak' },
            { icon: 'zap', text: 'Sign in in under 2 seconds' },
            { icon: 'devices', text: 'Syncs across all your devices' }
          ].map((item, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(400 + (index * 100)).duration(800).springify()}
              className="flex-row items-center px-4"
            >
              <View 
                className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: theme.colors.glass.subtle }}
              >
                <MaterialCommunityIcons name={item.icon as any} size={20} color={theme.colors.brand.primary} />
              </View>
              <Text 
                className="text-sm font-bold"
                style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.primary }}
              >
                {item.text}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Actions */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800).springify()}
          className="w-full gap-y-4"
        >
          <PremiumButton 
            label="ENABLE PASSKEY" 
            variant="primary" 
            onPress={handleEnable}
          />
          <Pressable 
            onPress={handleSkip}
            className="items-center py-4"
          >
            <Text 
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.muted }}
            >
              Maybe Later
            </Text>
          </Pressable>
        </Animated.View>

      </View>
    </AuthLayout>
  );
}
