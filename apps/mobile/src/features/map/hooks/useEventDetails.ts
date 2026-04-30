import { useState, useEffect } from 'react';
import { LatticeEvent } from '../../../types';

export interface EventDetails extends LatticeEvent {
  description?: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string;
  distance?: string;
  website?: string;
  phone?: string;
}

export const useEventDetails = (eventId: string | null) => {
  const [details, setDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setDetails(null);
      return;
    }

    setLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setDetails({
        id: Number(eventId),
        name: eventId === '1' ? 'Música en el Parque' : eventId === '2' ? 'Fira Gastronòmica' : 'Exposición de Arte',
        type: eventId === '1' ? 'music' : eventId === '2' ? 'food' : 'generic',
        description: 'The Real Club de Polo de Barcelona is a sports venue located in Barcelona. Established in 1897, it had 9000 members at the time of the 1992 Summer Olympics.',
        rating: 4.8,
        reviewsCount: 26,
        openingHours: 'Open',
        distance: '900m',
        website: 'https://rcpolo.com',
        phone: '+34 932 03 12 12',
        imageUrl: eventId === '1' 
          ? 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'
          : eventId === '2' 
            ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
            : 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac'
      });
      setLoading(false);
    }, 400);
  }, [eventId]);

  return { details, loading };
};
