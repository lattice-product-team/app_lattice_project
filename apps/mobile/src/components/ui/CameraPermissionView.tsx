import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CameraPermissionViewProps {
  onRequestPermission: () => void;
}

export const CameraPermissionView = ({ onRequestPermission }: CameraPermissionViewProps) => {
  const theme = useAppTheme();
  return (
    <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: theme.colors.bg.main }}>
      <Feather name="camera-off" size={64} color={theme.colors.text.muted} />
      <Text className="text-xl font-bold mt-4 text-center" style={{ color: theme.colors.text.primary }}>Permís de Càmera Necessari</Text>
      <Text className="text-center mt-2 mb-8" style={{ color: theme.colors.text.muted }}>
        Necessitem accés a la càmera per poder escanejar el codi QR de la teva entrada.
      </Text>
      <Pressable 
        className="px-6 py-3 rounded-full active:opacity-90"
        style={{ backgroundColor: theme.colors.brand.primary }}
        onPress={onRequestPermission}
      >
        <Text className="text-white font-bold text-lg">Donar Permís</Text>
      </Pressable>
    </View>
  );
};
