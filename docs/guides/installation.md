import { Callout } from 'nextra/components'

# Installation Guide

This manual details the step-by-step installation and local setup of the entire Lattice ecosystem. It is intended for software engineers, database administrators, and QA teams who need to set up a fully functional local instance of the platform.

<div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 0' }}>
  <img src="/assets/mockups/map-black-1.png" alt="Relational Spatial Maps (Dark Mode)" style={{ height: '360px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
  <img src="/assets/mockups/map-white-1.png" alt="Relational Spatial Maps (Light Mode)" style={{ height: '360px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
</div>

---

## 1. System Prerequisites

Ensure your host machine meets the following version requirements before starting:

| Component          | Minimum Version                      | Verification Command         |
| :----------------- | :----------------------------------- | :--------------------------- |
| **Node.js**        | `v18.x` or higher (LTS recommended)  | `node -v`                    |
| **pnpm**           | `v8.x` or higher                     | `pnpm -v`                    |
| **Docker**         | `v20.x` or higher                    | `docker --version`           |
| **Docker Compose** | `v2.x` or higher                     | `docker compose version`     |
| **PostgreSQL**     | `v15.x` (if installed on host)       | `psql --version`             |
| **PostGIS**        | `v3.3` (required database extension) | _Checked inside SQL console_ |

<Callout type="info">
  If you are running the database inside the provided Docker environment, you do not need to install PostgreSQL or PostGIS directly on your host machine, as the Docker image compiles it automatically.
</Callout>

---

## 2. Repository and Package Installation

### Step 1: Clone the Repository

Clone the codebase and navigate to the project directory:

```bash
git clone https://github.com/lattice-product-team/app_lattice_project.git
cd app_lattice_project
```

### Step 2: Install Node Dependencies

Lattice uses **pnpm workspaces** to manage its monorepo. Install all project dependencies at once from the root directory:

```bash
pnpm install
```

_This installs and links all dependencies for the server, admin panel, mobile app, and shared packages._

### Step 3: Build Shared Packages

Lattice relies on shared packages located under the `/packages` folder. You must compile these shared utilities and schemas before running the individual services:

```bash
pnpm build
```

_This triggers Turbo to build `@app/core`, `@app/types-schema`, `@app/theme`, and `@app/db` in the correct dependency order._

---

## 3. Environment Configuration

Copy the template configuration file to create your local `.env` file:

```bash
cp .env.example .env
```

Open the newly created `.env` file and configure the core parameters:

### Core Configuration Parameters

- **`NODE_ENV`**: Set to `development` for local work.
- **`JWT_SECRET`**: A secret key for signing JSON Web Tokens. Use a cryptographically strong string.
- **`LAN_IP`**: Set this to your computer's local network IP address (e.g., `192.168.1.55`) so your mobile emulator or physical device can talk to the backend server. Do not use `localhost` if testing on a physical phone.
- **`DATABASE_URL`**: The connection string for PostgreSQL.
  - _Docker default:_ `postgres://postgres:password@localhost:5433/lattice_db` (using port `5433` to prevent conflicts with a host-installed Postgres).
- **`MAPTILER_KEY`**: Get a free API key from [MapTiler](https://www.maptiler.com/) to render base map styles on the Admin dashboard and mobile app.
- **`ADMIN_EMAIL` / `ADMIN_PASSWORD`**: The default admin account generated during database seeding.

---

## 4. Database Setup & Initialization
 
Lattice requires **PostGIS** (PostgreSQL Geospatial Extension) to manage coordinate grids, event boundaries, and active crowd zones. For complete details on the relational layouts, composite keys, and spatial fields, refer to our [Database Schema Architecture Guide](../architecture/database-schema.md).


### Option A: Using Docker (Recommended)

Start the pre-configured Postgres container defined in `docker-compose.yml`:

```bash
docker compose up db -d
```

_This starts a `postgis/postgis:15-3.3` image and exposes it on port `5433` as defined in your `.env`._

### Option B: Local Installation on Host

If you choose to use an existing PostgreSQL server on your host machine:

1. Ensure the PostgreSQL service is active.
2. Connect to your instance and create the database:
   ```sql
   CREATE DATABASE lattice_db;
   ```
3. Enable the PostGIS extension:
   ```sql
   \c lattice_db;
   CREATE EXTENSION postgis;
   ```
4. Update your `.env` file's `DATABASE_URL` to point to port `5432` or your custom host port.

### Migrating and Seeding Data

Once the database service is running and accessible, run the schema migrations and load the master seed data (default events, points of interest, paths, and admin accounts):

```bash
pnpm db:migrate
pnpm db:seed
```

<Callout type="warning">
  If migrations or seeding fail, make sure the database is fully initialized and your `DATABASE_URL` contains the correct password and port. You can run `pnpm db:check` to diagnose connection issues.
</Callout>

---

## 5. Setting up Valhalla (Routing Engine)

Lattice utilizes the **Valhalla Routing Engine** to compute custom, optimized navigation paths for events (taking into account stairs, accessible routes, and temporary blockages).

1. Check that the `.docker/valhalla` directory exists in the workspace.
2. In local development, Valhalla uses a pre-downloaded map extract (e.g. Catalonia osm extract).
3. Start the Valhalla service:
   ```bash
   docker compose up valhalla -d
   ```
4. On its first boot, the container will build routing tiles from the osm file. This might take a couple of minutes. Once ready, it will listen on `http://localhost:8002`.

---

## 6. Launching Platform Services

With the infrastructure running and the shared packages compiled, you can start the application servers.

### 1. Start the Redis Caching Server

Redis handles session caching and temporary telemetry buffers:

```bash
docker compose up redis -d
```

### 2. Start the Backend Express API
 
The server manages event data, POI state updates, and real-time telemetry processing. For comprehensive endpoints, parameter structures, and response payloads, check out the [Mobile API Specifications](../api-spec/mobile-api.md) and [Admin API Specifications](../api-spec/admin-api.md).
 
```bash
pnpm dev:api
```
 
_The backend API will start on port `3000` (or `GATEWAY_PORT` if overridden)._


### 3. Start the Admin Web Dashboard

The web console allows curators and operational staff to draw boundaries, update POIs, and view real-time maps:

```bash
pnpm dev:web
```

_The dashboard will compile and launch on `http://localhost:3004`._

### 4. Start the Mobile Client

The client app is built using React Native and Expo.
To start the React Native bundler (Metro):

```bash
# Start standard Metro dev server
pnpm dev:mobile

# OR start with LAN IP broadcast (recommended for testing on physical devices via Expo Go)
pnpm dev:mobile:lan
```

_Press `i` to launch in the iOS Simulator, `a` for the Android Emulator, or scan the QR code using the **Expo Go** application on your physical iOS/Android phone._

---

## 7. Verification Checklist

To confirm everything is fully operational:

1.  **API Check**: Open `http://localhost:3000/status` in your browser. It should return `{"status": "ok"}`.
2.  **Admin Login**: Navigate to `http://localhost:3004`. Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in `.env`.
3.  **Map Telemetry**: Ensure that the map on the Admin Dashboard loads correctly (verifies the `MAPTILER_KEY`).
4.  **Mobile Navigation**: Open the app in Expo Go, tap on an active event, and try planning a route. If routes compute successfully, the Valhalla container is communicating correctly with the API.
