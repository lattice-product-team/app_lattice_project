import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ticket } from '../../types/models/auth';
import { colors } from '../../styles/colors';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onCardPress?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, index = 0, onCardPress }) => {
  const isTribuna = ticket.zoneName?.toLowerCase().includes('tribuna');
  
  // Premium gradient combinations
  const gradientColors = isTribuna 
    ? [colors.primary, '#5C4A54'] // Magic Gem variant
    : [colors.secondary, '#4D4B4C']; // Boat Anchor variant

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100)}
      style={styles.cardContainer}
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
          <View style={styles.glassHeader}>
            <View>
              <Text style={styles.brandTitle}>LATTICE</Text>
              <Text style={styles.brandSub}>LATTICE ELITE</Text>
            </View>
            <View style={styles.chipContainer}>
              <MaterialCommunityIcons name="integrated-circuit-chip" size={24} color="rgba(255,255,255,0.7)" />
            </View>
          </View>

          {/* Main Info Section */}
          <View style={styles.content}>
            <View style={styles.mainField}>
              <Text style={styles.label}>ZONE</Text>
              <Text style={styles.value}>{ticket.zoneName || 'General Admission'}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>GATE</Text>
                <Text style={styles.subValue}>{ticket.gate || '03'}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>ROW</Text>
                <Text style={styles.subValue}>{ticket.seatRow || '—'}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>SEAT</Text>
                <Text style={styles.subValue}>{ticket.seatNumber || '—'}</Text>
              </View>
            </View>
          </View>

          {/* Bottom QR Section (Clean) */}
          <View style={styles.footer}>
            <View style={styles.qrWrapper}>
              <Image 
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.code}&color=1d1c1d` }}
                style={styles.qrCode}
                contentFit="contain"
              />
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.ticketCode}>{ticket.code}</Text>
            </View>
          </View>

          {/* Abstract Decorations */}
          <View style={styles.decorCircle} />
          <View style={styles.decorLines} />
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
    backgroundColor: colors.background,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    letterSpacing: 1,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.5)',
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
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  value: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -0.5,
  },
  subValue: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
  },
  footer: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  qrWrapper: {
    width: 160,
    height: 160,
    backgroundColor: '#FFF',
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
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  ticketCode: {
    color: colors.background,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorLines: {
    position: 'absolute',
    bottom: 240,
    left: -20,
    width: 100,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '45deg' }],
  }
});
