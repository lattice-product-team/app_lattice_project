import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { getCategoryMetadata } from '../../utils/poiUtils';
import { typography } from '../../styles/typography';
import { UIPOI } from '../../types/models/poi';
import * as Haptics from 'expo-haptics';
import { colors } from '../../styles/colors';
import { useLocationStore } from '../../store/useLocationStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 280);
const CARD_HEIGHT = 180;

// Utility to calculate distance in meters (Haversine simple)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

interface POICarouselCardProps {
  poi: UIPOI;
  onPress: () => void;
  index: number;
}

const POICarouselCard = ({ poi, onPress, index }: POICarouselCardProps) => {
  const userCoords = useLocationStore((s) => s.logicalCoords);
  const metadata = getCategoryMetadata(poi.category);
  const imageUrl = (poi.images && poi.images.length > 0) 
    ? poi.images[0] 
    : 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop';

  const distanceText = useMemo(() => {
    if (!userCoords || !poi.geometry?.coordinates) return null;
    const d = calculateDistance(
      userCoords[1], userCoords[0],
      poi.geometry.coordinates[1], poi.geometry.coordinates[0]
    );
    if (d >= 1000) return `${(d / 1000).toFixed(1)} km`;
    return `${Math.round(d)} m`;
  }, [userCoords, poi.geometry]);

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).duration(600)}
      style={styles.cardWrapper}
    >
      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }
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
            <View 
              style={[styles.categoryBadge, { backgroundColor: `${metadata.color}EE` }]}
            >
              <MaterialCommunityIcons name={metadata.icon as any} size={12} color="white" />
              <Text style={styles.categoryText}>{metadata.label.toUpperCase()}</Text>
            </View>
            
            {distanceText && (
              <View style={styles.distanceBadge}>
                <Feather name="navigation" size={10} color="white" />
                <Text style={styles.distanceText}>{distanceText}</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomInfo}>
            <Text style={styles.poiName} numberOfLines={1}>{poi.name}</Text>
            <View style={styles.detailsRow}>
              <View className="flex-row items-center">
                <View style={[styles.statusDot, { backgroundColor: '#32D74B' }]} />
                <Text style={styles.statusText}>Poca gente</Text>
              </View>
              <View style={styles.dot} />
              <Text style={styles.statusText}>Abierto</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

interface POICarouselProps {
  pois: UIPOI[];
  onSelectPoi: (poi: UIPOI) => void;
  title?: string;
}

export const POICarousel = ({ pois, onSelectPoi, title }: POICarouselProps) => {
  const userCoords = useLocationStore((s) => s.logicalCoords);
  
  const sortedPois = useMemo(() => {
    if (!userCoords || !pois) return pois;
    return [...pois].sort((a, b) => {
      const distA = calculateDistance(userCoords[1], userCoords[0], a.geometry.coordinates[1], a.geometry.coordinates[0]);
      const distB = calculateDistance(userCoords[1], userCoords[0], b.geometry.coordinates[1], b.geometry.coordinates[0]);
      return distA - distB;
    });
  }, [pois, userCoords]);

  if (!sortedPois || sortedPois.length === 0) return null;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.3)" />
        </View>
      )}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {sortedPois.map((poi, index) => (
          <POICarouselCard 
            key={poi.id} 
            poi={poi} 
            index={index}
            onPress={() => onSelectPoi(poi)} 
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    color: 'white',
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
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: 'white',
    fontSize: 18,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontFamily: typography.secondary.medium,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
