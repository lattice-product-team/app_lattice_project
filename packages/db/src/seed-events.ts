import { db, venues, events, pointsOfInterest, sql } from './index';

async function seed() {
  console.log('Seeding Real Event System data...');

  try {
    // 1. Create Venue (The Main Island)
    const [venue] = await db.insert(venues).values({
      name: 'Midnight Island Grounds',
      primaryColor: '#ff382e',
      center: sql`ST_SetSRID(ST_MakePoint(2.1734, 41.3851), 4326)`,
    }).returning();

    console.log(`Venue created: ${venue.name} (ID: ${venue.id})`);

    // 2. Create Realistic Events
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const seededEvents = await db.insert(events).values([
      {
        venueId: venue.id,
        name: 'Música en el Parque',
        type: 'music',
        description: 'Concierto de jazz y soul al aire libre con artistas locales. Una experiencia única bajo las estrellas de Midnight Island.',
        locationName: 'Escenario Principal',
        imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
        startDate: now,
        endDate: in2Hours,
        metadata: JSON.stringify({ rating: 4.8, reviewsCount: 120, website: 'https://midnight.music' }),
      },
      {
        venueId: venue.id,
        name: 'Fira Gastronòmica',
        type: 'food',
        description: 'Descubre los sabores de la isla. Degustaciones, talleres de cocina y los mejores food trucks de la región.',
        locationName: 'Food Court Central',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
        startDate: now,
        endDate: tomorrow,
        metadata: JSON.stringify({ rating: 4.9, reviewsCount: 85, website: 'https://midnight.food' }),
      },
      {
        venueId: venue.id,
        name: 'Exposición de Arte Contemporáneo',
        type: 'generic',
        description: 'Galería abierta con obras de artistas emergentes. Una mirada crítica y estética sobre el futuro de la isla.',
        locationName: 'Pabellón de Arte',
        imageUrl: 'https://images.unsplash.com/photo-1460666819451-7410f5ef13ac',
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 48 * 60 * 60 * 1000),
        metadata: JSON.stringify({ rating: 4.5, reviewsCount: 42, website: 'https://midnight.art' }),
      }
    ]).returning();

    console.log(`Seeded ${seededEvents.length} events.`);

    // 3. Create POIs (Venues/Stages) linked to Events
    // Event 0 (Music) -> POI 0 (Main Stage)
    await db.insert(pointsOfInterest).values([
      {
        venueId: venue.id,
        eventId: seededEvents[0].id,
        name: 'Escenario Principal (Lattice Arena)',
        description: 'El corazón musical de la isla. Sonido envolvente y capacidad para 5000 personas.',
        type: 'grandstand',
        location: sql`ST_SetSRID(ST_MakePoint(2.1734, 41.3851), 4326)`,
      },
      {
        venueId: venue.id,
        eventId: seededEvents[1].id,
        name: 'Zona Gastro (Food Court)',
        description: 'Área de restauración con sombrillas y música ambiente.',
        type: 'restaurant',
        location: sql`ST_SetSRID(ST_MakePoint(2.1740, 41.3855), 4326)`,
      },
      {
        venueId: venue.id,
        eventId: seededEvents[2].id,
        name: 'Pabellón de Cristal',
        description: 'Espacio expositivo con luz natural.',
        type: 'shop',
        location: sql`ST_SetSRID(ST_MakePoint(2.1720, 41.3840), 4326)`,
      }
    ]);

    console.log('POIs (Venues) seeded successfully.');
    console.log('--- SEEDING COMPLETE ---');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seed();
