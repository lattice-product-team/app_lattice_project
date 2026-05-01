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
import { colors as primitiveColors } from '@app/theme';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { authStyles } from '../../src/styles/typography';

/**
 * Standard Registration Screen.
 * Simplified to match the clean Lattice cleanup.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
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
      Haptics.notificationAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        router.replace('/(auth)/login');
      }}
      midnight
    >
      {/* Header section matching login */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100).springify()}
        className="pt-16 pb-12 items-start w-full"
      >
        <Text 
          className="mb-2"
          style={[authStyles.title, { color: theme.colors.text.primary, fontSize: 34, letterSpacing: -1 }]}
        >
          {registrationRequired ? 'Finish Profile' : 'Create Profile'}
        </Text>
        
        {registrationRequired ? (
          <View 
            className="px-5 py-3 rounded-2xl border flex-row items-center mt-2"
            style={{ 
              backgroundColor: theme.colors.status.successSurface,
              borderColor: theme.colors.status.success
            }}
          >
             <Feather name="check-circle" size={16} color={theme.colors.status.success} />
             <Text 
               className="text-sm font-bold ml-2"
               style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.status.success }}
             >
               Ticket Scanned! Set Password
             </Text>
          </View>
        ) : pendingTicketCode ? (
          <View 
            className="px-5 py-3 rounded-2xl border flex-row items-center mt-2"
            style={{ 
              backgroundColor: theme.colors.status.successSurface,
              borderColor: theme.colors.status.success
            }}
          >
             <Feather name="check-circle" size={16} color={theme.colors.status.success} />
             <Text 
               className="text-sm font-bold ml-2"
               style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.status.success }}
             >
               Ticket Ready to Sync
             </Text>
          </View>
        ) : (
          <Text 
            className="leading-6"
            style={[authStyles.subtitle, { color: theme.colors.text.secondary, fontSize: 16 }]}
          >
            Join the Lattice community and access real-time performance analytics.
          </Text>
        )}
      </Animated.View>

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        entering={FadeInDown.duration(600).delay(300).springify()}
        className="mb-6"
      >
        <View 
          className="rounded-[32px] overflow-hidden mb-6 border"
          style={{ 
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border
          }}
        >
          {/* Full Name Input */}
          <View 
            className="flex-row items-center px-7 py-5 border-b"
            style={{ borderBottomColor: theme.colors.glass.subtleBorder }}
          >
            <Feather name="user" size={18} color={theme.colors.text.secondary} />
            <TextInput 
              className="flex-1 text-base font-medium ml-4 h-10"
              autoCapitalize="words" 
              placeholder="Full Name"
              placeholderTextColor={theme.colors.text.muted}
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.primary }}
            />
          </View>

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
              editable={!isLoading && !registrationRequired}
              style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.primary }}
            />
          </View>
          
          {/* Password Input */}
          <View className="flex-row items-center px-7 py-5">
            <Feather name="lock" size={18} color={theme.colors.text.secondary} />
            <TextInput 
              className="flex-1 text-base font-medium ml-4 h-10"
              secureTextEntry={!showPassword} 
              placeholder="Create Password"
              placeholderTextColor={theme.colors.text.muted}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.primary }}
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)} 
              className="active:opacity-70" 
              hitSlop={20}
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
          onPress={handleRegister} 
          label="LAUNCH ACCOUNT" 
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
            OR JOIN WITH
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
        entering={FadeInDown.duration(800).delay(500).springify()}
        className="items-center pb-12"
      >
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            router.replace('/(auth)/login');
          }}
          className="active:opacity-70 p-4"
        >
          <Text 
            className="text-xs font-bold tracking-widest"
            style={{ fontFamily: 'PlusJakartaSans-Bold', color: theme.colors.text.secondary }}
          >
            ALREADY A MEMBER? <Text style={{ color: theme.colors.brand.primary }}>LOG IN HERE</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </AuthLayout>
  );
}
