import 'dotenv/config';
import { db, pool, eq, sql } from './index';
import { users, events, pointsOfInterest, nodes, pathSegments, tickets, savedLocations } from './schema';
import { seedCommon } from './seed-common';

async function seed() {
  console.log('🚀 Starting Master Seed...');

  // 1. Cleanup - Cascading truncate
  console.log('🧹 Cleaning existing event data...');
  // We truncate events first; cascade will handle POIs, Nodes, Segments
  await db.execute(sql`TRUNCATE TABLE ${events} RESTART IDENTITY CASCADE`);
  // Also clean tickets and saved locations to avoid duplicates
  await db.execute(sql`TRUNCATE TABLE ${tickets} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${savedLocations} RESTART IDENTITY CASCADE`);

  // 2. Seed Base Users & Profiles
  console.log('👤 Seeding base users...');
  await seedCommon(db);

  // Get the main test user for linking
  const [koreUser] = await db.select().from(users).where(eq(users.email, 'kore@example.com'));

  // 3. Seed Events
  console.log('📅 Creating 3 diverse events in Barcelona...');
  
  // 3.1 Nitro GP (Sports)
  await db.insert(events).values({
    name: 'Nitro GP Barcelona',
    description: 'The ultimate high-speed racing experience.',
    type: 'sports',
    startDate: new Date('2026-05-15'),
    endDate: new Date('2026-05-17'),
    locationName: 'Circuit de Barcelona-Catalunya',
    address: 'Mas La Conca, s/n, 08160 Montmeló, Barcelona, Spain',
    location: [2.2611, 41.5701],
    boundary: [[[2.2530, 41.5750], [2.2650, 41.5750], [2.2650, 41.5650], [2.2530, 41.5650], [2.2530, 41.5750]]],
    imageUrl: 'https://images.unsplash.com/photo-1532906623266-0bb7ca053177?auto=format&fit=crop&q=80&w=800',
    primaryColor: '#e10600',
    metadata: JSON.stringify({ capacity: 140000, category: 'Sports' }),
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
    address: 'Carrer de la Pau, 12, 08930 Sant Adrià de Besòs, Barcelona, Spain',
    location: [2.2215, 41.4125],
    boundary: [[[2.2150, 41.4180], [2.2300, 41.4180], [2.2300, 41.4050], [2.2150, 41.4050], [2.2150, 41.4180]]],
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    primaryColor: '#bc00ff',
    metadata: JSON.stringify({ capacity: 50000, category: 'Music' }),
  }).onConflictDoNothing();
  const [neonNights] = await db.select().from(events).where(eq(events.name, 'Neon Nights Festival'));

  // 3.3 Quantum Conf (Tech) - PERMANENT
  await db.insert(events).values({
    name: 'Quantum Tech Summit',
    description: 'Exploring the future of quantum computing, AI, and decentralized systems.',
    type: 'tech',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2099-12-31'),
    isPermanent: true,
    locationName: 'Fira Barcelona Gran Via',
    address: 'Av. Joan Carles I, 64, 08908 L\'Hospitalet de Llobregat, Barcelona, Spain',
    location: [2.1315, 41.3545],
    boundary: [[[2.1250, 41.3600], [2.1400, 41.3600], [2.1400, 41.3500], [2.1250, 41.3500], [2.1250, 41.3600]]],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    primaryColor: '#ff4704',
    metadata: JSON.stringify({ capacity: 12000, currentOccupancy: 45, category: 'Technology' }),
  }).onConflictDoNothing();
  const [quantumConf] = await db.select().from(events).where(eq(events.name, 'Quantum Tech Summit'));

  console.log('✅ Events created.');

  // 4. Seed Tickets for Test User
  if (koreUser) {
    console.log('🎫 Seeding tickets for test user...');
    await db.insert(tickets).values([
      { userId: koreUser.id, eventId: nitroGP.id, zoneName: 'general' },
      { userId: koreUser.id, eventId: neonNights.id, zoneName: 'vip' },
      { userId: koreUser.id, eventId: quantumConf.id, zoneName: 'staff' },
    ]);

    console.log('📍 Seeding saved locations for test user...');
    await db.insert(savedLocations).values([
      {
        userId: koreUser.id,
        label: 'Main Entrance (Quantum)',
        location: [2.1310, 41.3540],
      }
    ]);
  }

  // 5. Seed POIs & Graphs per Event
  const eventConfigs = [
    {
      event: nitroGP,
      pois: [
        { name: 'Main Grandstand', type: 'meetup_point', coords: [2.2592, 41.5695] as [number, number] },
        { name: 'Paddock VIP', type: 'restaurant', coords: [2.2615, 41.5698] as [number, number] },
        { name: 'Medical Center', type: 'gate', coords: [2.2635, 41.5708] as [number, number] },
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
        description: `Experience the best of ${poi.name} at ${config.event.name}.`,
        locationName: `${poi.name} Area`,
        address: config.event.address || 'Event Location',
        capacity: Math.floor(1000 + Math.random() * 4000),
        currentOccupancy: Math.floor(Math.random() * 100),
        status: 'open',
        metadata: JSON.stringify({ 
          website: 'https://lattice.app', 
          rating: (4 + Math.random()).toFixed(1), 
          openingHours: '09:00 - 23:00' 
        }),
      }).onConflictDoNothing();
    }

    // Create deterministic nodes
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

    // Connect segments with accessibility variations
    const segments = [
      { s: nodeIds[0], t: nodeIds[1], dist: 150, stairs: false, surface: 'asphalt' },
      { s: nodeIds[1], t: nodeIds[2], dist: 180, stairs: config.event.type === 'sports', surface: 'gravel' },
      { s: nodeIds[2], t: nodeIds[0], dist: 220, stairs: false, surface: 'asphalt' },
    ];

    for (const seg of segments) {
      await db.insert(pathSegments).values({
        sourceNodeId: seg.s,
        targetNodeId: seg.t,
        distance: seg.dist,
        hasStairs: seg.stairs,
        surface: seg.surface as any,
      }).onConflictDoNothing();
      // Bi-directional
      await db.insert(pathSegments).values({
        sourceNodeId: seg.t,
        targetNodeId: seg.s,
        distance: seg.dist,
        hasStairs: seg.stairs,
        surface: seg.surface as any,
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
