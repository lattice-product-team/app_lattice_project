import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchFilters } from './SearchFilters';
import { RemoteModeWarning } from './RemoteModeWarning';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useAppTheme } from '../../../hooks/useAppTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  const theme = useAppTheme();
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
      <View style={styles.innerGlowBorder} />
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
  const { isRemote } = usePOIStore();
  const theme = useAppTheme();
  const snapPoints = useMemo(() => [
    insets.bottom + 110,  // Collapsed: Search bar only
    SCREEN_HEIGHT * 0.48, // Medium: Exploration
    SCREEN_HEIGHT * 0.92  // Expanded: List full view
  ], [insets.bottom]);

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      handleIndicatorStyle={[
        styles.handleIndicator,
        { backgroundColor: theme.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }
      ]}
      handleStyle={styles.handle}
      animatedPosition={translateY}
      onChange={(index) => {
        if (index >= 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      style={styles.sheetContainer}
    >
      <View style={styles.fixedHeader}>
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
      </View>

      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
  },
  handle: {
    paddingTop: 8,
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 12, // Reduced because header is outside
  },
  fixedHeader: {
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  searchContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  filtersWrapper: {
    paddingVertical: 8,
  },
  contentWrapper: {
    marginTop: 4,
    minHeight: 250,
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    pointerEvents: 'none',
  },
});

