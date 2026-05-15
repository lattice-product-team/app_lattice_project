import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable as NativePressable, Dimensions } from 'react-native';
import { Pressable as GHPressable } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { Navigation, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { typography } from '../../../styles/typography';
import { StandardUIPOI as UIPOI } from '../../../types/models/poi';
import * as Haptics from 'expo-haptics';
import { useLocationStore } from '../../../store/useLocationStore';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { useMapUIStore } from '../store/useMapUIStore';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { calculateDistance, formatDistance } from '../../../utils/geoUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 280);
const CARD_HEIGHT = 180;

const Pressable = Platform.OS === 'android' ? NativePressable : GHPressable;

interface POICarouselCardProps {
  poi: UIPOI;
  onPress: () => void;
  index: number;
}

const POICarouselCard = ({ poi, onPress, index }: POICarouselCardProps) => {
  const theme = useLatticeTheme();
  const logicalCoords = useLocationStore((s) => s.logicalCoords);
  const discoveryLocation = useMapUIStore((s) => s.discoveryLocation);
  
  const userCoords = discoveryLocation || logicalCoords;

  const metadata = getCategoryMetadata(poi.category);
  const CategoryIcon = metadata.icon;
  const imageUrl =
    poi.images && poi.images.length > 0
      ? poi.images[0]
      : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop';

  const distanceText = useMemo(() => {
    if (!userCoords || !poi.coordinates) return null;
    const d = calculateDistance(
      userCoords[1],
      userCoords[0],
      poi.coordinates[1],
      poi.coordinates[0]
    );
    return formatDistance(d);
  }, [userCoords, poi.coordinates]);

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.colors.bg.elevation,
            borderColor: theme.colors.glass.border,
          },
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
            <View style={[styles.categoryBadge, { backgroundColor: `${metadata.color}EE` }]}>
              <CategoryIcon size={12} color="white" strokeWidth={2.5} />
              <Text style={styles.categoryText}>{metadata.label.toUpperCase()}</Text>
            </View>

            {distanceText && (
              <View
                style={[
                  styles.distanceBadge,
                  {
                    backgroundColor: theme.colors.overlay.modal,
                    borderColor: theme.colors.glass.border,
                  },
                ]}
              >
                <Navigation size={10} color="white" strokeWidth={2.5} />
                <Text style={styles.distanceText}>{distanceText}</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomInfo}>
            <Text style={[styles.poiName, { color: 'white' }]} numberOfLines={1}>
              {poi.displayName}
            </Text>
            <View style={styles.detailsRow}>
              <View style={styles.statusWrapper}>
                <View
                  style={[styles.statusDot, { backgroundColor: theme.colors.status.success }]}
                />
                <Text style={[styles.statusText, { color: 'rgba(255,255,255,0.7)' }]}>
                  Poca gente
                </Text>
              </View>
              <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              <Text style={[styles.statusText, { color: 'rgba(255,255,255,0.7)' }]}>Abierto</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

interface POICarouselProps {
  pois: UIPOI[];
  onSelectPoi: (poi: UIPOI) => void;
  title?: string;
}

export const POICarousel = ({ pois, onSelectPoi, title }: POICarouselProps) => {
  const theme = useLatticeTheme();
  const logicalCoords = useLocationStore((s) => s.logicalCoords);
  const discoveryLocation = useMapUIStore((s) => s.discoveryLocation);
  
  const userCoords = discoveryLocation || logicalCoords;

  const sortedPois = useMemo(() => {
    if (!userCoords || !pois) return pois;
    return [...pois].sort((a, b) => {
      const distA = calculateDistance(
        userCoords[1],
        userCoords[0],
        a.coordinates[1],
        a.coordinates[0]
      );
      const distB = calculateDistance(
        userCoords[1],
        userCoords[0],
        b.coordinates[1],
        b.coordinates[0]
      );
      return distA - distB;
    });
  }, [pois, userCoords]);

  if (!sortedPois || sortedPois.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
          <ChevronRight size={16} color={theme.colors.text.muted} strokeWidth={2.2} />
        </View>
      )}
      <GestureDetector gesture={Gesture.Native()}>
        <ScrollView
          horizontal
          style={{ height: 180 }}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
        >
          {sortedPois.map((poi, index) => (
            <POICarouselCard key={poi.id} poi={poi} index={index} onPress={() => onSelectPoi(poi)} />
          ))}
        </ScrollView>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    minHeight: 220, // Prevents bottom sheet from squashing the carousel
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 4, // 20 - 16 (gap)
    flexDirection: 'row',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    aspectRatio: 1.5,
    marginRight: 16,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 9,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
  },
  distanceText: {
    color: 'white',
    fontSize: 10,
    fontFamily: typography.secondary.bold,
  },
  bottomInfo: {
    gap: 2,
  },
  poiName: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: typography.secondary.medium,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
