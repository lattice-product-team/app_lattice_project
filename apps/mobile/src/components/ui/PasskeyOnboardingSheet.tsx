import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
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
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PasskeyOnboardingSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PasskeyOnboardingSheet = ({ isVisible, onClose, onConfirm }: PasskeyOnboardingSheetProps) => {
  const theme = useAppTheme();
  const animState = useSharedValue(0);

  React.useEffect(() => {
    animState.value = withSpring(isVisible ? 1 : 0, theme.motion.physics.snappy);
  }, [isVisible, theme.motion.physics.snappy]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - animState.value) * SCREEN_HEIGHT }],
  }));

  if (!isVisible) {
    // Si no es visible, podemos ocultarlo después de que la animación termine
    // Por simplicidad en este paso, usaremos solo isVisible
    // Para un cierre suave total se podría usar un estado de 'render'
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isVisible ? "auto" : "none"}>
      {isVisible && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]} 
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
      )}

      <Animated.View style={[styles.sheet, { backgroundColor: '#FFF' }, animatedStyle]}>
        <View style={styles.handle} />
        
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/icon.png')} 
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>

          <Text style={styles.title}>
            Secure your access.
          </Text>
          <Text style={styles.subtitle}>
            Enable FaceID or TouchID for instant, passwordless access to your city life.
          </Text>

          <View style={styles.benefits}>
            <BenefitItem 
              icon="zap" 
              text="Instant login in under 1 second" 
            />
            <BenefitItem 
              icon="shield" 
              text="Military-grade biometric security" 
            />
            <BenefitItem 
              icon="key" 
              text="No more passwords to remember" 
            />
          </View>

          <View style={styles.actions}>
            <PremiumButton 
              label="Enable Passkey" 
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onConfirm();
              }}
            />
            <Pressable onPress={onClose} style={styles.skipButton}>
              <Text style={styles.skipText}>
                Maybe later
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const BenefitItem = ({ icon, text }: { icon: any, text: string }) => (
  <View style={styles.benefitItem}>
    <View style={styles.benefitIcon}>
      <Feather name={icon} size={18} color="#000" />
    </View>
    <Text style={styles.benefitText}>{text}</Text>
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 50,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 32,
    shadowColor: '#E2B042',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },
  title: {
    fontSize: 36,
    fontFamily: 'CormorantGaramond-Medium',
    textAlign: 'center',
    color: '#000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.5,
    color: '#000',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  benefits: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    opacity: 0.8,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#E2B042', // Lattice Orange
  },
});
