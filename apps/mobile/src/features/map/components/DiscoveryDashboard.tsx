import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  SharedValue,
  Extrapolation
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { EventCarouselCard } from './EventCarouselCard';
import { useSearchEvents } from '../hooks/useSearchEvents';
import { LatticeEvent } from '../../../types';

interface Category {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'music', label: 'Música', icon: 'music' },
  { id: 'gastro', label: 'Gastro', icon: 'food' },
  { id: 'culture', label: 'Cultura', icon: 'palette' },
  { id: 'sport', label: 'Deporte', icon: 'run' },
  { id: 'night', label: 'Ocio', icon: 'weather-night' },
];

interface DiscoveryDashboardProps {
  islandState: SharedValue<number>;
  onSelectCategory?: (id: string) => void;
  onSelectEvent?: (event: LatticeEvent) => void;
}

export const DiscoveryDashboard = React.memo(({ 
  islandState, 
  onSelectCategory,
  onSelectEvent,
}: DiscoveryDashboardProps) => {
  const theme = useAppTheme();
  const { events, loading: eventsLoading } = useSearchEvents(''); // Fetch all events for the dashboard

  const rContainerStyle = useAnimatedStyle(() => {
    // Opacidad sube de 0 a 0.5 (Nivel 1 -> 2)
    // Opacidad baja de 0.5 a 0.6 (Nivel 2 -> 3)
    const opacity = interpolate(
      islandState.value,
      [0.05, 0.3, 0.5, 0.6],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      pointerEvents: opacity < 0.1 ? 'none' : 'auto',
    };
  });

  return (
    <Animated.View style={[styles.container, rContainerStyle]}>
      {/* 1. Categories Row (Carousel) */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory?.(cat.id)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
              ]}
            >
              <View style={[
                styles.categoryPill,
                { 
                  backgroundColor: theme.colors.glass.tint === 'dark' 
                    ? 'rgba(120, 120, 128, 0.36)' 
                    : 'rgba(120, 120, 128, 0.12)',
                }
              ]}>
                <MaterialCommunityIcons 
                  name={cat.icon} 
                  size={18} 
                  color={theme.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'} 
                />
                <Text style={[styles.categoryLabel, { color: theme.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }]}>
                  {cat.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 2. Events Carousel */}
      <View style={styles.carouselSection}>
        {eventsLoading ? (
          <View style={[styles.carouselScrollContainer, { justifyContent: 'center' }]}>
            <Text style={{ color: theme.colors.text.muted, textAlign: 'center' }}>Cargando eventos...</Text>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.carouselScrollContainer}
            contentContainerStyle={styles.carouselScroll}
            snapToInterval={276} // 260 width + 16 gap
            decelerationRate="fast"
          >
            {events.map((event) => (
              <EventCarouselCard 
                key={event.id}
                event={event as any}
                onPress={() => onSelectEvent?.(event as any)}
              />
            ))}
            {events.length === 0 && (
              <Text style={{ color: theme.colors.text.muted, padding: 20 }}>No hay eventos programados hoy.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    minHeight: 40,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    includeFontPadding: false,
  },
  carouselSection: {
    gap: 16,
  },
  carouselScrollContainer: {
    height: 320,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 25, // Ample room for shadows
  },
});
