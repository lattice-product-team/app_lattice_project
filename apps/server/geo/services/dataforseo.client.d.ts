import 'dotenv/config';
/**
 * Professional DataForSEO API Client
 * Handles authentication, error handling, and structured data retrieval.
 */
export declare class DataForSEOClient {
    private static readonly BASE_URL;
    private readonly authHeader;
    constructor();
    /**
     * Searches for a business listing on Google Maps.
     */
    searchBusiness(keyword: string, location?: {
        lat: number;
        lng: number;
    }): Promise<any>;
    /**
     * Fetches latest reviews for a specific business.
     */
    getReviews(placeId: string): Promise<any>;
}
export declare const dataForSEO: DataForSEOClient;
//# sourceMappingURL=dataforseo.client.d.ts.map