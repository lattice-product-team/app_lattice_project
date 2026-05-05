import { useEffect, useState } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

import { startupMetrics } from '../src/utils/startupMetrics';
import { useQueryClient } from '@tanstack/react-query';

export default function Index() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
      startupMetrics.markInteractive('Index');
      
      // Pre-fetch events while determining route
      queryClient.prefetchQuery({
        queryKey: ['events-search', ''],
        queryFn: () => import('../src/services/geoService').then(m => m.geoService.getEvents())
      });
    }
  }, [navigationState?.key, queryClient]);

  useEffect(() => {
    if (isReady) {
      console.log('[Index] Ready to redirect, token present:', !!token, 'isGuest:', isGuest);
      if (token || isGuest) {
        router.replace('/(main)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }
  }, [isReady, token, isGuest, router]);

  return null;
}
