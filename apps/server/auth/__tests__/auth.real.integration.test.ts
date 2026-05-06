import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { db, users, truncateAllTables, eq } from '@app/db';

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
        fullName: 'Real Test User'
      };

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(userData.email);

      // Verify persistence in DB
      const [savedUser] = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
      expect(savedUser).toBeDefined();
      expect(savedUser.fullName).toBe(userData.fullName);
    });

    it('should fail when registering a duplicate email (DB Constraint)', async () => {
      const email = 'duplicate@test.com';
      
      // Manually insert first user
      await db.insert(users).values({
        email,
        passwordHash: 'hashed_password',
        fullName: 'Original User'
      });

      // Try to register again via API
      const response = await request(app)
        .post('/register')
        .send({
          email,
          password: 'anotherPassword',
          fullName: 'Duplicate User'
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('USER_EXISTS');
    });
  });

  describe('POST /login', () => {
    it('should authenticate correctly against real DB data', async () => {
      const email = 'login_test@test.com';
      const password = 'password123';

      // Insert user
      await db.insert(users).values({
        email,
        passwordHash: password, // The service currently uses plain text check or simple mock-like logic
        fullName: 'Login Tester'
      });

      const response = await request(app)
        .post('/login')
        .send({ email, password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(email);
    });
  });
});
