import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, ScrollView, Pressable, Text } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchFilters } from './SearchFilters';
import { RemoteModeWarning } from './RemoteModeWarning';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { MapUIState } from '../store/useMapUIStore';
import { typography } from '../../../styles/typography';

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
          borderColor: theme.colors.glass.border,
        },
      ]}
    >
      <View style={styles.innerGlowBorder} />
    </SafeBlurView>
  );
};

export const MapBottomSheet = forwardRef<BottomSheet, MapBottomSheetProps>(
  (
    {
      searchBar,
      isSearching,
      searchResults,
      discoveryContent,
      savedContent,
      poiCarousel,
      translateY,
      activeCategoryId,
      uiState,
      onSelectCategory,
    }: MapBottomSheetProps,
    ref
  ) => {
    const insets = useSafeAreaInsets();
    const { isRemote } = usePOIStore();
    const theme = useAppTheme();
    const snapPoints = useMemo(
      () => [
        insets.bottom + 110, // Compact
        SCREEN_HEIGHT * 0.45, // Medium
        SCREEN_HEIGHT * 0.88, // Expanded (Leave space at top)
      ],
      [insets.bottom]
    );

    return (
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        detached={true}
        bottomInset={insets.bottom + 24}
        backgroundComponent={CustomBackground}
        handleIndicatorStyle={[
          styles.handleIndicator,
          { backgroundColor: theme.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' },
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
          <View style={styles.searchContainer}>{searchBar}</View>

          {!isSearching && uiState === MapUIState.EXPLORING && (
            <View style={styles.temporalFiltersWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.temporalFiltersScroll}
              >
                {['Hoy', 'Mañana', 'Este finde', 'Más tarde'].map((filter, i) => (
                  <Pressable
                    key={filter}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    style={[
                      styles.temporalPill,
                      i === 0 && {
                        backgroundColor: theme.colors.brand.primary,
                        borderColor: 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.temporalText,
                        i === 0 ? { color: '#000' } : { color: theme.colors.text.primary },
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
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
            {isSearching
              ? searchResults
              : uiState === MapUIState.SAVED_LIST
                ? savedContent
                : activeCategoryId
                  ? poiCarousel
                  : discoveryContent}
          </View>

          <View style={{ height: insets.bottom + 40 }} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

interface MapBottomSheetProps {
  searchBar?: React.ReactNode;
  isSearching?: boolean;
  searchResults?: React.ReactNode;
  discoveryContent?: React.ReactNode;
  savedContent?: React.ReactNode;
  poiCarousel?: React.ReactNode;
  translateY: SharedValue<number>;
  activeCategoryId: string | null;
  uiState: MapUIState;
  onSelectCategory: (category: string) => void;
}

MapBottomSheet.displayName = 'MapBottomSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
  },
  blurBackground: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'transparent',
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
  temporalFiltersWrapper: {
    paddingVertical: 10,
  },
  temporalFiltersScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  temporalPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  temporalText: {
    fontSize: 14,
    fontFamily: typography.secondary.bold,
  },
  contentWrapper: {
    marginTop: 4,
    minHeight: 400,
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    pointerEvents: 'none',
  },
});
