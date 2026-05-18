import 'dotenv/config';
import { db, pool, eq, sql } from './index.js';
import { events, tickets } from './schema.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateQRs() {
  console.log('🎟️  Starting SMART Ticket & QR Generation...');

  const outputDir = './sample_tickets';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  } else {
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  }

  // 1. Get ALL events from DB
  const allEvents = await db.select().from(events);
  if (allEvents.length === 0) {
    console.error('❌ No events found. Run db:seed first.');
    process.exit(1);
  }

  console.log(`🔍 Found ${allEvents.length} events. Mapping tickets to specific locations...`);

  for (const event of allEvents) {
    // 2. Look for special locations (Grandstands, VIP, Stages) in the event's POIs
    // We fetch POIs for this event
    const { pointsOfInterest } = await import('./schema.js');
    const eventPois = await db
      .select()
      .from(pointsOfInterest)
      .where(eq(pointsOfInterest.eventId, event.id));

    // Intelligence: Find "Grandstand" (Grada) or "VIP" or "Stage"
    const grandstand = eventPois.find(
      (p) =>
        p.name.toLowerCase().includes('grandstand') ||
        p.name.toLowerCase().includes('grada') ||
        p.name.toLowerCase().includes('tribuna')
    );
    const vipZone = eventPois.find(
      (p) => p.name.toLowerCase().includes('vip') || p.name.toLowerCase().includes('meetup')
    );

    const zones = [];

    if (grandstand) {
      zones.push({
        name: grandstand.name,
        gate: 'Porta A',
        row: '12',
        startSeat: 4,
        count: 2,
        location: grandstand.location,
      });
    }

    if (vipZone) {
      zones.push({
        name: vipZone.name,
        gate: 'VIP Entrance',
        row: 'A',
        startSeat: 1,
        count: 2,
        location: vipZone.location,
      });
    }

    // Always add a general admission if no special zones found or as a base
    zones.push({
      name: 'General Admission',
      gate: 'Main Entrance',
      row: null,
      startSeat: null,
      count: 2,
      location: event.location,
    });

    console.log(`📌 Generating ${zones.length * 2} tickets for: ${event.name}`);

    // Clean old tickets for this event
    await db.delete(tickets).where(eq(tickets.eventId, event.id));

    for (const zone of zones) {
      for (let i = 0; i < zone.count; i++) {
        const seatNum = zone.startSeat ? zone.startSeat + i : null;
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const code = `LAT-${event.id}-${randomPart}`;

        // Coordinates logic: If it's a POI location, it's already a geometry. If it's event.location, same.
        // Drizzle-orm handles geometry objects if we pass them correctly, or we use sql template.

        await db.insert(tickets).values({
          eventId: event.id,
          userId: null,
          code: code,
          zoneName: zone.name,
          gate: zone.gate,
          seatRow: zone.row,
          seatNumber: seatNum ? String(seatNum) : null,
          seatLocation: zone.location, // Copy geometry from source
          isActive: true,
          createdAt: new Date(),
        });

        const fileName = `${event.name.substring(0, 10)}_${zone.name.replace(/\s+/g, '_')}_${randomPart}.png`;
        const filePath = path.join(outputDir, fileName);

        await QRCode.toFile(filePath, code, {
          color: { dark: '#1D1C1D', light: '#FFFFFF' },
          width: 600,
          margin: 2,
        });
      }
    }
  }

  console.log(`\n🎉 SUCCESS! SMART Tickets generated in: ${path.resolve(outputDir)}`);
  await pool.end();
}

generateQRs().catch((err) => {
  console.error('❌ SMART QR Generation failed:', err);
  process.exit(1);
});
