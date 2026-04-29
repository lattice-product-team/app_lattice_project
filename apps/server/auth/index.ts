import { loadConfig } from '@app/core';
import app from './app';

// Load validated config
const env = loadConfig();
const PORT = env.AUTH_PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
