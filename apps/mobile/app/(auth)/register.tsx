import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useRegister } from '../../src/hooks/queries/useAuth';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/styles/colors';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { authStyles } from '../../src/styles/typography';

/**
 * Standard Registration Screen.
 * Simplified to match the clean "Muzaic" cleanup.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { pendingTicketCode, token, registrationRequired, prefilledEmail } = useAuthStore();
  const register = useRegister();

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  useEffect(() => {
    if (token) {
      router.replace('/(main)');
    }
  }, [token, router]);

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Required Fields', 'All fields are mandatory to create your account.');
      return;
    }

    register.mutate({ email, password, fullName }, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (pendingTicketCode) {
          Alert.alert(
            "Account Created", 
            "Your profile is ready and your ticket has been successfully linked.",
            [{ text: "Continue", onPress: () => router.replace('/(main)') }]
          );
        } else {
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Registration Error', error.message);
      }
    });
  };

  const isLoading = register.isPending;

  return (
    <AuthLayout 
      showBack 
      onBack={() => {
        useAuthStore.getState().clearRegistrationData();
        router.replace('/(auth)/welcome');
      }}
    >
      {/* Header section matching login */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100).springify()}
        className="pt-8 pb-10 items-start w-full"
      >
        <Text 
          className="text-white mb-4"
          style={authStyles.title}
        >
          {registrationRequired ? 'Finish Profile' : 'Create Profile'}
        </Text>
        
        {registrationRequired ? (
          <View className="bg-primary/10 px-5 py-2.5 rounded-2xl border border-primary/20 mt-3 flex-row items-center">
             <Feather name="check-circle" size={16} color={colors.primary} />
             <Text 
               className="text-white text-sm font-bold ml-2"
               style={{ fontFamily: 'PlusJakartaSans-Bold' }}
             >
               Ticket Scanned! Set Password
             </Text>
          </View>
        ) : pendingTicketCode ? (
          <View className="bg-primary/10 px-5 py-2.5 rounded-2xl border border-primary/20 mt-3 flex-row items-center">
             <Feather name="check-circle" size={16} color={colors.primary} />
             <Text 
               className="text-white text-sm font-bold ml-2"
               style={{ fontFamily: 'PlusJakartaSans-Bold' }}
             >
               Ticket Ready to Sync
             </Text>
          </View>
        ) : (
          <Text 
            className="text-white/40 leading-6"
            style={authStyles.subtitle}
          >
            Join the elite crew and access real-time race analytics.
          </Text>
        )}
      </Animated.View>

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeInDown.duration(600).delay(300).springify()}
        className="mb-8"
      >
        <View className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-8 p-1">
          {/* Full Name Input */}
          <View className="flex-row items-center px-6 py-5 border-b border-white/5">
            <Feather name="user" size={20} color="rgba(255,255,255,0.3)" />
            <TextInput 
              className="flex-1 text-white text-lg font-medium ml-4 h-10"
              autoCapitalize="words" 
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium' }}
            />
          </View>

          {/* Email Input */}
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
              editable={!isLoading && !registrationRequired}
              style={{ fontFamily: 'Outfit-Medium' }}
            />
          </View>
          
          {/* Password Input */}
          <View className="flex-row items-center px-6 py-5">
            <Feather name="lock" size={20} color="rgba(255,255,255,0.3)" />
            <TextInput 
              className="flex-1 text-white text-lg font-medium ml-4 h-10"
              secureTextEntry={!showPassword} 
              placeholder="Create Password"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium' }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} className="active:opacity-70" hitSlop={20}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="rgba(255,255,255,0.3)" />
            </Pressable>
          </View>
        </View>

        <PremiumButton 
          onPress={handleRegister} 
          label="LAUNCH ACCOUNT" 
          isLoading={isLoading} 
          variant="primary"
        />
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(500).springify()}
        className="items-center pb-8"
      >
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            router.replace('/(auth)/login');
          }}
          className="active:opacity-70 p-4"
        >
          <Text 
            className="text-white/40 text-sm font-medium tracking-wide"
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
          >
            ALREADY A MEMBER? <Text className="text-white font-black" style={{ color: colors.primary }}>LOG IN HERE</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
