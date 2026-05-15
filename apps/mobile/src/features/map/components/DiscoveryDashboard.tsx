import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { ScrollView, Pressable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  Extrapolation,
} from 'react-native-reanimated';
import { LucideIcon, Info, Utensils, Car, Bus, Shield } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { semanticColors } from '../../../styles/semanticColors';
import { EventCarouselCard } from './EventCarouselCard';
import { useSearchEvents } from '../hooks/useSearchEvents';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { LatticeEvent } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

const CATEGORIES: Category[] = [
  { id: 'services', label: 'Info', icon: Info },
  { id: 'gastro', label: 'Comida', icon: Utensils },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'transport', label: 'Bus', icon: Bus },
  { id: 'emergency', label: 'Seguridad', icon: Shield },
];

interface DiscoveryDashboardProps {
  islandState: SharedValue<number>;
  onSelectCategory?: (id: string) => void;
  onSelectEvent?: (event: LatticeEvent) => void;
}

export const DiscoveryDashboard = React.memo(
  ({
    islandState,
    onSelectCategory,
    onSelectEvent,
  }: DiscoveryDashboardProps) => {
    const theme = useAppTheme();
    const { activeCategoryFilters, toggleCategoryFilter } = usePOIStore();
    const { events: allEvents, loading: eventsLoading } = useSearchEvents('');

    const filteredEvents = useMemo(() => {
      if (activeCategoryFilters.length === 0) return allEvents;

      const categoryMap: Record<string, string[]> = {
        services: ['services', 'info', 'toilet', 'wc', 'utility'],
        gastro: ['food', 'restaurant', 'gastro', 'bar', 'cafe'],
        parking: ['parking', 'garage', 'transport'],
        transport: ['transport', 'bus', 'train', 'shuttle'],
        emergency: ['emergency', 'medical', 'security', 'police'],
      };

      return allEvents.filter((event) => {
        return activeCategoryFilters.some((filterId: string) => {
          const matchedTypes = categoryMap[filterId] || [filterId];
          return matchedTypes.includes(event.type.toLowerCase());
        });
      });
    }, [allEvents, activeCategoryFilters]);

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
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategoryFilters.includes(cat.id);
              const activeColor =
                (semanticColors.categories as any)[cat.id === 'gastro' ? 'food' : cat.id] ||
                theme.colors.brand.primary;

              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (onSelectCategory) {
                      onSelectCategory(cat.id);
                    } else {
                      toggleCategoryFilter(cat.id);
                    }
                  }}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
                  ]}
                >
                  <View
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected
                          ? activeColor
                          : theme.colors.glass.tint === 'dark'
                            ? 'rgba(120, 120, 128, 0.36)'
                            : 'rgba(120, 120, 128, 0.12)',
                        borderWidth: 1.5,
                        borderColor: isSelected ? 'rgba(255,255,255,0.3)' : 'transparent',
                      },
                    ]}
                  >
                    <Icon
                      size={18}
                      color={
                        isSelected
                          ? '#FFFFFF'
                          : theme.dark
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.6)'
                      }
                      strokeWidth={isSelected ? 3 : 2.5}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : theme.dark
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.6)',
                        },
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
                <View
                  style={{
                    width: SCREEN_WIDTH - 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.text.muted,
                      padding: 20,
                      textAlign: 'center',
                      fontFamily: typography.primary.medium,
                    }}
                  >
                    No hay eventos de esta categoría hoy.
                  </Text>
                </View>
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
