import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { useStartupStore } from '../src/store/useStartupStore';
import { startupMetrics } from '../src/utils/startupMetrics';
import { useQueryClient } from '@tanstack/react-query';

export default function Index() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  
  const { isDataReady, setDataReady } = useStartupStore();

  useEffect(() => {
    if (navigationState?.key) {
      console.log('🚀 [Index] Root Navigation Ready. Starting prep...');
      startupMetrics.markInteractive('Index');
      
      const prepare = async () => {
        try {
          Promise.all([
            queryClient.prefetchQuery({
              queryKey: ['events-search', ''],
              queryFn: () => import('../src/services/geoService').then(m => m.geoService.getEvents())
            }),
            queryClient.prefetchQuery({
              queryKey: ['pois', undefined, undefined],
              queryFn: () => import('../src/services/geoService').then(m => m.geoService.getPOIs())
            })
          ]).then(() => {
            console.log('✅ [Index] Data Pre-fetch Complete');
            setDataReady(true);
          }).catch(e => {
            console.warn('⚠️ [Index] Pre-fetch failed, proceeding anyway', e);
            setDataReady(true);
          });
        } catch (e) {
          setDataReady(true);
        }
      };

      prepare();
    }
  }, [navigationState?.key, queryClient]);

  useEffect(() => {
    if (navigationState?.key) {
      console.log('✨ [Index] Triggering navigation to (main)...');
      const timer = setTimeout(() => {
        try {
          if (token || isGuest) {
            router.replace('/(main)');
          } else {
            router.replace('/(auth)/onboarding');
          }
        } catch (e) {
          console.error('❌ [Index] Navigation failed', e);
        }
      }, 150); // Increased to 150ms for maximum safety
      return () => clearTimeout(timer);
    }
  }, [navigationState?.key, token, isGuest, router]);



  // Root _layout will handle the SplashScreen overlay
  return null;
}
