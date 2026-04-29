import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { ThemeProvider, useAppTheme } from '../src/providers/ThemeProvider';
import '../global.css';

const queryClient = new QueryClient();

// Catch unhandled promise rejections that might cause crashes (like KeepAwake failure)
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    if (error?.message?.includes('keep awake') || error?.message?.includes('KeepAwake')) {
      console.warn('[KeepAwake] Suppressed activation error:', error.message);
      return;
    }
    originalHandler(error, isFatal);
  });
}

function AppStatusBar() {
  const theme = useAppTheme();
  return <StatusBar style={theme.dark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const { loaded, error } = useAppFonts();

  useEffect(() => {
    console.log('[RootLayout] Mounted');
    return () => console.log('[RootLayout] Unmounted');
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(main)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <AppStatusBar />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
