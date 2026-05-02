import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function MainLayout() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);

  useEffect(() => {
    if (!token && !isGuest) {
      router.replace('/(auth)/login');
    }
  }, [token, isGuest, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="scan" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="saved" />
    </Stack>
  );
}
