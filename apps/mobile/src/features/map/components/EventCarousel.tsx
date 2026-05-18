import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ScrollView, Pressable } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getEventMetadata } from '../../../utils/poiUtils';
import { typography } from '../../../styles/typography';
import { LatticeEvent } from '../../../types';
import * as Haptics from 'expo-haptics';
import { useMapUIStore } from '../store/useMapUIStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 280);
const CARD_HEIGHT = 180;

interface EventCarouselLegacyCardProps {
  event: LatticeEvent;
  onPress: () => void;
  index: number;
}

const EventCarouselLegacyCard = ({ event, onPress, index }: EventCarouselLegacyCardProps) => {
  const metadata = getEventMetadata(event.type);
  const CategoryIcon = metadata.icon;
  const imageUrl =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop';

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(600)}
      style={styles.cardWrapper}
    >
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
        ]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.overlay} />

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={[styles.categoryBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <CategoryIcon size={12} color="white" strokeWidth={2.5} />
              <Text style={styles.categoryText}>{metadata.label.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.eventName} numberOfLines={1}>
              {event.name}
            </Text>
            <Text style={styles.dateText}>{event.startDate || 'Coming Soon'}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

interface EventCarouselProps {
  events: LatticeEvent[];
  onSelectEvent: (event: LatticeEvent) => void;
  title?: string;
}

export const EventCarousel = ({ events, onSelectEvent, title }: EventCarouselProps) => {
  const triggerForceCenter = useMapUIStore((s) => s.triggerForceCenter);
  if (!events || events.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event, index) => (
          <EventCarouselLegacyCard
            key={event.id}
            event={event}
            index={index}
            onPress={() => {
              triggerForceCenter('list_click');
              onSelectEvent(event);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 4,
    flexDirection: 'row',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 16,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.primary.bold,
    letterSpacing: 1,
  },
  bottomInfo: {
    gap: 2,
  },
  eventName: {
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: typography.secondary.medium,
  },
});
