import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraPermissions, CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout, SlideOutLeft } from 'react-native-reanimated';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { useSyncTicket } from '../../src/services/auth';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { ThemeGradient } from '../../src/components/ui/ThemeGradient';
import { colors } from '../../src/styles/colors';
import { authStyles } from '../../src/styles/typography';

/**
 * Single Step Visual Component
 */
interface StepProps {
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

const WelcomeStep = ({ title, subtitle, primaryAction, secondaryAction }: StepProps) => (
  <Animated.View 
    entering={FadeInDown.duration(600)}
    exiting={SlideOutLeft.duration(400)}
    className="flex-1 justify-center"
  >
    <View className="items-start mb-16">
      <Text 
        className="text-white mb-6"
        style={authStyles.title}
      >
        {title}
      </Text>
      <Text 
        className="text-white/50 pr-8"
        style={authStyles.subtitle}
      >
        {subtitle}
      </Text>
    </View>

    <View className="gap-y-5">
      <PremiumButton
        onPress={primaryAction.onPress}
        label={primaryAction.label}
        variant="white"
      />

      {secondaryAction ? (
        <PremiumButton
          onPress={secondaryAction.onPress}
          label={secondaryAction.label}
          variant="glass"
        />
      ) : null}
    </View>
  </Animated.View>
);

export default function WelcomeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const syncTicket = useSyncTicket();

  const handleHaveTicket = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to scan tickets.');
        return;
      }
    }
    setIsScanning(true);
  }, [permission, requestPermission]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setIsScanning(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    syncTicket.mutate(data, {
      onSuccess: (response) => {
        if (response.requires_setup) {
          router.replace('/(auth)/register');
        } else {
          router.replace('/(main)');
        }
      },
      onError: (error: any) => {
        Alert.alert('Sync Failed', error.message);
      }
    });
  };

  const currentStepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <WelcomeStep
            key="step-1"
            title={"Lattice\nOn Track"}
            subtitle="Benvingut al Circuit de Barcelona-Catalunya. Prepara't per a la millor experiència Lattice."
            primaryAction={{
              label: 'COMENÇAR',
              onPress: () => setStep(2)
            }}
          />
        );
      case 2:
        return (
          <WelcomeStep
            key="step-2"
            title={"Tens la teva\nentrada?"}
            subtitle="Escaneja el codi per activar el teu Copilot i trobar el teu seient ràpidament."
            primaryAction={{
              label: 'SÍ, LA TINC AQUÍ',
              onPress: handleHaveTicket
            }}
            secondaryAction={{
              label: 'ENCARA NO LA TINC',
              onPress: () => setStep(3)
            }}
          />
        );
      case 3:
        return (
          <WelcomeStep
            key="step-3"
            title={"Accedeix al\nteu compte"}
            subtitle="Inicia sessió o crea un compte per guardar les teves preferències i historial."
            primaryAction={{
              label: 'SOC NOU USUARI',
              onPress: () => router.replace('/(auth)/register')
            }}
            secondaryAction={{
              label: 'JA TINC COMPTE',
              onPress: () => router.replace({ pathname: '/(auth)/login', params: { mode: 'account' } })
            }}
          />
        );
      default:
        return null;
    }
  }, [step, handleHaveTicket, router]);

  if (isScanning) {
    return (
      <View style={StyleSheet.absoluteFill} className="bg-black">
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <AuthLayout 
          showBack 
          onBack={() => setIsScanning(false)} 
          isScrollable={false}
          transparent
        >
          <View className="items-center mb-24 flex-1 justify-center">
            <View className="w-64 h-64 border-2 border-primary/50 rounded-[40px] items-center justify-center">
               <View className="w-48 h-48 border border-white/20 rounded-3xl border-dashed" />
            </View>
            <Text className="text-white/80 text-center mt-8 bg-black/60 px-6 py-3 rounded-full overflow-hidden border border-white/5">
              Center the QR code in the frame
            </Text>
          </View>
        </AuthLayout>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemeGradient 
        variant="premium" 
        showBlob={true}
      />
      
      <AuthLayout 
        step={step} 
        totalSteps={3} 
        showBack={step > 1} 
        onBack={() => {
          if (step === 3) useAuthStore.getState().clearRegistrationData();
          setStep((prev) => (prev - 1) as 1 | 2 | 3);
        }}
        transparent
      >
        <Animated.View layout={Layout.springify()} className="flex-1">
          {currentStepContent}
        </Animated.View>

        {syncTicket.isPending && (
          <View style={StyleSheet.absoluteFill} className="bg-black/80 items-center justify-center z-[100]">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-white mt-4 font-semibold">Verificando entrada...</Text>
          </View>
        )}
      </AuthLayout>
    </View>
  );
}
