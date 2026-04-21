import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SearchBar } from '../SearchBar';
import { MapSheetManager } from './MapSheetManager';
import { POICarousel } from './POICarousel';
import { GuidesSection } from './GuidesSection';
import { colors } from '../../styles/colors';

interface MapHUDProps {
  activeCategoryId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearching: boolean;
  setIsSearching: (s: boolean) => void;
  onSelectCategory: (cat: string) => void;
  searchResults: React.ReactNode;
  carouselPois: any[];
  onSelectPoi: (poi: any) => void;
  isLoading?: boolean;
  rawPoisData?: any;
  setShowSavedManager: (show: boolean) => void;
}

export const MapHUD = React.memo(function MapHUD({
  activeCategoryId,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
  onSelectCategory,
  searchResults,
  carouselPois,
  onSelectPoi,
  isLoading,
  rawPoisData,
  setShowSavedManager,
}: MapHUDProps) {
  return (
    <>
      <MapSheetManager
        activeCategoryId={activeCategoryId}
        isSearching={isSearching}
        searchBar={
          <SearchBar
            placeholder="Busca sitios..."
            value={searchQuery}
            onSearch={setSearchQuery}
            onArPress={() => {/* Profile logic will be injected or handled via router */}}
            onFocus={() => setIsSearching(true)}
          />
        }
        onFocusSearch={() => setIsSearching(true)}
        searchResults={searchResults}
        poiCarousel={
          <POICarousel 
            pois={carouselPois} 
            onSelectPoi={onSelectPoi} 
          />
        }
        discoveryContent={
          <View>
            <POICarousel 
              title="Cerca de ti"
              pois={rawPoisData?.features?.map((f: any) => ({ ...f.properties, geometry: f.geometry })) || []}
              onSelectPoi={onSelectPoi}
            />
            <GuidesSection
              onSeeAll={() => setShowSavedManager(true)}
              onSelectMarker={(coords, id) => {
                onSelectPoi({ id: `saved_${id}`, geometry: { coordinates: coords } });
              }}
            />
          </View>
        }
        onSelectCategory={onSelectCategory}
      />

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
