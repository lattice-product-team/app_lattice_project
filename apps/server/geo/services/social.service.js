import { db, events, pointsOfInterest, eq } from '@app/db';
import { dataForSEO } from './dataforseo.client';
/**
 * Orchestrates social proof synchronization for Lattice assets.
 */
export class SocialService {
    /**
     * Synchronizes social data for a specific asset (Event or POI).
     */
    async syncAssetSocialData(type, id, force = false) {
        try {
            // 1. Fetch asset details
            const table = type === 'event' ? events : pointsOfInterest;
            const result = await db.select().from(table).where(eq(table.id, id)).limit(1);
            if (result.length === 0)
                return null;
            const asset = result[0];
            // --- CACHE CHECK ---
            const existingMetadata = asset.metadata ? JSON.parse(asset.metadata) : {};
            const lastSync = existingMetadata.social?.last_sync;
            if (!force && lastSync) {
                const diffDays = Math.ceil((new Date().getTime() - new Date(lastSync).getTime()) / (1000 * 3600 * 24));
                if (diffDays < 7) {
                    console.log(`[SocialService] Cache hit for ${type} ${id} (${diffDays} days old). Skipping API.`);
                    return existingMetadata.social;
                }
            }
            console.log(`[SocialService] Syncing ${type} ${id} from DataForSEO...`);
            // Use asset location if available
            const lat = 41.3851, lng = 2.1734; // Default BCN
            // 2. Perform Search
            // Use manual override if available, otherwise search by name
            const searchKeyword = existingMetadata.social?.source_url || existingMetadata.source_url || asset.name;
            const business = await dataForSEO.searchBusiness(searchKeyword, { lat, lng });
            if (!business) {
                console.log(`[SocialService] No match found for ${asset.name}`);
                return null;
            }
            // 3. Prepare social metadata
            const socialData = {
                rating: business.rating?.value || business.rating || 0,
                reviews_count: business.rating?.votes_count || business.reviews_count || 0,
                source_url: business.url || business.website,
                place_id: business.place_id || business.cid,
                last_sync: new Date().toISOString(),
                snippets: [],
            };
            // 4. Fetch reviews if place_id/cid found
            const targetId = business.place_id || business.cid;
            if (targetId) {
                const reviews = await dataForSEO.getReviews(targetId);
                socialData.snippets = reviews
                    .slice(0, 3)
                    .map((r) => r.text)
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
        }
        catch (error) {
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
