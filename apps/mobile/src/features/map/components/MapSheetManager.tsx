import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

// Store & Types
import { useMapUIStore, MapUIState } from '../store/useMapUIStore';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';

// Components
import { MapBottomSheet } from './MapBottomSheet';
import { PoiDetailSheet } from './PoiDetailSheet';
import { NavigationInfo } from './NavigationInfo';

interface MapSheetManagerProps {
  // Props for MapBottomSheet
  activeCategoryId: string | null;
  isSearching: boolean;
  searchBar: React.ReactNode;
  searchResults: React.ReactNode;
  poiCarousel: React.ReactNode;
  discoveryContent: React.ReactNode;
  savedContent: React.ReactNode;
  onSelectCategory: (category: string) => void;
  onFocusSearch: () => void;
}

export const MapSheetManager = ({
  activeCategoryId,
  isSearching,
  searchBar,
  searchResults,
  poiCarousel,
  discoveryContent,
  savedContent,
  onSelectCategory,
  onFocusSearch,
}: MapSheetManagerProps) => {
  const { uiState } = useMapUIStore();
  const { selectedPoi, deselect } = usePOIStore();
  const { isNavigating } = useNavigationStore();

  // Refs for BottomSheets
  const mainSheetRef = useRef<BottomSheet>(null);
  const poiSheetRef = useRef<BottomSheet>(null);

  // Animated values for synchronization
  const mainSheetTranslateY = useSharedValue(0);
  const poiSheetTranslateY = useSharedValue(0);

  // Orchestration Logic
  useEffect(() => {
    switch (uiState) {
      case MapUIState.EXPLORING:
        poiSheetRef.current?.close();
        mainSheetRef.current?.snapToIndex(1); // Default to medium/visible
        break;

      case MapUIState.POI_DETAIL:
        mainSheetRef.current?.snapToIndex(0); // Minimize main sheet
        poiSheetRef.current?.snapToIndex(0); // Show POI details
        break;

      case MapUIState.NAVIGATING:
        mainSheetRef.current?.close();
        poiSheetRef.current?.close();
        Keyboard.dismiss();
        break;

      case MapUIState.SAVED_LIST:
        poiSheetRef.current?.close();
        mainSheetRef.current?.snapToIndex(2); // Expanded view for the list
        break;
    }
  }, [uiState]);

  return (
    <>
      {/* 1. Main Exploration Sheet */}
      <MapBottomSheet
        ref={mainSheetRef}
        translateY={mainSheetTranslateY}
        activeCategoryId={activeCategoryId}
        isSearching={isSearching}
        searchBar={searchBar}
        searchResults={searchResults}
        poiCarousel={poiCarousel}
        discoveryContent={discoveryContent}
        savedContent={savedContent}
        uiState={uiState}
        onSelectCategory={onSelectCategory}
      />

      {/* 2. POI Detail Sheet */}
      <PoiDetailSheet
        ref={poiSheetRef}
        poi={selectedPoi}
        onClose={() => {
          if (!isNavigating) deselect();
        }}
        translateY={poiSheetTranslateY}
      />

      {/* 3. Navigation Info Overlay */}
      <NavigationInfo />
    </>
  );
};
