import { View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTicketScanner } from '../../src/features/tickets/hooks/useTicketScanner';
import { CameraPermissionView } from '../../src/components/ui/CameraPermissionView';
import { ScanOverlay } from '../../src/components/ui/ScanOverlay';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { scanned, isProcessing, handleBarCodeScanned, resetScanner } = useTicketScanner();

  if (!permission) return null;

  if (!permission.granted) {
    return <CameraPermissionView onRequestPermission={requestPermission} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : ({ data }) => handleBarCodeScanned(data)}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <ScanOverlay 
        isProcessing={isProcessing} 
        scanned={scanned} 
        onReset={resetScanner} 
      />
    </View>
  );
}

