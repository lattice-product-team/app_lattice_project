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
    <View className="mb-6">
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
            style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2 }}
            className="rounded-[32px] overflow-hidden"
          >
            <Image
              source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30' }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' }}
            />
            <View className="absolute bottom-0 left-0 right-0 p-5">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="px-2.5 py-1 rounded-full bg-yellow-400">
                  <Text style={{ fontFamily: typography.primary.bold, fontSize: 10, color: '#000' }}>
                    LIVE
                  </Text>
                </View>
                <Text style={{ fontFamily: typography.primary.medium, color: '#fff', opacity: 0.8, fontSize: 12 }}>
                  {new Date(event.startDate || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View className="flex-row items-center gap-1 ml-auto">
                  <Star size={14} color="#FACC15" fill="#FACC15" />
                  <Text style={{ fontFamily: typography.primary.bold, color: '#FACC15', fontSize: 12 }}>
                    {((event as any).metadata?.social?.rating || 4.5 + Math.random() * 0.5).toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontFamily: typography.primary.bold, color: '#fff', fontSize: 24, marginBottom: 4 }}
                numberOfLines={2}
              >
                {event.name}
              </Text>
              <Text
                style={{ fontFamily: typography.primary.regular, color: '#fff', opacity: 0.7, fontSize: 14, marginBottom: 12 }}
                numberOfLines={1}
              >
                {event.locationName || 'Downtown Area'}
              </Text>
              <Pressable
                onPress={() => onPress(event)}
                className="bg-yellow-400 py-3 rounded-2xl items-center justify-center"
              >
                <Text style={{ fontFamily: typography.primary.bold, color: '#000', fontSize: 14 }}>
                  CONSULTA MÁS DETALLES
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});
