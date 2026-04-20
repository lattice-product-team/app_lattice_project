import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSockets } from './controllers/social.controller';

// Load environment variables from root if not already set (e.g. in CI/CD)
dotenv.config({ path: path.join(process.cwd(), '../../../.env') });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSockets(io);

const PORT = process.env.SOCIAL_PORT || process.env.PORT || 3003;

httpServer.listen(PORT, () => {
  console.log(`[Social Service] running on port ${PORT}`);
});
