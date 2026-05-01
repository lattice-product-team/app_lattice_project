import React, { useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../hooks/useAppTheme';
import { PremiumButton } from './PremiumButton';
import { useRouter } from 'expo-router';

interface AuthPromptSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

/**
 * Bottom sheet prompt for unauthenticated users attempting to access protected features.
 */
export const AuthPromptSheet = ({ 
  sheetRef, 
  title = "Join the Crew", 
  subtitle = "Sign in to save your favorite places and sync performance data across devices.",
  onClose
}: AuthPromptSheetProps) => {
  const theme = useAppTheme();
  const router = useRouter();
  
  // Snap to 35% of screen height
  const snapPoints = useMemo(() => ['35%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
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
      backgroundStyle={{ backgroundColor: theme.colors.bg.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border.strong, width: 40 }}
      onChange={(index) => {
        if (index === -1 && onClose) onClose();
      }}
    >
      <View className="flex-1 px-8 pt-6 pb-12 items-center">
        <Text 
          className="text-2xl mb-3 text-center" 
          style={{ fontFamily: 'Outfit-Bold', color: theme.colors.text.primary }}
        >
          {title}
        </Text>
        <Text 
          className="text-sm leading-5 mb-10 text-center px-4" 
          style={{ fontFamily: 'Outfit-Medium', color: theme.colors.text.secondary }}
        >
          {subtitle}
        </Text>
        
        <View className="w-full">
          <PremiumButton 
            label="SIGN IN OR REGISTER" 
            variant="primary" 
            onPress={() => {
              sheetRef.current?.close();
              router.push('/(auth)/login');
            }}
            className="mb-3"
          />
          
          <PremiumButton 
            label="MAYBE LATER" 
            variant="outline" 
            onPress={() => sheetRef.current?.close()} 
          />
        </View>
      </View>
    </BottomSheet>
  );
};
