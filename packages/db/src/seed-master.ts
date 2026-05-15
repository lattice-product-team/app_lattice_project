import 'dotenv/config';
import { db, pool, eq, sql } from './index.js';
import {
  users,
  events,
  pointsOfInterest,
  nodes,
  pathSegments,
  tickets,
  savedLocations,
  telemetryLogs,
} from './schema.js';
import { seedCommon } from './seed-common.js';

interface SeedPoi {
  name: string;
  type: string;
  offset?: [number, number];
  bannerUrl?: string;
  galleryUrls?: string[];
}

interface SeedEvent {
  name: string;
  description: string;
  type: string;
  locationName: string;
  address: string;
  location: [number, number];
  primaryColor: string;
  bannerUrl: string;
  galleryUrls: string[];
  category: string;
  pois: SeedPoi[];
}

interface SeedData {
  events: SeedEvent[];
}

async function seed() {
  console.log('🚀 Starting Master Seed...');

  // 1. Cleanup - Cascading truncate
  console.log('🧹 Cleaning existing event data...');
  // We truncate events first; cascade will handle POIs, Nodes, Segments
  await db.execute(sql`TRUNCATE TABLE ${events} RESTART IDENTITY CASCADE`);
  // Also clean tickets and saved locations to avoid duplicates
  await db.execute(sql`TRUNCATE TABLE ${tickets} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${savedLocations} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${telemetryLogs} RESTART IDENTITY CASCADE`);

  // 2. Seed Base Users & Profiles
  console.log('👤 Seeding base users...');
  await seedCommon(db);

  // Get the main test user for linking
  const [koreUser] = await db.select().from(users).where(eq(users.email, 'kore@example.com'));

  // 3. Seed Rich Data
  const seedData = (await import('./seed.json', { assert: { type: 'json' } })).default as SeedData;
  console.log(`📅 Creating ${seedData.events.length} events from seed.json...`);

  for (let i = 0; i < seedData.events.length; i++) {
    const eventData = seedData.events[i];
    console.log(`✨ Creating event: ${eventData.name}`);

    // 3.1 Insert Event
    await db
      .insert(events)
      .values({
        name: eventData.name,
        description: eventData.description,
        type: eventData.type as any,
        startDate: new Date('2026-05-15'),
        endDate: new Date('2026-05-17'),
        locationName: eventData.locationName,
        address: eventData.address,
        location: eventData.location as [number, number],
        boundary: [
          [
            [eventData.location[0] - 0.01, eventData.location[1] + 0.01],
            [eventData.location[0] + 0.01, eventData.location[1] + 0.01],
            [eventData.location[0] + 0.01, eventData.location[1] - 0.01],
            [eventData.location[0] - 0.01, eventData.location[1] - 0.01],
            [eventData.location[0] - 0.01, eventData.location[1] + 0.01],
          ],
        ],
        bannerUrl: eventData.bannerUrl,
        galleryUrls: eventData.galleryUrls || [],
        primaryColor: eventData.primaryColor,
        isFeatured: i === 0 || i === 3, // Featured if it's the first or fourth
        isTrending: true,
        metadata: JSON.stringify({
          capacity: 50000,
          category: eventData.category,
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
        }),
      })
      .onConflictDoNothing();

    const [event] = await db.select().from(events).where(eq(events.name, eventData.name));

    // 3.2 Seed Tickets if user exists
    if (koreUser) {
      await db.insert(tickets).values({
        userId: koreUser.id,
        eventId: event.id,
        zoneName: i === 0 ? 'VIP' : 'General',
      });
    }

    // 3.3 Seed POIs for this event
    console.log(`📍 Creating ${eventData.pois.length} POIs for ${event.name}`);
    for (const poiData of eventData.pois) {
      const poiCoords: [number, number] = [
        eventData.location[0] + (poiData.offset?.[0] || 0),
        eventData.location[1] + (poiData.offset?.[1] || 0),
      ];

      await db
        .insert(pointsOfInterest)
        .values({
          name: poiData.name,
          type: poiData.type as any,
          location: poiCoords,
          bannerUrl:
            poiData.bannerUrl ||
            `PLACEHOLDER_POI_${poiData.name.toUpperCase().replace(/\s+/g, '_')}_BANNER`,
          galleryUrls: poiData.galleryUrls || [],
          eventId: event.id,
          description: `Enjoy ${poiData.name} at ${event.name}.`,
          locationName: `${poiData.name} Zone`,
          address: eventData.address,
          capacity: 500,
          currentOccupancy: Math.floor(Math.random() * 100),
          status: 'open',
          isTrending: Math.random() > 0.5,
          metadata: JSON.stringify({
            rating: (4.0 + Math.random()).toFixed(1),
            openingHours: '09:00 - 02:00',
          }),
        })
        .onConflictDoNothing();
    }

    // 3.4 Seed Mock Telemetry for Crowd Radar
    console.log(`📡 Seeding mock telemetry for ${event.name}`);
    for (let j = 0; j < 30; j++) {
      const latOffset = (Math.random() - 0.5) * 0.015;
      const lngOffset = (Math.random() - 0.5) * 0.015;
      await db.insert(telemetryLogs).values({
        userId: koreUser ? (j % 2 === 0 ? koreUser.id : 1) : 1,
        eventId: event.id,
        location: [eventData.location[0] + lngOffset, eventData.location[1] + latOffset],
        timestamp: new Date(Date.now() - Math.random() * 600000), // Random within last 10 mins
      });
    }
  }

  console.log('✨ Master Seeding complete!');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
