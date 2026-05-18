import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { resolveBannerUrl } from '../../../utils/poiUtils';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 12;
const TOTAL_WIDTH = width - GRID_PADDING * 2;
const HALF_WIDTH = (TOTAL_WIDTH - GRID_GAP) / 2;

interface Props {
  title: string;
  items: any[];
  onPress: (item: any) => void;
}

export const BentoGrid = React.memo(({ title, items, onPress }: Props) => {
  const theme = useAppTheme();

  if (!items || items.length === 0) return null;

  return (
    <View className="mb-6 px-5">
      <Text
        style={{
          fontFamily: typography.primary.bold,
          fontSize: 18,
          color: theme.colors.text.primary,
          marginBottom: 16,
        }}
      >
        {title}
      </Text>

      <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
        {items.slice(0, 4).map((item, index) => {
          // Asymmetrical layout: First item is wide, next two are half width
          const isWide = index === 0;
          const cardWidth = isWide ? TOTAL_WIDTH : HALF_WIDTH;
          const cardHeight = isWide ? 160 : 180;

          return (
            <Pressable
              key={`${item.id}-${index}`}
              onPress={() => onPress(item)}
              style={{ width: cardWidth, height: cardHeight, borderRadius: 24, overflow: 'hidden' }}
            >
              <Image
                source={{
                  uri: resolveBannerUrl(item.bannerUrl),
                }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' }}
              />

              {/* HOT Badge for Trending */}
              {item.isTrending && (
                <View className="absolute top-3 right-3 bg-white/20 px-2 py-1 rounded-md backdrop-blur-md">
                  <Text
                    style={{ fontFamily: typography.primary.bold, fontSize: 10, color: '#fff' }}
                  >
                    HOT
                  </Text>
                </View>
              )}

              <View className="absolute bottom-0 left-0 right-0 p-4">
                {item.metadata?.social?.rating && (
                  <View className="flex-row items-center gap-1 mb-1">
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <Text
                      style={{
                        fontFamily: typography.primary.medium,
                        color: '#FBBF24',
                        fontSize: 12,
                      }}
                    >
                      {item.metadata.social.rating}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    fontFamily: typography.primary.bold,
                    color: '#fff',
                    fontSize: isWide ? 18 : 16,
                  }}
                  numberOfLines={1}
                >
                  {item.displayName || item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.primary.regular,
                    color: '#fff',
                    opacity: 0.7,
                    fontSize: 12,
                  }}
                  numberOfLines={1}
                >
                  {item.subtitle || item.locationName || item.address || item.type}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
