import { Callout } from 'nextra/components'

# Getting Started

This guide provides the essential steps to get the Lattice ecosystem running on your local machine for development.

<div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 0' }}>
  <img src="/assets/mockups/map-2.png" alt="Mobile Live Map View" style={{ height: '360px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/navigation-2.png" alt="AR Navigation HUD View" style={{ height: '360px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/details-pois-2.png" alt="Service Detail View" style={{ height: '360px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
</div>

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
docker compose up -d
```
*This starts PostgreSQL (on port `5433`), Redis, and Valhalla in the background.*
 
### Step 2: Dependencies
```bash
pnpm install
```
 
### Step 3: Database Initialization
```bash
pnpm db:migrate
pnpm db:seed
```
*This compiles the SQL migrations and populates the database with default spatial events, POIs, and nodes.*
 
### Step 4: Start Applications
Open three separate terminals to start the core services:
 
*   **Server (API)**: 
    ```bash
    pnpm dev:api
    ```
*   **Admin Web Dashboard**: 
    ```bash
    pnpm dev:web
    ```
*   **Mobile (Expo Dev Client)**: 
    For local development with physical devices on the same Wi-Fi network (highly recommended):
    ```bash
    pnpm dev:mobile:lan
    ```
    *Alternatively, use `pnpm dev:mobile` for simulators, `pnpm dev:mobile:lan:prod` for production env testing, or `pnpm dev:mobile:tunnel` if on separate networks.*

## 4. Verification
 
- **API Health**: Visit `http://localhost:3001/status`.
- **Admin Dashboard**: Visit `http://localhost:3000`.
- **Mobile Expo Console**: Scan the QR code displayed in the terminal with the Expo Go app (or Expo dev client) or press `i` (iOS simulator) or `a` (Android emulator).
 
---
 
<Callout type="info">
  If you encounter database connection issues or need details on configuring specific ports, check the [Troubleshooting](./troubleshooting.md) guide.
</Callout>

