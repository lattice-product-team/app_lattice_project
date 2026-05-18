import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/hooks/useAppTheme';

/**
 * Legacy Profile Screen refactored to redirect to the new Dropdown Profile
 * integrated into the Map (Nivel 2).
 */
export default function ProfileScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  useEffect(() => {
    // Redirect back to main map
    router.replace('/');
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.bg.main,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.text.primary} />
    </View>
  );
}
