import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ticket } from '../../types/models/auth';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onCardPress?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, index = 0, onCardPress }) => {
  const theme = useLatticeTheme();
  const isTribuna = ticket.zoneName?.toLowerCase().includes('tribuna');
  
  // Premium gradient combinations
  const gradientColors = isTribuna 
    ? [theme.colors.brand.primary, theme.colors.brand.secondaryVariant] 
    : [theme.colors.brand.secondary, theme.colors.brand.primaryVariant]; 

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100)}
      style={[styles.cardContainer, { backgroundColor: theme.colors.bg.main }]}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onCardPress}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Top Glass Header */}
          <View style={[styles.glassHeader, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}>
            <View>
              <Text style={[styles.brandTitle, { color: theme.colors.text.inverse }]}>LATTICE</Text>
              <Text style={[styles.brandSub, { color: theme.colors.interactive.disabled }]}>LATTICE ELITE</Text>
            </View>
            <View style={[styles.chipContainer, { backgroundColor: theme.colors.overlay.thin }]}>
              <MaterialCommunityIcons name="integrated-circuit-chip" size={24} color={theme.colors.text.inverse} style={{ opacity: 0.7 }} />
            </View>
          </View>

          {/* Main Info Section */}
          <View style={styles.content}>
            <View style={styles.mainField}>
              <Text style={[styles.label, { color: theme.colors.interactive.disabled }]}>ZONE</Text>
              <Text style={[styles.value, { color: theme.colors.text.inverse }]}>{ticket.zoneName || 'General Admission'}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.interactive.disabled }]}>GATE</Text>
                <Text style={[styles.subValue, { color: theme.colors.text.inverse }]}>{ticket.gate || '03'}</Text>
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.interactive.disabled }]}>ROW</Text>
                <Text style={[styles.subValue, { color: theme.colors.text.inverse }]}>{ticket.seatRow || '—'}</Text>
              </View>
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.colors.interactive.disabled }]}>SEAT</Text>
                <Text style={[styles.subValue, { color: theme.colors.text.inverse }]}>{ticket.seatNumber || '—'}</Text>
              </View>
            </View>
          </View>

          {/* Bottom QR Section (Clean) */}
          <View style={[styles.footer, { backgroundColor: theme.colors.bg.surface }]}>
            <View style={[styles.qrWrapper, { backgroundColor: theme.colors.bg.surface }]}>
              <Image 
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.code}&color=1d1c1d` }}
                style={styles.qrCode}
                contentFit="contain"
              />
            </View>
            <View style={[styles.codeContainer, { backgroundColor: theme.colors.overlay.thin }]}>
              <Text style={[styles.ticketCode, { color: theme.colors.text.primary }]}>{ticket.code}</Text>
            </View>
          </View>

          {/* Abstract Decorations */}
          <View style={[styles.decorCircle, { backgroundColor: theme.colors.overlay.thin }]} />
          <View style={[styles.decorLines, { backgroundColor: theme.colors.overlay.thin }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  gradient: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    letterSpacing: 2,
    marginTop: 2,
  },
  content: {
    paddingVertical: 20,
  },
  mainField: {
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -0.5,
  },
  subValue: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
  },
  footer: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  qrWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCode: {
    width: 140,
    height: 140,
  },
  codeContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ticketCode: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 3,
    opacity: 0.6,
  },
  decorCircle: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  decorLines: {
    position: 'absolute',
    bottom: 240,
    left: -20,
    width: 100,
    height: 2,
    transform: [{ rotate: '45deg' }],
  }
});

