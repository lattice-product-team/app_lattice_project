import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Star, StarHalf, Quote, ExternalLink } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface ReviewSectionProps {
  rating: number;
  reviewsCount: number;
  snippets: string[];
  sourceUrl?: string;
}

export const ReviewSection = ({ rating, reviewsCount, snippets, sourceUrl }: ReviewSectionProps) => {
  const theme = useAppTheme();

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= score) {
        stars.push(<Star key={i} size={16} color="#FFD700" fill="#FFD700" />);
      } else if (i - 0.5 <= score) {
        stars.push(<StarHalf key={i} size={16} color="#FFD700" fill="#FFD700" />);
      } else {
        stars.push(<Star key={i} size={16} color="#FFD700" />);
      }
    }
    return stars;
  };

  if (snippets.length === 0 && rating === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ratingRow}>
          <Text style={[styles.ratingText, { color: theme.colors.text.primary }]}>
            {rating.toFixed(1)}
          </Text>
          <View style={styles.stars}>{renderStars(rating)}</View>
          <Text style={[styles.countText, { color: theme.colors.text.muted }]}>
            ({reviewsCount.toLocaleString()})
          </Text>
        </View>
        {sourceUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(sourceUrl)}>
            <ExternalLink size={20} color="#00AF87" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.snippets}>
        {snippets.slice(0, 3).map((text, index) => (
          <View key={index} style={styles.snippetItem}>
            <Quote size={16} color="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.1)" />
            <Text style={[styles.snippetText, { color: 'rgba(255,255,255,0.8)' }]} numberOfLines={2}>
              {text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  countText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  snippets: {
    gap: 12,
  },
  snippetItem: {
    flexDirection: 'row',
    gap: 8,
  },
  snippetText: {
    fontSize: 14,
    fontFamily: typography.primary.regular,
    lineHeight: 20,
    flex: 1,
    fontStyle: 'italic',
  },
});
