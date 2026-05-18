import { create } from 'zustand';
import { LatticeEvent } from '../../../types';

interface EventStore {
  currentEventId: number | null;
  selectedEvent: LatticeEvent | null;


  setCurrentEvent: (event: LatticeEvent | null) => void;
  clearEvent: () => void;
}

/***
 * Specialized store for managing the current event context.
 */
export const useEventStore = create<EventStore>((set) => ({
  currentEventId: null,
  selectedEvent: null,

  setCurrentEvent: (event: LatticeEvent | null) => {
    set({
      currentEventId: event?.id || null,
      selectedEvent: event,
    });
  },

  clearEvent: () =>
    set({
      currentEventId: null,
      selectedEvent: null,
    }),
}));
