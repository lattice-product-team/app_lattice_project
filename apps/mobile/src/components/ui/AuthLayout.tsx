import React from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Pressable,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeGradient } from './ThemeGradient';
import { useAppTheme } from '../../hooks/useAppTheme';

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
  const theme = useAppTheme();

  const navigationRow = (
    <View style={[styles.navigationOverlay, { top: 10 }]}>
      {/* Button Row */}
      {showBack ? (
        <Pressable 
          onPress={() => {
            Haptics.selectionAsync();
            if (onBack) onBack();
          }}
          hitSlop={20}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
        </Pressable>
      ) : null}

      {/* Progress Bar - Moved or kept if needed */}
      {step ? (
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View 
              key={i} 
              style={{
                height: 4,
                borderRadius: 2,
                flex: 1,
                backgroundColor: step >= i + 1 ? theme.colors.text.primary : theme.colors.border.subtle,
                opacity: step >= i + 1 ? 0.8 : 0.2,
              }}
            />
          ))}
        </View>
      ) : null}
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

const styles = StyleSheet.create({
  navigationOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginLeft: 20,
  }
});

