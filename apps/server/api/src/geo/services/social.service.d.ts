/**
 * Orchestrates social proof synchronization for Lattice assets.
 */
export declare class SocialService {
  /**
   * Synchronizes social data for a specific asset (Event or POI).
   */
  syncAssetSocialData(type: 'event' | 'poi', id: number, force?: boolean): Promise<any>;
  /**
   * Background sync for all active assets.
   */
  syncAllActive(): Promise<void>;
}
export declare const socialService: SocialService;
//# sourceMappingURL=social.service.d.ts.map
