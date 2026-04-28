import { createMMKV } from 'react-native-mmkv';
import { LatticeEvent, POICollection } from '../types';
import { geoService } from './geoService';
import MapLibreGL from '../utils/safeMapLibre';

const storage = typeof createMMKV !== 'undefined' 
  ? createMMKV({ id: 'lattice-offline-cache' })
  : {
      set: () => {},
      getString: () => null,
      getNumber: () => null,
      getBoolean: () => null,
      delete: () => {},
    } as any;

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
      styleURL: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      bounds: [
        [Math.min(...coordinates.map(c => c[0])), Math.min(...coordinates.map(c => c[1]))], // SW
        [Math.max(...coordinates.map(c => c[0])), Math.max(...coordinates.map(c => c[1]))], // NE
      ] as [number, number][],
      minZoom: 12,
      maxZoom: 18,
    };

    // Note: MapLibre Offline Manager uses a callback-based API
    await MapLibreGL.offlineManager.createPack(packOptions, (pack, status) => {
      if (onProgress) {
        onProgress(status.percentage / 100);
      }
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
    storage.delete(`pois_${eventId}`);
    storage.delete(`network_${eventId}`);
    storage.delete(`downloaded_${eventId}`);
  }
};
