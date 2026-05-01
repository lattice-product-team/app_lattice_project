import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLogin } from '../../src/hooks/queries/useAuth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { colors as primitiveColors } from '@app/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { authStyles } from '../../src/styles/typography';

/**
 * Standard Sign In Screen.
 * Simplified to email/password following the Lattice project cleanup.
 */
export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const token = useAuthStore((state) => state.token);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  const handleLogin = () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Error', 'Email and password are required');
      return;
    }
    
    login.mutate({ email, password }, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(main)');
      },
      onError: (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Login Failed', error.message);
      }
    });
  };

  const isLoading = login.isPending;

  return (
    <AuthLayout midnight>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(200).springify()}
        className="pt-16 pb-12 items-start w-full"
      >
        <Text 
          className="mb-2"
          style={[authStyles.title, { color: theme.colors.text.primary, fontSize: 34, letterSpacing: -1 }]}
        >
          Sign In
        </Text>
        <Text 
          className="leading-6"
          style={[authStyles.subtitle, { color: theme.colors.text.secondary, fontSize: 16 }]}
        >
          Access your Lattice profile to sync performance data and preferences.
        </Text>
      </Animated.View>

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeInDown.duration(600).delay(400).springify()}
        className="mb-6"
      >
        <View 
          className="rounded-[32px] overflow-hidden mb-6 border"
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
            <Pressable 
              onPress={() => setShowPassword(!showPassword)} 
              hitSlop={20} 
              className="active:opacity-70"
            >
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
          className="mb-4"
        />

        {/* Divider */}
        <View className="flex-row items-center my-6 px-4">
          <View className="flex-1 h-[1px]" style={{ backgroundColor: theme.colors.border.subtle }} />
          <Text 
            className="mx-4 text-xs font-bold tracking-widest" 
            style={{ color: theme.colors.text.muted, fontFamily: 'PlusJakartaSans-Bold' }}
          >
            OR CONTINUE WITH
          </Text>
          <View className="flex-1 h-[1px]" style={{ backgroundColor: theme.colors.border.subtle }} />
        </View>

        {/* Social Buttons */}
        <View className="flex-row gap-x-3 mb-8">
          <PremiumButton 
            onPress={() => {}} 
            label="APPLE" 
            variant="apple" 
            className="flex-1"
          />
          <PremiumButton 
            onPress={() => {}} 
            label="GOOGLE" 
            variant="google" 
            className="flex-1"
          />
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(600).springify()}
        className="items-center pb-12"
      >
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            router.replace('/(auth)/register');
          }}
          className="active:opacity-70 p-4"
        >
          <Text 
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.secondary }}
          >
            NEW TO LATTICE? <Text style={{ color: theme.colors.brand.primary }}>JOIN THE CREW</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
