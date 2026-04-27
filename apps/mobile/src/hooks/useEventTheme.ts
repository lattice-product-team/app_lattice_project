import { useMemo } from 'react';
import { useMapStore } from '../store/useMapStore';
import { colors } from '../styles/colors';

export const useEventTheme = () => {
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  
  const eventColor = useMemo(() => {
    if (!selectedEvent) return colors.categories.generic;
    return colors.categories[selectedEvent.type] || colors.categories.generic;
  }, [selectedEvent]);

  return {
    primaryColor: eventColor,
    isGeneric: !selectedEvent,
    eventType: selectedEvent?.type || 'generic',
  };
};
