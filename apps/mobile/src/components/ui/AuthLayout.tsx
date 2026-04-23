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
  const navigationRow = (
    <View className="z-50 mb-2">
      {/* Progress Bar at the top */}
      {step ? (
        <View className="flex-row gap-x-2 mb-6 mt-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View 
              key={i} 
              className={`h-1.5 rounded-full flex-1 ${step >= i + 1 ? 'bg-white' : 'bg-white/10'}`} 
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
            className="w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10 active:opacity-70 active:scale-90"
          >
            <Feather name="chevron-left" size={28} color="white" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      
      {!transparent && <ThemeGradient variant={midnight ? "midnight" : "auth"} />}
      
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
