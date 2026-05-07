import { users } from './schema';

export async function seedCommon(db: any) {
  console.log('Seeding common data (users and profiles)...');

  // 1. Seed a test user
  const [testUser] = await db
    .insert(users)
    .values({
      email: 'kore@example.com',
      passwordHash: 'password123',
      fullName: 'Kore User',
      mobilityMode: 'standard',
    })
    .onConflictDoNothing()
    .returning();

  if (testUser) {
    console.log('Created test user:', testUser.email);
  } else {
    console.log('Test user already exists.');
  }

  // 2. Seeding additional tester accounts
  const testerEmails = [
    'tester_tech2026@example.com'
  ];

  for (const email of testerEmails) {
    await db
      .insert(users)
      .values({
        email,
        passwordHash: 'password123',
        fullName: email.split('@')[0],
        hasTicket: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { 
          passwordHash: 'password123',
          fullName: email.split('@')[0],
          hasTicket: true
        }
      });
    console.log(`Ensured tester account exists and is updated: ${email}`);
  }
}
