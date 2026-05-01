import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../hooks/useAppTheme';
import { PremiumButton } from './PremiumButton';
import { useAuthStore } from '../../store/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

interface AuthPromptSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  title?: string;
  subtitle?: string;
}

/**
 * Premium "Level 2" style bottom sheet for auth prompts.
 */
export const AuthPromptSheet: React.FC<AuthPromptSheetProps> = ({ 
  sheetRef,
  title = "Unlock the full experience",
  subtitle = "Sign in to Lattice to access this feature and personalize your urban discovery."
}) => {
  const theme = useAppTheme();
  const router = useRouter();
  const snapPoints = useMemo(() => ['45%'], []);
  const closeAuthPrompt = useAuthStore((state) => state.closeAuthPrompt);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sheetRef.current?.close();
    closeAuthPrompt();
    setGuestMode(false); // Crucial: Clear guest mode to allow seeing the login screen
    router.push('/(auth)/login');
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ 
        backgroundColor: theme.colors.glass.background,
        borderRadius: 40,
      }}
      handleIndicatorStyle={{ 
        backgroundColor: theme.colors.text.muted,
        width: 40
      }}
      onChange={(index) => {
        if (index === -1) {
          closeAuthPrompt();
        }
      }}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.glass.subtle }]}>
            <Feather name="lock" size={24} color={theme.colors.brand.primary} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>{subtitle}</Text>
        </View>

        <View style={styles.actions}>
          <PremiumButton 
            label="GET STARTED" 
            variant="primary" 
            onPress={handleAction}
          />
          <Pressable 
            onPress={() => sheetRef.current?.close()} 
            style={styles.notNowButton}
          >
            <Text style={[styles.notNowText, { color: theme.colors.text.muted }]}>Maybe later</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
    alignItems: 'center',
    gap: 32,
  },
  iconContainer: {
    marginTop: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  actions: {
    width: '100%',
    gap: 16,
    marginTop: 10,
  },
  notNowButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  notNowText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    textDecorationLine: 'underline',
  }
});
