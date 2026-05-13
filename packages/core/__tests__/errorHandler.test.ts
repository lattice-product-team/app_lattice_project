import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../index.js';
import { Request, Response } from 'express';

describe('errorHandler', () => {
  it('should return 500 and internal error if no status is provided', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();
    const error = new Error('Test Error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Test Error',
        code: 'INTERNAL_ERROR',
      },
    });
  });

  it('should return the provided status and code', () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const mockNext = vi.fn();
    const error = {
      status: 400,
      message: 'Bad Request',
      code: 'BAD_REQUEST',
    };

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        message: 'Bad Request',
        code: 'BAD_REQUEST',
      },
    });
  });
});
