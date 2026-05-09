import { useMemo } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useEventDetails } from './useEventDetails';
import { DetailModel } from '../../../types/models/detail';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';

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

  // Get navigation data (Driving for the button, Current for the metrics)
  const navMetadata = useNavigationStore((s) => s.metadata);
  const setPlanning = useNavigationStore((s) => s.setPlanning);
  const isFetching = useNavigationStore((s) => s.isFetching);
  const deselect = usePOIStore((s) => s.deselect);

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
      return {
        id: String(data.id),
        type: 'event',
        name: data.name,
        subtitle: (data as any).type || 'Activity',
        description: (data as any).description || 'Explore this event and discover unique experiences in the city.',
        imageUrl: data.imageUrl || (data as any).images?.[0],
        logoUrl: (data as any).logoUrl,
        metrics: [
          { 
            label: 'Hours', 
            value: (data as any).openingHours || 'Open', 
            icon: 'clock-outline', 
            color: '#32D74B' 
          },
          { 
            label: 'Rating', 
            value: (data as any).rating ? `${Math.round((data as any).rating * 20)}%` : '88%', 
            icon: 'thumb-up-outline' 
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
      const metadata = getCategoryMetadata(selectedPoi.category);
      return {
        id: selectedPoi.id,
        type: 'poi',
        name: selectedPoi.displayName,
        subtitle: selectedPoi.categoryLabel,
        description: selectedPoi.description || 'A notable point of interest in the area.',
        imageUrl: selectedPoi.images?.[0],
        categoryIcon: metadata.icon,
        metrics: [
          { 
            label: 'Hours', 
            value: 'Open', 
            icon: 'clock-outline', 
            color: '#32D74B' 
          },
          { 
            label: 'Rating', 
            value: '83%', 
            icon: 'thumb-up-outline' 
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
  }, [selectedEvent, eventDetails, selectedPoi, theme, navMetadata, isFetching]);
};

