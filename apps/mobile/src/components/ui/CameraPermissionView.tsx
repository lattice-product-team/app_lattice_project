import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CameraOff } from 'lucide-react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CameraPermissionViewProps {
  onRequestPermission: () => void;
}

export const CameraPermissionView = ({ onRequestPermission }: CameraPermissionViewProps) => {
  const theme = useAppTheme();
  return (
    <View
      className="flex-1 items-center justify-center p-6"
      style={{ backgroundColor: theme.colors.bg.main }}
    >
      <CameraOff size={64} color={theme.colors.text.muted} strokeWidth={1.5} />
      <Text
        className="text-xl font-bold mt-4 text-center"
        style={{ color: theme.colors.text.primary }}
      >
        Permís de Càmera Necessari
      </Text>
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
