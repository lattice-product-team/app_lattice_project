import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from '@/src/hooks/useAppFonts';
import { ThemeProvider, useAppTheme } from '@/src/providers/ThemeProvider';
import { RealtimeSyncProvider } from '@/src/providers/RealtimeSyncProvider';
import { AuthPromptOverlay } from '../src/components/ui/AuthPromptOverlay';
import { SplashScreen as AppSplashScreen } from '../src/components/ui/SplashScreen';
import * as SplashScreen from 'expo-splash-screen';
import { startupMetrics } from '../src/utils/startupMetrics';
import { useStartupStore } from '../src/store/useStartupStore';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import '../global.css';

// Start tracking metrics immediately
startupMetrics.start();

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const { loaded: fontsLoaded, error: fontsError } = useAppFonts();
  const isDataReady = useStartupStore((s) => s.isDataReady);
  const isMapReady = useStartupStore((s) => s.isMapReady);
  let theme = useAppTheme();
  if (!theme || !theme.colors) {
    const { darkTheme } = require('../src/styles/theme');
    theme = darkTheme;
  }


  const [showSplashOverlay, setShowSplashOverlay] = useState(true);
  const splashOpacity = useSharedValue(1);

  // The app is ready to HIDE our custom splash only when everything is loaded
  const isAppFullyReady = fontsLoaded && isDataReady && isMapReady;

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    if (isAppFullyReady) {
      console.log('✅ [RootLayout] App Fully Ready. Fading out splash...');
      // Trigger fade out
      splashOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
        if (finished) {
          runOnJS(setShowSplashOverlay)(false);
        }
      });
    } else {
      console.log(
        `⏳ [RootLayout] Waiting for: ${!fontsLoaded ? 'Fonts ' : ''}${!isDataReady ? 'Data ' : ''}${!isMapReady ? 'Map' : ''}`
      );
    }
  }, [isAppFullyReady]);

  // Master Safety Timeout: Absolute 10-second limit to hide splash no matter what
  useEffect(() => {
    if (isAppFullyReady) return;

    const timer = setTimeout(() => {
      if (showSplashOverlay) {
        console.warn('🚨 [RootLayout] Master Safety Timeout Triggered: Forcing Splash Hide');
        splashOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
          if (finished) {
            runOnJS(setShowSplashOverlay)(false);
          }
        });
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isAppFullyReady]);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    pointerEvents: splashOpacity.value < 0.1 ? 'none' : ('auto' as any),
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RealtimeSyncProvider>
              <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(main)" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="+not-found" />
                </Stack>

                <AuthPromptOverlay />
                <StatusBar style={theme.dark ? 'light' : 'dark'} />

                {showSplashOverlay && (
                  <Animated.View
                    style={[StyleSheet.absoluteFill, animatedSplashStyle, { zIndex: 99999 }]}
                  >
                    <AppSplashScreen />
                  </Animated.View>
                )}
              </View>
            </RealtimeSyncProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
