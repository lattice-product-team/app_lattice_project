import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../.env') }); // from packages/db/src to root
import { db, pool } from './index';
import { pointsOfInterest, nodes, pathSegments } from './schema';
import { sql } from 'drizzle-orm';
import { seedCommon } from './seed-common';

async function seedPedralbes() {
  console.log('Seeding database (Pedralbes)...');

  // 1. Seed common data (users, profiles)
  await seedCommon(db);

  console.log('Seeding Pedralbes test POIs...');

  const pedralbesPois = [
    {
      name: 'Entrada Institut Pedralbes',
      description: 'Accés principal al centre educatiu.',
      type: 'gate',
      location: sql`ST_GeomFromText('POINT(2.1060698 41.3863034)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
    {
      name: 'Tribuna Principal Pedralbes',
      description: 'Zona de seients coberta amb vistes a la recta principal.',
      type: 'grandstand',
      location: sql`ST_GeomFromText('POINT(2.1063 41.3868)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'high',
    },
    {
      name: 'Tribuna Nord',
      description: 'Vistes panoràmiques del gir de la zona nord.',
      type: 'grandstand',
      location: sql`ST_GeomFromText('POINT(2.1055 41.3872)', 4326)`,
      isWheelchairAccessible: false, // Accessible only by stairs in this test case
      crowdLevel: 'moderate',
    },
    {
      name: 'Zona de Food Trucks',
      description: 'Diversa oferta gastronòmica a l’aire lliure.',
      type: 'restaurant',
      location: sql`ST_GeomFromText('POINT(2.1072 41.3864)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'high',
    },
    {
      name: 'WC Adaptat Sud',
      description: 'Serveis públics adaptats a la zona sud.',
      type: 'wc',
      location: sql`ST_GeomFromText('POINT(2.1068 41.3858)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Centre Mèdic Pedralbes',
      description: 'Atenció sanitària d’emergència.',
      type: 'medical',
      location: sql`ST_GeomFromText('POINT(2.1062 41.3860)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Punt de Trobada VIP',
      description: 'Accés exclusiu per a membres VIP.',
      type: 'meetup_point',
      location: sql`ST_GeomFromText('POINT(2.1066 41.3862)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'low',
    },
    {
      name: 'Pàrquing P1',
      description: 'Zona de parking per a vehicles acreditats.',
      type: 'parking',
      location: sql`ST_GeomFromText('POINT(2.1055 41.3855)', 4326)`,
      isWheelchairAccessible: true,
      crowdLevel: 'moderate',
    },
  ] as const;

  for (const poi of pedralbesPois) {
    await db
      .insert(pointsOfInterest)
      .values({
        name: poi.name,
        description: poi.description,
        type: poi.type,
        location: poi.location,
        isWheelchairAccessible: poi.isWheelchairAccessible,
        crowdLevel: poi.crowdLevel,
      })
      .onConflictDoUpdate({
        target: pointsOfInterest.name,
        set: {
          description: poi.description,
          type: poi.type,
          location: poi.location,
          isWheelchairAccessible: poi.isWheelchairAccessible,
          crowdLevel: poi.crowdLevel,
        }
      });
  }

  console.log(`Seeded ${pedralbesPois.length} Pedralbes test POIs.`);

  console.log('Seeding Pedralbes routing nodes and segments...');

  // Reset nodes and segments for clean seed
  await db.delete(pathSegments);
  await db.delete(nodes);

  // 4. Seed Nodes (Coordinate mesh for Pedralbes)
  const nodesData = [
    { id: 1, name: 'Entrance Junction', location: sql`ST_GeomFromText('POINT(2.1061 41.3863)', 4326)` },
    { id: 2, name: 'Main Ribbon Path Mid', location: sql`ST_GeomFromText('POINT(2.1064 41.3865)', 4326)` },
    { id: 3, name: 'Grandstand Entry North', location: sql`ST_GeomFromText('POINT(2.1063 41.3868)', 4326)` },
    { id: 4, name: 'Food Zone Access', location: sql`ST_GeomFromText('POINT(2.1070 41.3864)', 4326)` },
    { id: 5, name: 'VIP Plaza', location: sql`ST_GeomFromText('POINT(2.1066 41.3862)', 4326)` },
    { id: 6, name: 'Medical Path Bridge', location: sql`ST_GeomFromText('POINT(2.1062 41.3861)', 4326)` },
    { id: 7, name: 'WC South Node', location: sql`ST_GeomFromText('POINT(2.1068 41.3859)', 4326)` },
    { id: 8, name: 'Parking Loop 1', location: sql`ST_GeomFromText('POINT(2.1058 41.3858)', 4326)` },
    { id: 9, name: 'Far West Gate', location: sql`ST_GeomFromText('POINT(2.1052 41.3860)', 4326)` },
    { id: 10, name: 'North Hill Climb Start', location: sql`ST_GeomFromText('POINT(2.1058 41.3870)', 4326)` },
    { id: 11, name: 'North Hill Top', location: sql`ST_GeomFromText('POINT(2.1055 41.3872)', 4326)` },
    { id: 12, name: 'South Garden Path', location: sql`ST_GeomFromText('POINT(2.1064 41.3858)', 4326)` },
    { id: 13, name: 'West Parking Access', location: sql`ST_GeomFromText('POINT(2.1055 41.3856)', 4326)` },
  ];

  for (const node of nodesData) {
    await db.insert(nodes).values(node).onConflictDoNothing();
  }

  // 5. Seed Path Segments (Lines)
  const segmentsData = [
    // Core Backbone
    { sourceNodeId: 1, targetNodeId: 2, distance: 35.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 2, targetNodeId: 3, distance: 38.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 2, targetNodeId: 4, distance: 65.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 1, targetNodeId: 6, distance: 25.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 6, targetNodeId: 5, distance: 45.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 5, targetNodeId: 4, distance: 48.0, surface: 'asphalt', hasStairs: false },
    
    // Services access
    { sourceNodeId: 5, targetNodeId: 7, distance: 35.0, surface: 'gravel', hasStairs: false },
    { sourceNodeId: 6, targetNodeId: 12, distance: 30.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 12, targetNodeId: 7, distance: 35.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 6, targetNodeId: 8, distance: 42.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 8, targetNodeId: 13, distance: 30.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 8, targetNodeId: 9, distance: 68.0, surface: 'asphalt', hasStairs: false },
    
    // The "Stair Challenge" (Shortcut vs Long way)
    { sourceNodeId: 10, targetNodeId: 11, distance: 28.0, surface: 'stairs', hasStairs: true }, // Short but has stairs
    { sourceNodeId: 3, targetNodeId: 11, distance: 95.0, surface: 'asphalt', hasStairs: false }, // Long way around, wheelchair safe
    { sourceNodeId: 3, targetNodeId: 10, distance: 55.0, surface: 'asphalt', hasStairs: false },
    
    // Loops
    { sourceNodeId: 1, targetNodeId: 8, distance: 58.0, surface: 'asphalt', hasStairs: false },
    { sourceNodeId: 4, targetNodeId: 7, distance: 80.0, surface: 'gravel', hasStairs: false },
  ] as const;

  for (const segment of segmentsData) {
    await db.insert(pathSegments).values({
      sourceNodeId: segment.sourceNodeId,
      targetNodeId: segment.targetNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: segment.hasStairs,
    }).onConflictDoNothing();
    
    await db.insert(pathSegments).values({
      sourceNodeId: segment.targetNodeId,
      targetNodeId: segment.sourceNodeId,
      distance: segment.distance,
      surface: segment.surface,
      hasStairs: segment.hasStairs,
    }).onConflictDoNothing();
  }

  console.log('Seeded dense routing graph for Pedralbes.');
  await pool.end();
}

seedPedralbes().catch((err) => {
  console.error('Seeding Pedralbes failed:', err);
  process.exit(1);
});
