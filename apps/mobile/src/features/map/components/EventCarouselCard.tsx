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
          styles.container,
          pressed && { transform: [{ scale: 0.97 }] }
        ]}
      >
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
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 4, // Space to avoid clipping shadow/border
  },
  container: {
    width: 240, // Perfect square
    height: 240, 
    borderRadius: 20, // Moderate rounding
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
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
    color: 'rgba(255,255,255,0.6)',
  },
});
