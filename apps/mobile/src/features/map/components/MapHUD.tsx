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
  setShowSavedManager: (show: boolean) => void;
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
  setShowSavedManager,
  onProfilePress,
  currentEventId,
  selectedEvent,
  eventsData,
  setCurrentEvent,
  onClearCategory,
}: MapHUDProps) {
  const theme = useLatticeTheme();
  return (
    <>
      <MapSheetManager
        activeCategoryId={activeCategoryId}
        isSearching={isSearching}
        searchBar={
          <FloatingSearchBar
            placeholder="Busca sitios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onProfilePress={onProfilePress}
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
            {currentEventId && selectedEvent ? (
              <EventSummaryCard 
                event={selectedEvent} 
                onClear={() => setCurrentEvent?.(null)} 
              />
            ) : eventsData && eventsData.length > 0 && (
              <EventCarousel 
                title="Próximos eventos"
                events={eventsData}
                onSelectEvent={(event) => {
                  setCurrentEvent?.(event);
                  onClearCategory?.();
                }}
              />
            )}
            <POICarousel 
              title={currentEventId ? "Puntos de interés" : "Cerca de ti"}
              pois={rawPoisData?.features?.map((f: any) => normalizePOI(f)) || []}
              onSelectPoi={onSelectPoi}
            />
            
            <GuidesSection
              onSeeAll={() => setShowSavedManager(true)}
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
