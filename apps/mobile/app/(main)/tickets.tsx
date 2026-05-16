import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Dimensions } from 'react-native';
import { ChevronLeft, ScanLine, Ticket as TicketIcon } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { typography } from '../../src/styles/typography';
import { WalletStack } from '../../src/features/tickets/components/WalletStack';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

const TicketsScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const { tickets } = useAuthStore();
  
  // Dynamic Island State (0: Tickets, 1: Scan)
  const islandMode = useSharedValue(0);

  const modeIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: islandMode.value * 110 }],
  }));

  const handleBack = () => {
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      {/* Dynamic Island Header */}
      <View style={styles.headerContainer}>
        <View style={[styles.island, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}>
          {/* Back Button */}
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={20} color={theme.colors.text.primary} />
          </Pressable>

          <View style={styles.divider} />

          {/* Mode Selector */}
          <View style={styles.selectorContainer}>
            <Animated.View style={[styles.activeIndicator, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }, modeIndicatorStyle]} />
            
            <Pressable 
              onPress={() => {
                islandMode.value = withSpring(0);
              }}
              style={styles.modeOption}
            >
              <TicketIcon size={18} color={theme.colors.text.primary} />
              <Text style={[styles.modeText, { color: theme.colors.text.primary }]}>Entradas</Text>
            </Pressable>

            <Pressable 
              onPress={() => {
                router.push('/(main)/scan');
              }}
              style={styles.modeOption}
            >
              <ScanLine size={18} color={theme.colors.text.secondary} />
              <Text style={[styles.modeText, { color: theme.colors.text.secondary }]}>Escanear</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Wallet Content */}
      <View style={styles.content}>
        {tickets && tickets.length > 0 ? (
          <WalletStack tickets={tickets} />
        ) : (
          <View style={styles.emptyState}>
            <TicketIcon size={64} color={theme.colors.interactive.disabled} strokeWidth={1} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No tienes entradas</Text>
            <Text style={[styles.emptySub, { color: theme.colors.text.secondary }]}>
              Escanea un código QR para añadir tu entrada al Wallet de Lattice.
            </Text>
            <Pressable 
              onPress={() => router.push('/(main)/scan')}
              style={[styles.scanButton, { backgroundColor: theme.colors.brand.primary }]}
            >
              <ScanLine size={20} color="#fff" />
              <Text style={styles.scanButtonText}>Escanear mi entrada</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TicketsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  content: {
    flex: 1,
    paddingTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
  },
  emptySub: {
    fontSize: 15,
    fontFamily: typography.primary.regular,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
});
