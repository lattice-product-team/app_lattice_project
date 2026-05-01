import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../styles/typography';
import { PremiumButton } from './PremiumButton';
import * as Haptics from 'expo-haptics';

interface PasskeyOnboardingSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PasskeyOnboardingSheet = ({ isVisible, onClose, onConfirm }: PasskeyOnboardingSheetProps) => {
  const theme = useAppTheme();
  const animState = useSharedValue(0);

  React.useEffect(() => {
    animState.value = withSpring(isVisible ? 1 : 0, {
      damping: 20,
      stiffness: 90
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - animState.value) * 600 }],
  }));

  if (!isVisible && animState.value === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isVisible ? "auto" : "none"}>
      {isVisible && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]} 
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
      )}

      <Animated.View style={[styles.sheet, { backgroundColor: theme.colors.bg.surface }, animatedStyle]}>
        <View style={styles.handle} />
        
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand.primary + '20' }]}>
            <MaterialCommunityIcons name="face-recognition" size={48} color={theme.colors.brand.primary} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Login ultra-rápido
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Activa tu Passkey para entrar en Lattice usando FaceID o tu huella dactilar. Sin contraseñas, 100% seguro.
          </Text>

          <View style={styles.benefits}>
            <BenefitItem 
              icon="zap" 
              text="Entra en menos de 1 segundo" 
              theme={theme} 
            />
            <BenefitItem 
              icon="shield-check" 
              text="Seguridad biométrica de grado militar" 
              theme={theme} 
            />
          </View>

          <View style={styles.actions}>
            <PremiumButton 
              label="Activar Passkey" 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                onConfirm();
              }}
            />
            <Pressable onPress={onClose} style={styles.skipButton}>
              <Text style={[styles.skipText, { color: theme.colors.text.muted }]}>
                Quizás más tarde
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const BenefitItem = ({ icon, text, theme }: any) => (
  <View style={styles.benefitItem}>
    <View style={[styles.benefitIcon, { backgroundColor: theme.colors.bg.main }]}>
      <Feather name={icon} size={16} color={theme.colors.brand.primary} />
    </View>
    <Text style={[styles.benefitText, { color: theme.colors.text.primary }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  content: {
    alignItems: 'center',
    paddingTop: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  benefits: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 15,
    fontFamily: typography.primary.medium,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 15,
    fontFamily: typography.primary.bold,
  },
});
