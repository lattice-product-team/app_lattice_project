import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ChevronLeft, Zap, ZapOff, RefreshCcw, Ticket as TicketIcon, ScanLine } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useTicketScanner } from '../../src/features/tickets/hooks/useTicketScanner';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { typography } from '../../src/styles/typography';

export default function TicketScanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const { scanned, isProcessing, handleBarCodeScanned, resetScanner } = useTicketScanner();

  // Dynamic Island State (0: Tickets, 1: Scan)
  // Since this is the Scan Screen, we start at 1
  const islandMode = useSharedValue(1);

  const modeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: islandMode.value * 110 }],
  }));

  const handleBack = () => {
    router.replace('/(main)');
  };

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg.main, padding: 40, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>Sin acceso a la cámara</Text>
        <Text style={[styles.errorSub, { color: theme.colors.text.secondary }]}>Necesitamos permiso para usar la cámara y poder escanear tu entrada.</Text>
        <Pressable 
          onPress={requestPermission}
          style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}
        >
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={scanned || isProcessing ? undefined : ({ data }) => handleBarCodeScanned(data)}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Dynamic Island Header */}
        <View style={styles.headerContainer}>
          <View style={[styles.island, { backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.1)' }]}>
            {/* Back Button */}
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>

            <View style={styles.divider} />

            {/* Mode Selector */}
            <View style={styles.selectorContainer}>
              <Animated.View style={[styles.activeIndicator, { backgroundColor: 'rgba(255,255,255,0.15)' }, modeIndicatorStyle]} />
              
              <Pressable 
                onPress={() => {
                  router.push('/(main)/tickets');
                }}
                style={styles.modeOption}
              >
                <TicketIcon size={18} color="rgba(255,255,255,0.6)" />
                <Text style={[styles.modeText, { color: 'rgba(255,255,255,0.6)' }]}>Entradas</Text>
              </Pressable>

              <Pressable 
                onPress={() => {
                  islandMode.value = withSpring(1);
                }}
                style={styles.modeOption}
              >
                <ScanLine size={18} color="#fff" />
                <Text style={[styles.modeText, { color: '#fff' }]}>Escanear</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Scan Finder & Torch */}
        <View style={styles.contentOverlay}>
          <View style={styles.finderContainer}>
            <View style={[styles.finder, { borderColor: theme.colors.brand.primary }]}>
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.brand.primary }]} />
            </View>
            
            <View style={styles.controlsRow}>
              <Pressable onPress={() => setTorch(!torch)} style={styles.torchButton}>
                {torch ? <Zap color="#FFD700" size={24} fill="#FFD700" /> : <ZapOff color="#fff" size={24} />}
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomSection}>
            {isProcessing && (
              <View style={styles.statusCard}>
                <ActivityIndicator color={theme.colors.brand.primary} />
                <Text style={styles.statusText}>Validando...</Text>
              </View>
            )}
            
            {scanned && !isProcessing && (
              <Pressable onPress={resetScanner} style={styles.retryButton}>
                <RefreshCcw color="#fff" size={20} />
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    zIndex: 1000,
  },
  island: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 8,
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectorContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 220,
    height: 44,
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 105,
    height: 36,
    borderRadius: 18,
    left: 2,
  },
  modeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  modeText: {
    fontSize: 13,
    fontFamily: typography.primary.bold,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  finderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finder: {
    width: 260,
    height: 260,
    borderRadius: 32,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 32 },
  topRight: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 32 },
  bottomLeft: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 32 },
  bottomRight: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 32 },
  controlsRow: {
    marginTop: 40,
  },
  torchButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: typography.primary.bold,
  },
  errorTitle: { fontSize: 22, fontFamily: typography.primary.bold, marginBottom: 12 },
  errorSub: { fontSize: 16, fontFamily: typography.primary.regular, textAlign: 'center', marginBottom: 32 },
  button: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: typography.primary.bold },
});
