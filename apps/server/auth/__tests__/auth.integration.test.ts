import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import * as dbLib from '@app/db';

// Mock the entire DB library
vi.mock('@app/db', async () => {
  const actual = (await vi.importActual('@app/db')) as any;
  return {
    ...actual,
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
    },
  };
});

describe('Auth Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('auth_service_ok');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email or password missing', async () => {
      const response = await request(app).post('/login').send({ email: 'test@test.com' });
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 401 if user not found', async () => {
      // Setup mock
      (dbLib.db.select as any).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const response = await request(app).post('/login').send({
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should login successfully with correct credentials', async () => {
      const password = 'correct_password';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const mockUser = {
        id: 1,
        email: 'kore@example.com',
        passwordHash: passwordHash,
        fullName: 'Kore User',
        hasTicket: false,
      };

      // Setup mocks for the chain: db.select().from(users).where(eq(users.email, email)).limit(1)
      const mockLimit = vi.fn().mockResolvedValue([mockUser]);
      const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      (dbLib.db.select as any).mockReturnValue({ from: mockFrom });

      // Mock ticket fetch at the end of login
      (dbLib.db.select as any)
        .mockImplementationOnce(() => ({ from: mockFrom })) // First for user
        .mockImplementationOnce(() => ({
          from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }),
        })); // Second for tickets

      const response = await request(app).post('/login').send({
        email: 'kore@example.com',
        password: 'correct_password',
      });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('kore@example.com');
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /register', () => {
    it('should create a new user and return 201', async () => {
      // 1. Mock first select (user check)
      const mockUserLimit = vi.fn().mockResolvedValue([]);
      const mockUserWhere = vi.fn().mockReturnValue({ limit: mockUserLimit });
      const mockUserFrom = vi.fn().mockReturnValue({ where: mockUserWhere });

      // 2. Mock second select (tickets check at the end)
      const mockTicketWhere = vi.fn().mockResolvedValue([]);
      const mockTicketFrom = vi.fn().mockReturnValue({ where: mockTicketWhere });

      (dbLib.db.select as any)
        .mockReturnValueOnce({ from: mockUserFrom })
        .mockReturnValueOnce({ from: mockTicketFrom });

      // 3. Mock insert
      const mockReturning = vi.fn().mockResolvedValue([
        {
          id: 2,
          email: 'new@test.com',
          fullName: 'New User',
          hasTicket: false,
        },
      ]);
      const mockValues = vi.fn().mockReturnValue({ returning: mockReturning });
      (dbLib.db.insert as any).mockReturnValue({ values: mockValues });

      const response = await request(app).post('/register').send({
        email: 'new@test.com',
        password: 'securepassword',
        fullName: 'New User',
      });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('new@test.com');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('tickets');
    });

    it('should return 400 if user already exists', async () => {
      const mockLimit = vi
        .fn()
        .mockResolvedValue([{ id: 1, email: 'exists@test.com', passwordHash: 'hash' }]);
      const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      (dbLib.db.select as any).mockReturnValue({ from: mockFrom });

      const response = await request(app).post('/register').send({
        email: 'exists@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('USER_EXISTS');
    });
  });
});
