import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export const useTicketScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { token, claimTicket, setPendingTicketCode } = useAuthStore();

  const handleBarCodeScanned = async (data: string) => {
    setScanned(true);
    setIsProcessing(true);

    if (token) {
      const success = await claimTicket(data);
      setIsProcessing(false);
      
      if (success) {
        Alert.alert(
          "Entrada Afegida", 
          "La teva entrada s'ha associat correctament al teu compte.",
          [{ text: "Veure Perfil", onPress: () => router.push('/profile') }]
        );
      } else {
        Alert.alert(
          "Error", 
          "No s'ha pogut associar l'entrada. És possible que el codi no sigui vàlid o ja estigui en ús.",
          [{ text: "Tornar a intentar", onPress: () => setScanned(false) }]
        );
      }
    } else {
      setPendingTicketCode(data);
      setIsProcessing(false);
      
      Alert.alert(
        "Inicia Sessió", 
        "Has d'iniciar sessió o registrar-te per guardar la teva entrada.",
        [
          { text: "Cancel·lar", onPress: () => { setScanned(false); setPendingTicketCode(null); }, style: 'cancel' },
          { text: "Continuar", onPress: () => router.push('/register' as any) }
        ]
      );
    }
  };

  const resetScanner = () => setScanned(false);

  return {
    scanned,
    isProcessing,
    handleBarCodeScanned,
    resetScanner,
  };
};
