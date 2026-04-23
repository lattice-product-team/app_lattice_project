import React from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeGradient } from './ThemeGradient';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface AuthLayoutProps {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
  isScrollable?: boolean;
  transparent?: boolean;
  midnight?: boolean;
}

/**
 * Shared layout for all authentication screens.
 * Handles progress, navigation, and consistent background styling.
 */
export const AuthLayout = ({ 
  children, 
  step, 
  totalSteps = 3, 
  onBack, 
  showBack = false,
  isScrollable = true,
  transparent = false,
  midnight = false
}: AuthLayoutProps) => {
  const theme = useLatticeTheme();

  const navigationRow = (
    <View className="z-50 mb-2">
      {/* Progress Bar at the top */}
      {step ? (
        <View className="flex-row gap-x-2 mb-6 mt-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View 
              key={i} 
              style={{
                height: 6,
                borderRadius: 3,
                flex: 1,
                backgroundColor: step >= i + 1 ? theme.colors.text.primary : theme.colors.border.subtle,
                opacity: step >= i + 1 ? 1 : 0.3,
              }}
            />
          ))}
        </View>
      ) : null}

      {/* Button Row below */}
      <View className="h-12 justify-center">
        {showBack ? (
          <Pressable 
            onPress={() => {
              Haptics.selectionAsync();
              if (onBack) onBack();
            }}
            hitSlop={20}
            style={{
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 24,
              backgroundColor: theme.colors.glass.background,
              borderWidth: 1,
              borderColor: theme.colors.glass.border,
            }}
            className="active:opacity-70 active:scale-90"
          >
            <Feather name="chevron-left" size={28} color={theme.colors.text.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar style={theme.dark ? "light" : "dark"} />
      
      {!transparent && (
        <ThemeGradient 
          variant={midnight || theme.dark ? "midnight" : "auth"} 
          showBlob={true} 
        />
      )}
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          <View className="flex-1 px-7">
            {navigationRow}
            
            {isScrollable ? (
              <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            ) : (
              <View className="flex-1">
                {children}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

