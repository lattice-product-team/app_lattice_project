import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface Event {
  id: string;
  name: string;
  image?: string;
  date: string;
  location: string;
  rating?: number;
}

interface EventCarouselCardProps {
  event: Event;
  onPress?: () => void;
}

export const EventCarouselCard = ({ event, onPress }: EventCarouselCardProps) => {
  const theme = useAppTheme();

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
          {/* Background Image - Square & Rounded */}
          <Image 
            source={event.image} 
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          {/* Subtle Gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />

          {/* Rating Badge */}
          {event.rating && (
            <View style={styles.ratingBadge}>
              <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{event.rating}</Text>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>{event.name}</Text>
            <View style={styles.footer}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="calendar" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.infoText}>{event.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    width: 260,
    height: 280,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  container: {
    width: 260,
    height: 280, 
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 0.5, 
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexShrink: 0,
  },

  image: {
    width: 260,
    height: 280,
    borderRadius: 12, 
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: typography.primary.bold,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    color: 'white',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: typography.primary.medium,
    color: 'rgba(255,255,255,0.8)',
  },
});
