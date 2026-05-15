import React from 'react';
import { View, StyleSheet, Text, Platform, Pressable as NativePressable } from 'react-native';
import { Pressable as GHPressable } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { 
  Star, 
  Calendar, 
  MapPin 
} from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { getEventMetadata } from '../../../utils/poiUtils';
import { useLocationStore } from '../../../store/useLocationStore';
import { useMapUIStore } from '../store/useMapUIStore';
import { useMemo } from 'react';

// Utility to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Pressable = Platform.OS === 'android' ? NativePressable : GHPressable;

interface Event {
  id: string | number;
  name: string;
  image?: string;
  bannerUrl?: string;
  date?: string;
  startDate?: string;
  location?: string;
  rating?: number;
  type?: string;
  description?: string;
}

interface EventCarouselCardProps {
  event: Event;
  onPress?: () => void;
}

export const EventCarouselCard = React.memo(({ event, onPress }: EventCarouselCardProps) => {
  const theme = useAppTheme();
  const logicalCoords = useLocationStore((s) => s.logicalCoords);
  const discoveryLocation = useMapUIStore((s) => s.discoveryLocation);
  
  const userCoords = discoveryLocation || logicalCoords;

  const metadata = getEventMetadata(event.type);
  const CategoryIcon = metadata.icon;

  const formattedDate = useMemo(() => {
    if (event.date) return event.date;
    if (!event.startDate) return 'Hoy';

    const date = new Date(event.startDate);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (isToday) return `Hoy, ${timeStr}`;

    return date.toLocaleDateString([], { day: '2-digit', month: 'short' }) + `, ${timeStr}`;
  }, [event.date, event.startDate]);

  const { distanceText, durationText } = useMemo(() => {
    if (!userCoords || !event.center?.coordinates) return { distanceText: null, durationText: null };
    
    const d = calculateDistance(
      userCoords[1],
      userCoords[0],
      event.center.coordinates[1],
      event.center.coordinates[0]
    );

    let dText = '';
    if (d >= 1000) dText = `${(d / 1000).toFixed(1)} km`;
    else dText = `${Math.round(d)} m`;

    // Estimate walking time (5km/h = 1.38m/s)
    const mins = Math.round(d / 1.38 / 60);
    const durText = mins < 1 ? '< 1 min' : `${mins} min`;

    return { distanceText: dText, durationText: durText };
  }, [userCoords, event.center?.coordinates]);

  return (
    <View style={styles.shadowWrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { width: 260, height: 220 },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={styles.container}>
          {/* Background Image */}
          <Image
            source={event.image || event.bannerUrl}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Top Row for Badges */}
          <View style={styles.topRow}>
            <View style={[styles.badge, styles.categoryBadge]}>
              <CategoryIcon size={14} color="white" strokeWidth={2.5} />
              <Text style={styles.categoryLabel}>{metadata.label.toUpperCase()}</Text>
            </View>

            {event.rating && (
              <View style={[styles.badge, styles.ratingBadge]}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{event.rating}</Text>
              </View>
            )}
          </View>

          {/* Info Footer - Blurred/Semi-transparent for Apple look */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: theme.colors.glass.background,
                borderColor: theme.colors.glass.border,
              },
            ]}
          >
            <View style={styles.footerContent}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={1}>
                {event.name}
              </Text>

              {event.description && (
                <Text
                  style={[styles.description, { color: theme.colors.text.secondary }]}
                  numberOfLines={1}
                >
                  {event.description}
                </Text>
              )}

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Calendar size={11} color={theme.colors.text.muted} strokeWidth={2.2} />
                  <Text style={[styles.detailText, { color: theme.colors.text.muted }]}>
                    {formattedDate}
                  </Text>
                </View>
                
                {distanceText && (
                  <>
                    <View style={styles.detailSeparator} />
                    <View style={styles.detailItem}>
                      <MapPin size={11} color={theme.colors.text.muted} strokeWidth={2.2} />
                      <Text style={[styles.detailText, { color: theme.colors.text.muted }]}>
                        {distanceText} • {durationText}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Border Overlay - Ensures sharp edges on rounded corners */}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.borderOverlay,
              { borderColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)' },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  shadowWrapper: {
    width: 260,
    height: 220,
    marginRight: 16,
  },
  container: {
    width: 260,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    // Border moved to overlay
  },
  borderOverlay: {
    borderRadius: 24,
    borderWidth: 1,
  },
  image: {
    width: 260,
    height: 220,
    position: 'absolute',
  },
  topRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryBadge: {},
  categoryLabel: {
    fontSize: 10,
    fontFamily: typography.primary.bold,
    color: 'white',
    letterSpacing: 0.6,
  },
  ratingBadge: {},
  ratingText: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  footerContent: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    fontFamily: typography.primary.medium,
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    fontFamily: typography.primary.bold,
  },
  detailSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
