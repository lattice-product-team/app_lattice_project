import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { getEventMetadata } from '../../../utils/poiUtils';

interface Event {
  id: string | number;
  name: string;
  image?: string;
  imageUrl?: string;
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
  const metadata = getEventMetadata(event.type);

  const formattedDate = React.useMemo(() => {
    if (event.date) return event.date;
    if (!event.startDate) return 'Hoy';
    
    const date = new Date(event.startDate);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (isToday) return `Hoy, ${timeStr}`;
    
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' }) + `, ${timeStr}`;
  }, [event.date, event.startDate]);

  return (
    <View style={styles.shadowWrapper}>
      <Pressable 
        onPress={onPress}
        style={({ pressed }) => [
          { width: 260, height: 280 },
          pressed && { transform: [{ scale: 0.97 }] }
        ]}
      >
        <View style={styles.container}>
          {/* Background Image */}
          <Image 
            source={event.image || event.imageUrl} 
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          {/* Top Row for Badges */}
          <View style={styles.topRow}>
            <View style={[styles.badge, styles.categoryBadge]}>
              <MaterialCommunityIcons name={metadata.icon as any} size={14} color="white" />
              <Text style={styles.categoryLabel}>{metadata.label.toUpperCase()}</Text>
            </View>

            {event.rating && (
              <View style={[styles.badge, styles.ratingBadge]}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{event.rating}</Text>
              </View>
            )}
          </View>

          {/* Info Footer - Blurred/Semi-transparent for Apple look */}
          <View style={[styles.footer, { backgroundColor: theme.colors.glass.background, borderColor: theme.colors.glass.border }]}>
            <View style={styles.footerContent}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={1}>{event.name}</Text>
              
              {event.description && (
                <Text style={[styles.description, { color: theme.colors.text.secondary }]} numberOfLines={1}>
                  {event.description}
                </Text>
              )}

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Feather name="calendar" size={11} color={theme.colors.text.muted} />
                  <Text style={[styles.detailText, { color: theme.colors.text.muted }]}>{formattedDate}</Text>
                </View>
                <View style={styles.detailSeparator} />
                <View style={styles.detailItem}>
                  <Feather name="map-pin" size={11} color={theme.colors.text.muted} />
                  <Text style={[styles.detailText, { color: theme.colors.text.muted }]}>{event.location || 'Barcelona'}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Border Overlay - Ensures sharp edges on rounded corners */}
          <View 
            pointerEvents="none" 
            style={[
              StyleSheet.absoluteFill, 
              styles.borderOverlay,
              { borderColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)' }
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
    height: 280,
    marginRight: 16,
  },
  container: {
    width: 260,
    height: 280, 
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
    height: 280,
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
