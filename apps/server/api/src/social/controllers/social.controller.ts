import { Request, Response } from 'express';
import { Server } from 'socket.io';

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'social_service_ok', timestamp: new Date() });
};

export const createGroup = (req: Request, res: Response) => {
  res.json({ message: 'Groups endpoint not implemented yet' });
};

export const setupSockets = (io: Server) => {
  io.of('/live-track').on('connection', (socket) => {
    console.log(`[Social Service] Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Social Service] Socket disconnected: ${socket.id}`);
    });
  });
};
