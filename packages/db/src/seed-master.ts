import 'dotenv/config';
import { db, pool, eq } from './index';
import { users, events, pointsOfInterest, nodes, pathSegments } from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🚀 Starting Master Seed...');

  // 1. Cleanup - Cascading truncate
  console.log('🧹 Cleaning existing event data...');
  await db.execute(sql`TRUNCATE TABLE ${events} RESTART IDENTITY CASCADE`);

  // 2. Seed Test User
  console.log('👤 Ensuring test user exists...');
  await db.insert(users).values({
    email: 'kore@example.com',
    passwordHash: 'password123',
    fullName: 'Kore User',
    mobilityMode: 'standard',
  }).onConflictDoNothing();

  // 3. Seed Events
  console.log('📅 Creating 3 diverse events in Barcelona...');
  
  // 3.1 Nitro GP (Sports)
  // We use numeric arrays for location and boundary to let Drizzle's customType handle the conversion
  await db.insert(events).values({
    name: 'Nitro GP Barcelona',
    description: 'The ultimate high-speed racing experience.',
    type: 'sports',
    startDate: new Date('2026-05-15'),
    endDate: new Date('2026-05-17'),
    locationName: 'Circuit de Barcelona-Catalunya',
    location: [2.2611, 41.5701],
    boundary: [[[2.2530, 41.5750], [2.2650, 41.5750], [2.2650, 41.5650], [2.2530, 41.5650], [2.2530, 41.5750]]],
  }).onConflictDoNothing();
  const [nitroGP] = await db.select().from(events).where(eq(events.name, 'Nitro GP Barcelona'));

  // 3.2 Neon Nights (Music)
  await db.insert(events).values({
    name: 'Neon Nights Festival',
    description: 'An immersive electronic music journey by the sea.',
    type: 'music',
    startDate: new Date('2026-07-10'),
    endDate: new Date('2026-07-12'),
    locationName: 'Parc del Fòrum',
    location: [2.2215, 41.4125],
    boundary: [[[2.2150, 41.4180], [2.2300, 41.4180], [2.2300, 41.4050], [2.2150, 41.4050], [2.2150, 41.4180]]],
  }).onConflictDoNothing();
  const [neonNights] = await db.select().from(events).where(eq(events.name, 'Neon Nights Festival'));

  // 3.3 Quantum Conf (Tech)
  await db.insert(events).values({
    name: 'Quantum Tech Summit',
    description: 'Exploring the future of quantum computing and AI.',
    type: 'tech',
    startDate: new Date('2026-11-05'),
    endDate: new Date('2026-11-07'),
    locationName: 'Fira Barcelona Gran Via',
    location: [2.1315, 41.3545],
    boundary: [[[2.1250, 41.3600], [2.1400, 41.3600], [2.1400, 41.3500], [2.1250, 41.3500], [2.1250, 41.3600]]],
  }).onConflictDoNothing();
  const [quantumConf] = await db.select().from(events).where(eq(events.name, 'Quantum Tech Summit'));

  console.log('✅ Events created.');

  // 4. Seed POIs & Graphs per Event
  const eventConfigs = [
    {
      event: nitroGP,
      pois: [
        { name: 'Main Grandstand', type: 'grandstand', coords: [2.2592, 41.5695] as [number, number] },
        { name: 'Paddock VIP', type: 'restaurant', coords: [2.2615, 41.5698] as [number, number] },
        { name: 'Medical Center', type: 'medical', coords: [2.2635, 41.5708] as [number, number] },
      ],
      nodeOffset: 100
    },
    {
      event: neonNights,
      pois: [
        { name: 'Solar Stage', type: 'meetup_point', coords: [2.2235, 41.4135] as [number, number] },
        { name: 'Ocean Stage', type: 'meetup_point', coords: [2.2255, 41.4115] as [number, number] },
        { name: 'Chill Out Zone', type: 'restaurant', coords: [2.2215, 41.4125] as [number, number] },
      ],
      nodeOffset: 200
    },
    {
      event: quantumConf,
      pois: [
        { name: 'Main Auditorium', type: 'meetup_point', coords: [2.1315, 41.3545] as [number, number] },
        { name: 'Innovation Hall', type: 'shop', coords: [2.1335, 41.3535] as [number, number] },
        { name: 'Registration Desk', type: 'gate', coords: [2.1295, 41.3555] as [number, number] },
      ],
      nodeOffset: 300
    }
  ];

  for (const config of eventConfigs) {
    if (!config.event) continue;
    console.log(`📍 Seeding graph for: ${config.event.name}`);
    
    // Create POIs
    for (const poi of config.pois) {
      await db.insert(pointsOfInterest).values({
        name: poi.name,
        type: poi.type as any,
        location: poi.coords,
        eventId: config.event.id,
      }).onConflictDoNothing();
    }

    // Create a small triangle graph for each
    const nodeIds = [config.nodeOffset + 1, config.nodeOffset + 2, config.nodeOffset + 3];
    const coords = config.pois.map(p => p.coords);

    for (let i = 0; i < nodeIds.length; i++) {
      await db.insert(nodes).values({
        id: nodeIds[i],
        name: `${config.event.name} Node ${i+1}`,
        location: coords[i],
        eventId: config.event.id,
      }).onConflictDoNothing();
    }

    // Connect them
    const segments = [
      { s: nodeIds[0], t: nodeIds[1], dist: 150, stairs: false },
      { s: nodeIds[1], t: nodeIds[2], dist: 180, stairs: config.event.type === 'sports' },
      { s: nodeIds[2], t: nodeIds[0], dist: 220, stairs: false },
    ];

    for (const seg of segments) {
      await db.insert(pathSegments).values({
        sourceNodeId: seg.s,
        targetNodeId: seg.t,
        distance: seg.dist,
        hasStairs: seg.stairs,
        surface: 'asphalt',
      }).onConflictDoNothing();
      // Bi-directional
      await db.insert(pathSegments).values({
        sourceNodeId: seg.t,
        targetNodeId: seg.s,
        distance: seg.dist,
        hasStairs: seg.stairs,
        surface: 'asphalt',
      }).onConflictDoNothing();
    }
  }

  console.log('✨ Master Seeding complete!');
  await pool.end();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
