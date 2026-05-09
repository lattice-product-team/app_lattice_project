import { useMemo } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useEventDetails } from './useEventDetails';
import { DetailModel } from '../../../types/models/detail';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { useSearchEvents } from './useSearchEvents';

/**
 * Normalization hook that converts Event or POI data into a unified
 * DetailModel for the redesigned DetailSheet.
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

      return {
        id: String(data.id),
        type: 'event',
        name: data.name,
        subtitle: (data as any).type || 'Activity',
        description: (data as any).description || 'Explore this event and discover unique experiences in the city.',
        imageUrl: data.imageUrl || (data as any).images?.[0],
        logoUrl: (data as any).logoUrl,
        social: social ? {
          rating: social.rating,
          reviewsCount: social.reviews_count,
          snippets: social.snippets || [],
          sourceUrl: social.source_url,
        } : undefined,
        metrics: [
          { 
            label: 'Hours', 
            value: (data as any).openingHours || 'Open', 
            icon: 'clock-outline', 
            color: '#32D74B' 
          },
          { 
            label: 'Popular', 
            value: 'Trending', 
            icon: 'fire',
            color: '#FF9F0A'
          },
          { 
            label: 'Distance', 
            value: formatDistance(drivingDistance), 
            icon: 'map-marker-distance' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: formatDuration(drivingDuration), 
            icon: 'car', 
            variant: 'primary', 
            onPress: () => {
              setPlanning(true);
            } 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'check-circle-outline', 
            variant: 'subdued', 
            onPress: () => console.log('Download offline') 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'compass-outline', 
            variant: 'subdued', 
            onPress: () => console.log('Open website') 
          },
          { 
            id: 'tickets', 
            label: 'Tickets', 
            icon: 'ticket-outline', 
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

      return {
        id: selectedPoi.id,
        type: 'poi',
        name: selectedPoi.displayName,
        subtitle: `${selectedPoi.categoryLabel}${social?.rating ? ` • ${social.rating} ⭐` : ''}`,
        description: selectedPoi.description || 'A notable point of interest in the area.',
        imageUrl: selectedPoi.images?.[0],
        categoryIcon: catMetadata.icon,
        parentName,
        social: social ? {
          rating: social.rating,
          reviewsCount: social.reviews_count,
          snippets: social.snippets || [],
          sourceUrl: social.source_url,
        } : undefined,
        metrics: [
          { 
            label: 'Hours', 
            value: 'Open', 
            icon: 'clock-outline', 
            color: '#32D74B' 
          },
          { 
            label: 'Popular', 
            value: 'Top Choice', 
            icon: 'fire',
            color: '#FF9F0A'
          },
          { 
            label: 'Accepts', 
            value: 'Pay', 
            icon: 'apple',
          },
          { 
            label: 'Distance', 
            value: formatDistance(drivingDistance), 
            icon: 'map-marker-distance' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: formatDuration(drivingDuration), 
            icon: 'car', 
            variant: 'primary', 
            onPress: () => {
              setPlanning(true);
            } 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'check-circle-outline', 
            variant: 'subdued', 
            onPress: () => {} 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'compass-outline', 
            variant: 'subdued', 
            onPress: () => {} 
          },
          { 
            id: 'tickets', 
            label: 'Tickets', 
            icon: 'ticket-outline', 
            variant: 'subdued', 
            onPress: () => {} 
          },
        ],
      } as DetailModel;
    }

    return null;
  }, [selectedEvent, eventDetails, selectedPoi, theme, navMetadata, isFetching, allEvents]);
};
