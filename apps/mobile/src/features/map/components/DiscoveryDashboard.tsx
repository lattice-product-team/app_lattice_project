import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  SharedValue,
  Extrapolate
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
  { id: 'health', label: 'Salud', icon: 'heart-pulse' },
  { id: 'tech', label: 'Tech', icon: 'cpu' },
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
    const opacity = interpolate(
      islandState.value,
      [0.05, 0.3],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      display: islandState.value < 0.05 ? 'none' : 'flex',
    };
  });

  return (
    <Animated.View style={[styles.container, rContainerStyle]}>
      {/* 1. Categories Row (Carousel) - At the TOP */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          decelerationRate="fast"
          snapToAlignment="start"
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory?.(cat.id)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
              ]}
            >
              <View 
                style={[
                  styles.categoryButton, 
                  { 
                    backgroundColor: theme.colors.glass.tint === 'dark' 
                      ? 'rgba(120, 120, 128, 0.36)' 
                      : 'rgba(120, 120, 128, 0.12)',
                  }
                ]}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons 
                    name={cat.icon} 
                    size={18} 
                    color="rgba(255, 255, 255, 0.6)" 
                    style={styles.categoryIcon}
                  />
                  <Text style={[styles.categoryLabel, { color: 'rgba(255, 255, 255, 0.6)' }]}>
                    {cat.label}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}



        </ScrollView>
      </View>

      {/* 2. Events Carousel */}
      <View style={styles.carouselSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Próximos eventos
          </Text>
          <Pressable>
            <Text style={[styles.seeAll, { color: theme.colors.brand.primary }]}>Ver todos</Text>
          </Pressable>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
          snapToInterval={256} // 240 width + 16 gap
          decelerationRate="fast"
        >
          {[1, 2, 3].map((id) => (
            <EventCarouselCard 
              key={id}
              event={{
                id: String(id),
                name: id === 1 ? 'Música en el Parque' : id === 2 ? 'Fira Gastronòmica' : 'Exposición de Arte',
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
    paddingBottom: 20,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    minHeight: 38, // Slightly more compact
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    marginRight: 6,
    // Removal of manual marginTop for cleaner auto-alignment
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    includeFontPadding: false,
    lineHeight: 18, // Added lineHeight for stability
  },


  carouselSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
});

