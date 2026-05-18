import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { getCategoryLabel, getEventMetadata, resolveBannerUrl } from '../../../utils/poiUtils';

interface Props {
  title: string;
  items: any[];
  onPress: (item: any) => void;
}

export const NearbyList = React.memo(({ title, items, onPress }: Props) => {
  const theme = useAppTheme();

  if (!items || items.length === 0) return null;

  return (
    <View className="mb-6 px-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text
          style={{
            fontFamily: typography.primary.bold,
            fontSize: 18,
            color: theme.colors.text.primary,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: typography.primary.medium,
            fontSize: 12,
            color: theme.colors.brand.primary, // Using brand primary for actions like VIEW MAP
          }}
        >
          VIEW MAP
        </Text>
      </View>

      <View className="flex-col gap-3">
        {items.map((item, index) => {
          const distanceText = item.distance ? `${(item.distance / 1000).toFixed(1)} km` : '';

          return (
            <Pressable
              key={`${item.id}-${index}`}
              onPress={() => onPress(item)}
              className="flex-row items-center p-3 rounded-2xl"
              style={{
                backgroundColor: theme.colors.glass.background,
                borderColor: theme.colors.glass.border,
                borderWidth: 1,
              }}
            >
              <Image
                source={{
                  uri: resolveBannerUrl(item.bannerUrl),
                }}
                style={{ width: 56, height: 56, borderRadius: 12, marginRight: 12 }}
                contentFit="cover"
              />
              <View className="flex-1 justify-center">
                <Text
                  style={{
                    fontFamily: typography.primary.bold,
                    fontSize: 16,
                    color: theme.colors.text.primary,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.primary.regular,
                    fontSize: 13,
                    color: theme.colors.text.muted,
                  }}
                  numberOfLines={1}
                >
                  {item.capacity !== undefined || item.currentOccupancy !== undefined
                    ? getCategoryLabel(item.type)
                    : getEventMetadata(item.type).label}
                </Text>
              </View>
              {distanceText ? (
                <View className="items-end justify-center">
                  <Text
                    style={{
                      fontFamily: typography.primary.medium,
                      fontSize: 14,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {distanceText}
                  </Text>
                  {item.status === 'open' && (
                    <Text
                      style={{
                        fontFamily: typography.primary.medium,
                        fontSize: 12,
                        color: theme.colors.status.success,
                      }}
                    >
                      Live
                    </Text>
                  )}
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
