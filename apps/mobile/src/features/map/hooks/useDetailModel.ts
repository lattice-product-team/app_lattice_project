import { useMemo } from 'react';
import { usePOIStore } from '../../poi/store/usePOIStore';
import { useEventStore } from '../../event/store/useEventStore';
import { useEventDetails } from './useEventDetails';
import { PremiumDetailModel } from '../../../types/models/detail';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getCategoryMetadata } from '../../../utils/poiUtils';

/**
 * Normalization hook that converts Event or POI data into a unified
 * PremiumDetailModel for the redesigned DetailSheet.
 */
export const useDetailModel = (): PremiumDetailModel | null => {
  const theme = useAppTheme();
  const selectedPoi = usePOIStore((s) => s.selectedPoi);
  const selectedEvent = useEventStore((s) => s.selectedEvent);
  
  // Fetch supplemental details for events if selected
  const { details: eventDetails } = useEventDetails(
    selectedEvent?.id ? String(selectedEvent.id) : null
  );

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
            value: (data as any).distance || '900m', 
            icon: 'map-marker-distance' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: '52 min', 
            icon: 'car', 
            type: 'primary', 
            onPress: () => console.log('Navigate to event') 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'check-circle-outline', 
            type: 'secondary', 
            onPress: () => console.log('Download offline') 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'compass-outline', 
            type: 'secondary', 
            onPress: () => console.log('Open website') 
          },
          { 
            id: 'tickets', 
            label: 'Tickets', 
            icon: 'ticket-outline', 
            type: 'secondary', 
            onPress: () => console.log('Buy tickets') 
          },
        ],
      } as PremiumDetailModel;
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
            value: selectedPoi.distance || '41 km', 
            icon: 'map-marker-distance' 
          },
        ],
        actions: [
          { 
            id: 'directions', 
            label: '52 min', 
            icon: 'car', 
            type: 'primary', 
            onPress: () => console.log('Navigate to POI') 
          },
          { 
            id: 'offline', 
            label: 'Offline', 
            icon: 'check-circle-outline', 
            type: 'secondary', 
            onPress: () => {} 
          },
          { 
            id: 'website', 
            label: 'Website', 
            icon: 'compass-outline', 
            type: 'secondary', 
            onPress: () => {} 
          },
          { 
            id: 'tickets', 
            label: 'Tickets', 
            icon: 'ticket-outline', 
            type: 'secondary', 
            onPress: () => {} 
          },
        ],
      } as PremiumDetailModel;
    }

    return null;
  }, [selectedEvent, eventDetails, selectedPoi, theme]);
};

