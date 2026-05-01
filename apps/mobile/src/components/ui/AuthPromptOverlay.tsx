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
  const closeAuthPrompt = useAuthStore((state) => state.closeAuthPrompt);

  useEffect(() => {
    if (isAuthPromptOpen) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [isAuthPromptOpen]);

  return (
    <AuthPromptSheet 
      sheetRef={sheetRef}
      onClose={closeAuthPrompt}
      title="Explore with Lattice"
      subtitle="Sign in to personalize your map, save places, and track your performance stats."
    />
  );
};
