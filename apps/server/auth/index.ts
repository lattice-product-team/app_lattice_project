import dotenv from 'dotenv';
import path from 'path';
import app from './app';

// Load environment variables from root if not already set (e.g. in CI/CD)
dotenv.config({ path: path.join(process.cwd(), '../../../.env') });

const PORT = process.env.AUTH_PORT || process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[Auth Service] running on port ${PORT}`);
});
