import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { useAuthStore } from '../hooks/useAuthStore';
import * as Location from 'expo-location';

/**
 * Service to handle location telemetry (Crowd Radar)
 */
export const telemetryService = {
  /**
   * Send a single location ping to the server
   */
  async ping() {
    const { user, activeTicket, eventConfig } = useAuthStore.getState();
    
    // Only ping if we have an active event/venue context
    const eventId = eventConfig?.id || activeTicket?.eventId;
    if (!eventId || !user) return;

    try {
      // Get current location (Fast/Low power)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      await apiClient.post('/telemetry/ping', {
        userId: user.id,
        eventId: eventId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      console.log('Telemetry ping sent');
    } catch (error) {
      console.error('Failed to send telemetry ping:', error);
    }
  },

  /**
   * Start periodic pings (Simulation for MVP)
   * In a real app, this would use expo-task-manager for true backgrounding.
   */
  startPinging(intervalMs = 60000) {
    const interval = setInterval(() => {
      this.ping();
    }, intervalMs);
    
    return () => clearInterval(interval);
  }
};
