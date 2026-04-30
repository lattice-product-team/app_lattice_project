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
}

export const DiscoveryDashboard = ({ 
  islandState, 
  onSelectCategory,
}: DiscoveryDashboardProps) => {
  const theme = useAppTheme();

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
      display: opacity === 0 ? 'none' : 'flex',
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
                  backgroundColor: theme.colors.glass.subtle,
                  borderColor: theme.dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                  borderWidth: 1,
                }
              ]}>
                <MaterialCommunityIcons 
                  name={cat.icon} 
                  size={18} 
                  color={theme.colors.text.secondary} 
                />
                <Text style={[styles.categoryLabel, { color: theme.colors.text.secondary }]}>
                  {cat.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 2. Events Carousel */}
      <View style={styles.carouselSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.carouselScrollContainer}
          contentContainerStyle={styles.carouselScroll}
          snapToInterval={276} // 260 width + 16 gap
          decelerationRate="fast"
        >

          {[1, 2, 3].map((id) => (
            <EventCarouselCard 
              key={id}
              event={{
                id: String(id),
                name: id === 1 ? 'Música en el Parque' : id === 2 ? 'Fira Gastronòmica' : 'Exposición de Arte',
                type: id === 1 ? 'music' : id === 2 ? 'food' : 'generic',
                description: id === 1 ? 'Música en vivo y aire libre' : id === 2 ? 'Lo mejor de la cocina local' : 'Arte contemporáneo y diseño',
                date: 'Hoy, 20:00',
                location: 'Olesa de Montserrat',
                rating: 4.8,
                image: id === 1 
                  ? 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'
                  : id === 2 
                    ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
                    : 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac'
              }}
              onPress={() => console.log('Event pressed:', id)}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

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
    height: 300,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 10, // Bottom breathing room
  },
});



