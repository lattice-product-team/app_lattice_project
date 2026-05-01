import React, { useEffect, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthPromptSheet } from './AuthPromptSheet';

/**
 * Global overlay that manages the AuthPromptSheet based on global state.
 * Place this once in the root layout.
 */
export const AuthPromptOverlay = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const isAuthPromptOpen = useAuthStore((state) => state.isAuthPromptOpen);

  useEffect(() => {
    if (isAuthPromptOpen) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [isAuthPromptOpen]);

  return (
    <AuthPromptSheet 
      sheetRef={sheetRef}
      title="Unlock the full experience"
      subtitle="Sign in to Lattice to access this feature and personalize your urban discovery."
    />
  );
};
