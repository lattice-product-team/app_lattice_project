import { db, events, pointsOfInterest, eq, sql } from '@app/db';
import { dataForSEO } from './dataforseo.client.js';

/**
 * Orchestrates social proof synchronization for Lattice assets.
 */
export class SocialService {
  /**
   * Synchronizes social data for a specific asset (Event or POI).
   */
  async syncAssetSocialData(type: 'event' | 'poi', id: number, force = false) {
    try {
      // 1. Fetch asset details
      const table = type === 'event' ? events : pointsOfInterest;
      const result = await db.select().from(table).where(eq(table.id, id)).limit(1);

      if (result.length === 0) return null;
      const asset = result[0] as any;

      // --- CACHE CHECK ---
      const existingMetadata = asset.metadata ? JSON.parse(asset.metadata) : {};
      const lastSync = existingMetadata.social?.last_sync;

      if (!force && lastSync) {
        const diffDays = Math.ceil(
          (new Date().getTime() - new Date(lastSync).getTime()) / (1000 * 3600 * 24)
        );
        if (diffDays < 7) {
          console.log(
            `[SocialService] Cache hit for ${type} ${id} (${diffDays} days old). Skipping API.`
          );
          return existingMetadata.social;
        }
      }

      console.log(`[SocialService] Syncing ${type} ${id} from DataForSEO...`);

      // Use asset location if available
      let lat = 41.3851;
      let lng = 2.1734; // Default BCN

      if (asset.location) {
        // PostGIS point format "POINT(lng lat)" or binary
        // Drizzle might return it differently depending on setup
        if (typeof asset.location === 'string') {
          const match = asset.location.match(/POINT\((.+) (.+)\)/);
          if (match) {
            lng = parseFloat(match[1]);
            lat = parseFloat(match[2]);
          }
        }
      }

      // 2. Perform Search (Optimized: only if we don't have a place identifier)
      const existingPlaceId = existingMetadata.social?.place_id;
      let business = null;
      let targetId = existingPlaceId;

      if (!targetId) {
        // Use manual override if available, otherwise search by name
        const searchKeyword =
          existingMetadata.social?.source_url || existingMetadata.source_url || asset.name;
        business = await dataForSEO.searchBusiness(searchKeyword, { lat, lng });

        if (!business) {
          console.log(`[SocialService] No match found for ${asset.name}`);
          return null;
        }
        targetId = business.place_id || business.cid;
      }

      // 3. Prepare social metadata
      const socialData = {
        rating: business
          ? business.rating?.value || business.rating || 0
          : existingMetadata.social?.rating || 0,
        reviews_count: business
          ? business.rating?.votes_count || business.reviews_count || 0
          : existingMetadata.social?.reviews_count || 0,
        source_url: business
          ? business.url || business.website
          : existingMetadata.social?.source_url,
        place_id: targetId,
        last_sync: new Date().toISOString(),
        snippets: [] as string[],
      };

      // 4. Fetch reviews if place_id/cid found
      if (targetId) {
        const reviews = await dataForSEO.getReviews(targetId);
        socialData.snippets = reviews
          .slice(0, 3)
          .map((r: any) => r.text)
          .filter(Boolean);
      }

      // 4. Update metadata in DB
      // We merge with existing metadata
      const updatedMetadata = JSON.stringify({
        ...existingMetadata,
        social: socialData,
      });

      await db.update(table).set({ metadata: updatedMetadata }).where(eq(table.id, id));

      console.log(`[SocialService] Successfully synced ${type} ${id}`);
      return socialData;
    } catch (error) {
      console.error(`[SocialService] Sync Error for ${type} ${id}:`, error);
      return null;
    }
  }

  /**
   * Background sync for all active assets.
   */
  async syncAllActive() {
    // Logic to iterate over active events and their POIs
    // This could be triggered by a cron job
  }
}

export const socialService = new SocialService();
