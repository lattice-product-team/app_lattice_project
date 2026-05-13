import { db, events, pointsOfInterest, eq, and, sql } from '@app/db';

export interface DiscoverySection {
  type: 'featured' | 'categories' | 'trending' | 'nearby';
  title: string | null;
  items: any[];
}

export class DiscoveryService {
  /**
   * Retrieves the orchestrated discovery feed
   */
  async getDiscoveryFeed(lat?: number, lng?: number): Promise<{ sections: DiscoverySection[] }> {
    const sections: DiscoverySection[] = [];

    // 1. Featured Section (Events)
    const featuredEvents = await db.select()
      .from(events)
      .where(eq(events.isFeatured, true))
      .limit(5);

    if (featuredEvents.length > 0) {
      sections.push({
        type: 'featured',
        title: 'Destacados',
        items: featuredEvents,
      });
    }

    // 2. Categories Section (Static for now, could be dynamic)
    sections.push({
      type: 'categories',
      title: null,
      items: [
        { id: 'music', label: 'Concerts', icon: 'music' },
        { id: 'nightlife', label: 'Nightlife', icon: 'glass-martini' },
        { id: 'art', label: 'Art', icon: 'palette' },
        { id: 'festival', label: 'Festivals', icon: 'tent' },
      ],
    });

    // 3. Trending Section (POIs)
    const trendingPois = await db.select()
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.isTrending, true))
      .limit(6);

    if (trendingPois.length > 0) {
      sections.push({
        type: 'trending',
        title: 'Trending Places',
        items: trendingPois,
      });
    }

    // 4. Nearby Section (Events and POIs mixed, sorted by proximity)
    if (lat !== undefined && lng !== undefined) {
      // Basic proximity sorting using PostGIS if geometry is available
      // ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography)
      
      const userPoint = `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;
      
      const nearbyEvents = await db.select({
        ...events,
        distance: sql<number>`ST_Distance(${events.location}::geography, ${sql.raw(userPoint)})`.as('distance')
      })
      .from(events)
      .where(sql`${events.location} IS NOT NULL`)
      .orderBy(sql`distance ASC`)
      .limit(5);
      
      const nearbyPois = await db.select({
        ...pointsOfInterest,
        distance: sql<number>`ST_Distance(${pointsOfInterest.location}::geography, ${sql.raw(userPoint)})`.as('distance')
      })
      .from(pointsOfInterest)
      .where(sql`${pointsOfInterest.location} IS NOT NULL`)
      .orderBy(sql`distance ASC`)
      .limit(5);

      const combinedNearby = [...nearbyEvents, ...nearbyPois]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 8); // Top 8 nearby items

      if (combinedNearby.length > 0) {
        sections.push({
          type: 'nearby',
          title: 'Nearby Now',
          items: combinedNearby,
        });
      }
    }

    return { sections };
  }
}

export const discoveryService = new DiscoveryService();
