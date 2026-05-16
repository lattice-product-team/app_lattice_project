import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Zap, ZapOff, RefreshCcw } from 'lucide-react-native';
import { useTicketScanner } from '../../src/features/tickets/hooks/useTicketScanner';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { typography } from '../../src/styles/typography';

export default function TicketScanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const { scanned, isProcessing, handleBarCodeScanned, resetScanner } = useTicketScanner();

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
        {/* Overlay Mask */}
        <View style={styles.overlay}>
          <View style={styles.topSection}>
            <Pressable 
              onPress={() => router.back()}
              style={styles.closeButton}
            >
              <X color="#fff" size={28} />
            </Pressable>
            <Text style={styles.headerTitle}>Escanear Ticket</Text>
            <Pressable 
              onPress={() => setTorch(!torch)}
              style={styles.torchButton}
            >
              {torch ? <Zap color="#FFD700" size={24} fill="#FFD700" /> : <ZapOff color="#fff" size={24} />}
            </Pressable>
          </View>

          <View style={styles.finderContainer}>
            <View style={[styles.finder, { borderColor: theme.colors.brand.primary }]}>
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.brand.primary }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.brand.primary }]} />
            </View>
            <Text style={styles.instructionText}>Encuadra el código QR de tu entrada Lattice</Text>
          </View>

          <View style={styles.bottomSection}>
            {isProcessing && (
              <View style={styles.processingCard}>
                <ActivityIndicator color={theme.colors.brand.primary} />
                <Text style={styles.processingText}>Validando entrada...</Text>
              </View>
            )}
            
            {scanned && !isProcessing && (
              <Pressable 
                onPress={resetScanner}
                style={styles.retryButton}
              >
                <RefreshCcw color="#fff" size={20} />
                <Text style={styles.retryText}>Volver a intentar</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  torchButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finderContainer: {
    alignItems: 'center',
  },
  finder: {
    width: 260,
    height: 260,
    borderWidth: 0,
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
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 32,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 32,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 32,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 32,
  },
  instructionText: {
    color: '#fff',
    marginTop: 32,
    fontSize: 15,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomSection: {
    paddingBottom: 80,
    alignItems: 'center',
  },
  processingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
  },
  processingText: {
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
  errorTitle: {
    fontSize: 22,
    fontFamily: typography.primary.bold,
    marginBottom: 12,
  },
  errorSub: {
    fontSize: 16,
    fontFamily: typography.primary.regular,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
});
