import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchFilters } from './SearchFilters';
import { RemoteModeWarning } from './RemoteModeWarning';
import { useMapStore } from '../../store/useMapStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapBottomSheetProps {
  searchBar?: React.ReactNode;
  isSearching?: boolean;
  searchResults?: React.ReactNode;
  discoveryContent?: React.ReactNode; // Now used for Near Me carousels
  poiCarousel?: React.ReactNode;      // Used for filtered results
  translateY: SharedValue<number>;
  activeCategoryId: string | null;
  onSelectCategory: (category: string) => void;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => (
  <SafeBlurView intensity={100} tint="dark" style={[style, styles.blurBackground]}>
    <View style={styles.premiumBorder} />
  </SafeBlurView>
);

export const MapBottomSheet = forwardRef<BottomSheet, MapBottomSheetProps>(({ 
  searchBar,
  isSearching,
  searchResults,
  discoveryContent,
  poiCarousel,
  translateY,
  activeCategoryId,
  onSelectCategory,
}: MapBottomSheetProps, ref) => {
  const insets = useSafeAreaInsets();
  const isRemote = useMapStore((s) => s.isRemote);

  const snapPoints = useMemo(() => [
    insets.bottom + 100,  // Collapsed: Search bar only
    SCREEN_HEIGHT * 0.48  // Medium: Main exploration view
  ], [insets.bottom]);

  return (
    <BottomSheet
      ref={ref}
      index={1} // Start at medium height
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={translateY}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchContainer}>
          {searchBar}
        </View>
        
        {!isSearching && (
          <View style={styles.filtersWrapper}>
            <SearchFilters 
              activeCategory={activeCategoryId}
              onSelectCategory={onSelectCategory}
              animatedPosition={translateY}
            />
          </View>
        )}

        {isRemote && !isSearching && <RemoteModeWarning />}

        {/* Content Area */}
        <View style={styles.contentWrapper}>
          {isSearching ? (
            searchResults
          ) : activeCategoryId ? (
            poiCarousel // Carousel for specific category
          ) : (
            discoveryContent // Default: Near Me carousel
          )}
        </View>

        <View style={{ height: insets.bottom + 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

MapBottomSheet.displayName = 'MapBottomSheet';

const styles = StyleSheet.create({
  blurBackground: {
    backgroundColor: 'rgba(10, 10, 12, 0.98)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  filtersWrapper: {
    paddingVertical: 12,
  },
  contentWrapper: {
    marginTop: 4,
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    pointerEvents: 'none',
  },
});
