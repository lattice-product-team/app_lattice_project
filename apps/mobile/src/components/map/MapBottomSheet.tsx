import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchFilters } from './SearchFilters';
import { RemoteModeWarning } from './RemoteModeWarning';
import { useMapStore } from '../../store/useMapStore';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  const theme = useLatticeTheme();
  return (
    <SafeBlurView 
      intensity={90} 
      tint={theme.colors.glass.tint} 
      style={[
        style, 
        styles.blurBackground,
        { 
          backgroundColor: theme.colors.glass.background,
          borderColor: theme.colors.glass.border 
        }
      ]}
    >
      <View style={styles.premiumBorder} />
    </SafeBlurView>
  );
};

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
  const theme = useLatticeTheme();

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
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: theme.colors.overlay.modal }
      ]}
      animatedPosition={translateY}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      style={styles.sheetContainer}
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

interface MapBottomSheetProps {
  searchBar?: React.ReactNode;
  isSearching?: boolean;
  searchResults?: React.ReactNode;
  discoveryContent?: React.ReactNode;
  poiCarousel?: React.ReactNode;
  translateY: SharedValue<number>;
  activeCategoryId: string | null;
  onSelectCategory: (category: string) => void;
}

MapBottomSheet.displayName = 'MapBottomSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: Platform.OS === 'ios' ? 10 : 0,
  },
  blurBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  handleIndicator: {
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
    minHeight: 250,
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    pointerEvents: 'none',
  },
});

