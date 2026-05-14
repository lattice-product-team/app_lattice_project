import { useMemo } from 'react';
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
import { isPointInPolygon } from '../../../utils/geoUtils';

/**
 * Normalization hook that converts Event or POI data into a unified
 * DetailModel for the redesigned DetailSheet.
 * Now using Lucide icon naming conventions.
 */
export const useDetailModel = (): DetailModel | null => {
  const theme = useAppTheme();
  const selectedPoi = usePOIStore((s) => s.selectedPoi);
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  
  // Fetch supplemental details for events if selected
  const { details: eventDetails } = useEventDetails(
    selectedEvent?.id ? String(selectedEvent.id) : null
  );

  // Get navigation data
  const navMetadata = useNavigationStore((s) => s.metadata);
  const { allEvents } = useSearchEvents('');
  const setPlanning = useNavigationStore((s) => s.setPlanning);
  const isFetching = useNavigationStore((s) => s.isFetching);
  const openAR = useARStore((s) => s.openAR);
  const userCoords = useLocationStore((s) => s.coords);

  const drivingDuration = navMetadata.driving?.duration;
  const drivingDistance = navMetadata.driving?.distance;

  const formatDistance = (m: number | undefined) => {
    if (!m) return '--';
    if (m < 1000) return `${Math.round(m)}m`;
    return `${(m / 1000).toFixed(1)} km`;
  };

  const formatDuration = (s: number | undefined) => {
    if (isFetching) return '...';
    if (!s) return '--';
    const mins = Math.round(s / 60);
    return `${mins} min`;
  };

  return useMemo(() => {
    // 1. Handle Event Case
    if (selectedEvent) {
      const data = eventDetails || selectedEvent;
      const metadata = typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata || {};
      const social = metadata.social;

      const isInside = userCoords && data.boundary?.coordinates?.[0]
        ? isPointInPolygon([userCoords[0], userCoords[1]], data.boundary.coordinates[0])
        : false;

      return {
        id: String(data.id),
        type: 'event',
        name: data.name,
        subtitle: (data as any).type || 'Activity',
        description: (data as any).description || 'Explore this event and discover unique experiences in the city.',
        imageUrl: data.imageUrl || (data as any).images?.[0],
        bannerUrl: (data as any).bannerUrl,
        galleryUrls: (data as any).galleryUrls || [],
        logoUrl: (data as any).logoUrl,
        social: social ? {
          rating: social.rating,
          reviewsCount: social.reviews_count,
          snippets: social.snippets || [],
          sourceUrl: social.source_url,
        } : undefined,
        info: [
          ...(metadata.is_wheelchair_accessible ? [{
            label: 'AccessibilityIcon',
            value: 'Wheelchair Accessible',
            icon: 'AccessibilityIcon',
          }] : []),
          ...(metadata.accepts_apple_pay ? [{
            label: 'Payment',
            value: 'Accepts Apple Pay',
            icon: 'SmartphoneIcon',
          }] : []),
        ],
        metrics: [
          { 
            label: 'Hours', 
            value: (data as any).openingHours || 'Open', 
            icon: 'ClockIcon', 
            color: '#32D74B' 
          },
          { 
            label: 'Popular', 
            value: 'Trending', 
            icon: 'FlameIcon',
            color: '#FF9F0A'
          },
          { 
            label: 'Distance', 
            value: formatDistance(drivingDistance), 
            icon: 'MapPinIcon' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: formatDuration(drivingDuration), 
            icon: 'CarIcon', 
            variant: 'primary', 
            onPress: () => {
              setPlanning(true);
            } 
          },
          { 
            id: 'ar', 
            label: 'Use AR', 
            icon: 'BinocularsIcon', 
            variant: isInside ? 'subdued' : 'disabled', 
            onPress: () => {
              if (isInside) openAR(ARFilterMode.SELECTED_EVENT, data.id);
            } 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'DownloadIcon', 
            variant: 'subdued', 
            onPress: () => console.log('DownloadIcon offline') 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'GlobeIcon', 
            variant: 'subdued', 
            onPress: () => console.log('Open website') 
          },
          { 
            id: 'tickets', 
            label: 'TicketIcons', 
            icon: 'TicketIcon', 
            variant: 'subdued', 
            onPress: () => console.log('Buy tickets') 
          },
        ],
      } as DetailModel;
    }

    // 2. Handle POI Case
    if (selectedPoi) {
      const catMetadata = getCategoryMetadata(selectedPoi.category);
      const metadata = typeof selectedPoi.metadata === 'string' ? JSON.parse(selectedPoi.metadata) : selectedPoi.metadata || {};
      const social = metadata.social;
      
      const parentEvent = allEvents?.find(e => String(e.id) === String(selectedPoi.parentId));
      const parentName = parentEvent?.name;

      const isInside = userCoords && parentEvent?.boundary?.coordinates?.[0]
        ? isPointInPolygon([userCoords[0], userCoords[1]], parentEvent.boundary.coordinates[0])
        : false;

      return {
        id: selectedPoi.id,
        type: 'poi',
        name: selectedPoi.displayName,
        subtitle: `${selectedPoi.categoryLabel}${social?.rating ? ` • ${social.rating} ⭐` : ''}`,
        description: selectedPoi.description || 'A notable point of interest in the area.',
        imageUrl: selectedPoi.imageUrl || selectedPoi.images?.[0],
        bannerUrl: (selectedPoi as any).bannerUrl,
        galleryUrls: (selectedPoi as any).galleryUrls || [],
        categoryIcon: catMetadata.icon,
        parentName,
        social: social ? {
          rating: social.rating,
          reviewsCount: social.reviews_count,
          snippets: social.snippets || [],
          sourceUrl: social.source_url,
        } : undefined,
        info: [
          ...(selectedPoi.isWheelchairAccessible ? [{
            label: 'AccessibilityIcon',
            value: 'Wheelchair Accessible',
            icon: 'AccessibilityIcon',
          }] : []),
          ...(selectedPoi.hasPriorityLane ? [{
            label: 'Priority',
            value: 'Fast Track Available',
            icon: 'ZapIcon',
          }] : []),
          ...(metadata.accepts_apple_pay ? [{
            label: 'Payment',
            value: 'Accepts Apple Pay',
            icon: 'SmartphoneIcon',
          }] : []),
        ],
        metrics: [
          { 
            label: 'Hours', 
            value: 'Open', 
            icon: 'ClockIcon', 
            color: '#32D74B' 
          },
          { 
            label: 'Popular', 
            value: 'Top Choice', 
            icon: 'FlameIcon',
            color: '#FF9F0A'
          },
          { 
            label: 'Distance', 
            value: formatDistance(drivingDistance), 
            icon: 'MapPinIcon' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: formatDuration(drivingDuration), 
            icon: 'CarIcon', 
            variant: 'primary', 
            onPress: () => {
              setPlanning(true);
            } 
          },
          { 
            id: 'ar', 
            label: 'Use AR', 
            icon: 'BinocularsIcon', 
            variant: isInside ? 'subdued' : 'disabled', 
            onPress: () => {
              if (isInside) openAR(ARFilterMode.SPECIFIC_PIN, selectedPoi.id);
            } 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'DownloadIcon', 
            variant: 'subdued', 
            onPress: () => {} 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'GlobeIcon', 
            variant: 'subdued', 
            onPress: () => {} 
          },
          { 
            id: 'tickets', 
            label: 'TicketIcons', 
            icon: 'TicketIcon', 
            variant: 'subdued', 
            onPress: () => {} 
          },
        ],
      } as DetailModel;
    }

    return null;
  }, [selectedEvent, eventDetails, selectedPoi, theme, navMetadata, isFetching, allEvents, userCoords]);
};
