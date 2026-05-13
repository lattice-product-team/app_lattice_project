import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import express from 'express';
import authRouter from '../routes/auth.routes.ts';
import { db, users, truncateAllTables, eq } from '@app/db';

const app = express();
app.use(express.json());
app.use(authRouter);

describe('Auth Service REAL Integration Tests', () => {
  beforeEach(async () => {
    // Ensure we are in test environment to avoid accidental data loss
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Real DB tests MUST run with NODE_ENV=test');
    }
    await truncateAllTables();
  });

  describe('POST /register', () => {
    it('should persist a new user in the real database', async () => {
      const userData = {
        email: 'real_integration@test.com',
        password: 'securePassword123',
        fullName: 'Real Test User',
      };

      const response = await request(app).post('/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(userData.email);

      // Verify persistence in DB and check that password is NOT plaintext
      const [savedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      expect(savedUser).toBeDefined();
      expect(savedUser.passwordHash).not.toBe(userData.password);
      expect(savedUser.passwordHash.startsWith('$2')).toBe(true); // Bcrypt hash prefix
    });

    it('should fail when registering a duplicate email (DB Constraint)', async () => {
      const email = 'duplicate@test.com';

      // Manually insert first user
      await db.insert(users).values({
        email,
        passwordHash: await bcrypt.hash('original', 10),
        fullName: 'Original User',
      });

      // Try to register again via API
      const response = await request(app).post('/register').send({
        email,
        password: 'anotherPassword',
        fullName: 'Duplicate User',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('USER_EXISTS');
    });
  });

  describe('POST /login', () => {
    it('should authenticate correctly against real DB data', async () => {
      const email = 'login_test@test.com';
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user with real Bcrypt hash
      await db.insert(users).values({
        email,
        passwordHash: passwordHash,
        fullName: 'Login Tester',
      });

      const response = await request(app).post('/login').send({ email, password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
    });

    it('should authenticate correctly against legacy plaintext data (Lazy Migration)', async () => {
      const email = 'legacy@test.com';
      const password = 'legacyPassword';

      // Insert user with PLAINTEXT password
      await db.insert(users).values({
        email,
        passwordHash: password,
        fullName: 'Legacy User',
      });

      const response = await request(app).post('/login').send({ email, password });

      expect(response.status).toBe(200);

      // Verify lazy migration happened in DB
      const [updatedUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      expect(updatedUser.passwordHash).not.toBe(password);
      expect(updatedUser.passwordHash.startsWith('$2')).toBe(true);
    });
  });
});
