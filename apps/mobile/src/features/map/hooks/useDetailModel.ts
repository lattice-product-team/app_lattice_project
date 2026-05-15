import { useMemo } from 'react';
import { Alert } from 'react-native';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useEventDetails } from './useEventDetails';
import { DetailModel } from '../../../types/models/detail';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useSearchEvents } from './useSearchEvents';
import { useARStore, ARFilterMode } from '../store/useARStore';
import { useLocationStore } from '../../../store/useLocationStore';
import { useMapUIStore } from '../../map/store/useMapUIStore';
import { calculateDistance, isPointInPolygon } from '../../../utils/geoUtils';


/**
 * Normalization hook that converts Event or POI data into a unified
 * DetailModel for the redesigned DetailSheet.
 * Now using Lucide icon naming conventions.
 */
export const useDetailModel = (): DetailModel | null => {
  const theme = useAppTheme();
  const selectedPoi = usePOIStore((s) => s.selectedPoi);
  const deselectPoi = usePOIStore((s) => s.deselect);
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  const clearEvent = useEventStore((s) => s.clearEvent);

  // Fetch supplemental details for events if selected
  const { details: eventDetails } = useEventDetails(
    selectedEvent?.id ? String(selectedEvent.id) : null
  );

  // Get navigation data
  const navMetadata = useNavigationStore((s) => s.metadata);
  const transportMode = useNavigationStore((s) => s.transportMode);
  const routeMetadata = useNavigationStore((s) => s.routeMetadata);
  const setPlanning = useNavigationStore((s) => s.setPlanning);
  const isFetching = useNavigationStore((s) => s.isFetching);

  const { allEvents } = useSearchEvents('');
  const openAR = useARStore((s) => s.openAR);

  // Get user location for estimates
  const logicalCoords = useLocationStore((s) => s.logicalCoords);
  const discoveryLocation = useMapUIStore((s) => s.discoveryLocation);
  const userCoords = discoveryLocation || logicalCoords;

  const currentDuration = routeMetadata?.duration;
  const currentDistance = routeMetadata?.distance;

  const destinationCoords =
    selectedPoi?.coordinates ||
    selectedEvent?.center?.coordinates ||
    (selectedEvent as any)?.coordinates;

  const { estimatedDistance, estimatedDuration } = useMemo(() => {
    if (!userCoords || !destinationCoords)
      return { estimatedDistance: undefined, estimatedDuration: undefined };

    const d = calculateDistance(
      userCoords[1],
      userCoords[0],
      destinationCoords[1],
      destinationCoords[0]
    );

    // Walking estimate (5km/h = 1.38m/s)
    const dur = d / 1.38;

    return { estimatedDistance: d, estimatedDuration: dur };
  }, [userCoords, destinationCoords]);

  const formatDistance = (m: number | undefined) => {
    const val = m || estimatedDistance;
    if (!val) return '--';
    if (val < 1000) return `${Math.round(val)}m`;
    return `${(val / 1000).toFixed(1)} km`;
  };

  const formatDuration = (s: number | undefined) => {
    if (isFetching) return '...';
    const val = s || estimatedDuration;
    if (!val) return '--';
    const mins = Math.round(val / 60);
    return `${mins} min`;
  };

  return useMemo(() => {
    // 1. Handle Event Case
    if (selectedEvent) {
      const data = eventDetails || selectedEvent;
      const metadata =
        typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata || {};
      const social = metadata.social;

      let isInside = false;
      if (userCoords && data.boundary?.coordinates) {
        const pt: [number, number] = [userCoords[0], userCoords[1]];
        if (data.boundary.type === 'Polygon') {
          isInside = isPointInPolygon(pt, data.boundary.coordinates[0]);
        } else if (data.boundary.type === 'MultiPolygon') {
          isInside = data.boundary.coordinates.some((poly: any) => isPointInPolygon(pt, poly[0]));
        }
      }

      return {
        id: String(data.id),
        type: 'event',
        name: data.name,
        subtitle: (data as any).type || 'Activity',
        description:
          (data as any).description ||
          'Explore this event and discover unique experiences in the city.',
        bannerUrl: (data as any).bannerUrl,
        galleryUrls: (data as any).galleryUrls || [],
        logoUrl: (data as any).logoUrl,
        social: social
          ? {
              rating: social.rating,
              reviewsCount: social.reviews_count,
              snippets: social.snippets || [],
              sourceUrl: social.source_url,
            }
          : undefined,
        info: [
          ...(metadata.is_wheelchair_accessible
            ? [
                {
                  label: 'AccessibilityIcon',
                  value: 'Wheelchair Accessible',
                  icon: 'AccessibilityIcon',
                },
              ]
            : []),
          ...(metadata.accepts_apple_pay
            ? [
                {
                  label: 'Payment',
                  value: 'Accepts Apple Pay',
                  icon: 'SmartphoneIcon',
                },
              ]
            : []),
        ],
        metrics: [
          {
            label: 'Hours',
            value: (data as any).openingHours || 'Open',
            icon: 'ClockIcon',
            color: '#32D74B',
          },
          {
            label: 'Popular',
            value: 'Trending',
            icon: 'FlameIcon',
            color: '#FF9F0A',
          },
          {
            label: 'Distance',
            value: formatDistance(currentDistance),
            icon: 'MapPinIcon',
          },
        ],
        actions: [
          {
            id: 'directions',
            label: formatDuration(currentDuration),
            icon: transportMode === 'driving' ? 'CarIcon' : transportMode === 'walking' ? 'FootprintsIcon' : 'BikeIcon',
            variant: 'primary',
            onPress: () => {
              setPlanning(true);
            },
          },
          {
            id: 'ar',
            label: 'Use AR',
            icon: 'BinocularsIcon',
            variant: isInside ? 'subdued' : 'tertiary',
            onPress: () => {
              if (isInside) {
                openAR(ARFilterMode.SELECTED_EVENT, data.id);
                clearEvent();
                deselectPoi();
              } else {
                Alert.alert('Aviso', 'Este botón está disponible si te encuentras en el evento.');
              }
            },
          },
          {
            id: 'website',
            label: 'Website',
            icon: 'GlobeIcon',
            variant: 'subdued',
            onPress: () => console.log('Open website'),
          },
          {
            id: 'tickets',
            label: 'TicketIcons',
            icon: 'TicketIcon',
            variant: 'subdued',
            onPress: () => console.log('Buy tickets'),
          },
        ],
      } as DetailModel;
    }

    // 2. Handle POI Case
    if (selectedPoi) {
      const catMetadata = getCategoryMetadata(selectedPoi.category);
      const metadata =
        typeof selectedPoi.metadata === 'string'
          ? JSON.parse(selectedPoi.metadata)
          : selectedPoi.metadata || {};
      const social = metadata.social;

      const parentEvent = allEvents?.find((e) => String(e.id) === String(selectedPoi.parentId));
      const parentName = parentEvent?.name || selectedPoi.raw?.eventName;

      let isInside = false;
      if (userCoords && parentEvent?.boundary?.coordinates) {
        const pt: [number, number] = [userCoords[0], userCoords[1]];
        if (parentEvent.boundary.type === 'Polygon') {
          isInside = isPointInPolygon(pt, parentEvent.boundary.coordinates[0]);
        } else if (parentEvent.boundary.type === 'MultiPolygon') {
          isInside = parentEvent.boundary.coordinates.some((poly: any) =>
            isPointInPolygon(pt, poly[0])
          );
        }
      }

      return {
        id: selectedPoi.id,
        type: 'poi',
        name: selectedPoi.displayName,
        subtitle: `${selectedPoi.categoryLabel}${social?.rating ? ` • ${social.rating} ⭐` : ''}`,
        description: selectedPoi.description || 'A notable point of interest in the area.',
        bannerUrl: (selectedPoi as any).bannerUrl,
        galleryUrls: (selectedPoi as any).galleryUrls || [],
        categoryIcon: catMetadata.icon,
        parentName,
        social: social
          ? {
              rating: social.rating,
              reviewsCount: social.reviews_count,
              snippets: social.snippets || [],
              sourceUrl: social.source_url,
            }
          : undefined,
        info: [
          ...(selectedPoi.isWheelchairAccessible
            ? [
                {
                  label: 'AccessibilityIcon',
                  value: 'Wheelchair Accessible',
                  icon: 'AccessibilityIcon',
                },
              ]
            : []),
          ...(selectedPoi.hasPriorityLane
            ? [
                {
                  label: 'Priority',
                  value: 'Fast Track Available',
                  icon: 'ZapIcon',
                },
              ]
            : []),
          ...(metadata.accepts_apple_pay
            ? [
                {
                  label: 'Payment',
                  value: 'Accepts Apple Pay',
                  icon: 'SmartphoneIcon',
                },
              ]
            : []),
        ],
        metrics: [
          {
            label: 'Hours',
            value: 'Open',
            icon: 'ClockIcon',
            color: '#32D74B',
          },
          {
            label: 'Popular',
            value: 'Top Choice',
            icon: 'FlameIcon',
            color: '#FF9F0A',
          },
          {
            label: 'Distance',
            value: formatDistance(currentDistance),
            icon: 'MapPinIcon',
          },
        ],
        actions: [
          {
            id: 'directions',
            label: formatDuration(currentDuration),
            icon: transportMode === 'driving' ? 'CarIcon' : transportMode === 'walking' ? 'FootprintsIcon' : 'BikeIcon',
            variant: 'primary',
            onPress: () => {
              setPlanning(true);
            },
          },
          {
            id: 'ar',
            label: 'Use AR',
            icon: 'BinocularsIcon',
            variant: isInside ? 'subdued' : 'tertiary',
            onPress: () => {
              if (isInside) {
                openAR(ARFilterMode.SPECIFIC_PIN, selectedPoi.id);
                deselectPoi();
                clearEvent();
              } else {
                Alert.alert('Aviso', 'Este botón está disponible si te encuentras en el evento.');
              }
            },
          },
          {
            id: 'website',
            label: 'Website',
            icon: 'GlobeIcon',
            variant: 'subdued',
            onPress: () => {},
          },
          {
            id: 'tickets',
            label: 'TicketIcons',
            icon: 'TicketIcon',
            variant: 'subdued',
            onPress: () => {},
          },
        ],
      } as DetailModel;
    }

    return null;
  }, [
    selectedEvent,
    eventDetails,
    selectedPoi,
    theme,
    navMetadata,
    isFetching,
    allEvents,
    userCoords,
  ]);
};
