import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';
import { usePOIs } from '../../src/hooks/queries/usePOIs';
import { useSinglePOI } from '../../src/hooks/queries/useSinglePOI';
import { useCategories } from '../../src/hooks/queries/useCategories';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useLocationService } from '../../src/hooks/useLocationService';
import { useCameraTilt } from '../../src/hooks/useCameraTilt';
import { AROverlay } from '../../src/components/ar/AROverlay';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMapStore } from '../../src/store/useMapStore';
import { useLocationStore } from '../../src/store/useLocationStore';
import { useOrientationStore } from '../../src/store/useOrientationStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { MapContent } from '../../src/components/map/MapContent';
import { MapHUD } from '../../src/components/map/MapHUD';
import { useSavedLocations } from '../../src/hooks/queries/useSavedLocations';
import { getCategoryMetadata } from '../../src/utils/poiUtils';
import { SavedLocationsManager } from '../../src/components/map/SavedLocationsManager';

// Configure MapLibre
MapLibreGL.setAccessToken(null);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MapIndexPage() {
  const router = useRouter();
  const { status: locationStatus, requestPermission } = useLocationService();
  const userCoords = useLocationStore((s) => s.logicalCoords);

  const selectedPoiId = useMapStore((s) => s.selectedPoiId);
  const selectedPoi = useMapStore((s) => s.selectedPoi);
  const deselect = useMapStore((s) => s.deselect);
  const selectPoi = useMapStore((s) => s.selectPoi);
  const triggerRecenter = useMapStore((s) => s.triggerRecenter);

  const { data: categories } = useCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { isVisible: isCameraARVisible } = useCameraTilt();
  const heading = useOrientationStore((s) => s.heading);
  const isLandscape = useOrientationStore((s) => s.isLandscape);
  const [manualAR, setManualAR] = useState(false);
  const isARVisible = isCameraARVisible || manualAR;

  const sheetPosition = useSharedValue(SCREEN_HEIGHT);

  const { data: savedData } = useSavedLocations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSavedManager, setShowSavedManager] = useState(false);

  const activeTicket = useAuthStore((s: any) => s.activeTicket);
  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return undefined;
    return categories?.find((c) => c.id === activeCategoryId)?.category;
  }, [activeCategoryId, categories]);

  const { data: rawPoisData, isLoading } = usePOIs(activeCategory);

  const poisData = useMemo(() => {
    if (!rawPoisData?.features || !activeTicket) return rawPoisData;
    const filteredFeatures = rawPoisData.features.filter((f: any) => {
      const { category, name } = f.properties;
      if (category === 'gate' && activeTicket.gate) {
        return (
          name.toLowerCase().includes(activeTicket.gate.toLowerCase()) ||
          activeTicket.gate.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (category === 'grandstand' && activeTicket.zoneName) {
        return (
          name.toLowerCase().includes(activeTicket.zoneName.toLowerCase()) ||
          activeTicket.zoneName.toLowerCase().includes(name.toLowerCase())
        );
      }
      return true;
    });
    return { ...rawPoisData, features: filteredFeatures };
  }, [rawPoisData, activeTicket]);

  const carouselPois = useMemo(() => {
    if (!poisData?.features || !activeCategoryId) return [];
    return poisData.features
      .filter((f: any) => f.properties.category === activeCategory)
      .map((f: any) => ({ ...f.properties, geometry: f.geometry }));
  }, [poisData, activeCategoryId, activeCategory]);

  const { isSelectedSaved, numericPoiId } = useMemo(() => {
    if (!selectedPoiId) return { isSelectedSaved: false, numericPoiId: null };
    const isPrefixed = selectedPoiId.toString().startsWith('saved_');
    const rawId = isPrefixed ? selectedPoiId.toString().replace('saved_', '') : selectedPoiId;
    const numId = Number(rawId);
    const existsInSaved =
      savedData?.features?.some((f: any) => Number(f.properties.id) === numId) || false;
    return {
      isSelectedSaved: isPrefixed || existsInSaved,
      numericPoiId: isNaN(numId) ? null : numId,
    };
  }, [selectedPoiId, savedData]);

  const isAlreadyLoaded = useMemo(() => {
    if (!numericPoiId || !poisData?.features) return false;
    return poisData.features.some((f: any) => Number(f.properties.id) === numericPoiId);
  }, [numericPoiId, poisData]);

  const { data: soloPoiData } = useSinglePOI(
    isSelectedSaved || isAlreadyLoaded || selectedPoi ? null : numericPoiId
  );

  useEffect(() => {
    if (!selectedPoi && soloPoiData && Number(soloPoiData.properties.id) === numericPoiId) {
      selectPoi({ ...soloPoiData.properties, geometry: soloPoiData.geometry } as any);
    } else if (!selectedPoi && poisData && numericPoiId) {
      const f = poisData.features.find((f: any) => Number(f.properties.id) === numericPoiId);
      if (f) selectPoi({ ...f.properties, geometry: f.geometry } as any);
    }
  }, [soloPoiData, poisData, numericPoiId, selectedPoi, selectPoi]);

  const searchResultsData = useMemo(() => {
    if (!searchQuery.trim() || !poisData?.features) return [];
    const query = searchQuery.toLowerCase();
    return poisData.features
      .filter(
        (f: any) =>
          f.properties.name?.toLowerCase().includes(query) ||
          f.properties.category?.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, poisData]);

  const handleRecenter = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (locationStatus === 'granted') {
        triggerRecenter();
        return;
      }
      const granted = await requestPermission();
      if (granted) triggerRecenter();
    } catch (err) {
      console.error('[Recenter] Error:', err);
    }
  }, [locationStatus, requestPermission, triggerRecenter]);

  const handleMapPress = useCallback(() => {
    Keyboard.dismiss();
    if (isSearching || searchQuery !== '') {
      setIsSearching(false);
      setSearchQuery('');
    }
    deselect();
  }, [isSearching, searchQuery, deselect]);

  const rRecenterButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetPosition.value - SCREEN_HEIGHT - 100 }],
  }));

  const renderSearchResults = () => (
    <View style={styles.cardContainer}>
      {searchResultsData.length > 0 ? (
        searchResultsData.map((f: any, index: number) => {
          const metadata = getCategoryMetadata(f.properties.category);
          return (
            <Pressable
              key={f.properties.id}
              onPress={() => {
                Keyboard.dismiss();
                selectPoi({ ...f.properties, geometry: f.geometry } as any);
                setSearchQuery('');
                setIsSearching(false);
              }}
              style={({ pressed }) => [
                styles.searchResultItem,
                index === searchResultsData.length - 1 && { borderBottomWidth: 0 },
                pressed && { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
              ]}
            >
              <View style={styles.searchResultInfo}>
                <View style={[styles.searchResultIcon, { backgroundColor: `${metadata.color}15` }]}>
                  <MaterialCommunityIcons
                    name={metadata.icon as any}
                    size={20}
                    color={metadata.color}
                  />
                </View>
                <View className="flex-1">
                  <Text style={styles.searchResultName} numberOfLines={1}>
                    {f.properties.name}
                  </Text>
                  <Text style={styles.searchResultCat}>{metadata.label}</Text>
                </View>
              </View>
            </Pressable>
          );
        })
      ) : (
        <View className="py-12 items-center">
          <MaterialCommunityIcons name="magnify" size={48} color="rgba(255,255,255,0.1)" />
          <Text style={styles.emptyResultsText}>No se encontraron resultados</Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 overflow-hidden" style={{ backgroundColor: colors.background }}>
      <View style={StyleSheet.absoluteFill}>
        <MapContent
          poisGeoJSON={poisData}
          savedLocations={savedData}
          onDeselect={handleMapPress}
          sheetPosition={sheetPosition}
        />
        <AROverlay
          isVisible={isARVisible}
          onExitAR={() => setManualAR(false)}
          userCoords={userCoords}
          heading={heading}
          pois={poisData?.features || []}
          isLandscape={isLandscape}
        />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.overlay, { bottom: 0 }, rRecenterButtonStyle]}
      >
        <View pointerEvents="auto" className="flex-row items-center justify-end px-4 mb-4 gap-3">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setManualAR(!manualAR);
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
              backgroundColor: manualAR ? colors.primary : 'rgba(0,0,0,0.6)',
            })}
            className="w-12 h-12 items-center justify-center rounded-full border border-white/5 shadow-lg"
          >
            <MaterialCommunityIcons name="augmented-reality" size={26} color="white" />
          </Pressable>

          <Pressable
            onPress={handleRecenter}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
            className="w-12 h-12 items-center justify-center rounded-full bg-black/60 border border-white/5 shadow-lg"
          >
            <Feather name="navigation" size={24} color="white" />
          </Pressable>
        </View>
      </Animated.View>

      {!isARVisible && (
        <MapHUD
          activeCategoryId={activeCategoryId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          onSelectCategory={(category) => {
            if (activeCategoryId === category) {
              setActiveCategoryId(null);
              return;
            }
            setActiveCategoryId(category);
            const foundCategory = categories?.find((c) => c.id === category)?.category;
            if (foundCategory && poisData?.features) {
              const foundPoi = poisData.features.find((f: any) => f.properties.category === foundCategory);
              if (foundPoi) selectPoi({ ...foundPoi.properties, geometry: foundPoi.geometry } as any);
            }
          }}
          searchResults={renderSearchResults()}
          carouselPois={carouselPois}
          onSelectPoi={selectPoi}
          isLoading={isLoading}
          rawPoisData={rawPoisData}
          setShowSavedManager={setShowSavedManager}
        />
      )}

      <SavedLocationsManager
        isVisible={showSavedManager}
        onClose={() => setShowSavedManager(false)}
        onSelectMarker={(coords, id) => {
          selectPoi({
            id: `saved_${id}`,
            name: 'Ubicación guardada',
            geometry: { coordinates: coords },
          } as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  cardContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 24,
    marginHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  searchResultName: {
    color: colors.black,
    fontSize: 16,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.2,
  },
  searchResultCat: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  emptyResultsText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});
