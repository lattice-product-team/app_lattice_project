import http from 'http';
import app from './app';
import { loadConfig } from '@app/core';
import { initSocket } from './socket';

const env = loadConfig();
const PORT = env.API_PORT;

const server = http.createServer(app);

if (env.NODE_ENV !== 'test') {
  initSocket(server).then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[API Monolith] running on port ${PORT} (WebSockets enabled)`);
    });
  });
}

export default app;
