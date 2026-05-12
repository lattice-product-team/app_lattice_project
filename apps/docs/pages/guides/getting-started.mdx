# Getting Started

This guide provides the essential steps to get the Lattice ecosystem running on your local machine for development.

## 1. Prerequisites

Ensure you have the following installed:
- **Node.js**: v18.x or higher.
- **pnpm**: v8.x or higher (`npm install -g pnpm`).
- **Docker**: For running PostgreSQL and the API.
- **iOS Simulator / Android Emulator**: For the mobile app.

## 2. Environment Setup

Lattice uses a decentralized `.env` strategy.

1.  **Root**: Copy `.env.example` to `.env`.
2.  **Server**: Ensure `DATABASE_URL` and `JWT_SECRET` are correctly set in the root `.env`.
3.  **Admin Web**: Ensure `NEXT_PUBLIC_API_URL` points to your local server.

## 3. Launch Sequence

Follow this order to ensure all services are linked correctly:

### Step 1: Infrastructure
```bash
docker-compose up -d
```
*This starts PostgreSQL and the core API service.*

### Step 2: Dependencies
```bash
pnpm install
```

### Step 3: Database Initialization
```bash
pnpm --filter @app/db db:migrate
pnpm --filter @app/db db:seed
```

### Step 4: Start Applications
Open three terminals or use a terminal multiplexer:

- **Server**: `pnpm --filter server dev`
- **Admin Web**: `pnpm --filter admin-web dev`
- **Mobile**: `pnpm --filter mobile start`

## 4. Verification

- **API Health**: Visit `http://localhost:3001/status`.
- **Admin Dashboard**: Visit `http://localhost:3000`.
- **Mobile**: Scan the QR code with the Expo Go app or press `i` for iOS simulator.

---

> [!TIP]
> If you encounter issues with the database connection, check the [Troubleshooting](./troubleshooting.md) guide.
