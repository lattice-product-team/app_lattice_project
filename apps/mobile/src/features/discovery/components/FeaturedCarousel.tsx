import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { LatticeEvent } from '../../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface Props {
  events: LatticeEvent[];
  onPress: (event: LatticeEvent) => void;
}

export const FeaturedCarousel = React.memo(({ events, onPress }: Props) => {
  const theme = useAppTheme();

  return (
    <View className="mb-8">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
      >
        {events.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => onPress(event)}
            style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.15 }}
            className="rounded-[40px] overflow-hidden"
          >
            <Image
              source={{
                uri:
                  event.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
              }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={400}
            />

            {/* Top Overlay: Badge */}
            <View className="absolute top-5 left-5 right-5 flex-row justify-between items-start">
              <View className="bg-brand-primary px-4 py-1.5 rounded-full backdrop-blur-md flex-row items-center gap-1.5 shadow-sm">
                <View className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <Text
                  style={{
                    fontFamily: typography.primary.bold,
                    fontSize: 11,
                    color: '#fff',
                    letterSpacing: 0.5,
                  }}
                >
                  LIVE NOW
                </Text>
              </View>
            </View>

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '65%' }}
            />

            <View className="absolute bottom-0 left-0 right-0 p-8">
              <Text
                style={{
                  fontFamily: typography.primary.medium,
                  color: theme.colors.brand.primary,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                {event.subtitle || event.locationName || 'Live Event'}
              </Text>
              <Text
                style={{
                  fontFamily: typography.primary.bold,
                  color: '#fff',
                  fontSize: 28,
                  lineHeight: 32,
                  marginBottom: 20,
                }}
                numberOfLines={2}
              >
                {event.displayName || event.name}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center border border-white/20">
                    <Text style={{ fontSize: 14 }}>📅</Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: typography.primary.medium,
                      color: '#fff',
                      opacity: 0.8,
                      fontSize: 13,
                    }}
                  >
                    Hasta el{' '}
                    {new Date(event.endDate || '').toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>

                <View className="bg-white px-5 py-2.5 rounded-2xl shadow-lg">
                  <Text
                    style={{ fontFamily: typography.primary.bold, color: '#000', fontSize: 13 }}
                  >
                    Ver ahora
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});
