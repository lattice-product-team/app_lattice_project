import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { typography } from '../../../styles/typography';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

interface GuidesSectionProps {
  onSelectMarker: (coords: [number, number], id: number) => void;
  onSeeAll?: () => void;
}

export const GuidesSection = ({ onSelectMarker, onSeeAll }: GuidesSectionProps) => {
  const { data: savedData, isLoading } = useSavedLocations();
  const theme = useLatticeTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.brand.primary} />
      </View>
    );
  }

  const hasSaved = savedData?.features && savedData.features.length > 0;

  if (!hasSaved) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Tus Marcadores
        </Text>
        <Pressable onPress={onSeeAll} style={styles.seeAllBtn}>
          <Text style={[styles.seeAllText, { color: theme.colors.brand.primary }]}>Ver todos</Text>
        </Pressable>
      </View>

      <View style={styles.savedList}>
        {savedData.features.slice(0, 3).map((f: any) => (
          <Pressable
            key={f.properties.id}
            style={[
              styles.savedItem,
              {
                backgroundColor: theme.colors.glass.subtle,
                borderColor: theme.colors.glass.subtleBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => onSelectMarker(f.geometry.coordinates, f.properties.id)}
          >
            <View style={styles.savedIconCircle}>
              <Star size={16} color="#FFD60A" fill="#FFD60A" strokeWidth={2.2} />
            </View>
            <Text
              style={[styles.savedLabel, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {f.properties.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  seeAllBtn: {
    padding: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: typography.secondary.bold,
  },
  loadingContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedList: {
    gap: 8,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  savedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 214, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedLabel: {
    fontSize: 14,
    fontFamily: typography.secondary.medium,
    flex: 1,
  },
});
