import { Callout } from 'nextra/components'

# Getting Started

This guide provides the essential steps to get the Lattice ecosystem running on your local machine for development.

## 1. Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.x or higher.
- **pnpm**: v8.x or higher (`npm install -g pnpm`).
- **Docker**: For running PostgreSQL and the API.
- **iOS Simulator / Android Emulator**: For the mobile app.

## 2. Environment Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/lattice-product-team/app_lattice_project.git
   cd app_lattice_project
   ```
2. **Copy Configuration**: Copy the template to create your root `.env` file:
   ```bash
   cp .env.example .env
   ```
3. **Configure Parameters**: Ensure `DATABASE_URL` (default: `postgres://postgres:password@localhost:5433/lattice_db`), `JWT_SECRET`, and `LAN_IP` are correctly configured (detailed in the [Installation Manual](./installation.md)).

## 3. Launch Sequence

We provide an automated script to handle the heavy lifting of environment setup.

### The Fast Track (Recommended)

```bash
pnpm install
pnpm onboard
```

The `onboard` script will automatically:

- Check for required tools (Docker, pnpm).
- Create your `.env` from the example template.
- Start the Docker infrastructure (Postgres, Redis, Valhalla).
- Wait for the database to be healthy.
- Run migrations and seed the initial development data.

### Manual Setup (Alternative)

If you prefer to run steps individually:

1. **Infrastructure**: `docker compose up -d`
2. **Database Initialization**: `pnpm db:migrate && pnpm db:seed`

### Step 4: Start Applications

Open separate terminals to start the core services:

- **Server (API)**:
  ```bash
  pnpm dev:api
  ```
- **Admin Web Dashboard**:
  ```bash
  pnpm dev:web
  ```
- **Mobile (Expo Dev Client)**:
  For local development with physical devices on the same Wi-Fi network (highly recommended):
  ```bash
  pnpm dev:mobile:lan
  ```
  _Alternatively, use `pnpm dev:mobile` for simulators, `pnpm dev:mobile:lan:prod` for production env testing, or `pnpm dev:mobile:tunnel` if on separate networks._

## 4. Verification

- **API Health**: Visit `http://localhost:3000/status` (should return `{"status": "api_ok", ...}`).
- **Admin Dashboard**: Visit `http://localhost:3004` (when running via Docker Compose) or `http://localhost:3001` (if running locally outside Docker where port 3000 is occupied by the API).
- **Mobile Expo Console**: Scan the QR code displayed in the terminal with the Expo Go app (or Expo dev client) or press `i` (iOS simulator) or `a` (Android emulator).

---

<Callout type="info">
  If you encounter database connection issues or need details on configuring specific ports, check the [Troubleshooting](./troubleshooting.md) guide.
</Callout>
