import {
  db,
  events,
  pointsOfInterest,
  eq,
  and,
  sql,
  getTableColumns,
  desc,
  inArray,
} from '@app/db';

export interface DiscoverySection {
  type: 'featured' | 'categories' | 'trending' | 'nearby';
  title: string | null;
  items: any[];
}

export class DiscoveryService {
  /**
   * Helper to generate a catchy subtitle based on POI type and metadata
   */
  private getCatchySubtitle(poi: any): string {
    const type = String(poi.type).toLowerCase();
    const metadata =
      typeof poi.metadata === 'string' ? JSON.parse(poi.metadata) : poi.metadata || {};
    const rating = metadata.social?.rating || metadata.rating;

    const ratingText = rating ? ` • ${rating} ⭐` : '';

    switch (type) {
      case 'stage':
        return `Main Performance${ratingText}`;
      case 'restaurant':
        return `Gastronomy Experience${ratingText}`;
      case 'bar':
        return `Drinks & Cocktails${ratingText}`;
      case 'shop':
        return `Official Merch${ratingText}`;
      case 'meetup_point':
        return `Exclusive VIP Lounge${ratingText}`;
      case 'medical':
        return 'Medical Support';
      case 'security':
        return 'Security Point';
      default:
        return `Must-visit Place${ratingText}`;
    }
  }

  /**
   * Retrieves the orchestrated discovery feed with GeoJSON-formatted coordinates
   * and high-value content filtering.
   */
  async getDiscoveryFeed(lat?: number, lng?: number): Promise<{ sections: DiscoverySection[] }> {
    const sections: DiscoverySection[] = [];
    const highValueCategories = ['stage', 'restaurant', 'bar', 'shop', 'meetup_point'];

    // 1. Featured Section (Events)
    const featuredEvents = await db
      .select({
        ...getTableColumns(events),
        center: sql<string>`ST_AsGeoJSON(${events.location})`,
      })
      .from(events)
      .where(eq(events.isFeatured, true))
      .limit(5);

    if (featuredEvents.length > 0) {
      sections.push({
        type: 'featured',
        title: 'Featured Experiences',
        items: featuredEvents.map((e) => ({
          ...e,
          center: e.center ? JSON.parse(e.center) : null,
          discoveryType: 'event',
          subtitle: e.locationName || 'Live Event',
        })),
      });
    }

    // 2. Categories Section
    sections.push({
      type: 'categories',
      title: null,
      items: [
        { id: 'stage', label: 'Stages', icon: 'music' },
        { id: 'restaurant', label: 'Gastronomy', icon: 'utensils' },
        { id: 'bar', label: 'Drinks', icon: 'beer' },
        { id: 'shop', label: 'Official Shop', icon: 'shopping-bag' },
        { id: 'meetup_point', label: 'VIP Areas', icon: 'star' },
      ],
    });

    // 3. Trending Section (POIs) - Enriched with catchy subtitles
    const trendingPois = await db
      .select({
        ...getTableColumns(pointsOfInterest),
        location: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
      })
      .from(pointsOfInterest)
      .where(
        and(
          eq(pointsOfInterest.isTrending, true),
          sql`${pointsOfInterest.type}::text IN (${sql.raw(highValueCategories.map((c) => `'${c}'`).join(','))})`
        )
      )
      .limit(6);

    if (trendingPois.length > 0) {
      sections.push({
        type: 'trending',
        title: 'Trending Right Now',
        items: trendingPois.map((p) => ({
          ...p,
          geometry: p.location ? JSON.parse(p.location) : null,
          discoveryType: 'poi',
          displayName: p.name,
          subtitle: this.getCatchySubtitle(p),
        })),
      });
    }

    // 4. Nearby Section (Events and POIs mixed)
    if (lat !== undefined && lng !== undefined) {
      const userPoint = `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;

      const nearbyEvents = await db
        .select({
          ...getTableColumns(events),
          center: sql<string>`ST_AsGeoJSON(${events.location})`,
          distance:
            sql<number>`ST_Distance(${events.location}::geography, ${sql.raw(userPoint)})`.as(
              'distance'
            ),
        })
        .from(events)
        .where(sql`${events.location} IS NOT NULL`)
        .orderBy(sql`distance ASC`)
        .limit(5);

      const nearbyPois = await db
        .select({
          ...getTableColumns(pointsOfInterest),
          location: sql<string>`ST_AsGeoJSON(${pointsOfInterest.location})`,
          distance:
            sql<number>`ST_Distance(${pointsOfInterest.location}::geography, ${sql.raw(userPoint)})`.as(
              'distance'
            ),
        })
        .from(pointsOfInterest)
        .where(
          and(
            sql`${pointsOfInterest.location} IS NOT NULL`,
            sql`${pointsOfInterest.type}::text IN (${sql.raw(highValueCategories.map((c) => `'${c}'`).join(','))})`
          )
        )
        .orderBy(sql`distance ASC`)
        .limit(5);

      const combinedNearby = [
        ...nearbyEvents.map((e) => ({
          ...e,
          center: e.center ? JSON.parse(e.center) : null,
          discoveryType: 'event',
          subtitle: `Featured Event • ${Math.round(e.distance / 100) / 10}km`,
        })),
        ...nearbyPois.map((p) => ({
          ...p,
          geometry: p.location ? JSON.parse(p.location) : null,
          discoveryType: 'poi',
          displayName: p.name,
          subtitle: `${this.getCatchySubtitle(p)} • ${Math.round(p.distance as number)}m`,
        })),
      ]
        .sort((a, b) => (a.distance as number) - (b.distance as number))
        .slice(0, 8);

      if (combinedNearby.length > 0) {
        sections.push({
          type: 'nearby',
          title: 'Popular Nearby',
          items: combinedNearby,
        });
      }
    }

    return { sections };
  }
}

export const discoveryService = new DiscoveryService();
