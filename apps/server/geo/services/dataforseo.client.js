import 'dotenv/config';
/**
 * Professional DataForSEO API Client
 * Handles authentication, error handling, and structured data retrieval.
 */
export class DataForSEOClient {
    static BASE_URL = 'https://api.dataforseo.com/v3';
    authHeader;
    constructor() {
        const login = process.env.DATAFORSEO_LOGIN;
        const password = process.env.DATAFORSEO_PASSWORD;
        if (!login || !password) {
            console.error('[DataForSEO] Missing API credentials in environment.');
            this.authHeader = '';
        }
        else {
            this.authHeader = `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`;
        }
    }
    /**
     * Searches for a business listing on Google Maps.
     */
    async searchBusiness(keyword, location) {
        if (!this.authHeader)
            return null;
        try {
            const payload = [
                {
                    keyword,
                    location_name: 'Barcelona,Catalonia,Spain',
                    language_name: 'Spanish',
                    limit: 1,
                },
            ];
            const response = await fetch(`${DataForSEOClient.BASE_URL}/serp/google/maps/live/advanced`, {
                method: 'POST',
                headers: {
                    Authorization: this.authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = (await response.json());
            // SERP API structure is slightly different
            if (data?.tasks?.[0]?.result?.[0]?.items?.[0]) {
                return data.tasks[0].result[0].items[0];
            }
            console.warn('[DataForSEO] No items found in result:', JSON.stringify(data?.tasks?.[0]?.status_message));
            return null;
        }
        catch (error) {
            console.error('[DataForSEO] Search Error:', error);
            return null;
        }
    }
    /**
     * Fetches latest reviews for a specific business.
     */
    async getReviews(placeId) {
        if (!this.authHeader)
            return null;
        try {
            const payload = [
                {
                    place_id: placeId,
                    depth: 1,
                    limit: 5,
                    sort_by: 'newest',
                },
            ];
            const response = await fetch(`${DataForSEOClient.BASE_URL}/business_data/google/reviews/live`, {
                method: 'POST',
                headers: {
                    Authorization: this.authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = (await response.json());
            return data?.tasks?.[0]?.result?.[0]?.items || [];
        }
        catch (error) {
            console.error('[DataForSEO] Reviews Error:', error);
            return [];
        }
    }
}
export const dataForSEO = new DataForSEOClient();
