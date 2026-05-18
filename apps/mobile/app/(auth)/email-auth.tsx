import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useLogin } from '../../src/hooks/queries/useAuth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { Button } from '../../src/components/ui/Button';
import { useAppTheme } from '../../src/hooks/useAppTheme';

export default function EmailAuthScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const { intendedDestination, setGuestMode } = useAuthStore.getState();

          // Ensure guest mode is disabled on successful login
          setGuestMode(false);

          if (intendedDestination) {
            useAuthStore.getState().setIntendedDestination(null);
            router.replace(intendedDestination as any);
          } else {
            router.replace('/(main)');
          }
        },
        onError: (error: any) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          const message =
            error instanceof Error
              ? error.message
              : typeof error === 'string'
                ? error
                : 'An unexpected error occurred';
          Alert.alert('Login Failed', message);
        },
      }
    );
  };

  return (
    <AuthLayout midnight showBack onBack={() => router.back()}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Sign in with Email
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Enter your details to access your account.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.form}
        >
          {login.isError && (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={16} color={theme.colors.status.error} />
              <Text style={[styles.errorText, { color: theme.colors.status.error }]}>
                {login.error instanceof Error
                  ? login.error.message
                  : 'Login failed. Please check your credentials.'}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.inputGroup,
              {
                backgroundColor: theme.colors.glass.subtle,
                borderColor: login.isError ? theme.colors.status.error : theme.colors.border.subtle,
              },
            ]}
          >
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

          <View
            style={[
              styles.inputGroup,
              {
                backgroundColor: theme.colors.glass.subtle,
                borderColor: login.isError ? theme.colors.status.error : theme.colors.border.subtle,
              },
            ]}
          >
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
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.text.muted}
              />
            </Pressable>
          </View>

          <View style={styles.forgotPassword}>
            <Text
              style={{ color: theme.colors.brand.primary, fontFamily: 'Inter-Bold', fontSize: 13 }}
            >
              Forgot Password?
            </Text>
          </View>

          <Button
            label={login.isPending ? 'Connecting...' : 'SIGN IN'}
            variant="primary"
            onPress={handleLogin}
            isLoading={login.isPending}
            disabled={!email || !password || login.isPending}
          />

          <View style={styles.registerLink}>
            <Text
              style={{ color: theme.colors.text.muted, fontFamily: 'Inter-Medium', fontSize: 14 }}
            >
              Don&apos;t have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/email-register')} hitSlop={10}>
              <Text
                style={{
                  color: theme.colors.brand.primary,
                  fontFamily: 'Inter-Bold',
                  fontSize: 14,
                }}
              >
                Create one
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
    fontSize: 40,
    fontFamily: 'CormorantGaramond-Bold',
    lineHeight: 44,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 18,
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
});
