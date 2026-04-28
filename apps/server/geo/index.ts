import { loadConfig } from '@app/core';
import app from './app';

// Load validated config
const env = loadConfig();
const PORT = env.GEO_PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Geo Service] running on port ${PORT}`);
});
