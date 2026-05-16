import 'dotenv/config';
import { db, pool, eq, sql } from './index.js';
import {
  users,
  events,
  tickets,
} from './schema.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function generateQRs() {
  console.log('🎟️  Generating Sample Tickets & QRs...');

  const outputDir = './sample_tickets';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // 1. Get a sample event (e.g., Barcelona Beach Festival)
  const [sampleEvent] = await db.select().from(events).where(eq(events.name, 'Barcelona Beach Festival 2026')).limit(1);

  if (!sampleEvent) {
    console.error('❌ Sample event not found. Run db:seed first.');
    process.exit(1);
  }

  const zones = [
    { name: 'VIP Lounge', gate: 'Porta 1', row: 'A', startSeat: 10, count: 2, location: [2.2315, 41.4125] },
    { name: 'Tribuna G', gate: 'Porta 3', row: '12', startSeat: 4, count: 2, location: [2.2335, 41.4145] },
    { name: 'General', gate: 'Main Entrance', row: null, startSeat: null, count: 2, location: [2.2300, 41.4110] },
  ];

  for (const zone of zones) {
    for (let i = 0; i < zone.count; i++) {
      const seatNum = zone.startSeat ? zone.startSeat + i : null;
      const code = `LAT-${zone.name.toUpperCase().substring(0,3)}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

      // Insert into DB as UNCLAIMED (userId = null)
      await db.insert(tickets).values({
        eventId: sampleEvent.id,
        userId: null, 
        code: code,
        zoneName: zone.name,
        gate: zone.gate,
        seatRow: zone.row,
        seatNumber: seatNum ? String(seatNum) : null,
        seatLocation: sql`ST_SetSRID(ST_MakePoint(${zone.location[0]}, ${zone.location[1]}), 4326)`,
        isActive: true,
      });

      // Generate QR Image
      const fileName = `${zone.name.replace(/\s+/g, '_')}_Seat_${seatNum || 'GEN'}.png`;
      const filePath = path.join(outputDir, fileName);
      
      await QRCode.toFile(filePath, code, {
        color: {
          dark: '#1D1C1D',
          light: '#FFFFFF'
        },
        width: 400
      });

      console.log(`✅ Generated: ${fileName} (Code: ${code})`);
    }
  }

  console.log(`\n🎉 Success! All QR codes are in: ${path.resolve(outputDir)}`);
  console.log(`Scan these from the app to claim your ticket!`);
  await pool.end();
}

generateQRs().catch((err) => {
  console.error('❌ QR Generation failed:', err);
  process.exit(1);
});
