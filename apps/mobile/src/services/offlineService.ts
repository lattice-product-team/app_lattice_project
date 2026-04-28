import { createMMKV } from 'react-native-mmkv';
import { LatticeEvent, POICollection } from '../types';
import { geoService } from './geoService';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAPTILER_KEY } from '../constants/mapConstants';

const storage = createMMKV({ id: 'lattice-offline-cache' });

export const offlineService = {
  /**
   * Downloads an event package (Tiles + POIs + Path Network)
   */
  downloadEventPackage: async (event: LatticeEvent, onProgress?: (progress: number) => void) => {
    if (!event.boundary) {
      throw new Error('Event does not have a defined boundary for offline download');
    }

    // 1. Download POIs for this event
    const pois = await geoService.getPOIs(undefined, event.id);
    storage.set(`pois_${event.id}`, JSON.stringify(pois));

    // 2. Download Path Network for this event
    const network = await geoService.getPathNetwork(); // We might want to filter this by eventId in the future
    storage.set(`network_${event.id}`, JSON.stringify(network));

    // 3. Download Map Tiles
    // We use the first ring of the polygon as the boundary for tiles
    const coordinates = event.boundary.coordinates[0];
    
    const packOptions = {
      name: `event_${event.id}`,
      styleURL: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
      bounds: [
        [Math.min(...coordinates.map(c => c[0])), Math.min(...coordinates.map(c => c[1]))], // SW
        [Math.max(...coordinates.map(c => c[0])), Math.max(...coordinates.map(c => c[1]))], // NE
      ] as any,
      minZoom: 12,
      maxZoom: 18,
    };

    // Note: MapLibre Offline Manager uses a callback-based API
    await MapLibreGL.offlineManager.createPack(packOptions, (pack, status) => {
      if (onProgress) {
        onProgress(status.percentage / 100);
      }
    }, (pack, error) => {
      console.error('Offline pack error:', error);
    });

    storage.set(`downloaded_${event.id}`, true);
  },

  isEventDownloaded: (eventId: number) => {
    return storage.getBoolean(`downloaded_${eventId}`) || false;
  },

  getOfflinePOIs: (eventId: number): POICollection | null => {
    const data = storage.getString(`pois_${eventId}`);
    return data ? JSON.parse(data) : null;
  },

  getOfflineNetwork: (eventId: number): any | null => {
    const data = storage.getString(`network_${eventId}`);
    return data ? JSON.parse(data) : null;
  },

  deleteEventPackage: async (eventId: number) => {
    await MapLibreGL.offlineManager.deletePack(`event_${eventId}`);
    storage.remove(`pois_${eventId}`);
    storage.remove(`network_${eventId}`);
    storage.remove(`downloaded_${eventId}`);
  }
};
