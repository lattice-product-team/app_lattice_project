import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRegister } from '../../src/hooks/queries/useAuth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function EmailRegisterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const register = useRegister();

  const handleRegister = () => {
    if (!fullName || !email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Error', 'All fields are required');
      return;
    }

    register.mutate({ fullName, email, password }, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const { intendedDestination, hasSeenPasskeyPrompt } = useAuthStore.getState();
        
        if (!hasSeenPasskeyPrompt) {
          router.replace('/(auth)/passkey-intro');
        } else if (intendedDestination) {
          useAuthStore.getState().setIntendedDestination(null);
          router.replace(intendedDestination as any);
        } else {
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Registration Failed', error.message);
      }
    });
  };

  return (
    <AuthLayout midnight showBack onBack={() => router.back()}>
      <View style={styles.container}>

        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Join Lattice with your email address.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.form}
        >
          <View style={[styles.inputGroup, { backgroundColor: theme.colors.glass.subtle }]}>
            <Feather name="user" size={20} color={theme.colors.text.muted} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, { color: theme.colors.text.primary }]}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: theme.colors.glass.subtle }]}>
            <Feather name="mail" size={20} color={theme.colors.text.muted} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, { color: theme.colors.text.primary }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: theme.colors.glass.subtle }]}>
            <Feather name="lock" size={20} color={theme.colors.text.muted} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, { color: theme.colors.text.primary }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color={theme.colors.text.muted} />
            </Pressable>
          </View>

          <PremiumButton 
            label={register.isPending ? "Creating..." : "CREATE ACCOUNT"} 
            variant="primary" 
            onPress={handleRegister}
            disabled={register.isPending}
          />

          <View style={styles.registerLink}>
            <Text style={{ color: theme.colors.text.muted, fontFamily: 'Inter-Medium', fontSize: 14 }}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Text style={{ color: theme.colors.brand.primary, fontFamily: 'Inter-Bold', fontSize: 14 }}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    marginLeft: -10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'CormorantGaramond-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    opacity: 0.6,
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  }
});
