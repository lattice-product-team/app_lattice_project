import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, View, Text, InteractionManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiscovery } from '../../../hooks/useDiscovery';
import { FeaturedCarousel } from './FeaturedCarousel';
import { CategoryChips } from './CategoryChips';
import { BentoGrid } from './BentoGrid';
import { NearbyList } from './NearbyList';
import { useAppTheme } from '../../../providers/ThemeProvider';
import { useAuthStore } from '../../../store/useAuthStore';
import { typography } from '../../../styles/typography';
import { LatticeTheme } from '../../../styles/theme';

const TitleTranslations: Record<string, string> = {
  'Featured Experiences': 'Experiencias Destacadas',
  'Trending Right Now': 'Tendencias del Momento',
  'Popular Nearby': 'Populares Cerca de Ti',
  'Trending': 'Tendencias',
  'Nearby': 'Cerca de Ti',
};

interface Props {
  onItemPress: (item: any) => void;
  theme?: LatticeTheme;
}

export const DiscoveryFeed = React.memo(function DiscoveryFeed({ onItemPress, theme: themeProp }: Props) {
  const { data: feed, isLoading, refetch, isRefetching } = useDiscovery();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isReady, setIsReady] = useState(false);

  const contextTheme = useAppTheme();
  let theme = themeProp || contextTheme;

  if (!theme || !theme.colors) {
    try {
      const { darkTheme } = require('../../../styles/theme');
      theme = darkTheme;
    } catch (e) {
      // Safe no-op catch block to avoid early returns
    }
  }

  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);

  const handleSelectCategory = React.useCallback((id: string) => {
    setActiveCategory((prev) => (prev === id ? 'all' : id));
  }, []);

  const filteredSections = React.useMemo(() => {
    if (!feed?.sections || activeCategory === 'all') return feed?.sections || [];

    return feed.sections.map((section) => {
      if (section.type === 'featured' || section.type === 'trending' || section.type === 'nearby') {
        return {
          ...section,
          items: section.items.filter((item: any) => {
            const itemCategory = (item.type || item.category || '').toLowerCase();
            return itemCategory === activeCategory.toLowerCase();
          }),
        };
      }
      return section;
    });
  }, [feed, activeCategory]);

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    let baseGreeting = 'Buenos días';
    if (hour >= 12 && hour < 17) baseGreeting = 'Buenas tardes';
    else if (hour >= 17 && hour < 21) baseGreeting = 'Buenas noches';
    else if (hour >= 21 || hour < 5) baseGreeting = 'Buenas noches';

    const name = isGuest ? 'Explorador' : user?.fullName?.split(' ')[0] || 'Usuario';
    return `${baseGreeting},\n${name}`;
  }, [user, isGuest]);

  const categoriesSection = React.useMemo(
    () => feed?.sections?.find((s) => s.type === 'categories'),
    [feed]
  );

  const mainSections = React.useMemo(
    () => filteredSections.filter((s) => s.type !== 'categories'),
    [filteredSections]
  );

  useEffect(() => {
    setIsReady(true);
  }, []);

  const renderSection = React.useCallback(
    ({ item: section, index }: { item: any; index: number }) => {
      if (!section || !section.items || section.items.length === 0) return null;

      switch (section.type) {
        case 'featured':
          return (
            <FeaturedCarousel
              key={`featured-${index}`}
              events={section.items}
              onPress={onItemPress}
            />
          );
        case 'trending':
          return (
            <BentoGrid
              key={`trending-${index}`}
              title={TitleTranslations[section.title] || section.title || 'Tendencias'}
              items={section.items}
              onPress={onItemPress}
            />
          );
        case 'nearby':
          return (
            <NearbyList
              key={`nearby-${index}`}
              title={TitleTranslations[section.title] || section.title || 'Cerca de Ti'}
              items={section.items}
              onPress={onItemPress}
            />
          );
        default:
          return null;
      }
    },
    [onItemPress]
  );

  if ((isLoading && !feed) || !isReady) {
    const skeletonColor = theme?.colors?.glass?.background || 'rgba(255,255,255,0.1)';
    return (
      <View style={{ flex: 1, padding: 20, paddingTop: insets.top + 20 }}>
        <View
          style={{
            height: 40,
            width: 240,
            borderRadius: 8,
            backgroundColor: skeletonColor,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            height: 40,
            width: 180,
            borderRadius: 8,
            backgroundColor: skeletonColor,
            marginBottom: 32,
          }}
        />
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 40 }}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{ width: 85, height: 36, borderRadius: 18, backgroundColor: skeletonColor }}
            />
          ))}
        </View>
        <View
          style={{
            height: 320,
            borderRadius: 32,
            backgroundColor: skeletonColor,
            marginBottom: 24,
          }}
        />
      </View>
    );
  }

  if (!feed || !feed.sections) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme?.colors?.text?.muted || '#666' }}>
          No discovery data available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mainSections}
      renderItem={renderSection}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={theme?.colors?.text?.primary || '#fff'}
        />
      }
      ListHeaderComponent={
        <>
          {/* 1. Header Greeting (Apple Style Large Title) */}
          <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
            <Text
              style={{
                fontFamily: typography.sans.bold,
                fontSize: 34,
                color: theme?.colors?.text?.primary || '#fff',
                letterSpacing: -1.2,
                lineHeight: 40,
              }}
            >
              {greeting}
            </Text>
          </View>

          {/* 2. Top Filters (Categories) */}
          {categoriesSection && (
            <View style={{ marginBottom: 28 }}>
              <CategoryChips
                categories={categoriesSection.items}
                activeCategory={activeCategory}
                onSelect={handleSelectCategory}
              />
            </View>
          )}
        </>
      }
    />
  );
});
