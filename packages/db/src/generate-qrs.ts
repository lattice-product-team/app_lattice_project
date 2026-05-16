import 'dotenv/config';
import { db, pool, eq, sql } from './index.js';
import {
  events,
  tickets,
} from './schema.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateQRs() {
  console.log('🎟️  Starting MODERN Ticket & QR Generation...');

  const outputDir = './sample_tickets';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  } else {
    // Clean old files
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  }

  // 1. Get a REAL event from the DB (the one created by seed-master)
  // We look for any event since the seed names might vary slightly
  const allEvents = await db.select().from(events).limit(5);

  if (allEvents.length === 0) {
    console.error('❌ No events found in DB. Please run pnpm db:seed first.');
    process.exit(1);
  }

  const targetEvent = allEvents.find(e => e.name.includes('Barcelona')) || allEvents[0];
  console.log(`📌 Using Event: ${targetEvent.name} (ID: ${targetEvent.id})`);

  const zones = [
    { name: 'VIP Lounge', gate: 'Porta 1', row: 'A', startSeat: 10, count: 2, location: [2.2315, 41.4125] },
    { name: 'Tribuna G', gate: 'Porta 3', row: '12', startSeat: 4, count: 2, location: [2.2335, 41.4145] },
    { name: 'General', gate: 'Main Entrance', row: null, startSeat: null, count: 2, location: [2.2300, 41.4110] },
  ];

  // 2. Clean old tickets for this event to avoid unique constraint errors
  await db.delete(tickets).where(eq(tickets.eventId, targetEvent.id));
  console.log('🧹 Cleaned previous tickets for this event.');

  for (const zone of zones) {
    for (let i = 0; i < zone.count; i++) {
      const seatNum = zone.startSeat ? zone.startSeat + i : null;
      // Modern Code Format: LATTICE-<EVENT_ID>-<RANDOM>
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `LAT-${targetEvent.id}-${randomPart}`;

      // 3. Insert into DB as UNCLAIMED
      await db.insert(tickets).values({
        eventId: targetEvent.id,
        userId: null, 
        code: code,
        zoneName: zone.name,
        gate: zone.gate,
        seatRow: zone.row,
        seatNumber: seatNum ? String(seatNum) : null,
        seatLocation: sql`ST_SetSRID(ST_MakePoint(${zone.location[0]}, ${zone.location[1]}), 4326)`,
        isActive: true,
        createdAt: new Date(),
      });

      // 4. Generate QR Image
      const fileName = `${zone.name.replace(/\s+/g, '_')}_${seatNum ? 'Seat_'+seatNum : 'GEN'}_${randomPart}.png`;
      const filePath = path.join(outputDir, fileName);
      
      await QRCode.toFile(filePath, code, {
        color: {
          dark: '#1D1C1D',
          light: '#FFFFFF'
        },
        width: 600, // Higher resolution
        margin: 2
      });

      console.log(`✅ Generated: ${fileName} -> Code: ${code}`);
    }
  }

  console.log(`\n🎉 SUCCESS! Scan these from the app to claim them.`);
  console.log(`Files location: ${path.resolve(outputDir)}`);
  await pool.end();
}

generateQRs().catch((err) => {
  console.error('❌ QR Generation failed:', err);
  process.exit(1);
});
