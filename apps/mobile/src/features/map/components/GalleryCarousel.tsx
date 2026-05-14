import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { typography } from '../../../styles/typography';
import { Text } from 'react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.7;

interface GalleryCarouselProps {
  images: string[];
}

export const GalleryCarousel = React.memo(({ images }: GalleryCarouselProps) => {
  const theme = useAppTheme();
  
  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.itemWrapper}>
            <Image
              source={{ uri: img }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-dominant"
              priority={index < 2 ? 'high' : 'normal'}
            />
          </View>
        ))}
        {/* End padding for better snapping of the last item */}
        <View style={{ width: 20 }} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  itemWrapper: {
    width: ITEM_WIDTH,
    aspectRatio: 1.2,
    borderRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
