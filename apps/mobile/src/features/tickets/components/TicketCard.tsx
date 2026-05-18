import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cpu, MapPin, Sparkles, Navigation } from 'lucide-react-native';
import { Ticket } from '../../../types/models/auth';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { useMapUIStore } from '../../map/store/useMapUIStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useRouter } from 'expo-router';
import { typography } from '../../../styles/typography';
import { normalizePOI } from '../../poi/adapters/poiAdapter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onCardPress?: () => void;
  isSelected?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = React.memo(
  ({ ticket, index = 0, onCardPress, isSelected = false }) => {
    const theme = useLatticeTheme();
    const router = useRouter();
    const triggerForceCenter = useMapUIStore((s) => s.triggerForceCenter);

    // Optimized Store Selectors
    const selectPoi = usePOIStore((s) => s.selectPoi);
    const setSelectedEvent = usePOIStore((s) => s.setSelectedEvent);
    const setPlanning = useNavigationStore((s) => s.setPlanning);

    const isVip = ticket.zoneName?.toLowerCase().includes('vip');
    const isTribuna =
      ticket.zoneName?.toLowerCase().includes('tribuna') ||
      ticket.zoneName?.toLowerCase().includes('grandstand');

    const handleGoToEvent = () => {
      const hasSpecificLocation =
        ticket.seatLocation?.coordinates &&
        (ticket.seatRow || ticket.seatNumber || isTribuna || isVip);

      // 1. Prepare Camera
      triggerForceCenter('list_click');

      // 2. Switch to Map
      router.replace('/(main)');

      // 3. Automation: Start Route Planning directly
      setPlanning(true);

      // 4. Set Target
      if (hasSpecificLocation && ticket.seatLocation) {
        console.log('[Ticket] Routing to SPECIFIC ZONE:', ticket.zoneName);

        // Create a virtual POI for the seat to ensure routing picks it up
        const seatPoi = normalizePOI({
          id: `ticket-${ticket.id}`,
          properties: {
            name: `${ticket.zoneName} - ${ticket.seatRow}${ticket.seatNumber}`,
            category: isVip ? 'vip' : 'seat',
            label: ticket.zoneName,
          },
          geometry: ticket.seatLocation,
        });

        selectPoi(seatPoi, false); // select but don't sync UI (we already set planning mode)
      } else if (ticket.eventId) {
        console.log('[Ticket] Routing to EVENT area:', ticket.eventName);
        setSelectedEvent(ticket.eventId, false); // same here
      }
    };

    // Modern Premium Gradients
    const gradientColors = isVip
      ? ['#0f0f0f', '#1a1a1a']
      : isTribuna
        ? ['#991B1B', '#7F1D1D']
        : ['#3730A3', '#312E81'];

    return (
      <Animated.View
        entering={FadeIn.delay(index * 50)}
        style={[styles.cardContainer, { backgroundColor: theme.colors.bg.main }]}
      >
        <TouchableOpacity activeOpacity={0.98} onPress={onCardPress} style={{ flex: 1 }}>
          <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Subtle Background Image of the Event */}
          <Image
            source={{
              uri:
                ticket.eventBanner ||
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            }}
            style={[StyleSheet.absoluteFill, { opacity: 0.15 }]}
            contentFit="cover"
          />

          <View style={styles.mainWrapper}>
            {/* Header with Go To Event Button */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.brandTitle}>LATTICE ELITE</Text>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {ticket.eventName || 'BARCELONA EVENT'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleGoToEvent}
                activeOpacity={0.8}
                style={[
                  styles.miniActionButton,
                  { backgroundColor: isVip ? '#FFD700' : 'rgba(255,255,255,0.15)' },
                ]}
              >
                <Navigation size={14} color={isVip ? '#000' : '#fff'} strokeWidth={2.5} />
                <Text style={[styles.miniActionText, { color: isVip ? '#000' : '#fff' }]}>GO</Text>
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.centerContent}>
              {isVip && (
                <View style={styles.vipBadge}>
                  <Sparkles size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.vipText}>VIP PASS</Text>
                </View>
              )}

              <View style={styles.zoneBox}>
                <Text style={styles.label}>ACCESS ZONE</Text>
                <Text style={styles.value} numberOfLines={1}>
                  {ticket.zoneName?.toUpperCase() || 'GENERAL ADMISSION'}
                </Text>
              </View>

              <View style={styles.grid}>
                <View style={styles.field}>
                  <Text style={styles.label}>GATE</Text>
                  <Text style={styles.subValue}>{ticket.gate || 'MAIN'}</Text>
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

            {/* Footer (QR Section when selected) */}
            {!isSelected ? (
              <View style={styles.footer}>
                <View style={styles.ticketMeta}>
                  <Text style={styles.ticketCode}>{ticket.code}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.ticketDate}>LATTICE TICKETING SYSTEM</Text>
                </View>
              </View>
            ) : (
              <Animated.View entering={FadeIn} style={styles.qrSection}>
                <View style={styles.qrContainer}>
                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.code}&color=1d1c1d`,
                    }}
                    style={styles.qrCode}
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.qrCodeText}>{ticket.code}</Text>
              </Animated.View>
            )}
          </View>

          {/* Abstract decoration */}
          <View style={styles.decorCircle} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

TicketCard.displayName = 'TicketCard';

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  mainWrapper: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 10,
    fontFamily: typography.primary.bold,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    color: '#fff',
    marginTop: 2,
  },
  miniActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  miniActionText: {
    fontSize: 11,
    fontFamily: typography.primary.bold,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: -8,
  },
  vipText: {
    color: '#FFD700',
    fontSize: 10,
    fontFamily: typography.primary.bold,
  },
  zoneBox: {
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontFamily: typography.primary.bold,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1.5,
  },
  value: {
    fontSize: 26,
    fontFamily: typography.primary.bold,
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  field: {
    flex: 1,
  },
  subValue: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    color: '#fff',
    marginTop: 2,
  },
  footer: {
    marginTop: 10,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketCode: {
    fontSize: 11,
    fontFamily: typography.primary.bold,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  ticketDate: {
    fontSize: 9,
    fontFamily: typography.primary.medium,
    color: 'rgba(255,255,255,0.2)',
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  qrSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 24,
    marginTop: 10,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  qrCode: {
    width: 120,
    height: 120,
  },
  qrCodeText: {
    marginTop: 12,
    fontSize: 10,
    fontFamily: typography.primary.bold,
    color: '#fff',
    opacity: 0.4,
    letterSpacing: 2,
  },
  decorCircle: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});
