import { useMemo } from 'react';
import { useMapStore } from '../store/useMapStore';
import { colors as primitiveColors } from '@app/theme';

export const useEventTheme = () => {
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  
  const eventColor = useMemo(() => {
    if (!selectedEvent) return primitiveColors.brand.primary;
    const type = selectedEvent.type as keyof typeof primitiveColors.category;
    return primitiveColors.category[type] || primitiveColors.brand.primary;
  }, [selectedEvent]);

  return {
    primaryColor: eventColor,
    isGeneric: !selectedEvent,
    eventType: selectedEvent?.type || 'generic',
  };
};
