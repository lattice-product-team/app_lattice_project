import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/useAuthStore';
import { useClaimTicket } from '../../auth/hooks/useAuthActions';

export const useTicketScanner = () => {
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { token, setPendingTicketCode } = useAuthStore();
  const { mutateAsync: claimTicket, isPending: isProcessing } = useClaimTicket();

  const handleBarCodeScanned = async (data: string) => {
    setScanned(true);

    if (token) {
      try {
        const response = await claimTicket(data);
        if (response.ticket_info) {
          Alert.alert(
            'Entrada Afegida',
            "La teva entrada s'ha associat correctament al teu compte.",
            [{ text: 'Veure Perfil', onPress: () => router.push('/profile') }]
          );
        } else {
          throw new Error('No info');
        }
      } catch (err) {
        Alert.alert(
          'Error',
          "No s'ha pogut associar l'entrada. És possible que el codi no sigui vàlid o ja estigui en ús.",
          [{ text: 'Tornar a intentar', onPress: () => setScanned(false) }]
        );
      }
    } else {
      setPendingTicketCode(data);

      Alert.alert(
        'Inicia Sessió',
        "Has d'iniciar sessió o registrar-te per guardar la teva entrada.",
        [
          {
            text: 'Cancel·lar',
            onPress: () => {
              setScanned(false);
              setPendingTicketCode(null);
            },
            style: 'cancel',
          },
          { text: 'Continuar', onPress: () => router.push('/register' as any) },
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
