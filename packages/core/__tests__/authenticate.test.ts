import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate } from '../index';
import { Request, Response } from 'express';
import { loadConfig } from '../src/config';

// Mock loadConfig to provide a consistent secret for tests
vi.mock('../src/config', () => ({
  loadConfig: vi.fn().mockReturnValue({
    JWT_SECRET: 'test_secret_key',
  }),
}));

describe('authenticate middleware', () => {
  const SECRET = 'test_secret_key';

  it('should call next() if valid bearer token is provided', () => {
    const token = jwt.sign({ userId: 1, email: 'test@example.com' }, SECRET);
    const mockReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect((mockReq as any).user).toHaveProperty('userId', 1);
  });

  it('should return 401 if no authorization header is present', () => {
    const mockReq = {
      headers: {},
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it('should return 401 if authorization header is invalid', () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer invalid_token_string',
      },
    } as unknown as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
