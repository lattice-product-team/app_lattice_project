import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server as HttpServer } from 'http';
import { loadConfig } from './config.js';
import { getRedisClient } from './redis.js';
import jwt from 'jsonwebtoken';

const config = loadConfig();

let io: Server;

export const initSocket = async (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = config.ALLOWED_ORIGINS.split(',');
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || config.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    },
  });

  // Redis Adapter Setup
  try {
    const pubClient = await getRedisClient();
    const subClient = pubClient.duplicate();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));
    console.log('[Socket] Redis Adapter integrated (shared client)');
  } catch (error) {
    console.error('[Socket] Redis adapter setup failed:', error);
  }

  // Authentication Middleware (Task 2.1)
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    // Dev override
    if (config.NODE_ENV === 'development' && token === 'dev-token') {
      (socket as any).user = { id: 'dev-admin', email: 'dev@admin.dev', role: 'admin' };
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`[Socket] User connected: ${user.email} (${socket.id})`);

    // Join private room (Task 2.2)
    socket.join(`user:${user.id}`);

    // Join admin room if applicable (Task 2.3)
    if (user.role === 'admin') {
      socket.join('admin');
      console.log(`[Socket] User ${user.email} joined admin room`);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
};

// Helper for broadcasting (Opción A: Invalidation only)
export const notifyAdmin = (event: string, payload: { type: string; id: string }) => {
  if (io) {
    console.log(`[Socket] Notifying admin: ${event}`, payload);
    io.to('admin').emit(event, payload);
  }
};

/**
 * Broadcasts an event to all connected clients.
 * Used for real-time UI synchronization (e.g. invalidating React Query caches)
 */
export const notifyAll = (event: string, payload: any) => {
  if (io) {
    console.log(`[Socket] Broadcasting event "${event}" to all clients:`, payload);
    io.emit(event, payload);
  } else {
    console.warn(`[Socket] Cannot broadcast "${event}", io not initialized`);
  }
};
