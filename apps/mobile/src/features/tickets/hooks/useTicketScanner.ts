import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { useClaimTicket } from '../../auth/hooks/useAuthActions';

export const useTicketScanner = () => {
  const [scanned, setScanned] = useState(false);
  // Use a ref for immediate locking to prevent race conditions from the camera frames
  const isLocked = useRef(false);
  
  const router = useRouter();
  const { token, setPendingTicketCode, addTicketToWallet } = useAuthStore();
  const { mutateAsync: claimTicket, isPending: isProcessing } = useClaimTicket();

  const handleBarCodeScanned = useCallback(async (data: string) => {
    // 1. Immediate lock check
    if (isLocked.current || scanned) return;
    isLocked.current = true;
    setScanned(true);

    console.log('[Scanner] QR Detected (Locked):', data);

    if (token) {
      try {
        const response = await claimTicket(data);
        
        if (response.ticket_info) {
          // Update local store immediately
          addTicketToWallet(response.ticket_info);
          
          Alert.alert(
            'Entrada Añadida',
            "Tu entrada se ha asociado correctamente a tu cuenta.",
            [{ 
              text: 'Ver Wallet', 
              onPress: () => {
                isLocked.current = false;
                router.replace('/(main)/tickets'); 
              }
            }]
          );
        } else {
          throw new Error('No ticket info in response');
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.error || "No se ha podido asociar la entrada. Es posible que el código no sea válido o ya esté en uso.";
        
        Alert.alert(
          'Error al escanear',
          errorMsg,
          [{ 
            text: 'Intentar de nuevo', 
            onPress: () => {
              isLocked.current = false;
              setScanned(false);
            } 
          }]
        );
      }
    } else {
      setPendingTicketCode(data);

      Alert.alert(
        'Inicia Sesión',
        "Debes iniciar sesión o registrarte para guardar tu entrada.",
        [
          {
            text: 'Cancelar',
            onPress: () => {
              isLocked.current = false;
              setScanned(false);
              setPendingTicketCode(null);
            },
            style: 'cancel',
          },
          { 
            text: 'Continuar', 
            onPress: () => {
              isLocked.current = false;
              router.push('/register' as any);
            }
          },
        ]
      );
    }
  }, [token, scanned, claimTicket, addTicketToWallet, router, setPendingTicketCode]);

  const resetScanner = () => {
    isLocked.current = false;
    setScanned(false);
  };

  return {
    scanned,
    isProcessing,
    handleBarCodeScanned,
    resetScanner,
  };
};
