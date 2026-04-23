import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchFilters } from './SearchFilters';

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
  <SafeBlurView intensity={85} tint="dark" style={[style, styles.blurBackground]}>
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

  const snapPoints = useMemo(() => [
    insets.bottom + 110,  // Collapsed: Search bar only
    SCREEN_HEIGHT * 0.48  // Medium: Main exploration view
  ], [insets.bottom]);

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={translateY}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      style={styles.sheetContainer} // Added for floating effect
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

        {/* Content Area */}
        <View style={styles.contentWrapper}>
          {isSearching ? (
            searchResults
          ) : activeCategoryId ? (
            poiCarousel 
          ) : (
            discoveryContent 
          )}
        </View>

        <View style={{ height: insets.bottom + 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

MapBottomSheet.displayName = 'MapBottomSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    // Adding horizontal padding to create a floating effect on larger screens
    // and ensuring the shadow is visible.
    marginHorizontal: Platform.OS === 'ios' ? 10 : 0,
  },
  blurBackground: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 5,
    borderRadius: 2.5,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    pointerEvents: 'none',
  },
});
