import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLatticeTheme } from '../hooks/useLatticeTheme';
import { getCategoryMetadata } from '../utils/poiUtils';
import { UIPOI } from '../types/models/poi';
import { POIBadges } from './poi/POIBadges';
import { POIActions } from './poi/POIActions';
import { POIImageGallery } from './poi/POIImageGallery';

interface POICardProps {
  poi: UIPOI | null;
  onClose: () => void;
  onNavigate: () => void;
  onSelect: (id: number, coords: number[]) => void;
  noFloat?: boolean;
}

export const POICard = React.memo(function POICard({ poi, onClose, onNavigate, onSelect, noFloat }: POICardProps) {
  const theme = useLatticeTheme();
  if (!poi) return null;

  const metadata = getCategoryMetadata(poi.category);
  const showImages = ['grandstand', 'restaurant', 'shop'].includes(poi.category.toLowerCase());

  return (
    <Pressable
      onPress={() => onSelect(poi.id, poi.geometry.coordinates)}
      className={`rounded-3xl p-4 border border-white/10 shadow-2xl active:opacity-90 ${noFloat ? 'mb-4' : 'mx-4 mb-4'}`}
      style={[styles.card, !noFloat && styles.floating]}
      accessibilityLabel={`Point of interest: ${poi.name}`}
      accessibilityRole="button"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <POIBadges 
            category={poi.category}
            crowdLevel={poi.crowdLevel}
            isWheelchairAccessible={poi.isWheelchairAccessible}
            hasPriorityLane={poi.hasPriorityLane}
            icon={metadata.icon}
          />

          <Text className="text-white font-black text-lg mb-1">{poi.name}</Text>
          {poi.description ? (
            <Text className="text-muted text-xs leading-relaxed mb-2" numberOfLines={2}>
              {poi.description}
            </Text>
          ) : null}

          {poi.time || poi.distance ? (
            <View className="flex-row items-center">
              <Feather name="clock" size={14} color={theme.colors.text.muted} />
              <Text className="text-xs ml-1" style={{ color: theme.colors.text.muted }}>
                {poi.time ? `${poi.time} walk` : ''} {poi.distance ? `(${poi.distance})` : ''}
              </Text>
            </View>
          ) : null}
        </View>

      </View>

      {showImages && poi.images ? <POIImageGallery images={poi.images} /> : null}

      <POIActions onNavigate={onNavigate} />
    </Pressable>
  );
});

POICard.displayName = 'POICard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
  },
  floating: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
