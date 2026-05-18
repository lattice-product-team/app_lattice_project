import { Callout } from 'nextra/components'

# Getting Started & Installation

This comprehensive handbook provides complete, step-by-step instructions to get the entire **Lattice** ecosystem up and running on your local development machine. 

Whether you are utilizing our automated onboarding scripts or configuring custom native services (such as host PostGIS instances and custom Valhalla engines), this guide covers all required processes.

---

## 1. Local Prerequisites

Before compiling the applications, ensure your workstation has the following tools installed:

*   **Node.js**: Long-Term Support (LTS) release v18.x or higher.
*   **pnpm**: Package Manager v8.x or higher (Install globally via `npm install -g pnpm`).
*   **Docker**: Docker Desktop (or Compose CLI) to manage containerized databases, routing servers, and caching layers.
*   **Mobile Simulators**: Android Studio (for Android Emulator) and/or Xcode (for iOS Simulator, macOS only) to test client applications.

---

## 2. Environment Variables Configuration

Lattice utilizes shared workspace environment parameters declared in a root `.env` file. 

### Step 1: Copy Configuration Template
Run the following command at the root of your workspace:
```bash
cp .env.example .env
```

### Step 2: Core Parameter Glossary
Open `.env` in your IDE and configure the following parameters:

*   `NODE_ENV`: Set to `development` for local work.
*   `JWT_SECRET`: A secure cryptographically random key used to sign session JSON Web Tokens.
*   `LAN_IP`: The local IP address of your workstation (e.g., `192.168.1.45`). **Do not use `localhost` or `127.0.0.1` if you are testing on physical mobile devices over Wi-Fi.** The Expo client requires a valid LAN IP to establish socket connections to your local API monolith server.
*   `DATABASE_URL`: Connection string for PostgreSQL + PostGIS.
    *   *Docker Default*: `postgres://postgres:password@localhost:5433/lattice_db` (using port `5433` to prevent port collisions with any pre-existing PostgreSQL instance on your host system).
*   `MAPTILER_KEY`: Your personal key obtained from [MapTiler](https://www.maptiler.com/) to render topographic and vector maps on the Admin dashboard and mobile client.
*   `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Default credentials assigned to the initial administrator account generated during database seeding.

---

## 3. Launch Sequence

We provide two pathways to initialize the system: an automated script that handles the setup, or a step-by-step manual setup.

### Option A: The Fast Track (Recommended)

Our automated script checks your system configurations, verifies Docker status, generates environment files, provisions container images, executes database migrations, and seeds the default dataset.

To launch the onboarding wizard, run:
```bash
pnpm install
pnpm onboard
```

The script will automatically perform:
1. Tool verification checks (Docker, pnpm).
2. Root `.env` verification.
3. Docker Compose orchestration (starts PostGIS, Redis, and Valhalla).
4. Relational database migrations and default data seeding.

---

### Option B: Manual Advanced Setup

If you prefer to configure each infrastructure layer individually or are integrating native host databases:

#### 1. Launching Containerized Services
To spin up the supporting containers (PostgreSQL, Redis, Valhalla) in detached mode, run:
```bash
docker compose up -d
```

#### 2. Advanced: Configuring a Host PostgreSQL Database
If you choose to bypass Docker and run a native PostgreSQL service installed directly on your machine:
*   Ensure PostgreSQL is active.
*   Log into your Postgres terminal and run:
    ```sql
    CREATE DATABASE lattice_db;
    \c lattice_db;
    CREATE EXTENSION postgis;
    ```
*   Update the `DATABASE_URL` in your `.env` to point to port `5432` (or your custom host port).

#### 3. Database Migrations and Seeding
With your database instance (Docker or Host) running, run the following commands to provision the database schema and seed default events, POIs, routing networks, and administrative accounts:
```bash
pnpm db:migrate
pnpm db:seed
```

#### 4. Advanced: Configuring the Valhalla Routing Engine
Lattice relies on Valhalla to perform accessible pedestrian routing.
*   Ensure that the `.docker/valhalla` directory exists in the workspace.
*   Valhalla requires a Spanish/Catalonia OSM (OpenStreetMap) regional extract to build routing graphs, which is located in `.docker/valhalla/cataluna-latest.osm.pbf`.
*   Start the Valhalla container:
    ```bash
    docker compose up valhalla -d
    ```
*   On its initial launch, Valhalla will download tile data and compile the routing graph. This can take a few minutes. Once compiled, it will listen on `http://localhost:8002`.

---

## 4. Running the Applications

With the database, routing, and caching containers active, open separate terminals to start the development servers:

### 1. Express API Monolith Server
```bash
pnpm dev:api
```
*Launches the backend server at `http://localhost:3000` with hot-reloading enabled.*

### 2. Admin Web Dashboard
```bash
pnpm dev:web
```
*Starts the Next.js Command Center. Accessible at `http://localhost:3001` or `http://localhost:3004` depending on active port allocations.*

### 3. Mobile Client (React Native & Expo Metro)
Depending on your testing environment, run one of the following commands:
*   **Physical Device on Wi-Fi (Highly Recommended)**:
    ```bash
    pnpm dev:mobile:lan
    ```
    *Scan the generated QR code in your terminal using the Expo Go app or Expo developer client.*
*   **Local Emulator/Simulator**:
    ```bash
    pnpm dev:mobile
    ```
    *Press `i` to launch on the iOS Simulator or `a` to launch on the Android Emulator.*
*   **Separate Networks**:
    ```bash
    pnpm dev:mobile:tunnel
    ```
    *Establishes a secure tunneling connection if your workstation and mobile phone are on separate network zones.*

---

## 5. Verification Checklist

To guarantee the entire Lattice ecosystem is fully operational:

1.  **API Health Check**: Visit `http://localhost:3000/status` in your browser. It should return `{"status": "api_ok", ...}`.
2.  **Admin Login**: Navigate to `http://localhost:3004` (or your active web port). Log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` declared in `.env`.
3.  **Map Styles Check**: Verify the map canvas on the Admin Dashboard loads vector overlays correctly (confirms the validity of `MAPTILER_KEY`).
4.  **Route Calculations**: Open the mobile app, select an active event, and planning a route. If routes compile successfully with correct distance metrics, the Valhalla container is communicating correctly with the API.

<Callout type="info">
  **Getting Help**: If you encounter connection timeouts or compile warnings, refer to the **[Troubleshooting Guide](./troubleshooting.md)**.
</Callout>
