import app from './app';
import { loadConfig } from '@app/core';

const env = loadConfig();
const PORT = env.API_PORT;

if (env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API Monolith] running on port ${PORT}`);
  });
}

export default app;
