import 'dotenv/config';
import { db, pool } from './index.js';
import { tickets } from './schema.js';
import { sql } from 'drizzle-orm';
import * as QRCode from 'qrcode';

async function generateTestTickets() {
  console.log('Generating test tickets for QR scanning...');

  const testTickets = [
    {
      code: 'CIRCUIT-VIP-2026',
      ownerEmail: 'kore@example.com',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club',
      seatRow: 'A',
      seatNumber: '12',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-G-2026',
      ownerEmail: 'tester_circuitg2026@example.com',
      gate: 'Gate 3',
      zoneName: 'Grandstand G',
      seatRow: '15',
      seatNumber: '42',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-PLATINUM-2026',
      ownerEmail: 'tester_circuitplatinum2026@example.com',
      gate: 'Gate 0',
      zoneName: 'Platinum Lounge',
      seatRow: '1',
      seatNumber: '1',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-EXTRA-VIP',
      ownerEmail: 'tester_circuitvip2026@example.com',
      gate: 'Gate 1 (VIP)',
      zoneName: 'Paddock Club (Extra)',
      seatRow: 'B',
      seatNumber: '24',
      isActive: true,
      createdAt: new Date(),
    },
    {
      code: 'CIRCUIT-G-2026-EXTRA',
      ownerEmail: 'tester_circuitg2026@example.com',
      gate: 'Gate 3',
      zoneName: 'Grandstand G (Extra)',
      seatRow: '15',
      seatNumber: '43',
      isActive: true,
      createdAt: new Date(),
    },
  ];

  for (const ticket of testTickets as any[]) {
    // Create JSON Payload
    const payload = JSON.stringify({
      code: ticket.code,
      email:
        ticket.ownerEmail ||
        ticket.email ||
        `tester_${ticket.code.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
    });

    // Insert ticket into DB if it doesn't exist
    await db
      .insert(tickets)
      .values({
        userId: null,
        code: ticket.code,
        ownerEmail: ticket.ownerEmail,
        gate: ticket.gate,
        zoneName: ticket.zoneName,
        seatRow: ticket.seatRow,
        seatNumber: ticket.seatNumber,
        isActive: ticket.isActive,
        createdAt: ticket.createdAt,
      })
      .onConflictDoUpdate({
        target: tickets.code,
        set: {
          userId: null,
          ownerEmail: ticket.ownerEmail,
          gate: ticket.gate,
        },
      });

    console.log(`\n================================`);
    console.log(`🎟️  ${ticket.zoneName} - ${ticket.code}`);
    console.log(`Payload: ${payload}`);
    console.log(`================================`);

    // Generate QR in terminal
    QRCode.toString(payload, { type: 'terminal', small: true }, function (err, url) {
      console.log(url);
    });
  }

  console.log(`\n✅ Test tickets generated successfully! Scan these with your Expo app.`);
  await pool.end();
}

generateTestTickets().catch((err) => {
  console.error('Failed to generate test tickets:', err);
  process.exit(1);
});
