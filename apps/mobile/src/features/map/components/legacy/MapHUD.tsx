import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { FloatingSearchBar } from '../../../components/ui/FloatingSearchBar';
import { MapSheetManager } from './MapSheetManager';
import { POICarousel } from './POICarousel';
import { GuidesSection } from './GuidesSection';
import { EventCarousel } from './EventCarousel';
import { EventSummaryCard } from './EventSummaryCard';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { LatticeEvent } from '../../../types';
import { StandardUIPOI } from '../../../types/models/poi';
import { normalizePOI } from '../../poi/adapters/poiAdapter';
import { SavedListContent } from './SavedListContent';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { useMapUIStore, MapUIState } from '../store/useMapUIStore';

interface MapHUDProps {
  activeCategoryId: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearching: boolean;
  setIsSearching: (s: boolean) => void;
  onSelectCategory: (cat: string) => void;
  searchResults: React.ReactNode;
  carouselPois: StandardUIPOI[];
  onSelectPoi: (poi: StandardUIPOI) => void;
  isLoading?: boolean;
  rawPoisData?: any;
  onProfilePress?: () => void;

  // Event Props
  currentEventId?: number | null;
  selectedEvent?: LatticeEvent | null;
  eventsData?: LatticeEvent[];
  setCurrentEvent?: (event: LatticeEvent | null) => void;
  onClearCategory?: () => void;
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
  onProfilePress,
  currentEventId,
  selectedEvent,
  eventsData,
  setCurrentEvent,
  onClearCategory,
}: MapHUDProps) {
  const theme = useLatticeTheme();
  const { setUIState } = useMapUIStore();
  const { data: savedData } = useSavedLocations();

  const savedPois = React.useMemo(() => {
    return savedData?.features?.map((f: any) => normalizePOI(f)) || [];
  }, [savedData]);

  const handleFocusSearch = React.useCallback(() => {
    setIsSearching(true);
  }, [setIsSearching]);

  const handleCloseSearch = React.useCallback(() => {
    setIsSearching(false);
  }, [setIsSearching]);

  return (
    <>
      <MapSheetManager
        activeCategoryId={activeCategoryId}
        isSearching={isSearching}
        searchBar={
          <FloatingSearchBar
            placeholder="Search places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onProfilePress={onProfilePress}
            onFocus={handleFocusSearch}
          />
        }
        onFocusSearch={handleFocusSearch}
        searchResults={searchResults}
        poiCarousel={<POICarousel pois={carouselPois} onSelectPoi={onSelectPoi} />}
        savedContent={
          <SavedListContent
            savedItems={savedPois}
            onSelectItem={(poi) => {
              onSelectPoi(poi);
              setUIState(MapUIState.POI_DETAIL);
            }}
          />
        }
        discoveryContent={
          <View>
            {currentEventId && selectedEvent ? (
              <EventSummaryCard event={selectedEvent} onClear={() => setCurrentEvent?.(null)} />
            ) : (
              eventsData &&
              eventsData.length > 0 && (
                <EventCarousel
                  title="Upcoming Events"
                  events={eventsData}
                  onSelectEvent={(event) => {
                    setCurrentEvent?.(event);
                    onClearCategory?.();
                  }}
                />
              )
            )}
            <POICarousel
              title={currentEventId ? 'Points of Interest' : 'Near You'}
              pois={rawPoisData?.features?.map((f: any) => normalizePOI(f)) || []}
              onSelectPoi={onSelectPoi}
            />

            <GuidesSection
              onSeeAll={() => setUIState(MapUIState.SAVED_LIST)}
              onSelectMarker={(coords, id) => {
                onSelectPoi({ id: `saved_${id}`, coordinates: coords as [number, number] } as any);
              }}
            />
          </View>
        }
        onSelectCategory={onSelectCategory}
      />

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={theme.colors.brand.primary} size="large" />
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
