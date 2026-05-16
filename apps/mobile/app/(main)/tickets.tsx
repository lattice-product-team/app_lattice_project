import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { ChevronDown, ScanLine, Ticket as TicketIcon, X } from 'lucide-react-native';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { typography } from '../../src/styles/typography';
import { WalletStack } from '../../src/features/tickets/components/WalletStack';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function TicketsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { tickets } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      {/* Header with Dropdown-style Menu and Close Button */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => setShowMenu(!showMenu)}
            style={[styles.menuTrigger, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}
          >
            <Text style={[styles.menuTitle, { color: theme.colors.text.primary }]}>Mis Entradas</Text>
            <ChevronDown size={20} color={theme.colors.text.primary} style={{ transform: [{ rotate: showMenu ? '180deg' : '0deg' }] }} />
          </Pressable>

          <Pressable 
            onPress={() => router.back()}
            style={[styles.closeButton, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}
          >
            <X size={20} color={theme.colors.text.primary} />
          </Pressable>
        </View>

        {showMenu && (
          <View style={[styles.dropdown, { backgroundColor: theme.colors.bg.surface, borderColor: theme.colors.border.subtle }]}>
            <Pressable 
              onPress={() => setShowMenu(false)}
              style={styles.dropdownItem}
            >
              <TicketIcon size={20} color={theme.colors.brand.primary} />
              <Text style={[styles.dropdownText, { color: theme.colors.text.primary }]}>Mis Entradas</Text>
            </Pressable>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />
            
            <Pressable 
              onPress={() => {
                setShowMenu(false);
                router.push('/(main)/scan');
              }}
              style={styles.dropdownItem}
            >
              <ScanLine size={20} color={theme.colors.text.secondary} />
              <Text style={[styles.dropdownText, { color: theme.colors.text.secondary }]}>Escanear Ticket</Text>
            </Pressable>
          </View>
        )}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  menuTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  dropdown: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 60,
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  divider: {
    height: 1,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingTop: 20,
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
