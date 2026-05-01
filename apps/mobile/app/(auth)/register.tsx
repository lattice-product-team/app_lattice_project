import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  Pressable,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout, FadeIn } from 'react-native-reanimated';
import { useRegister } from '../../src/hooks/queries/useAuth';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { AuthDivider } from '../../src/components/ui/AuthDivider';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { authStyles } from '../../src/styles/typography';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  const { pendingTicketCode, token, registrationRequired, prefilledEmail } = useAuthStore();
  const register = useRegister();

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
      // Auto-expand if coming from a ticket prefill
      setShowEmailForm(true);
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
        
        const { intendedDestination, hasSeenPasskeyPrompt } = useAuthStore.getState();
        
        // Always show on registration if never seen
        if (!hasSeenPasskeyPrompt) {
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
      {/* Header section */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100).springify()}
        className="pt-16 pb-12 items-center w-full"
      >
        <Text 
          className="mb-3 text-center"
          style={[authStyles.title, { color: theme.colors.text.primary, fontSize: 34, letterSpacing: -1 }]}
        >
          {registrationRequired ? 'Finish Profile' : 'Join the Crew'}
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
        ) : (
          <Text 
            className="leading-5 text-center px-6"
            style={[authStyles.subtitle, { color: theme.colors.text.secondary, fontSize: 14 }]}
          >
            Create your profile to access real-time map features and performance stats.
          </Text>
        )}
      </Animated.View>

      {/* Social Buttons Block */}
      {!registrationRequired && (
        <Animated.View 
          entering={FadeInDown.duration(600).delay(300).springify()}
          className="w-full gap-y-3"
        >
          <PremiumButton 
            onPress={() => {}} 
            label="Join with Google" 
            variant="google" 
            className="w-full"
          />
          <PremiumButton 
            onPress={() => {}} 
            label="Join with Apple" 
            variant="apple" 
            className="w-full"
          />
        </Animated.View>
      )}

      {!registrationRequired && <AuthDivider label="OR" />}

      {/* Form Container */}
      <Animated.View 
        layout={Layout.springify()}
        className="w-full mb-8"
      >
        {!showEmailForm && !registrationRequired ? (
          <Animated.View entering={FadeIn}>
            <PremiumButton 
              onPress={() => {
                Haptics.selectionAsync();
                setShowEmailForm(true);
              }} 
              label="Join With Email" 
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
              onPress={handleRegister} 
              label={registrationRequired ? "FINISH PROFILE" : "CREATE PROFILE"} 
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
          By joining, you confirm that you've read and agreed to our{' '}
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

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(700).springify()}
        className="items-center pb-12"
      >
        <Pressable 
          onPress={() => router.replace('/(auth)/login')}
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

