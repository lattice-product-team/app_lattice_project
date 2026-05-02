import { useEffect, useState } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { AppLoadingView } from '../src/components/ui/AppLoadingView';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const isGuest = useAuthStore((state) => state.isGuest);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
    }
  }, [navigationState?.key]);

  useEffect(() => {
    if (isReady) {
      console.log('[Index] Ready to redirect, token present:', !!token, 'isGuest:', isGuest);
      if (token || isGuest) {
        router.replace('/(main)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isReady, token, isGuest, router]);

  return <AppLoadingView />;
}
