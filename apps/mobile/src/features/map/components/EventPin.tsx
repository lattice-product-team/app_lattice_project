import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Animated, { 
  withSpring, 
  withTiming,
  withDelay,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { usePOIStore } from '../../poi/store/usePOIStore';

interface EventPinProps {
  id: string | number;
  name: string;
  imageUrl?: string;
  coordinates: number[];
  isSelected: boolean;
  onPress: () => void;
  zoom: SharedValue<number>;
}

export const EventPin = React.memo(({ 
  id,
  name, 
  imageUrl, 
  coordinates, 
  isSelected, 
  onPress,
  zoom
}: EventPinProps) => {
  const theme = useAppTheme();
  const activeFilters = usePOIStore(s => s.activeCategoryFilters);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const isDimmed = activeFilters.length > 0 && !isSelected;

  useEffect(() => {
    // Faster reveal, similar to the zoom-driven feel
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  React.useEffect(() => {
    scale.value = withSpring(isSelected ? 1.25 : 1, {
      damping: 12,
      stiffness: 100,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value * (isDimmed ? 0.4 : 1),
    zIndex: isSelected ? 1000 : 1,
  }));

  return (
    <MapLibreGL.MarkerView coordinate={coordinates}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.touchTarget} onTouchEnd={onPress}>
          {/* Main Pin Body */}
          <View style={[
            styles.pinWrapper, 
            { backgroundColor: theme.colors.bg.main, borderColor: '#FFFFFF' },
            isSelected && styles.selectedShadow
          ]}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* Pin Tail (Apple Style) */}
          {isSelected && (
            <View style={[styles.tail, { borderTopColor: '#FFFFFF' }]} />
          )}

          {/* Label */}
          <View style={styles.labelContainer}>
            <Text 
              style={[
                styles.label, 
                { 
                  color: theme.colors.text.primary,
                  textShadowColor: theme.colors.bg.main 
                }
              ]}
              numberOfLines={2}
            >
              {name.toUpperCase()}
            </Text>
          </View>
        </View>
      </Animated.View>
    </MapLibreGL.MarkerView>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120, // Wide enough for labels
  },
  touchTarget: {
    alignItems: 'center',
  },
  pinWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedShadow: {
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  tail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1, // Overlap slightly with circle
  },
  labelContainer: {
    marginTop: 4,
    maxWidth: 100,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
});
