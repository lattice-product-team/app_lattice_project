/**
 * @app/core - Shared Backend Utilities
 */

export * from './src/config';

import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock_jwt_token_for_')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        status: 401,
      },
    });
  }
  next();
};
