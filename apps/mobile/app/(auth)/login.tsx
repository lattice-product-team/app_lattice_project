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
import { colors } from '../../src/styles/colors';
import { authStyles } from '../../src/styles/typography';

/**
 * Standard Sign In Screen.
 * Simplified to email/password following the "Muzaic" cleanup.
 */
export default function LoginScreen() {
  const router = useRouter();
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    <AuthLayout showBack onBack={() => router.replace('/(auth)/welcome')}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(200).springify()}
        className="pt-8 pb-10 items-start w-full"
      >
        <Text 
          className="text-white mb-4"
          style={authStyles.title}
        >
          Sign In
        </Text>
        <Text 
          className="text-white/40 leading-6"
          style={authStyles.subtitle}
        >
          Access your pilot profile to sync race data and preferences.
        </Text>
      </Animated.View>

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeInDown.duration(600).delay(400).springify()}
        className="mb-8"
      >
        <View className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 p-1">
          <View className="flex-row items-center px-6 py-5 border-b border-white/5">
            <Feather name="mail" size={20} color="rgba(255,255,255,0.3)" />
            <TextInput 
              className="flex-1 text-white text-lg font-medium ml-4 h-10"
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium' }}
            />
          </View>
          <View className="flex-row items-center px-6 py-5">
            <Feather name="lock" size={20} color="rgba(255,255,255,0.3)" />
            <TextInput 
              className="flex-1 text-white text-lg font-medium ml-4 h-10"
              secureTextEntry={!showPassword} 
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium' }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={20} className="active:opacity-70">
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255,255,255,0.3)" />
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

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(600).springify()}
        className="items-center pb-8"
      >
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            router.replace('/(auth)/register');
          }}
          className="active:opacity-70 p-4"
        >
          <Text 
            className="text-white/40 text-sm font-medium tracking-wide"
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
          >
            NOT A PILOT YET? <Text className="text-white font-black" style={{ color: colors.primary }}>JOIN THE CREW</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
