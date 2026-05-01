import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Alert,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLogin } from '../../src/hooks/queries/useAuth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { AuthDivider } from '../../src/components/ui/AuthDivider';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { authStyles } from '../../src/styles/typography';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const token = useAuthStore((state) => state.token);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const login = useLogin();

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  const handleLogin = () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Error', 'Email and password are required');
      return;
    }
    
    login.mutate({ email, password }, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const { intendedDestination, hasSeenPasskeyPrompt } = useAuthStore.getState();
        
        // Logic to determine if we should show Passkey Intro
        // Show if never seen before
        const shouldShowPasskey = !hasSeenPasskeyPrompt;

        if (shouldShowPasskey) {
          router.replace('/(auth)/passkey-intro');
          return;
        }

        if (intendedDestination) {
          useAuthStore.getState().setIntendedDestination(null);
          router.replace(intendedDestination as any);
        } else {
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Login Failed', error.message);
      }
    });
  };

  const handleGuestMode = () => {
    Haptics.selectionAsync();
    setGuestMode(true);
    router.replace('/(main)');
  };

  const isLoading = login.isPending;

  return (
    <AuthLayout midnight>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100).springify()}
        className="pt-16 pb-12 items-center w-full"
      >
        <Text 
          className="mb-3 text-center"
          style={[authStyles.title, { color: theme.colors.text.primary, fontSize: 34, letterSpacing: -1 }]}
        >
          Sign in to continue
        </Text>
        <Text 
          className="leading-5 text-center px-6"
          style={[authStyles.subtitle, { color: theme.colors.text.secondary, fontSize: 14 }]}
        >
          Please try one of the following ways to register or log in to your account.
        </Text>
      </Animated.View>

      {/* Social Buttons Block */}
      <Animated.View 
        entering={FadeInDown.duration(600).delay(300).springify()}
        className="w-full gap-y-3"
      >
        <PremiumButton 
          onPress={() => {}} 
          label="Continue with Google" 
          variant="google" 
          className="w-full"
        />
        <PremiumButton 
          onPress={() => {}} 
          label="Continue with Apple" 
          variant="apple" 
          className="w-full"
        />
        <PremiumButton 
          onPress={() => {}} 
          label="Connect With Crypto Wallet" 
          variant="outline" 
          className="w-full"
        />
      </Animated.View>

      <AuthDivider label="OR" />

      {/* Email Form Section */}
      <Animated.View 
        layout={Layout.springify()}
        className="w-full mb-8"
      >
        {!showEmailForm ? (
          <Animated.View entering={FadeIn}>
            <PremiumButton 
              onPress={() => {
                Haptics.selectionAsync();
                setShowEmailForm(true);
              }} 
              label="Connect With Email" 
              variant="dark" 
              className="w-full"
              icon="email-outline"
            />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.springify()}>
            <View 
              className="rounded-[32px] overflow-hidden mb-4 border"
              style={{ 
                backgroundColor: theme.colors.glass.background,
                borderColor: theme.colors.glass.border
              }}
            >
              {/* Email Input */}
              <View 
                className="flex-row items-center px-7 py-5 border-b"
                style={{ borderBottomColor: theme.colors.glass.subtleBorder }}
              >
                <Feather name="mail" size={18} color={theme.colors.text.secondary} />
                <TextInput 
                  className="flex-1 text-base font-medium ml-4 h-10"
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  placeholder="Email address"
                  placeholderTextColor={theme.colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                  style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.primary }}
                />
              </View>

              {/* Password Input */}
              <View className="flex-row items-center px-7 py-5">
                <Feather name="lock" size={18} color={theme.colors.text.secondary} />
                <TextInput 
                  className="flex-1 text-base font-medium ml-4 h-10"
                  secureTextEntry={!showPassword} 
                  placeholder="Password"
                  placeholderTextColor={theme.colors.text.muted}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.primary }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={20}>
                  <Feather 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={18} 
                    color={theme.colors.text.muted} 
                  />
                </Pressable>
              </View>
            </View>

            <PremiumButton 
              onPress={handleLogin} 
              label="SIGN IN" 
              isLoading={isLoading} 
              variant="primary"
            />
          </Animated.View>
        )}
      </Animated.View>

      {/* Legal Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(600).springify()}
        className="items-center px-6 mb-8"
      >
        <Text 
          className="text-center text-[11px] leading-4"
          style={{ color: theme.colors.text.muted, fontFamily: 'PlusJakartaSans-Medium' }}
        >
          By continuing, you confirm that you've read and agreed to our{' '}
          <Text 
            className="font-bold" 
            style={{ color: theme.colors.text.secondary }}
            onPress={() => Linking.openURL('#')}
          >Terms of Service</Text>
          {' '}and consent to the{' '}
          <Text 
            className="font-bold" 
            style={{ color: theme.colors.text.secondary }}
            onPress={() => Linking.openURL('#')}
          >Privacy Policy</Text>.
        </Text>
      </Animated.View>

      {/* Secondary Actions */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(700).springify()}
        className="items-center pb-12 w-full"
      >
        <Pressable 
          onPress={() => router.replace('/(auth)/register')}
          className="active:opacity-70 mb-6"
        >
          <Text 
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.secondary }}
          >
            NEW TO LATTICE? <Text style={{ color: theme.colors.brand.primary }}>JOIN THE CREW</Text>
          </Text>
        </Pressable>

        <Pressable 
          onPress={handleGuestMode}
          className="active:opacity-70"
        >
          <Text 
            className="text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.muted }}
          >
            Skip for now
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}

