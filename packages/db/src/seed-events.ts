import { db, venues, events, pointsOfInterest, sql } from './index';

async function seed() {
  console.log('Seeding Event Platform Transition data...');

  try {
    // 1. Create Venue (Music Festival Ground)
    const [venue] = await db.insert(venues).values({
      name: 'Lattice Arena (Music Festival Ground)',
      primaryColor: '#8a2be2', // BlueViolet
      center: sql`ST_SetSRID(ST_MakePoint(2.1734, 41.3851), 4326)`, // Near Barcelona city
    }).returning();

    console.log(`Venue created: ${venue.name} (ID: ${venue.id})`);

    // 2. Create Event
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 3);

    const [event] = await db.insert(events).values({
      venueId: venue.id,
      name: 'Lattice Summer Festival 2026',
      startDate: startDate,
      endDate: endDate,
    }).returning();

    console.log(`Event created: ${event.name} (ID: ${event.id})`);

    // 3. Create POIs for this venue
    await db.insert(pointsOfInterest).values([
      {
        venueId: venue.id,
        name: 'Main Stage',
        type: 'grandstand',
        location: sql`ST_SetSRID(ST_MakePoint(2.1734, 41.3851), 4326)`,
      },
      {
        venueId: venue.id,
        name: 'VIP Lounge',
        type: 'restaurant',
        location: sql`ST_SetSRID(ST_MakePoint(2.1740, 41.3855), 4326)`,
      },
      {
        venueId: venue.id,
        name: 'Entrance Gate A',
        type: 'gate',
        location: sql`ST_SetSRID(ST_MakePoint(2.1720, 41.3840), 4326)`,
      }
    ]);

    console.log('POIs seeded successfully.');
    console.log('--- SEEDING COMPLETE ---');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seed();
