import React from 'react';
import { View, ActivityIndicator, Pressable, Text } from 'react-native';
import { CircleCheck, RefreshCw } from 'lucide-react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ScanOverlayProps {
  isProcessing: boolean;
  scanned: boolean;
  onReset: () => void;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({ isProcessing, scanned, onReset }) => {
  const theme = useAppTheme();

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      {/* Scan Frame */}
      <View
        className="w-64 h-64 border-2 rounded-3xl items-center justify-center"
        style={{
          borderColor: scanned ? theme.colors.status.success : theme.colors.text.muted,
          borderStyle: scanned ? 'solid' : 'dashed',
        }}
      >
        {isProcessing && (
          <View className="bg-black/60 p-6 rounded-2xl">
            <ActivityIndicator color={theme.colors.brand.primary} size="large" />
          </View>
        )}

        {scanned && !isProcessing && (
          <View className="bg-black/60 p-6 rounded-2xl items-center">
            <CircleCheck size={48} color={theme.colors.status.success} strokeWidth={2.2} />
          </View>
        )}
      </View>

      {/* Reset Button (only shown when scanned) */}
      {scanned && (
        <View className="absolute bottom-20 left-0 right-0 items-center" pointerEvents="auto">
          <Pressable
            onPress={onReset}
            className="bg-white/10 border border-white/20 px-8 py-4 rounded-full flex-row items-center"
          >
            <RefreshCw size={18} color="white" strokeWidth={2.2} />
            <Text className="text-white font-bold ml-3">SCAN ANOTHER</Text>
          </Pressable>
        </View>
      )}

      {/* Guidance Text */}
      {!scanned && !isProcessing && (
        <View className="absolute bottom-24 left-0 right-0 items-center">
          <Text className="text-white/60 bg-black/40 px-6 py-2 rounded-full overflow-hidden">
            Center the QR code in the frame
          </Text>
        </View>
      )}
    </View>
  );
};
