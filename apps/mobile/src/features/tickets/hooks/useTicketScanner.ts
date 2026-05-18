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

  const handleBarCodeScanned = useCallback(
    async (data: string) => {
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
              'Ticket Added',
              'Your ticket has been successfully associated with your account.',
              [
                {
                  text: 'View Wallet',
                  onPress: () => {
                    isLocked.current = false;
                    router.replace('/(main)/tickets');
                  },
                },
              ]
            );
          } else {
            throw new Error('No ticket info in response');
          }
        } catch (err: any) {
          const errorMsg =
            err?.response?.data?.error ||
            'Could not associate ticket. The code might be invalid or already in use.';

          Alert.alert('Scan Error', errorMsg, [
            {
              text: 'Try Again',
              onPress: () => {
                isLocked.current = false;
                setScanned(false);
              },
            },
          ]);
        }
      } else {
        setPendingTicketCode(data);

        Alert.alert('Log In', 'You must log in or register to save your ticket.', [
          {
            text: 'Cancel',
            onPress: () => {
              isLocked.current = false;
              setScanned(false);
              setPendingTicketCode(null);
            },
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => {
              isLocked.current = false;
              router.push('/register' as any);
            },
          },
        ]);
      }
    },
    [token, scanned, claimTicket, addTicketToWallet, router, setPendingTicketCode]
  );

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
