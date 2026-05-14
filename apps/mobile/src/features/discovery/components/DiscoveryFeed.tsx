import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, View, Text, InteractionManager } from 'react-native';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { FeaturedCarousel } from './FeaturedCarousel';
import { CategoryChips } from './CategoryChips';
import { BentoGrid } from './BentoGrid';
import { NearbyList } from './NearbyList';
import { useAppTheme } from '../../../hooks/useAppTheme';

interface Props {
  onItemPress: (item: any) => void;
}

export function DiscoveryFeed({ onItemPress }: Props) {
  const { data: feed, isLoading, refetch, isRefetching } = useDiscovery();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isReady, setIsReady] = useState(false);
  const theme = useAppTheme();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if ((isLoading && !feed) || !isReady) {
    // Basic skeleton loading state
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ height: 300, borderRadius: 32, backgroundColor: theme.colors.glass.background, marginBottom: 24 }} />
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.glass.background }} />
          ))}
        </View>
        <View style={{ height: 200, borderRadius: 24, backgroundColor: theme.colors.glass.background }} />
      </View>
    );
  }

  if (!feed || !feed.sections) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.muted }}>No discovery data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={theme.colors.text.primary}
        />
      }
    >
      {feed.sections.map((section, index) => {
        switch (section.type) {
          case 'featured':
            return (
              <FeaturedCarousel
                key={index}
                events={section.items}
                onPress={onItemPress}
              />
            );
          case 'categories':
            return (
              <CategoryChips
                key={index}
                categories={section.items}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            );
          case 'trending':
            return (
              <BentoGrid
                key={index}
                title={section.title || 'Trending'}
                items={section.items}
                onPress={onItemPress}
              />
            );
          case 'nearby':
            return (
              <NearbyList
                key={index}
                title={section.title || 'Nearby'}
                items={section.items}
                onPress={onItemPress}
              />
            );
          default:
            return null;
        }
      })}
    </ScrollView>
  );
}
