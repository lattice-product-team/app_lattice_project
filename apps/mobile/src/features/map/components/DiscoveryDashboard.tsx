import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  Extrapolation,
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
  activeCategoryFilters?: string[];
  onSelectCategory?: (id: string) => void;
  onSelectEvent?: (event: LatticeEvent) => void;
  onClearFilters?: () => void;
}

export const DiscoveryDashboard = React.memo(
  ({ 
    islandState, 
    activeCategoryFilters = [], 
    onSelectCategory, 
    onSelectEvent,
    onClearFilters 
  }: DiscoveryDashboardProps) => {
    const theme = useAppTheme();
    const { events, loading: eventsLoading } = useSearchEvents(''); // Fetch all events for the dashboard

    const filteredEvents = useMemo(() => {
      if (activeCategoryFilters.length === 0) return events;
      
      // Map dashboard IDs to actual Event types/categories
      const eventMapping: Record<string, string[]> = {
        gastro: ['food', 'gastro', 'gastronomía'],
        sport: ['sports', 'sport', 'deporte'],
        music: ['music', 'música', 'concierto'],
        culture: ['culture', 'cultura', 'arte'],
        night: ['night', 'ocio', 'fiesta'],
      };

      return events.filter((event) => {
        return activeCategoryFilters.some((filterId) => {
          const mappedTypes = eventMapping[filterId] || [filterId];
          return mappedTypes.includes(event.type?.toLowerCase());
        });
      });
    }, [events, activeCategoryFilters]);

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
            {activeCategoryFilters.length > 0 && (
              <Pressable
                onPress={() => onClearFilters?.()}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                <View
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: theme.colors.brand.primary,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={18}
                    color="black"
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: 'black' },
                    ]}
                  >
                    Limpiar
                  </Text>
                </View>
              </Pressable>
            )}

            {CATEGORIES.map((cat) => {
              const isActive = activeCategoryFilters.includes(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => onSelectCategory?.(cat.id)}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isActive 
                          ? theme.colors.brand.primary 
                          : theme.colors.glass.tint === 'dark'
                            ? 'rgba(120, 120, 128, 0.36)'
                            : 'rgba(120, 120, 128, 0.12)',
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon}
                      size={18}
                      color={isActive 
                        ? 'black' 
                        : theme.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: isActive 
                          ? 'black' 
                          : theme.dark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Events Carousel */}
        <View style={styles.carouselSection}>
          {eventsLoading ? (
            <View style={[styles.carouselScrollContainer, { justifyContent: 'center' }]}>
              <Text style={{ color: theme.colors.text.muted, textAlign: 'center' }}>
                Cargando eventos...
              </Text>
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
              {filteredEvents.map((event) => (
                <EventCarouselCard
                  key={event.id}
                  event={event as any}
                  onPress={() => onSelectEvent?.(event as any)}
                />
              ))}
              {filteredEvents.length === 0 && (
                <Text style={{ color: theme.colors.text.muted, padding: 20 }}>
                  No hay eventos que coincidan con los filtros.
                </Text>
              )}
            </ScrollView>
          )}
        </View>
      </Animated.View>
    );
  }
);

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
    height: 260,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 25, // Ample room for shadows
  },
});
