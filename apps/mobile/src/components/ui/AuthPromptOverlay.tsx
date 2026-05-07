import React from 'react';
import { AuthPromptSheet } from './AuthPromptSheet';

/**
 * Global overlay that manages the AuthPromptSheet.
 * Since AuthPromptSheet now handles its own state/animation, this is a simple wrapper.
 */
export const AuthPromptOverlay = () => {
  return (
    <AuthPromptSheet
      title="Unlock the full experience"
      subtitle="Sign in to Lattice to access this feature and personalize your urban discovery."
    />
  );
};
